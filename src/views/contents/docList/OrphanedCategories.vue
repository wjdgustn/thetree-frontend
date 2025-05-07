<template>
  <p>
    다음은 [[<NuxtLink :to="doc_action_link('분류:분류', 'w')">분류:분류</NuxtLink>]]에서
    분류로 도달할 수 없는 분류로,
    역링크가 없거나 자기네들끼리만 분류 되어 있는 경우입니다.
  </p>
  <p>이 페이지는 하루에 한번 업데이트 됩니다.</p>
  <GeneralButton v-if="data.permissions.dev" theme="danger" :whenClick="update">업데이트</GeneralButton>
  <PrevNextBtn flex :="pageProps"/>
  <ul>
    <li v-for="item in data.items">
      <NuxtLink :to="doc_action_link(item, 'w')">{{doc_fulltitle(item)}}</NuxtLink>
      &nbsp;<NuxtLink :to="doc_action_link(item, 'backlink')">[역링크]</NuxtLink>
    </li>
  </ul>
  <PrevNextBtn flex :="pageProps"/>
</template>
<script>
import Common from '@/mixins/common'
import NuxtLink from '@/components/global/nuxtLink'
import PrevNextBtn from '@/components/prevNextBtn'
import GeneralButton from '@/components/generalButton'
import NamespaceSelector from '@/components/namespaceSelector'

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
      await this.internalRequestAndProcess('/OrphanedCategories/update')
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