<template>
  <div v-for="(category, name) in categories" :id="'category-' + name">
    <h2 v-text="name === '분류' ? '하위 분류' : name"></h2>

    <PrevNextBtn flex v-if="category.prevItem || category.nextItem" v-bind="pageProps(name, category)"/>

    <div>
      <div>전체 {{category.count}}개 문서</div>
      <div :class="{ 'many-wrapper': Object.keys(category.categoriesPerChar).length >= 3 }">
        <div v-for="(documents, char) in category.categoriesPerChar">
          <h3 v-text="char"></h3>
          <ul>
            <li v-for="document in documents">
              <NuxtLink :to="doc_action_link(document.parsedName, 'w')" :title="doc_fulltitle(document.parsedName)" v-text="document.category.text || document.parsedName.title"/>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <PrevNextBtn flex v-if="category.prevItem || category.nextItem" v-bind="pageProps(name, category)"/>
  </div>
</template>
<script>
import Common from '@/mixins/common'
import NuxtLink from '@/components/global/nuxtLink'
import PrevNextBtn from '@/components/prevNextBtn'

export default {
  mixins: [Common],
  components: {
    NuxtLink,
    PrevNextBtn
  },
  props: {
    categories: JSON
  },
  methods: {
    pageProps(name, category) {
      return {
        prev: category.prevItem ? { query: { namespace: name, cuntil: category.prevItem } } : null,
        next: category.nextItem ? { query: { namespace: name, cfrom: category.nextItem } } : null
      }
    }
  }
}
</script>
<style scoped>
h2 {
  font-size: 1.8em;
}

h2, h3 {
  border-bottom: 1px solid #ccc;
  margin: 1.2em 0 .8em;
  padding-bottom: 5px;
}

.many-wrapper {
  column-count: 3;
}

.many-wrapper>div {
  page-break-inside: avoid;
}

.many-wrapper div:first-child h3 {
  margin-top: 0;
}
</style>