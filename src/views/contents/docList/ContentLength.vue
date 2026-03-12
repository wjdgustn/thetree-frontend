<template>
  <p>{{page.title}} ({{$t('views.content_length.document_without_redirect')}})</p>
  <PrevNextBtn flex :="data.pageProps"/>
  <ul>
    <li v-for="item in data.items">
      <NuxtLink :to="doc_action_link(item.document.parsedName, 'w')">{{doc_fulltitle(item.document.parsedName)}}</NuxtLink>
      ({{$t('views.content_length.char_count', { count: item.contentLength })}})
    </li>
  </ul>
  <PrevNextBtn flex :="data.pageProps"/>
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