<template>
  <NamespaceSelector/>
  <PrevNextBtn flex :="data.pageProps"/>
  <ul>
    <li v-for="item in data.items">
      <NuxtLink :to="doc_action_link(item.parsedName, 'w')">{{doc_fulltitle(item.parsedName)}}</NuxtLink>
    </li>
  </ul>
  <PrevNextBtn flex :="data.pageProps"/>
</template>
<script>
import Common from '@/mixins/common'
import NamespaceSelector from '@/components/namespaceSelector'
import PrevNextBtn from '@/components/prevNextBtn'
import NuxtLink from '@/components/global/nuxtLink'

export default {
  mixins: [Common],
  components: {
    NuxtLink,
    PrevNextBtn,
    NamespaceSelector
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