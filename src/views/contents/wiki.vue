<template>
  <Alert v-if="data.rev" error>
    <b>[주의!]</b> 문서의 이전 버전(<LocalDate :date="data.date"/>에 수정)을 보고 있습니다. <NuxtLink :to="doc_action_link(data.document, 'w')">최신 버전으로 이동</NuxtLink>
  </Alert>
  <Alert v-if="$route.query.from" theme="primary">
    <NuxtLink rel="nofollow" :title="$route.query.from" :to="{ path: `/w/${$route.query.from}`, query: { noredirect: 1 } }" v-text="$route.query.from"/>에서 넘어옴
  </Alert>

  <Alert v-if="!categories.length && data.document.namespace !== '사용자'">
    이 문서는 분류가 되어 있지 않습니다. <NuxtLink :to="doc_action_link({
      namespace: '분류',
      title: '분류'
    }, 'w')">분류:분류</NuxtLink>에서 적절한 분류를 찾아 문서를 분류해주세요!
  </Alert>

  <div v-if="userbox.admin" class="user-box admin-box">
    이 사용자는 특수 권한을 가지고 있습니다.
  </div>
  <div v-if="userbox.blocked" class="user-box banned-box">
    이 사용자는 차단된 사용자입니다. (#{{userbox.blocked.id}})<br><br>

    이 사용자는 <LocalDate :date="userbox.blocked.createdAt"/>에
    <template v-if="userbox.blocked.expiresAt">
      <LocalDate :date="userbox.blocked.expiresAt"/> 까지
    </template>
    <template v-else>
      영구적으로
    </template>
    차단되었습니다.<br>
    차단 사유: {{userbox.blocked.note ?? '없음'}}
  </div>

  <WikiContent :content="content" :categories="categories"></WikiContent>

  <WikiCategoryDocs v-if="data.document.namespace === '분류'" :categories="categoriesData"/>
</template>
<script>
import WikiContent from '@/components/wiki/wikiContent';
import NuxtLink from '@/components/global/nuxtLink'
import Alert from '@/components/alert'
import LocalDate from '@/components/localDate'
import WikiCategoryDocs from '@/components/wiki/wikiCategoryDocs'

export default {
  components: {
    WikiCategoryDocs,
    LocalDate, Alert, NuxtLink,
    WikiContent
  },
  computed: {
    data() {
      return this.$store.state.page.data
    },
    content() {
      return this.$store.state.viewData.contentHtml
    },
    categories() {
      return this.$store.state.viewData.categories
    },
    categoriesData() {
      return this.$store.state.viewData.categoriesData
    },
    userbox() {
      return this.$store.state.viewData.userboxData ?? {}
    }
  },
}
</script>
<style scoped>
.user-box {
  border-width: 5px 1px 1px;
  border-style: solid;
  border-image: initial;
  padding: 10px;
  margin-bottom: 10px;
}

.admin-box {
  border-color: orange gray gray;
}

.admin-box:hover {
  border-color: red gray gray;
}

.banned-box {
  border-color: red gray gray;
}

.banned-box:hover {
  border-color: blue gray gray;
}
</style>