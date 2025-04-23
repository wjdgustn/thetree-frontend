<template>
  <p>해당 문서를 찾을 수 없습니다.</p>
  <p>
    <NuxtLink :to="doc_action_link(viewData.document, 'edit')" rel="nofollow">[새 문서 만들기]</NuxtLink>
  </p>
  <template v-if="viewData.revs.length">
    <div style="margin-top: 40px; margin-bottom: 15px;"/>
    <h3>이 문서의 역사</h3>
    <ul>
      <li v-for="item in viewData.revs">
        <span>
          <LocalDate :date="item.createdAt"/>&nbsp;
        </span>
        <strong>r{{item.rev}}&nbsp;</strong>
        <i v-if="item.infoText" v-html="'(' + item.infoText + ')&nbsp;'"/>
        (<DiffCount :count="item.diffLength"/>)
        <AuthorSpan :account="item.user" :pos="`${doc_fulltitle(viewData.document)} r${item.rev}`"/>
        (<span class="log" v-text="item.log"/>)
      </li>
    </ul>
    <NuxtLink :to="doc_action_link(viewData.document, 'history')">[더보기]</NuxtLink>
  </template>
</template>
<script>
import Common from '@/mixins/common'
import LocalDate from '@/components/localDate'
import DiffCount from '@/components/diffCount'
import AuthorSpan from '@/components/authorSpan'
import NuxtLink from '@/components/global/nuxtLink'

export default {
  mixins: [Common],
  components: {
    NuxtLink,
    AuthorSpan,
    DiffCount,
    LocalDate

  }
}
</script>
<style scoped>
span.log {
  color: gray;
}
</style>