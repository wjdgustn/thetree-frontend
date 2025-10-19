<template>
  <Alert v-if="doc_fulltitle(page.data.document) === config['wiki.front_page']">
    <strong>[경고!]</strong>
    이 토론은 {{doc_fulltitle(page.data.document)}} 문서의 토론입니다.
    {{doc_fulltitle(page.data.document)}} 문서와 관련 없는 토론은 각 문서의 토론에서 진행해 주시기 바랍니다.
    {{doc_fulltitle(page.data.document)}} 문서와 관련 없는 토론은 삭제될 수 있습니다.
  </Alert>

  <div class="title-group">
    <h2 class="topic">{{data.thread.topic}}</h2>
    <div class="title-group-right">
      <ButtonBadge round :theme="['', 'secondary', 'super'][data.thread.status]">
        <FontAwesomeIcon :icon="['door-open', 'pause', 'door-closed'][data.thread.status]" />
        <span v-text="['열림', '중지됨', '닫힘'][data.thread.status]"/>
      </ButtonBadge>
      <ContextMenu placement="bottom-end">
        <GeneralButton class="more-button">
          <FontAwesomeIcon icon="ellipsis-vertical" />
        </GeneralButton>
        <template #menu>
          <CheckBox v-model="hideHidden">숨겨진 댓글 보이지 않기</CheckBox>
          <template v-if="data.permissions.delete">
            <hr>
            <SeedForm :beforeSubmit="goConfirm" method="post" class="delete-thread-form" :action="'/admin/thread/' + data.thread.url + '/delete'" noCaptcha>
              <GeneralButton theme="danger" type="submit">[ADMIN] 스레드 삭제</GeneralButton>
            </SeedForm>
          </template>
        </template>
      </ContextMenu>
    </div>
  </div>

  <div>
    <template v-for="comment in data.comments">
      <Comment
          ref="comments"
          v-if="!comment.hidden || !hideHidden"
          :slug="data.thread.url"
          :comment="comment"
          @show="commentShown"
      />
    </template>
  </div>

  <template v-if="data.thread.pinnedComment">
    <h3>고정된 댓글</h3>
    <Comment :slug="data.thread.url" :comment="pinnedComment"/>
  </template>

  <h3>댓글 달기</h3>
  <FormErrorAlert/>
  <template v-if="data.permissions.manage">
    <SeedForm method="post" :action="'/admin/thread/' + data.thread.url + '/status'" noCaptcha>
      [ADMIN] 스레드 상태 변경
      <select name="status">
        <option v-if="data.thread.status !== 0" value="Normal">normal</option>
        <option v-if="data.thread.status !== 2" value="Close">close</option>
        <option v-if="data.thread.status !== 1" value="Pause">pause</option>
      </select>
      <SeedButton type="submit">변경</SeedButton>
    </SeedForm>
    <SeedForm method="post" :action="'/admin/thread/' + data.thread.url + '/document'" noCaptcha>
      [ADMIN] 스레드 이동
      <input name="document" :value="doc_fulltitle(data.document)">
      <SeedButton type="submit">변경</SeedButton>
    </SeedForm>
    <SeedForm method="post" :action="'/admin/thread/' + data.thread.url + '/topic'" noCaptcha>
      [ADMIN] 스레드 주제 변경
      <input name="topic" :value="data.thread.topic">
      <SeedButton type="submit">변경</SeedButton>
    </SeedForm>
  </template>

  <SeedForm method="post" class="comment-form" :afterSubmit="afterSubmit" :action="'/thread/' + data.thread.url">
    <CommentPreviewTab ref="commentPreviewTab" :sendComment="sendComment"/>
    <IpWarn discuss/>
    <SeedButton ref="submitButton" type="submit" submit :disabled="data.thread.status !== 0">전송</SeedButton>
  </SeedForm>
</template>
<script>
import { io } from 'socket.io-client'
import { GlobalEvents } from 'vue-global-events'

import Common from '@/mixins/common'
import ButtonBadge from '@/components/buttonBadge'
import ContextMenu from '@/components/contextMenu'
import SeedForm from '@/components/form/seedForm'
import SeedButton from '@/components/seedButton'
import Comment from '@/components/comment'
import CheckBox from '@/components/form/checkBox'
import GeneralButton from '@/components/generalButton'
import FormErrorAlert from '@/components/form/formErrorAlert'
import IpWarn from '@/components/ipWarn'
import Alert from '@/components/alert'
import CommentPreviewTab from '@/components/commentPreviewTab'

export default {
  mixins: [Common],
  components: {
    CommentPreviewTab,
    Alert,
    IpWarn,
    FormErrorAlert,
    GeneralButton,
    CheckBox,
    Comment,
    SeedButton,
    SeedForm,
    ContextMenu,
    ButtonBadge,
    GlobalEvents
  },
  data() {
    return {
      initLoaded: false,
      locks: [],
      fetchingComments: false,
      scrollTimer: null,
      hideHidden: this.$store.state.localConfig['thread.hide_hidden'] ?? true,
      socket: null
    }
  },
  computed: {
    pinnedComment() {
      return this.data.thread.pinnedComment && this.data.comments.find(a => a.id === this.data.thread.pinnedComment)
    }
  },
  created() {
    this.$store.state.components.mainView.beforeLeave = this.beforeLeave
  },
  mounted() {
    window.addEventListener('scroll', this.scrollHandler)

    this.socket = io('/thread', {
      query: {
        thread: this.data.thread.url
      }
    })

    this.socket.on('comment', comment => {
      const commentIndex = this.data.comments.findIndex(a => a.id === comment.id)
      const prevComment = this.data.comments[commentIndex]
      if(commentIndex !== -1) this.data.comments[commentIndex] = comment
      else this.data.comments.push(comment)

      if(!comment.contentHtml && prevComment?.contentHtml)
        comment.contentHtml = prevComment.contentHtml
    })
    this.socket.on('updateThread', thread => {
      this.data.thread = {
        ...this.data.thread,
        ...thread
      }

      if(thread.deleted)
        this.$store.state.components.mainView.routerPush(this.doc_action_link(this.data.document, 'discuss'))
    })

    const anchorElem = document.getElementById(location.hash.slice(1))
    anchorElem?.scrollIntoView()
  },
  beforeUnmount() {
    if(this.scrollTimer != null) clearTimeout(this.scrollTimer)
    window.removeEventListener('scroll', this.scrollHandler)

    this.socket.disconnect()
  },
  watch: {
    hideHidden(newValue) {
      this.setScrollTimer()
      this.$store.state.localConfigSetValue('thread.hide_hidden', newValue)
    },
    $route() {
      this.setScrollTimer(true)
    }
  },
  methods: {
    commentShown() {
      if(this.initLoaded) return
      this.initLoaded = true
      this.setScrollTimer(true)
    },
    beforeLeave() {
      if(this.$refs.commentPreviewTab.$refs.commentInput?.value)
        return confirm('변경된 사항이 저장되지 않았습니다.')
      return true
    },
    setScrollTimer(skipWait = false) {
      this.scrollTimer = setTimeout(async () => {
        if(this.fetchingComments) await this.waitUntil(new Promise(resolve => {
          this.locks.push(resolve)
        }), 5000)

        const visibleComments = this.$refs.comments.filter(a => a.shown)
        const firstUnfetchedComment = visibleComments.find(a => !a.fetched)
        if(!firstUnfetchedComment) return

        this.fetchingComments = true

        const firstIndex = firstUnfetchedComment.comment.id - 1
        const firstComment = this.data.comments[firstIndex]

        let commentOffset = 0
        const firstFetchedBelowComment = this.data.comments.find(a => a.id > firstComment.id && a.user)
        const lastComment = this.data.comments[this.data.comments.length - 1]

        let belowCommentAmount = (firstFetchedBelowComment ?? lastComment).id - firstComment.id + (firstFetchedBelowComment ? -1 : 1)
        commentOffset += this.data.commentLoadAmount - Math.min(this.data.commentLoadAmount, belowCommentAmount + (firstFetchedBelowComment ? 1 : 0))

        const comment = this.data.comments.find(a => !a.user && a.id >= firstComment.id - commentOffset)

        const comments = await this.internalRequest(`/thread/${this.data.thread.url}/${comment.id}`, {
          noProgress: true
        })
        for(let comment of Object.values(comments)) {
          if(!comment.id) continue
          const commentIndex = this.data.comments.findIndex(a => a.id === comment.id)
          if(commentIndex !== -1) this.data.comments[commentIndex] = comment
          else this.data.comments.push(comment)
        }

        this.fetchingComments = false
        this.locks.forEach(r => r())

        requestAnimationFrame(() => {
          const visibleComments = this.$refs.comments.filter(a => a.shown)
          const firstUnfetchedComment = visibleComments.find(a => !a.fetched)
          if(firstUnfetchedComment) this.setScrollTimer()
        });
      }, skipWait ? 0 : 100)
    },
    scrollHandler() {
      if(this.scrollTimer != null) clearTimeout(this.scrollTimer)
      this.setScrollTimer()
    },
    afterSubmit() {
      this.$refs.commentPreviewTab.$refs.commentInput.value = ''
      this.$refs.commentPreviewTab.activeTab = 'raw'
    },
    sendComment(e) {
      if(e.repeat) return
      this.$refs.submitButton.$el.click()
    },
    goConfirm() {
      return confirm('go?')
    }
  }
}
</script>
<style module>
@import '@/styles/button.css';
</style>
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

.delete-thread-form {
  display: flex;
}

.more-button {
  height: 2rem;
  width: 2rem;
}
</style>