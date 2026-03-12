<template>
  <NamespaceSelector/>
  <p>{{$t('views.needed_pages.backlink_but_no_document')}}</p>
  <p>{{$t('views.needed_pages.updated_per_day')}}</p>
  <GeneralButton v-if="data.permissions.dev" theme="danger" :whenClick="update">{{$t('views.needed_pages.update')}}</GeneralButton>
  <PrevNextBtn flex :="pageProps"/>
  <ul>
    <li v-for="item in data.items">
      <NuxtLink :to="doc_action_link(item, 'w')">{{doc_fulltitle(item)}}</NuxtLink>
      &nbsp;<NuxtLink :to="doc_action_link(item, 'backlink')">[{{$t('views.needed_pages.backlink')}}]</NuxtLink>
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