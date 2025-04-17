<template>
  <div ref="el" class="category" :class="{ 'category-folded': isFold }">
    <span>분류</span>
    <ul>
      <template v-for="c in categories">
        <li>
          <NuxtLink :class="{ 'not-exist': c.notExist }" :to="doc_action_link(c.document, 'w')" v-text="c.document.title"></NuxtLink>
        </li>
      </template>
    </ul>
    <div v-if="showCurtain" class="curtain">
      <GeneralButton class="curtain-button" :whenClick="onClickUnfoldButton">더 보기</GeneralButton>
    </div>
  </div>
</template>
<script>
import NuxtLink from '@/components/global/nuxtLink'
import GeneralButton from '@/components/generalButton'

import Common from '@/mixins/common'

export default {
  mixins: [Common],
  components: {
    NuxtLink,
    GeneralButton
  },
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      isFold: true,
      showCurtain: false
    }
  },
  methods: {
    onClickUnfoldButton() {
      this.isFold = false
      this.showCurtain = false
    },
    async recalculate() {
      this.isFold = true
      this.showCurtain = false
      await this.$nextTick()
      const el = this.$refs.el
      if(!el) return

      this.showCurtain = el.scrollHeight > el.clientHeight
    }
  },
  mounted() {
    this.recalculate()
  },
  watch: {
    categories() {
      this.recalculate()
    }
  }
}
</script>
<style scoped>
.category {
  background-color: var(--light-article-background-color, var(--article-background-color, #fff));
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: .9rem;
  margin: 0 0 1em;
  padding: .2rem .5rem;
  position: relative;
}

.theseed-dark-mode .category {
  background-color: var(--dark-article-background-color, var(--article-background-color, #1c1d1f));
  border-color: #555;
}

.category-folded {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

span {
  margin: 0 .1rem 0 0;
}

span:after {
  content: ":";
}

ul {
  margin: 0;
  padding: 0;
}

ul, li {
  display: inline;
}

li:after {
  border-left: 1px solid #888;
  content: "";
  display: inline-block;
  height: .8rem;
  margin: 0 .4rem -.1rem;
}

.not-exist {
  color: red !important;
}

li:last-child:after {
  display: none;
}

.curtain {
  background: linear-gradient(90deg, transparent, var(--light-article-background-color, var(--article-background-color, #fff)), var(--light-article-background-color, var(--article-background-color, #fff)));
  height: 100%;
  padding: 0 0 0 5rem;
  position: absolute;
  right: 0;
  top: 0;
}

.theseed-dark-mode .curtain {
  background: linear-gradient(90deg,transparent,var(--dark-article-background-color, var(--article-background-color, #1c1d1f)), var(--dark-article-background-color, var(--article-background-color, #1c1d1f)));
}

.curtain-button {
  display: inline-block;
  font-size: .7rem;
  margin: .25rem .5rem 0 0;
  padding: .05rem .25rem;
}
</style>