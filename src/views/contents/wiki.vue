<template>
  <Alert v-if="data.rev" error>
    <b>[주의!]</b> 문서의 이전 버전(<LocalDate :date="data.date"/>에 수정)을 보고 있습니다. <NuxtLink :to="doc_action_link(data.document, 'w')">최신 버전으로 이동</NuxtLink>
  </Alert>
  <Alert v-if="$route.query.from" theme="primary">
    <NuxtLink rel="nofollow" :title="$route.query.from" :to="{ path: `/w/${$route.query.from}`, query: { noredirect: 1 } }">{{$route.query.from}}</NuxtLink>에서 넘어옴
  </Alert>

  <Alert v-if="!categories.length && data.document.namespace !== '사용자' && !data.isRedirect">
    이 문서는 분류가 되어 있지 않습니다. <NuxtLink :to="doc_action_link({
      namespace: '분류',
      title: '분류'
    }, 'w')">분류:분류</NuxtLink>에서 적절한 분류를 찾아 문서를 분류해주세요!
  </Alert>

  <WikiContent
      :content="content"
      :categories="categories"
      :userbox="userbox"
      :topHtml="data.topDocument"
      :bottomHtml="data.bottomDocument"
  />

  <WikiCategoryDocs v-if="data.document.namespace === '분류'" :categories="categoriesData"/>
</template>
<script>
import Common from '@/mixins/common'
import WikiContent from '@/components/wiki/wikiContent';
import NuxtLink from '@/components/global/nuxtLink'
import Alert from '@/components/alert'
import LocalDate from '@/components/localDate'
import WikiCategoryDocs from '@/components/wiki/wikiCategoryDocs'

export default {
  mixins: [Common],
  components: {
    WikiCategoryDocs,
    LocalDate,
    Alert,
    NuxtLink,
    WikiContent
  },
  mounted() {
    if(this.data.docScript) eval(this.data.docScript)
  },
  watch: {
    async 'data.docScript'(newValue) {
      if(newValue) {
        await this.$nextTick()
        eval(newValue)
      }
    }
  },
  computed: {
    content() {
      return this.data.contentHtml
    },
    categories() {
      return this.data.categories
    },
    categoriesData() {
      return this.data.categoriesData
    },
    userbox() {
      return this.data.userboxData ?? {}
    }
  },
}
</script>