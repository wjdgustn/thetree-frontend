<template>
  <p>편집된 지 오래된 문서의 목록입니다. (리다이렉트 제외)</p>
  <PrevNextBtn flex :="data.pageProps"/>
  <ul>
    <li v-for="item in data.items">
      <NuxtLink :to="doc_action_link(item.document.parsedName, 'w')">
        {{doc_fulltitle(item.document.parsedName)}}
      </NuxtLink>
      (수정 시각: <LocalDate :date="item.createdAt"/>)
    </li>
  </ul>
  <PrevNextBtn flex :="data.pageProps"/>
</template>
<script>
import Common from '@/mixins/common'
import PrevNextBtn from '@/components/prevNextBtn'
import NuxtLink from '@/components/global/nuxtLink'
import LocalDate from '@/components/localDate'

export default {
  mixins: [Common],
  components: {
    LocalDate,
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