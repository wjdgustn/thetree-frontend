<template>
  <div class="title-group">
    <h2 class="topic">{{viewData.thread.topic}}</h2>
    <div class="title-group-right">
      <ButtonBadge round :theme="['', 'secondary', 'super'][viewData.thread.status]">
        <FontAwesomeIcon class="status-icon" :icon="['door-open', 'pause', 'door-closed'][viewData.thread.status]" />
        <span v-text="['열림', '중지됨', '닫힘'][viewData.thread.status]"/>
      </ButtonBadge>
      <ContextMenu placement="bottom-end">
      <span role="button" class="button more-button">
        <FontAwesomeIcon icon="ellipsis-vertical" />
      </span>
        <template #menu>
          <CheckBox v-model="hideHidden">숨겨진 댓글 보이지 않기</CheckBox>
          <template v-if="viewData.permissions.delete">
            <hr>
            <SeedForm method="post" class="delete-thread-form" :action="'/admin/thread/' + viewData.thread.url + '/delete'">
              <GeneralButton theme="danger" type="submit">[ADMIN] 스레드 삭제</GeneralButton>
            </SeedForm>
          </template>
        </template>
      </ContextMenu>
    </div>
  </div>

  <div>
    <template v-for="comment in viewData.comments">
      <Comment
          ref="comments"
          v-if="!comment.hidden || !hideHidden"
          :slug="viewData.thread.url"
          :data="comment"
      />
    </template>
  </div>

  <h3>댓글 달기</h3>
  <FormErrorAlert/>
  <SeedForm v-if="viewData.permissions.status" method="post" :action="'/admin/thread/' + viewData.thread.url + '/status'">
    [ADMIN] 스레드 상태 변경
    <select name="status">
      <option v-if="viewData.thread.status !== 0" value="Normal">normal</option>
      <option v-if="viewData.thread.status !== 1" value="Pause">pause</option>
      <option v-if="viewData.thread.status !== 2" value="Close">close</option>
    </select>
    <SeedButton type="submit">변경</SeedButton>
  </SeedForm>
  <SeedForm v-if="viewData.permissions.document" method="post" :action="'/admin/thread/' + viewData.thread.url + '/document'">
    [ADMIN] 스레드 이동
    <input name="document" :value="doc_fulltitle(viewData.document)">
    <SeedButton type="submit">변경</SeedButton>
  </SeedForm>
  <SeedForm v-if="viewData.permissions.document" method="post" :action="'/admin/thread/' + viewData.thread.url + '/topic'">
    [ADMIN] 스레드 주제 변경
    <input name="topic" :value="viewData.thread.topic">
    <SeedButton type="submit">변경</SeedButton>
  </SeedForm>

  <SeedForm method="post" class="comment-form" :afterSubmit="afterSubmit">
    <ul>
      <li><button type="button" class="tab-button" :class="{ active: activeTab === 'raw' }" @click="activeTab = 'raw'">RAW 편집</button></li>
      <li><button type="button" class="tab-button" :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">미리보기</button></li>
    </ul>
    <div class="tabs">
      <div :class="{ active: activeTab === 'raw' }">
        <textarea v-if="viewData.thread.status === 0" ref="commentInput" rows="5" name="text"/>
        <textarea v-else rows="5" disabled v-text="['', 'pause 상태입니다.', '닫힌 토론입니다.'][viewData.thread.status]"/>
      </div>
      <div class="preview-tab" :class="{ active: activeTab === 'preview' }">
        <Comment
            previewMode
            :slug="viewData.thread.url"
            :data="previewComment"
        />
      </div>
    </div>
    <BlinkRedWarn v-if="session.account.type !== 1">비로그인 상태로 토론에 참여합니다. 토론 내역에 IP({{session.account.name}}) 주소 전체가 영구히 기록됩니다.</BlinkRedWarn>
    <SeedButton type="submit" submit>전송</SeedButton>
  </SeedForm>
</template>
<script>
import { io } from 'socket.io-client'

import Common from '@/mixins/common'
import ButtonBadge from '@/components/buttonBadge'
import ContextMenu from '@/components/contextMenu'
import SeedForm from '@/components/form/seedForm'
import SeedButton from '@/components/seedButton'
import BlinkRedWarn from '@/components/blinkRedWarn'
import Comment from '@/components/comment'
import CheckBox from '@/components/form/checkBox'
import GeneralButton from '@/components/generalButton'
import FormErrorAlert from '@/components/form/formErrorAlert'

export default {
  mixins: [Common],
  components: {
    FormErrorAlert,
    GeneralButton,
    CheckBox,
    Comment,
    BlinkRedWarn,
    SeedButton,
    SeedForm,
    ContextMenu,
    ButtonBadge
  },
  data() {
    return {
      locks: [],
      fetchingComments: false,
      scrollTimer: null,
      hideHidden: true,
      socket: null,
      activeTab: 'raw',
      previewComment: {}
    }
  },
  mounted() {
    this.setScrollTimer()
    window.addEventListener('scroll', this.scrollHandler)

    this.socket = io('/thread', {
      query: {
        thread: this.viewData.thread.url
      }
    })

    this.socket.on('comment', comment => {
      const commentIndex = this.viewData.comments.findIndex(a => a.id === comment.id)
      const prevComment = this.viewData.comments[commentIndex]
      if(commentIndex !== -1) this.viewData.comments[commentIndex] = comment
      else this.viewData.comments.push(comment)

      if(!comment.contentHtml && prevComment?.contentHtml)
        comment.contentHtml = prevComment.contentHtml
    })
    this.socket.on('updateThread', thread => {
      this.viewData.thread = {
        ...this.viewData.thread,
        ...thread
      }
    })
  },
  beforeUnmount() {
    if(this.scrollTimer != null) clearTimeout(this.scrollTimer)
    window.removeEventListener('scroll', this.scrollHandler)

    this.socket.disconnect()
  },
  watch: {
    hideHidden() {
      this.setScrollTimer()
    },
    activeTab(newValue) {
      if(newValue === 'preview')
        this.loadPreview()
    }
  },
  methods: {
    setScrollTimer() {
      this.scrollTimer = setTimeout(async () => {
        if(this.fetchingComments) await this.waitUntil(new Promise(resolve => {
          this.locks.push(resolve)
        }), 5000)

        const visibleComments = this.$refs.comments.filter(a => a.shown)
        const firstUnfetchedComment = visibleComments.find(a => !a.fetched)
        if(!firstUnfetchedComment) return

        this.fetchingComments = true

        const firstIndex = firstUnfetchedComment.data.id - 1
        const firstComment = this.viewData.comments[firstIndex]

        let commentOffset = 0
        const firstFetchedBelowComment = this.viewData.comments.find(a => a.id > firstComment.id && a.user)
        const lastComment = this.viewData.comments[this.viewData.comments.length - 1]

        let belowCommentAmount = (firstFetchedBelowComment ?? lastComment).id - firstComment.id + (firstFetchedBelowComment ? -1 : 1)
        commentOffset += this.viewData.commentLoadAmount - Math.min(this.viewData.commentLoadAmount, belowCommentAmount)

        const comment = this.viewData.comments.find(a => !a.user && a.id >= firstComment.id - commentOffset)

        const comments = await this.internalRequest(`/thread/${this.viewData.thread.url}/${comment.id}`)
        for(let comment of Object.values(comments)) {
          const commentIndex = this.viewData.comments.findIndex(a => a.id === comment.id)
          if(commentIndex !== -1) this.viewData.comments[commentIndex] = comment
          else this.viewData.comments.push(comment)
        }

        this.fetchingComments = false
        this.locks.forEach(r => r())

        requestAnimationFrame(() => {
          const visibleComments = this.$refs.comments.filter(a => a.shown)
          const firstUnfetchedComment = visibleComments.find(a => !a.fetched)
          if(firstUnfetchedComment) this.setScrollTimer()
        });
      }, 100);
    },
    scrollHandler() {
      if(this.scrollTimer != null) clearTimeout(this.scrollTimer)
      this.setScrollTimer()
    },
    afterSubmit() {
      this.$refs.commentInput.value = ''
      this.activeTab = 'raw'
    },
    async loadPreview() {
      this.previewComment = {
        type: 0,
        id: this.viewData.comments.at(-1).id + 1,
        createdAt: new Date().toISOString(),
        user: {
          uuid: this.session.account.uuid,
          name: this.session.account.name,
          type: this.session.account.type
        }
      }

      const json = await this.internalRequest(this.doc_action_link(this.viewData.document, 'preview'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          content: this.$refs.commentInput.value,
          mode: 'thread'
        }).toString(),
        noProgress: true
      })

      this.previewComment.contentHtml = json.contentHtml
    }
  }
}
</script>
<style scoped>
.clearfix {
  clear: both;
}

h2 {
  font-size: 1.8em;
  margin: 1.2em 0 .8em;
}

h2, h3 {
  font-weight: 700;
  line-height: 1.1;
}

h3 {
  border-top: 2px dashed gray;
  color: inherit;
  font-family: inherit;
  font-size: 1.6em;
  margin: .2em 0 .8em;
  padding-top: 1em;
}

.theseed-dark-mode h3 {
  border-top-color: #383b40;
}

textarea {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  line-height: 1.5;
  font: inherit;
  margin: 0;
  padding: .25rem .5rem;
  resize: vertical;
  width: 100%;
}

textarea[disabled] {
  background-color: #eceeef;
  cursor: not-allowed;
  opacity: 1;
}

.theseed-dark-mode textarea {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

form.comment-form button {
  float: right;
  width: 8rem;
}

form.comment-form ul {
  border-bottom: 1px solid #ddd;
  height: 36px;
  list-style: none;
  margin-bottom: 0;
  margin-top: 0;
  padding-left: 0;
}

form.comment-form ul:after,form.comment-form ul:before {
  content: " ";
  display: table;
}

form.comment-form li {
  float: left;
  margin-bottom: -1px;
}

form.comment-form li+li {
  margin-left: .2rem;
}

form.comment-form li button {
  background: none;
  border: 1px solid transparent;
  border-radius: .25rem .25rem 0 0;
  cursor: pointer;
  display: block;
  font-size: .9rem;
  padding: .5em 1em;
}

form.comment-form li button.active {
  background-color: #fff;
  border-color: #ddd #ddd transparent;
  color: #55595c;
}

form.comment-form div.tabs:before {
  clear: both;
  content: "";
  display: table
}

form.comment-form div.tabs {
  border: 1px solid #ddd;
  border-top: none;
  margin-bottom: 1em;
}

form.comment-form div.tabs>div {
  display: none;
}

form.comment-form div.tabs>div.active {
  display: block;
}

form.comment-form div.tabs>div.preview-tab {
  padding: 20px;
}

form.comment-form div.tabs>div.preview-tab>div {
  padding-bottom: 0;
}

form.comment-form textarea {
  border: none;
}

.theseed-dark-mode form.comment-form div.tabs, .theseed-dark-mode form.comment-form ul {
  border-color: #383b40;
}

.theseed-dark-mode form.comment-form li button {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

.theseed-dark-mode form.comment-form li button.tab-button {
  background-color: #383b40;
}

.title-group {
  align-items: flex-start;
  display: flex;
  margin: 1.5rem 0 1.2rem;
}

@media screen and (max-width: 1023.98px) {
  .title-group {
    align-items: stretch;
    flex-direction: column;
  }
}

.title-group-right {
  align-items: center;
  display: flex;
  gap: .5rem;
  justify-content: flex-end;
  margin: 0 0 0 1rem;
}

@media screen and (max-width: 1023.98px) {
  .title-group-right {
    margin:.5rem 0 0;
  }
}

.topic {
  align-self: center;
  flex: 1;
  margin: 0;
}

@media screen and (max-width: 1023.98px) {
  .topic {
    align-self: auto;
  }
}

.status-icon {
  margin: 0 .4rem 0 0;
  overflow: hidden !important;
}

.delete-thread-form {
  display: flex;
}

.more-button {
  height: 2rem;
  width: 2rem;
}
</style>