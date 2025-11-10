<template>
  <WikiCategory v-if="categories.length && $store.state.localConfig['wiki.category_position'] !== 'bottom'" :categories="categories"/>

  <div v-if="userbox.admin" class="user-box admin-box">
    이 사용자는 특수 권한을 가지고 있습니다.
  </div>
  <div v-if="userbox.blocked" class="user-box banned-box">
    이 사용자는 {{userbox.blocked.name}} 그룹에 있습니다. (#{{userbox.blocked.id}})<br><br>

    이 사용자는 <LocalDate :date="userbox.blocked.createdAt"/>에
    <template v-if="userbox.blocked.expiresAt">
      <LocalDate :date="userbox.blocked.expiresAt"/> 까지
    </template>
    <template v-else>
      영구적으로
    </template>
    {{userbox.blocked.name}} 그룹에 추가되었습니다.<br>
    사유: {{userbox.blocked.note ?? '없음'}}
  </div>

  <div
      ref="div"
      v-html="(topHtml || '') + content + (bottomHtml || '')"
      class="wiki-content"
      @click="onDynamicContentClick"
      @submit.prevent="formSubmit"
      :class="{ 'wiki-thread-content': discuss }"
  />

  <WikiCategory v-if="categories.length && ['bottom', 'both'].includes($store.state.localConfig['wiki.category_position'])" :categories="categories"/>

  <div ref="popover" v-show="popover.show" id="tooltip" class="popper">
    <div ref="popoverArrow" id="tooltip-arrow" class="popper__arrow"></div>
    <div id="tooltip-content" class="wiki-content" v-html="popover.content" @click="onDynamicContentClick"></div>
  </div>
  <Modal v-model="modal.show" v-slot="props">
    <div class="wiki-content" v-html="modal.content" @click="onDynamicContentClick"></div>
    <button @click="props.close" type="button">닫기</button>
  </Modal>
</template>
<script>
import { computePosition, offset, flip, shift, autoUpdate } from '@floating-ui/vue'

import NuxtLink from '@/components/global/nuxtLink'
import Alert from '@/components/alert'
import WikiCategory from '@/components/wiki/wikiCategory'
import WikiCategoryDocs from '@/components/wiki/wikiCategoryDocs'
import LocalDate from '@/components/localDate'

import Common from '@/mixins/common'
import { isMobile } from '@/utils'
import Modal from '@/components/modal'

export default {
  mixins: [Common],
  components: {
    Modal,
    NuxtLink,
    Alert,
    WikiCategory,
    WikiCategoryDocs,
    LocalDate
  },
  props: {
    discuss: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    },
    categories: {
      type: Array,
      default: () => []
    },
    userbox: {
      type: Object,
      default: () => ({})
    },
    topHtml: {
      type: String
    },
    bottomHtml: {
      type: String
    }
  },
  data() {
    return {
      popover: {
        show: false,
        content: '',
        cleanup: null
      },
      modal: {
        show: false,
        content: ''
      },
      canPlayVideo: false,
      autoplayObserver: null,
      cleanupFunctions: []
    }
  },
  mounted() {
    this.canPlayVideo = (() => {
      try {
        const video = document.createElement('video')
        if(video?.canPlayType?.(`video/mp4; codecs="avc1.4D401E"`))
          return true
      } catch(e) {}

      return false
    })
    this.autoplayObserver = new IntersectionObserver(entries => {
      for(let entry of entries) {
        try {
          if(entry.isIntersecting)
            entry.target.play()
          else
            entry.target.pause()
        } catch (e) {}
      }
    })

    this.setupWikiContent()
    if(!import.meta.env.SSR) import('@justinribeiro/lite-youtube')
  },
  beforeUnmount() {
    for(let func of this.cleanupFunctions)
      func()
    this.cleanupFunctions.length = 0
  },
  watch: {
    async content() {
      await this.$nextTick()
      this.setupWikiContent()
    },
    'popover.show'(newValue) {
      if(!newValue)
        this.popover.cleanup?.()
    },
    $route() {
      this.popover.show = false
    }
  },
  methods: {
    getFootnotes(element) {
      return [...element.getElementsByClassName('wiki-fn-content')]
    },
    setupWikiContent(element = this.$refs.div) {
      {
        const imageHide = this.$store.state.localConfig['wiki.image_hide']
        const disableImageLazy = this.$store.state.localConfig['wiki.disable_image_lazy']

        for(let img of [...element.getElementsByClassName('wiki-image-loading')]) {
          if(img.tagName !== 'IMG') continue

          const parent = img.parentNode
          if(!parent) continue

          const isVideo = img.dataset.videoSrc && this.canPlayVideo
          const size = parseInt(isVideo ? img.dataset.videoFilesize : img.dataset.filesize)

          img.classList.remove('wiki-image-loading')

          const addInfoBtn = () => {
            if(!img.dataset.doc || img.closest('a')) return

            const btn = document.createElement('a')
            btn.classList.add('wiki-image-info-btn')
            btn.href = img.dataset.doc
            btn.rel = 'nofollow noopener'
            parent.appendChild(btn)
          }

          const loadImg = () => {
            if(!isVideo) {
              if(!disableImageLazy)
                img.setAttribute('loading', 'lazy')
              img.setAttribute('src', img.dataset.src)
              addInfoBtn()
              return
            }

            const video = document.createElement('video')
            if(img.dataset.src) {
              video.muted = true
              video.loop = true

              const baseUrl = import.meta.env.BASE_URL
              video.setAttribute('poster', baseUrl + (baseUrl.endsWith('/') ? '' : '/') + 'img/loading.gif')
            }
            else {
              video.controls = true
            }
            video.playsInline = true
            video.setAttribute('src', img.dataset.videoSrc)
            video.classList.add('wiki-image')

            if(img.getAttribute('width'))
              video.setAttribute('width', img.getAttribute('width'))
            if(img.getAttribute('height'))
              video.setAttribute('height', img.getAttribute('height'))

            if(!disableImageLazy)
              video.setAttribute('loading', 'lazy')

            parent.insertBefore(video, img)
            addInfoBtn()
            parent.removeChild(img)

            if(this.autoplayObserver) {
              this.autoplayObserver.observe(video)
              this.cleanupFunctions.push(() => {
                this.autoplayObserver.unobserve(video)
              })
            }
          }

          if(imageHide === 'hide' || (imageHide === 'hide_1mb' && !isNaN(size) && size >= (1024 * 1024))) {
            const btn = document.createElement('button')
            btn.setAttribute('type', 'button')
            btn.classList.add('wiki-image', 'wiki-image-show-button')

            let sizeText = ''
            if(size) {
              if(size > 1024 * 1024)
                sizeText = (size / 1024 / 1024).toFixed(2) + 'MB'
              else if(size > 1024)
                sizeText = (size / 1024).toFixed(2) + 'KB'
              else
                sizeText = size + 'bytes'
            }
            sizeText &&= ` (${sizeText})`

            btn.innerText = (img.dataset.src ? '이미지' : '동영상') + sizeText

            const removeBtnListener = () => {
              btn.removeEventListener('click', onBtnClick)
            }
            this.cleanupFunctions.push(removeBtnListener)

            let onBtnClick = e => {
              if(!onBtnClick) return

              e?.preventDefault()
              removeBtnListener()
              onBtnClick = null
              parent.insertBefore(img, btn)
              parent.removeChild(btn)
              loadImg()
            }

            btn.addEventListener('click', onBtnClick)
            parent.insertBefore(btn, img)
            parent.removeChild(img)
          }
          else loadImg()
        }
      }

      const headings = element.getElementsByClassName('wiki-heading')
      for(let heading of headings) {
        heading.addEventListener('click', e => {
          if(e.target.tagName === 'A') return

          const heading = e.currentTarget
          const content = heading.nextElementSibling
          const prevClosed = heading.classList.contains('wiki-heading-folded')
          if(prevClosed) {
            heading.classList.remove('wiki-heading-folded')
            content.classList.remove('wiki-heading-content-folded')
          }
          else {
            heading.classList.add('wiki-heading-folded')
            content.classList.add('wiki-heading-content-folded')
          }
        })

        if(this.$store.state.localConfig['wiki.hide_heading_content']) {
          heading.classList.add('wiki-heading-folded')
          heading.nextElementSibling.classList.add('wiki-heading-content-folded')
        }
      }

      const foldings = element.getElementsByClassName('wiki-folding')
      for(let folding of foldings) {
        const foldingText = folding.firstElementChild
        const foldingContent = foldingText.nextElementSibling

        let offsetWidth
        let offsetHeight
        const resizeObserver = new ResizeObserver(([entry]) => {
          if(!entry.contentRect.height) return

          const openedBefore = foldingContent.classList.contains('wiki-folding-opened')

          if(!openedBefore) foldingContent.classList.add('wiki-folding-opened')
          offsetWidth = foldingContent.offsetWidth
          offsetHeight = foldingContent.offsetHeight
          if(!openedBefore) foldingContent.classList.remove('wiki-folding-opened')

          resizeObserver.disconnect()
        })
        resizeObserver.observe(foldingText)

        let transitionCount = 0
        const transitioning = () => transitionCount !== 0

        foldingContent.addEventListener('transitionstart', _ => transitionCount++)
        foldingContent.addEventListener('transitionend', _ => transitionCount--)
        foldingContent.addEventListener('transitioncancel', _ => transitionCount--)

        const setSizeToOffsetSize = () => {
          foldingContent.style.maxWidth = offsetWidth + 'px'
          foldingContent.style.maxHeight = offsetHeight + 'px'
        }
        const removeSize = () => {
          foldingContent.style.maxWidth = ''
          foldingContent.style.maxHeight = ''
        }
        const finishOpen = () => {
          if(transitioning()) return

          removeSize()
          foldingContent.classList.add('wiki-folding-opened')

          foldingContent.removeEventListener('transitionend', finishOpen)
        }

        if(this.$store.state.localConfig['wiki.show_folding'])
          foldingContent.classList.add('wiki-folding-open-anim', 'wiki-folding-opened')

        foldingText.addEventListener('click', e => {
          const foldingText = e.currentTarget
          const foldingContent = foldingText.nextElementSibling

          const opened = foldingContent.classList.contains('wiki-folding-open-anim')

          if(opened) {
            setSizeToOffsetSize()

            requestAnimationFrame(_ => {
              foldingContent.classList.remove('wiki-folding-open-anim')
              foldingContent.classList.remove('wiki-folding-opened')

              removeSize()
            })
          }
          else {
            foldingContent.classList.add('wiki-folding-open-anim')
            setSizeToOffsetSize()

            foldingContent.addEventListener('transitionend', finishOpen)
          }
        })
      }

      let footnoteType = this.$store.state.localConfig['wiki.footnote_type']
      footnoteType ??= isMobile ? 'popup' : 'popover'

      if(footnoteType === 'popover') this.setupFootnoteTooltip(element)
      else if(footnoteType === 'popup') this.setupFootnoteModal(element)
      else if(footnoteType === 'unfold') this.setupFootnoteUnfolded(element)

      if(this.$store.state.localConfig['wiki.unfold_wiki_link']) {
        const links = element.getElementsByClassName('wiki-link-internal')
        for(let link of links) {
          if(link.tagName !== 'A') continue

          const title = link.getAttribute('title')
          if(!title) continue
          let checkTitle = title

          const anchorPos = title.lastIndexOf('#')
          if(anchorPos !== -1)
            checkTitle = title.slice(0, anchorPos)

          if(checkTitle.trim() === link.innerText.trim())
            continue
          if(link.getElementsByTagName('img').length)
            continue

          const unfolded = document.createElement('span')
          unfolded.classList = 'wiki-link-unfolded'
          unfolded.innerText = title

          const linkParent = link.parentNode
          if(linkParent) {
            if(link.nextSibling)
              linkParent.insertBefore(unfolded, link.nextSibling)
            else
              linkParent.appendChild(unfolded)
          }
        }
      }

      const oldDarkStyle = document.getElementById('darkStyle')
      if(oldDarkStyle) oldDarkStyle.remove()

      const darkStyleElements = document.querySelectorAll('*[data-dark-style]')
      const darkStyles = []
      for(let element of darkStyleElements) {
        const styleData = element.dataset.darkStyle.split(';').map(a => a.trim()).filter(a => a)
        let style = ''
        for(let stylePart of styleData) {
          const [key, value] = stylePart.split(':').map(a => a.trim())
          style += `${key}:${value} !important;`
        }

        let darkStyle = darkStyles.find(a => a.style === style)
        if(!darkStyle) {
          darkStyle = {
            style,
            class: '_' + crypto.randomUUID().replaceAll('-', '')
          }
          darkStyles.push(darkStyle)
        }
        element.classList.add(darkStyle.class)
      }

      if(darkStyles.length) {
        const newDarkStyle = document.createElement('style')
        newDarkStyle.id = 'darkStyle'
        newDarkStyle.innerHTML = darkStyles.map(a => `.theseed-dark-mode .${a.class}{${a.style}}`).join('')
        document.body.appendChild(newDarkStyle)
      }

      const times = element.querySelectorAll('time[data-type=timezone]')
      for(let time of times) {
        const type = time.dataset.type
        const date = new Date(time.dateTime)

        const dateStr = [
          date.getFullYear(),
          date.getMonth() + 1,
          date.getDate()
        ].map(num => num.toString().padStart(2, '0')).join('-')

        const timeStr = [
          date.getHours(),
          date.getMinutes(),
          date.getSeconds()
        ].map(num => num.toString().padStart(2, '0')).join(':')

        let result = dateStr + ' ' + timeStr

        if(type === 'timezone') {
          const offset = -(date.getTimezoneOffset() / 60)
          result += (offset > 0 ? '+' : '-') + (offset * 100).toString().padStart(4, '0')
        }

        time.textContent = result
      }

      if(!this.discuss) {
        const anchorElem = document.getElementById(location.hash.slice(1))
        anchorElem?.scrollIntoView()
      }
    },
    setupFootnoteTooltip(element) {
      let hovering = 0
      const mouseLeaveHandler = _ => {
        requestAnimationFrame(() => requestAnimationFrame( () =>{
          hovering--

          if(!hovering)
            this.popover.show = false
        }))
      }

      const popover = this.$refs.popover
      popover.addEventListener('mouseenter', _ => {
        hovering++
      })
      popover.addEventListener('mouseleave', mouseLeaveHandler)

      for(let footnote of this.getFootnotes(element)) {
        const targetId = footnote.getAttribute('href').slice(1)
        const contentElement = document.getElementById(targetId).parentElement

        footnote.title = ''

        const update = () => computePosition(footnote, popover, {
          placement: 'top',
          middleware: [
            offset(5),
            flip(),
            shift()
          ]
        }).then(({x, y, placement, middlewareData}) => {
          popover.setAttribute('x-placement', placement)
          Object.assign(popover.style, {
            left: `${x}px`,
            top: `${y}px`,
          })

          this.$refs.popoverArrow.style.left = `calc(50% - 10px - ${middlewareData.shift.x}px)`
        })

        footnote.addEventListener('mouseenter', async _ => {
          hovering++

          this.popover.show = true
          this.popover.content = contentElement.innerHTML
          this.popover.cleanup = autoUpdate(footnote, popover, update)
        })

        footnote.addEventListener('mouseleave', mouseLeaveHandler)
      }
    },
    setupFootnoteModal(element) {
      for(let footnote of this.getFootnotes(element)) {
        const targetId = footnote.getAttribute('href').slice(1)
        const contentElement = document.getElementById(targetId).parentElement

        footnote.title = ''

        footnote.addEventListener('click', e => {
          e.preventDefault()

          this.modal.content = contentElement.innerHTML
          this.modal.show = true
        })
      }
    },
    setupFootnoteUnfolded(element) {
      for(let footnote of this.getFootnotes(element)) {
        if(footnote.tagName !== 'A') continue

        const footnoteLink = footnote.getAttribute('href')
        if(!footnoteLink) continue

        const footnoteId = decodeURIComponent(footnoteLink.slice(1))
        const footnoteParent = footnote.parentNode
        if(!footnoteParent) continue

        let footnoteContent = document.getElementById(footnoteId)
        if(!footnoteContent || !footnoteContent.parentNode)
          continue
        footnoteContent = footnoteContent.parentNode.innerHTML

        const unfolded = document.createElement('span')
        unfolded.classList = 'wiki-fn-unfolded'
        unfolded.innerHTML = footnoteContent
        unfolded.id = 'r' + footnoteId

        const unfoldedLink = unfolded.getElementsByTagName('a')[0]
        if(unfoldedLink)
          unfoldedLink.href = '#' + footnoteId

        unfolded.removeChild(unfolded.getElementsByTagName('span')[0])

        this.setupWikiContent(unfolded)

        footnoteParent.insertBefore(unfolded, footnote)
        footnoteParent.removeChild(footnote)
      }
    },
    async formSubmit(e) {
      const el = e.target
      const actionAttr = el.getAttribute('action')
      const url = new URL(el.action)
      const formData = new FormData(el)
      await this.internalRequestAndProcess(url.pathname, {
        method: el.method,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(formData).toString()
      })

      const newEl = this.$refs.div.querySelector(`form[action="${actionAttr}"]`)
      for(let [key, value] of formData.entries()) {
        const input = newEl.querySelector(`[type=radio][name="${key}"][value="${value}"]`)
        input.checked = true
      }
    }
  }
}
</script>
<style scoped>
.popper {
  background: #fff;
  border-radius: 3px;
  box-shadow: 0 0 2px rgba(0,0,0,.5);
  max-width: 50%;
  padding: 15px;
  position: absolute;
  word-break: break-all;
  z-index: 1;
}

.theseed-dark-mode .popper {
  background: #383b40;
  box-shadow: 0 0 2px hsla(0,0%,100%,.5);
}

.popper .popper__arrow {
  border-color: #ddd;
  border-style: solid;
  height: 0;
  margin: 5px;
  position: absolute;
  width: 0;
}

.theseed-dark-mode .popper .popper__arrow {
  border-color: #ccc;
}

.popper[x-placement^=top] {
  margin-bottom: 5px;
}

.popper[x-placement^=top] .popper__arrow {
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-right-color: transparent;
  border-width: 5px 5px 0;
  bottom: -5px;
  left: calc(50% - 10px);
  margin-bottom: 0;
  margin-top: 0;
}

.popper[x-placement^=bottom] {
  margin-top: 5px
}

.popper[x-placement^=bottom] .popper__arrow {
  border-left-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  border-width: 0 5px 5px;
  left: calc(50% - 10px);
  margin-bottom: 0;
  margin-top: 0;
  top: -5px;
}

.popper[x-placement^=right] {
  margin-left: 5px
}

.popper[x-placement^=right] .popper__arrow {
  border-bottom-color: transparent;
  border-left-color: transparent;
  border-top-color: transparent;
  border-width: 5px 5px 5px 0;
  left: -5px;
  margin-left: 0;
  margin-right: 0;
  top: calc(50% - 10px);
}

.popper[x-placement^=left] {
  margin-right: 5px;
}

.popper[x-placement^=left] .popper__arrow {
  border-bottom-color: transparent;
  border-right-color: transparent;
  border-top-color: transparent;
  border-width: 5px 0 5px 5px;
  margin-left: 0;
  margin-right: 0;
  right: -5px;
  top: calc(50% - 10px);
}

:deep(.thetree-modal-container) {
  padding-top: 10rem;
}

:deep(.thetree-modal-container):focus {
  outline: 0 !important;
}

.thetree-modal-content .wiki-content {
  padding: 1rem;
}

.thetree-modal-content button {
  background-color: #fafafa;
  border: 0;
  border-top: 1px solid #eee;
  color: inherit;
  cursor: pointer;
  font-size: 12px !important;
  font: inherit;
  margin: 2px 0 0;
  outline: none;
  padding: 10px;
  width: 100%;
}

.theseed-dark-mode .thetree-modal-content button {
  background-color: #383b40;
  border-top: 1px solid #111;
}

 .user-box {
   border-width: 5px 1px 1px;
   border-style: solid;
   border-image: initial;
   padding: 10px;
   margin-bottom: 10px;
 }

.admin-box {
  border-color: orange gray gray;
}

.admin-box:hover {
  border-color: red gray gray;
}

.banned-box {
  border-color: red gray gray;
}

.banned-box:hover {
  border-color: blue gray gray;
}
</style>