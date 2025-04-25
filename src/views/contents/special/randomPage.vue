<template>
  <NamespaceSelector/>
  <ul>
    <li v-for="item in data.docs">
      <NuxtLink :to="doc_action_link(item, 'w')" v-text="doc_fulltitle(item)"/>
    </li>
  </ul>
</template>
<script>
import Common from '@/mixins/common'
import NamespaceSelector from '@/components/namespaceSelector'
import NuxtLink from '@/components/global/nuxtLink'

export default {
  mixins: [Common],
  components: {
    NuxtLink,
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