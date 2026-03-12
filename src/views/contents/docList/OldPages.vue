<template>
  <p>{{$t('views.old_pages.description')}}</p>
  <PrevNextBtn flex :="data.pageProps"/>
  <ul>
    <li v-for="item in data.items">
      <NuxtLink :to="doc_action_link(item.document.parsedName, 'w')">
        {{doc_fulltitle(item.document.parsedName)}}
      </NuxtLink>
      (<i18next :translation="$t('views.old_pages.edit_date')">
        <template #date>
          <LocalDate :date="item.createdAt"/>
        </template>
      </i18next>)
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