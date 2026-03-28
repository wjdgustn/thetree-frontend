<template>
  <Alert v-if="data.rev" error>
    <b>[{{$t('views.wiki.warn')}}]</b> <i18next :translation="$t('views.wiki.old_revision')">
      <template #date>
        <LocalDate :date="data.date"/>
      </template>
    </i18next> <NuxtLink :to="doc_action_link(data.document, 'w')">{{$t('views.wiki.go_to_latest')}}</NuxtLink>
  </Alert>
  <Alert v-if="$route.query.from" theme="primary">
    <NuxtLink rel="nofollow" :title="$route.query.from" :to="{ path: `/w/${$route.query.from}`, query: { noredirect: 1 } }">{{$route.query.from}}</NuxtLink>에서 넘어옴
  </Alert>

  <Alert v-if="!categories.length && data.document.namespace !== '사용자' && !data.isRedirect">
    <i18next :translation="$t('views.wiki.no_category')">
      <template #link>
        <NuxtLink :to="doc_action_link({
      namespace: $t('namespaces.분류', { lng: config.lang || 'ko' }),
      title: $t('namespaces.분류', { lng: config.lang || 'ko' })
    }, 'w')">{{$t('namespaces.분류', { lng: config.lang || 'ko' })}}:{{$t('namespaces.분류', { lng: config.lang || 'ko' })}}</NuxtLink>
      </template>
    </i18next>
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
    if(this.data.docScript) this.$nextTick(() => (0, eval)(this.data.docScript))
  },
  watch: {
    async 'data.docScript'(newValue) {
      if(newValue) {
        await this.$nextTick()
        (0, eval)(newValue)
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