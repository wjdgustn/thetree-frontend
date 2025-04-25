<template>
  <NamespaceSelector/>
  <p>역 링크는 존재하나 아직 작성이 되지 않은 문서 목록입니다.</p>
  <p>이 페이지는 하루에 한번 업데이트 됩니다.</p>
  <GeneralButton v-if="data.permissions.dev" theme="danger" :whenClick="update">업데이트</GeneralButton>
  <PrevNextBtn flex :="pageProps"/>
  <ul>
    <li v-for="item in data.items">
      <NuxtLink :to="doc_action_link(item, 'w')" v-text="doc_fulltitle(item)"/>
      &nbsp;<NuxtLink :to="doc_action_link(item, 'backlink')">[역링크]</NuxtLink>
    </li>
  </ul>
  <PrevNextBtn flex :="pageProps"/>
</template>
<script>
import Common from '@/mixins/common'
import NamespaceSelector from '@/components/namespaceSelector'
import GeneralButton from '@/components/generalButton'
import PrevNextBtn from '@/components/prevNextBtn'
import NuxtLink from '@/components/global/nuxtLink'

export default {
  mixins: [Common],
  components: {
    NuxtLink,
    PrevNextBtn,
    GeneralButton,
    NamespaceSelector
  },
  computed: {
    pageProps() {
      const prevItem = this.data.prevItem
      const nextItem = this.data.nextItem
      return {
        prev: prevItem >= 0 ? { query: { until: prevItem } } : null,
        next: nextItem < this.data.total ? { query: { from: nextItem } } : null
      }
    }
  },
  methods: {
    async update() {
      await this.internalRequestAndProcess('/NeededPages/update')
    }
  }
}
</script>
<style scoped>
ul {
  margin: .4em 0 .4em 1.5em;
  padding-left: .5rem;
}

ul>li {
  font-size: .9rem;
  list-style: inherit !important;
  margin: .4em 0;
}
</style>