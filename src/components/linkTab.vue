<template>
  <div class="link-tab">
    <div
        ref="navigation"
        class="tab-content"
        :class="{ 'tab-line': tab }"
        v-drag-to-scroll="{ controller: eventAbortController }"
        @scroll="onNavigationScroll"
    >
      <div class="list-wrapper" :class="{ 'tab-wrapper': tab }">
        <ul class="list" :class="{ 'list-tab': tab }">
          <LinkTabItem ref="items" v-for="item in items" :href="item.href" :active="item.active">{{item.title}}</LinkTabItem>
        </ul>
      </div>
    </div>
    <div
        ref="scrollGlowLeft"
        v-show="showScrollGlowLeft"
        class="tab-glow tab-glow-left"
        :style="{ opacity: scrollGlowOpacityLeft }"
    />
    <div
        ref="scrollGlowRight"
        v-show="showScrollGlowRight"
        class="tab-glow"
        :style="{ opacity: scrollGlowOpacityRight }"
    />
  </div>
</template>
<script>
import LinkTabItem from '@/components/linkTabItem'

export default {
  components: {
    LinkTabItem
  },
  props: {
    items: {
      type: Array,
      required: true
    },
    tab: Boolean
  },
  data() {
    return {
      eventAbortController: undefined,
      showScrollGlowLeft: false,
      showScrollGlowRight: false,
      scrollGlowOpacityLeft: 1,
      scrollGlowOpacityRight: 1,
      scrollGlowWidth: 0,
      navigationPaddingLeft: 0,
      navigationPaddingRight: 0
    }
  },
  directives: {
    dragToScroll(el, binding) {
      let startX, startY, scrollLeft, scrollTop
      let isDragging = false
      const controller = binding.value?.controller
      const signal = controller?.signal

      const clearDrag = () => {
        if(!isDragging) return
        isDragging = false
        Array.from(el.querySelectorAll('a')).forEach(a => {
          a.removeAttribute('draggable')
          a.style.removeProperty('user-select')
          a.style.removeProperty('pointer-events')
        })
      }

      el.addEventListener('mousedown', e => {
        scrollLeft = el.scrollLeft
        scrollTop = el.scrollTop
        startX = e.pageX - el.offsetLeft
        startY = e.pageY - el.offsetTop
        isDragging = true
      }, { signal })

      el.addEventListener('mousemove', e => {
        if (!isDragging) return
        const dx = e.pageX - el.offsetLeft - startX
        const dy = e.pageY - el.offsetTop  - startY
        if(dx !== 0 || dy !== 0) {
          Array.from(el.querySelectorAll('a')).forEach(a => {
            a.setAttribute('draggable', 'false')
            a.style.userSelect   = 'none'
            a.style.pointerEvents = 'none'
          })
        }
        el.scrollLeft = scrollLeft - dx
      }, { signal })

      el.addEventListener('mouseup', clearDrag, { signal })
      el.addEventListener('mouseleave', clearDrag, { signal })
    }
  },
  methods: {
    navigationHorizontalScrollCheck(initial) {
      const nav = this.$refs.navigation
      if(!nav) return

      if (nav.firstChild) {
        const style = getComputedStyle(nav.firstChild)
        const mr = parseFloat(style.marginRight) || 0
        const ml = parseFloat(style.marginLeft) || 0
        if(mr > 0) this.navigationPaddingRight = mr
        if(ml > 0) this.navigationPaddingLeft = ml
      }

      const glowEl = this.$refs.scrollGlowLeft
      this.scrollGlowWidth = parseFloat(getComputedStyle(glowEl).width) || 0

      if (initial && Array.isArray(this.$refs.items)) {
        const activeItem = this.$refs.items.find(c => c.$props.active)
        const itemEl = activeItem?.$refs.item
        if(itemEl) {
          const rect = itemEl.getBoundingClientRect()
          const center = rect.left + nav.scrollLeft + rect.width / 2
          const half = nav.offsetWidth / 2
          nav.scrollLeft = center > half ? center - half : 0
        }
      }

      this.showScrollGlowLeft = nav.scrollLeft >= this.scrollGlowWidth
      this.showScrollGlowRight = nav.offsetWidth + nav.scrollLeft < nav.scrollWidth
    },
    navigationHorizontalScrollProcess() {
      const nav = this.$refs.navigation
      if (!nav) return

      if (nav.scrollLeft < this.navigationPaddingLeft) {
        this.scrollGlowOpacityLeft = 1
      } else {
        this.scrollGlowOpacityLeft =
            (nav.scrollLeft - this.navigationPaddingLeft) / this.scrollGlowWidth
      }
      this.showScrollGlowLeft = nav.scrollLeft > this.navigationPaddingLeft

      const maxScroll = nav.scrollWidth - this.navigationPaddingRight
      const distanceRight = maxScroll - nav.offsetWidth - nav.scrollLeft
      if (distanceRight > this.scrollGlowWidth) {
        this.scrollGlowOpacityRight = 1
      } else {
        this.scrollGlowOpacityRight = distanceRight / this.scrollGlowWidth
      }
      this.showScrollGlowRight = nav.offsetWidth + nav.scrollLeft < maxScroll
    },
    onResizeWindow() {
      this.navigationHorizontalScrollCheck(false)
      this.navigationHorizontalScrollProcess()
    },
    onNavigationScroll() {
      this.navigationHorizontalScrollProcess()
    }
  },
  watch: {
    async $route() {
      await this.$nextTick()
      this.navigationHorizontalScrollCheck(true)
      this.navigationHorizontalScrollProcess()
    }
  },
  mounted() {
    this.eventAbortController = new AbortController()
    this.navigationHorizontalScrollCheck(true)
    this.navigationHorizontalScrollProcess()
    window.addEventListener('resize', this.onResizeWindow, {
      signal: this.eventAbortController.signal
    })
  }
}
</script>
<style scoped>
.link-tab {
  margin-left: calc(var(--article-padding-x, 0) * -1);
  margin-right: calc(var(--article-padding-x, 0) * -1);
  position: relative;
}

.tab-content {
  overflow-x: auto;
}

.tab-line {
  border-bottom: 1px solid #e0e0e0;
}

.list-wrapper {
  display: inline-block;
  margin: 0 var(--article-padding-x, 0);
}

.tab-wrapper {
  margin: 0 calc(var(--article-padding-x, 0) / 2);
}

.list {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
}

@media print {
  .list {
    flex-wrap: wrap;
    justify-content: space-between;
  }

  .list>* {
    border: 0 !important;
    border-radius: 0 !important;
    flex: 1;
    padding: 0 !important;
  }
}

.list:not(.list-tab)>* {
  border-bottom: 1px solid #e0e0e0;
  border-top: 1px solid #e0e0e0;
}

.theseed-dark-mode .list:not(.list-tab)>* {
  border-bottom-color: #575757;
  border-top-color: #575757;
}

.list:not(.list-tab)>:first-of-type {
  border-bottom-left-radius: 8px;
  border-left: 1px solid #e0e0e0;
  border-top-left-radius: 8px;
  padding: 0 0 0 .5rem;
}

.theseed-dark-mode .list:not(.list-tab)>:first-of-type {
  border-left-color: #575757;
}

.list:not(.list-tab)>:last-of-type {
  border-bottom-right-radius: 8px;
  border-right: 1px solid #e0e0e0;
  border-top-right-radius: 8px;
  padding: 0 .5rem 0 0;
}

.theseed-dark-mode .list:not(.list-tab)>:last-of-type {
  border-right-color: #575757;
}

.tab-glow {
  background: linear-gradient(90deg, transparent, var(--light-article-background-color, var(--article-background-color, #fff)));
  bottom: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
  width: 8rem;
}

@media print {
  .tab-glow {
    display: none;
  }
}

.tab-glow-left {
  background: linear-gradient(90deg, var(--light-article-background-color, var(--article-background-color, #fff)), transparent);
  left: 0;
  right: auto;
}

.theseed-dark-mode .tab-glow {
  background: linear-gradient(90deg, transparent, var(--dark-article-background-color, var(--article-background-color, #1c1d1f)));
}

.theseed-dark-mode .tab-glow-left {
  background: linear-gradient(90deg, var(--dark-article-background-color, var(--article-background-color, #1c1d1f)), transparent);
}
</style>