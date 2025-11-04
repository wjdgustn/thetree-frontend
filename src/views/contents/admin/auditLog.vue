<template>
  <SeedForm flex box class="search-form">
    <SelectMenu name="target" :value="$route.query.target || 'text'">
      <option value="text">내용</option>
      <option value="author">실행자</option>
    </SelectMenu>
    <SelectMenu name="type" :value="$route.query.type || 'all'">
      <option value="all">전체</option>
      <option v-for="i of Object.values(AuditLogTypes)" :value="i">{{typeName(i)}}</option>
    </SelectMenu>
    <InputField class="search-input" name="query" placeholder="검색" v-model="$route.query.query"/>
    <div class="button-block">
      <GeneralButton type="submit" theme="primary" class="search-button">검색</GeneralButton>
      <GeneralButton :whenClick="reset">초기화</GeneralButton>
    </div>
  </SeedForm>
  <div class="top-page-block">
    <PrevNextBtn flex class="top-page" v-bind="data.pageProps"/>
  </div>

  <ul class="list">
    <li v-for="item in data.items" class="row">
      <div class="item">
        <span class="icon" :class="iconClass(item.action)">
          <FontAwesomeIcon :icon="iconName(item.action)" />
        </span>
      </div>
      <div class="item content">
        <div>
          <AuthorSpan :account="item.user"/>
          사용자가
          <template v-if="item.action === AuditLogTypes.NamespaceACL">
            <b>{{item.target}}</b> 이름공간 ACL을 편집함
          </template>
          <template v-else-if="item.action === AuditLogTypes.DeleteThread">
            <b><NuxtLink :to="'/thread/' + item.thread.url">{{item.thread.topic}}</NuxtLink></b> 스레드를 삭제함
          </template>
          <template v-else-if="item.action === AuditLogTypes.DevSupport">
            엔진 개발자 권한을 사용함
          </template>
          <template v-else-if="item.action === AuditLogTypes.ACLGroupCreate">
            <b>{{item.target}}</b> ACL 그룹을 생성함
          </template>
          <template v-else-if="item.action === AuditLogTypes.ACLGroupDelete">
            <b>{{item.target}}</b> ACL 그룹을 삭제함
          </template>
          <template v-else-if="item.action === AuditLogTypes.ManageAccount">
            <AuthorSpan :account="item.targetUser"/> 계정을 관리함
          </template>
          <template v-else-if="item.action === AuditLogTypes.ModifyConfig">
            <b>{{item.target}}</b> 설정을 수정함
          </template>
          <template v-else-if="item.action === AuditLogTypes.ThreadACL">
            <b><NuxtLink :to="'/thread/' + item.thread.url">{{item.thread.topic}}</NuxtLink></b> 토론 ACL을 편집함
          </template>
        </div>
        <div v-if="item.content" class="text">
          {{item.content}}
        </div>
        <details v-if="item.hasDiff" @toggle="onDiffToggle(item)">
          <summary>비교</summary>
          <Diff v-if="item.diffHtml" :diffHtml="item.diffHtml"/>
          <span v-else>Loading...</span>
        </details>
        <div class="text">
          <LocalDate :date="item.createdAt"/>
        </div>
      </div>
    </li>
  </ul>

  <PrevNextBtn flex v-bind="data.pageProps"/>
</template>
<script>
import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import InputField from '@/components/form/inputField'
import CheckBox from '@/components/form/checkBox'
import SelectMenu from '@/components/selectMenu'
import GeneralButton from '@/components/generalButton'
import PrevNextBtn from '@/components/prevNextBtn'
import AuthorSpan from '@/components/authorSpan'
import LocalDate from '@/components/localDate'
import NuxtLink from '@/components/global/nuxtLink'
import Heading from '@/components/heading'
import Diff from '@/components/diff'

const AuditLogTypes = {
  NamespaceACL: 0,
  DeleteThread: 1,
  ACLGroupCreate: 3,
  ACLGroupDelete: 4,
  ManageAccount: 5,
  ModifyConfig: 6,
  ThreadACL: 7,
  DevSupport: 2
}

export default {
  mixins: [Common],
  components: {
    Diff,
    Heading,
    NuxtLink,
    LocalDate,
    AuthorSpan,
    PrevNextBtn,
    GeneralButton,
    SelectMenu,
    CheckBox,
    InputField,
    SeedForm
  },
  data() {
    return {
      AuditLogTypes
    }
  },
  methods: {
    reset() {
      this.$router.push('/admin/audit_log')
    },
    iconClass(type) {
      return ({
        [AuditLogTypes.NamespaceACL]: 'icon-nsacl',
        [AuditLogTypes.DeleteThread]: 'icon-delete-thread',
        [AuditLogTypes.DevSupport]: 'icon-dev-support',
        [AuditLogTypes.ACLGroupCreate]: 'icon-aclgroup-create',
        [AuditLogTypes.ACLGroupDelete]: 'icon-aclgroup-delete',
        [AuditLogTypes.ManageAccount]: 'icon-manage-account',
        [AuditLogTypes.ModifyConfig]: 'icon-modify-config',
        [AuditLogTypes.ThreadACL]: 'icon-thread-acl'
      })[type]
    },
    iconName(type) {
      return ({
        [AuditLogTypes.NamespaceACL]: 'lock',
        [AuditLogTypes.DeleteThread]: 'trash-can',
        [AuditLogTypes.DevSupport]: 'code',
        [AuditLogTypes.ACLGroupCreate]: 'user-plus',
        [AuditLogTypes.ACLGroupDelete]: 'user-minus',
        [AuditLogTypes.ManageAccount]: 'user-gear',
        [AuditLogTypes.ModifyConfig]: 'gear',
        [AuditLogTypes.ThreadACL]: 'comments'
      })[type]
    },
    typeName(type) {
      return ({
        [AuditLogTypes.NamespaceACL]: '이름공간ACL 편집',
        [AuditLogTypes.DeleteThread]: '스레드 삭제',
        [AuditLogTypes.DevSupport]: '개발자 지원',
        [AuditLogTypes.ACLGroupCreate]: 'ACL그룹 생성',
        [AuditLogTypes.ACLGroupDelete]: 'ACL그룹 삭제',
        [AuditLogTypes.ManageAccount]: '계정 관리',
        [AuditLogTypes.ModifyConfig]: '설정 수정',
        [AuditLogTypes.ThreadACL]: '토론 ACL 편집'
      })[type]
    },
    async onDiffToggle(item) {
      if(!item.hasDiff || item.diffHtml) return

      const { diffHtml } = await this.internalRequest(`/admin/audit_log/${item._id}/diff`, {
        noProgress: true
      })
      item.diffHtml = diffHtml
    }
  }
}
</script>
<style scoped>
@media screen and (max-width: 1023.98px) {
  .search-form {
    width: 100%;
  }
}

@media screen and (max-width: 727.98px) {
  .search-form {
    flex-direction: column;
  }

  .search-form>* {
    width: 100%;
  }
}

.list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  margin: 0 0 .6rem;
  padding: .6rem .75rem 0;
}

.theseed-dark-mode .row {
  border-color: #434343;
}

@media screen and (max-width: 727.98px) {
  .row {
    margin: 0 0 .75rem;
    padding: .75rem 0 0 .75rem;
  }
}

@media screen and (max-width: 371.98px) {
  .row {
    flex-direction: column;
    gap: .5rem;
  }
}

.row:last-child {
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
  padding-bottom: .6rem;
}

@media screen and (max-width: 727.98px) {
  .row:last-child {
    padding-bottom: .75rem;
  }
}

.theseed-dark-mode .row:last-child {
  border-color: #434343;
}

.item {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  row-gap: .25rem
}

.content {
  flex: 1;
}

.text {
  color: #777;
  font-size: .9rem;
}

.search-input {
  width: 20rem;
}

@media screen and (max-width: 727.98px) {
  .search-input {
    width: 100%;
  }
}

.button-block {
  display: flex;
  gap: .5rem;
}

@media screen and (max-width: 727.98px) {
  .search-button {
    flex: 1;
  }
}

.top-page-block {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 1rem 0;
}

@media screen and (max-width: 727.98px) {
  .top-page-block {
    align-items: normal;
    flex-direction: column;
  }
}

.top-page {
  flex: 1;
  margin: 0 !important;
}

.icon {
  display: flex;
  height: 1.25rem;
  width: 1.25rem;
}

.icon svg {
  fill: currentColor;
  height: initial;
}

.icon-nsacl {
  color: #f76b15;
}

.icon-delete-thread {
  color: #d64a58;
}

.icon-dev-support {
  color: #8e4ec6;
}

.icon-aclgroup-create {
  color: #46a758;
}

.icon-aclgroup-delete {
  color: #8b8d98;
}

.icon-manage-account, .icon-modify-config {
  color: darkslategrey;
}

.icon-thread-acl {
  color: #f76b15;
}

details summary {
  display: revert;
}
</style>