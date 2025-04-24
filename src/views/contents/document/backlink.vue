<template>
  <BacklinkNamespaceSelector :namespaces="data.namespaceCounts"/>

  <PrevNextBtn flex v-bind="pageProps"/>

  <div v-if="Object.keys(data.backlinksPerChar).length" :class="{ 'many-wrapper': Object.keys(data.backlinksPerChar).length >= 3 }">
    <div v-for="(documents, char) in data.backlinksPerChar">
      <h3 v-text="char"/>
      <ul>
        <li v-for="doc in documents">
          <NuxtLink :to="doc_action_link(doc.parsedName, 'w')" v-text="doc_fulltitle(doc.parsedName)"/>
          ({{doc.flags.map(a => ({1: 'link', 2: 'file', 4: 'include', 8: 'redirect'})[a]).join(', ')}})
        </li>
      </ul>
    </div>
  </div>
  <div v-else>
    해당 문서의 역링크가 존재하지 않습니다.
  </div>

  <PrevNextBtn flex v-bind="pageProps"/>
</template>
<script>
import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import GeneralButton from '@/components/generalButton'
import PrevNextBtn from '@/components/prevNextBtn'
import SelectMenu from '@/components/selectMenu'
import BacklinkNamespaceSelector from '@/components/backlinkNamespaceSelector'
import NuxtLink from '@/components/global/nuxtLink'

export default {
  mixins: [Common],
  components: {
    SeedForm,
    GeneralButton,
    PrevNextBtn,
    SelectMenu,
    BacklinkNamespaceSelector,
    NuxtLink
  },
  computed: {
    pageProps() {
      const prevItem = this.data.prevItem
      const nextItem = this.data.nextItem
      return {
        prev: prevItem ? { query: { until: prevItem.title } } : null,
        next: nextItem ? { query: { from: nextItem.title } } : null
      }
    }
  }
}
</script>
<style scoped>
.many-wrapper {
  column-count: 3;
}

.many-wrapper>div {
  page-break-inside: avoid;
}

h3 {
  font-size: 1.75rem;
  font-weight: 700;
}

ul {
  margin: .4em 0 .4em 1.5em;
  padding-left: .5rem;
}

ul li {
  margin: .4em 0;
}
</style>