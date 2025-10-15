<template>
  <ul>
    <li><button type="button" class="tab-button" :class="{ active: activeTab === 'raw' }" @click="activeTab = 'raw'">RAW 편집</button></li>
    <li><button type="button" class="tab-button" :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">미리보기</button></li>
  </ul>
  <div class="tabs">
    <div :class="{ active: activeTab === 'raw' }">
      <textarea v-if="!data.thread || data.thread.status === 0" ref="commentInput" rows="5" name="text" @keydown.ctrl.enter="sendComment"/>
      <textarea v-else rows="5" disabled v-text="['', 'pause 상태입니다.', '닫힌 토론입니다.'][data.thread.status]"/>
    </div>
    <div class="preview-tab" :class="{ active: activeTab === 'preview' }">
      <Comment
          previewMode
          :slug="data.thread?.url ?? 'dummy'"
          :comment="previewComment"
      />
    </div>
  </div>
</template>
<script>
import Common from '@/mixins/common'
import Comment from '@/components/comment'

export default {
  mixins: [Common],
  props: {
    sendComment: Function
  },
  components: {
    Comment
  },
  data() {
    return {
      activeTab: 'raw',
      previewComment: {}
    }
  },
  watch: {
    activeTab(newValue) {
      if(newValue === 'preview')
        this.loadPreview()
    }
  },
  methods: {
    async loadPreview() {
      this.previewComment = {
        type: 0,
        id: (this.data.comments?.at(-1).id ?? 0) + 1,
        createdAt: new Date().toISOString(),
        user: {
          uuid: this.session.account.uuid,
          name: this.session.account.name,
          type: this.session.account.type
        }
      }

      const json = await this.internalRequest(this.doc_action_link(this.data.document, 'preview'), {
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

button {
  float: right;
  width: 8rem;
}

ul {
  border-bottom: 1px solid #ddd;
  height: 36px;
  list-style: none;
  margin-bottom: 0;
  margin-top: 0;
  padding-left: 0;
}

ul:after,ul:before {
  content: " ";
  display: table;
}

li {
  float: left;
  margin-bottom: -1px;
}

li+li {
  margin-left: .2rem;
}

li button {
  background: none;
  border: 1px solid transparent;
  border-radius: .25rem .25rem 0 0;
  cursor: pointer;
  display: block;
  font-size: .9rem;
  padding: .5em 1em;
}

li button.active {
  background-color: #fff;
  border-color: #ddd #ddd transparent;
  color: #55595c;
}

div.tabs:before {
  clear: both;
  content: "";
  display: table
}

div.tabs {
  border: 1px solid #ddd;
  border-top: none;
  margin-bottom: 1em;
}

div.tabs>div {
  display: none;
}

div.tabs>div.active {
  display: block;
}

div.tabs>div.preview-tab {
  padding: 20px;
}

div.tabs>div.preview-tab>div {
  padding-bottom: 0;
}

textarea {
  border: none;
}

.theseed-dark-mode div.tabs, .theseed-dark-mode ul {
  border-color: #383b40;
}

.theseed-dark-mode li button {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

.theseed-dark-mode li button.active {
  background-color: #383b40;
}
</style>