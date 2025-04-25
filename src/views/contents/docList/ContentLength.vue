<template>
  <p>{{page.title}} (문서 이름공간, 리다이렉트 제외)</p>
  <PrevNextBtn flex :="data.pageProps"/>
  <ul>
    <li v-for="item in data.items">
      <NuxtLink :to="doc_action_link(item.document.parsedName, 'w')" v-text="doc_fulltitle(item.document.parsedName)"/>
      ({{item.contentLength}}글자)
    </li>
  </ul>
  <PrevNextBtn flex :="data.pageProps"/>
  <pre>{{data}}</pre>
</template>
<script>
import Common from '@/mixins/common'
import PrevNextBtn from '@/components/prevNextBtn'
import NuxtLink from '@/components/global/nuxtLink'

export default {
  mixins: [Common],
  components: {
    NuxtLink,
    PrevNextBtn
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