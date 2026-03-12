<template>
  <NamespaceSelector/>
  <p>
    <i18next :translation="$t('views.orphaned_pages.description')">
      <template #link>
        <NuxtLink :to="doc_action_link(frontPage, 'w')">{{frontPage}}</NuxtLink>
      </template>
    </i18next>
  </p>
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
    frontPage() {
      return this.$store.state.config['wiki.front_page']
    },
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
      await this.internalRequestAndProcess('/OrphanedPages/update')
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