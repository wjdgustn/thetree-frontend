<template>
  <div v-for="(category, name) in categories" :id="'category-' + name">
    <h2 v-text="name"></h2>
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
  </div>
</template>
<script>
import Common from '@/mixins/common'
import NuxtLink from '@/components/global/nuxtLink'

export default {
  mixins: [Common],
  components: {
    NuxtLink
  },
  props: {
    categories: JSON
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