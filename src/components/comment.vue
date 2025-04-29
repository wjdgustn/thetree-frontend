<template>
  <div ref="elem" v-close-popover class="comment" :class="{
    loading: !fetched,
    visible: shown,
    'tooltip-mode': tooltipMode
  }">
    <div class="comment-inside" :class="{ 'tooltip-mode': tooltipMode }">
      <div class="user-block" :class="{ 'user-starter': !previewMode && (comment.user && comment.user?.uuid === data.thread?.createdUser) }">
        <span class="num-text">
          <a :id="comment.id">#{{comment.id}}</a>
        </span>
        <template v-if="fetched">
          <AuthorSpan :account="comment.user" :pos="pos" discuss :discussAdmin="comment.admin"/>
          <span class="time-block">
            <LocalDate :date="comment.createdAt"/>
            <ContextMenu v-if="!previewMode" class="menu-block" placement="bottom-end">
              <span role="button" class="button menu-button">
                <FontAwesomeIcon icon="caret-down" />
              </span>
              <template #menu>
                <GeneralButton :whenClick="toggleRaw" v-text="showRaw ? '위키 보기' : '원문 보기'" v-close-popover/>
                <template v-if="data.permissions.hide">
                  <hr>
                  <GeneralButton theme="danger" :whenClick="toggleHide" v-text="comment.hidden ? '[ADMIN] 숨기기 해제' : '[ADMIN] 숨기기'" v-close-popover/>
                </template>
              </template>
            </ContextMenu>
          </span>
          <div class="clearfix"/>
        </template>
      </div>
      <div class="content-block" :class="{
        'special-comment': fetched && comment.type !== 0,
        'hidden-comment': comment.hidden && !forceShow
      }">
        <template v-if="!fetched || !comment.hidden || forceShow">
          <span v-if="showRaw" v-text="rawContent"/>
          <WikiContent v-else-if="comment.contentHtml" discuss :content="comment.contentHtml"/>
        </template>
        <template v-else>
          [<AuthorSpan :account="comment.hideUser" :pos="pos"/>에 의해 숨겨진 글입니다.]
          <SeedButton @click="forceShow = true" v-if="data.permissions.hide" danger>[ADMIN] SHOW</SeedButton>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import { vClosePopper } from 'floating-vue'

import Common from '@/mixins/common'
import AuthorSpan from '@/components/authorSpan'
import LocalDate from '@/components/localDate'
import ContextMenu from '@/components/contextMenu'
import WikiContent from '@/components/wiki/wikiContent'
import GeneralButton from '@/components/generalButton'
import SeedButton from '@/components/seedButton'

export default {
  components: {
    SeedButton,
    GeneralButton,
    WikiContent,
    ContextMenu,
    LocalDate,
    AuthorSpan
  },
  mixins: [Common],
  emits: ['updateShow', 'updateHide', 'show', 'hide'],
  directives: {
    closePopover: vClosePopper
  },
  props: {
    comment: {
      type: JSON,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    previewMode: Boolean,
    tooltipMode: Boolean,
    thread: JSON
  },
  data() {
    return {
      shown: false,
      tooltipVisible: false,
      showRaw: false,
      rawContent: null,
      loadingRaw: false,
      abortController: null,
      forceShow: false
    }
  },
  mounted() {
    this.observer = new IntersectionObserver(entries => {
      if(entries.length > 0) {
        const entry = entries[0]
        this.shown = entry.isIntersecting
        this.$emit(this.shown ? 'show' : 'hide')
      }
    })
    this.observer.observe(this.$refs.elem)

    this.abortController = new AbortController()
  },
  beforeUnmount() {
    if(this.observer) {
      this.observer.disconnect()
      this.observer = null
    }

    if(this.abortController) {
      this.abortController.abort()
      this.abortController = null
    }
  },
  computed: {
    fetched() {
      return this.comment.user
    },
    pos() {
      return '토론 ' + this.slug + ' #' + this.comment.id
    }
  },
  methods: {
    async loadRaw() {
      if(this.loadingRaw) return

      this.loadingRaw = true
      try {
        const res = await this.internalRequest(`/thread/${this.slug}/${this.comment.id}/raw`)

        if(res.code) {
          alert(res.data)
          this.showRaw = false
          return
        }

        this.rawContent = res.data
      } catch(e) {
        console.error(e)
        this.showRaw = false
      } finally {
        this.loadingRaw = false
      }
    },
    async toggleRaw() {
      this.showRaw = !this.showRaw
      if(this.showRaw && this.rawContent === null) {
        await this.loadRaw()
      }
    },
    async toggleHide() {
      await this.internalRequestAndProcess(`/admin/thread/${this.slug}/${this.comment.id}/${this.comment.hidden ? 'show' : 'hide'}`, {
        method: 'POST'
      })
    }
  }
}
</script>
<style scoped>
@keyframes loadingBlink {
  0% {
    opacity: .25;
  }

  25% {
    opacity: .37;
  }

  50% {
    opacity: .52;
  }

  75% {
    opacity: .81;
  }

  to {
    opacity: 1;
  }
}

div.comment {
  margin: 0;
  padding-bottom: 20px;
}

div.comment.tooltip-mode {
  padding-bottom: 0;
}

div.comment.loading.visible {
  animation-direction: alternate;
  animation-duration: .5s;
  animation-iteration-count: infinite;
  animation-name: loadingBlink;
  opacity: .25;
}

div.comment div.comment-inside {
  display: inline-block;
  max-width: 100%;
  min-width: 400px;
  word-wrap: break-word;
  background: #d5d5d5;
  border: 1px solid gray;
  border-radius: 4px;
  overflow: hidden;
}

.theseed-dark-mode div.comment div.comment-inside {
  background-color: #2d2f34;
  border-color: #383b40;
}

div.comment div.comment-inside.tooltip-mode {
  border: none;
  border-radius: 0;
  display: block;
}

div.comment div.user-block {
  margin: 0;
  padding: 7px 7px 7px 10px;
}

div.comment div.user-block.user-starter {
  background: #b0d3ad;
}

.theseed-dark-mode div.comment div.user-block.user-starter {
  background-color: #324432;
}

div.comment span.num-text {
  margin-right: .25rem;
}

div.comment div.content-block {
  background: #f4f4f4;
  padding: 13px;
  word-wrap: break-word;
  max-height: 500px;
  overflow-y: auto;
}

div.comment div.content-block.tooltip-mode {
  overflow-y: hidden
}

div.content-raw {
  white-space: pre-wrap;
}

.theseed-dark-mode div.comment div.content-block {
  background: #27292d;
}

div.comment div.content-block.special-comment {
  background: #fc6;
}

.theseed-dark-mode div.comment div.content-block.special-comment {
  background: #54411a;
}

div.comment div.content-block.hidden-comment {
  background: #6b6b6b;
  color: #fff;
}

div.comment.loading div.content-block {
  height: 80px;
}

div.comment div.comment-inside span.time-block {
  float: right;
}

div.comment div.comment-inside span.time-block div.menu-block {
  display: inline-block;
  vertical-align: middle;
}

div.comment div.comment-inside span.time-block div.menu-block .menu-button {
  height: 1.2rem;
  margin: 0 0 -.25rem .5rem;
  padding: 0;
  width: 1.25rem;
}

div.comment div.comment-inside span.time-block div.menu-block .menu-button svg {
  fill: #555;
  width: .5rem;
}

.theseed-dark-mode div.comment div.comment-inside span.time-block div.menu-block .menu-button svg {
  fill: #aaa;
}

div.clearfix {
  clear: both;
}

div.comment div.user-block sub {
  bottom: -.25em;
  font-size: 75%;
  line-height: 0;
  position: relative;
  vertical-align: baseline;
}

@media screen and (max-width: 700px) {
  div.comment {
    padding-left: 0;
  }

  div.comment div.comment-inside {
    display: block;
    min-width: 100%;
    width: 100%;
  }
}
</style>