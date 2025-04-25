<template>
  <SeedForm flex box>
    <SelectMenu name="target">
      <option value="text">내용</option>
      <option value="author">실행자</option>
    </SelectMenu>
    <InputField class="search-input" name="query" placeholder="검색"/>
    <div class="button-block">
      <GeneralButton type="submit" theme="primary" class="search-button">검색</GeneralButton>
      <GeneralButton :whenClick="reset">초기화</GeneralButton>
    </div>
    <CheckBox
        v-if="data.permissions.dev"
        :checked="$route.query.showHidden === '1'"
        :whenChange="e => $router.push({ query: { showHidden: e.target.checked ? '1' : undefined } })">
      비공개 내역 보기
    </CheckBox>
  </SeedForm>
  <div class="top-page-block">
    <PrevNextBtn class="top-page" v-bind="pageProps"/>
  </div>

  <ul class="block-list">
    <li v-for="item in data.logs" class="block-row">
      <div class="block-item">
        <span class="icon" :class="iconClass(item.type)">
          <FontAwesomeIcon :icon="iconName(item.type)" />
        </span>
      </div>
      <div class="block-item block-content">
        <div>
          <template v-if="item.hideLog">(비공개) </template>
          <template v-if="item.type === BlockHistoryTypes.ACLGroupAdd">
            <AuthorSpan :account="item.createdUser"/>
            사용자가
            <template v-if="item.targetUser">
              <AuthorSpan :account="item.targetUser"/>
              사용자를
            </template>
            <template v-else>
              {{item.targetContent}}
              IP를
            </template>
            <template v-if="item.targetUser && item.targetUser.name !== item.targetUsername">
              (차단 당시 이름: {{item.targetUsername}})
            </template>
            <span class="bold">{{item.aclGroup?.name || item.aclGroupName || item.aclGroup}}</span>
            ACL 그룹에
            <span>
              <template v-if="item.duration">
                {{durationToExactString(item.duration)}} 동안
              </template>
              <template v-else>
                영구적으로
              </template>
            </span>
            등록함
            <span class="block-id">#{{item.aclGroupId}}</span>
          </template>
          <template v-else-if="item.type === BlockHistoryTypes.ACLGroupRemove">
            <AuthorSpan :account="item.createdUser"/>
            사용자가
            <template v-if="item.targetUser">
              <AuthorSpan :account="item.targetUser"/>
              사용자를
            </template>
            <template v-else>
              {{item.targetContent}}
              IP를
            </template>
            <template v-if="item.targetUser && item.targetUser.name !== item.targetUsername">
              (차단 당시 이름: {{item.targetUsername}})
            </template>
            <span class="bold">{{item.aclGroup?.name || item.aclGroupName || item.aclGroup}}</span>
            ACL 그룹에서 제거함
            <span class="block-id">#{{item.aclGroupId}}</span>
          </template>
          <template v-else-if="item.type === BlockHistoryTypes.Grant">
            <AuthorSpan :account="item.createdUser"/>
            사용자가
            <AuthorSpan :account="item.targetUser"/>
            사용자의 권한 설정
          </template>
          <template v-else-if="item.type === BlockHistoryTypes.BatchRevert">
            <AuthorSpan :account="item.createdUser"/>
            사용자가
            <AuthorSpan :account="item.targetUser"/>
            {{item.targetUser.type === 1 ? '사용자' : 'IP'}}의
            기여를 일괄 되돌림
          </template>
          <template v-else-if="item.type === BlockHistoryTypes.LoginHistory">
            <AuthorSpan :account="item.createdUser"/>
            사용자가
            <AuthorSpan :account="item.targetUser"/>
            사용자의 로그인 기록 조회
          </template>
        </div>
        <div class="block-text" v-if="item.type === BlockHistoryTypes.Grant">
          {{item.content}}
        </div>
        <div class="block-text">
          <LocalDate :date="item.createdAt"/>
          <span v-if="item.type !== BlockHistoryTypes.Grant && item.content">
            ({{item.content}})
          </span>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import SelectMenu from '@/components/selectMenu'
import InputField from '@/components/form/inputField'
import GeneralButton from '@/components/generalButton'
import PrevNextBtn from '@/components/prevNextBtn'
import CheckBox from '@/components/form/checkBox'
import AuthorSpan from '@/components/authorSpan'
import LocalDate from '@/components/localDate'

const BlockHistoryTypes = {
  ACLGroupAdd: 0,
  ACLGroupRemove: 1,
  Grant: 2,
  BatchRevert: 3,
  LoginHistory: 4
}

export default {
  mixins: [Common],
  components: {
    LocalDate,
    AuthorSpan,
    CheckBox,
    PrevNextBtn,
    GeneralButton,
    InputField,
    SeedForm,
    SelectMenu
  },
  data() {
    return {
      BlockHistoryTypes
    }
  },
  computed: {
    pageProps() {
      const prevItem = this.data.prevItem
      const nextItem = this.data.nextItem
      return {
        prev: prevItem ? { query: { until: prevItem.uuid } } : null,
        next: nextItem ? { query: { from: nextItem.uuid } } : null
      }
    }
  },
  methods: {
    reset() {
      this.$router.push('/BlockHistory')
    },
    iconClass(type) {
      return ({
        [BlockHistoryTypes.ACLGroupAdd]: 'aclgroup-add',
        [BlockHistoryTypes.ACLGroupRemove]: 'aclgroup-remove',
        [BlockHistoryTypes.Grant]: 'grant',
        [BlockHistoryTypes.BatchRevert]: 'batch-revert',
        [BlockHistoryTypes.LoginHistory]: 'login-history'
      })[type]
    },
    iconName(type) {
      return ({
        [BlockHistoryTypes.ACLGroupAdd]: 'user-plus',
        [BlockHistoryTypes.ACLGroupRemove]: 'user-minus',
        [BlockHistoryTypes.Grant]: 'user-check',
        [BlockHistoryTypes.BatchRevert]: 'clock-rotate-left',
        [BlockHistoryTypes.LoginHistory]: 'user'
      })[type]
    }
  }
}
</script>
<style scoped>
.block-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.block-row {
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  margin: 0 0 .6rem;
  padding: .6rem .75rem 0;
}

.theseed-dark-mode .block-row {
  border-color: #434343;
}

@media screen and (max-width: 727.98px) {
  .block-row {
    margin: 0 0 .75rem;
    padding: .75rem 0 0 .75rem;
  }
}

@media screen and (max-width: 371.98px) {
  .block-row {
    flex-direction: column;
    gap: .5rem;
  }
}

.block-row:last-child {
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
  padding-bottom: .6rem;
}

@media screen and (max-width: 727.98px) {
  .block-row:last-child {
    padding-bottom: .75rem;
  }
}

.theseed-dark-mode .block-row:last-child {
  border-color: #434343;
}

.block-item {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  row-gap: .25rem
}

.block-content {
  flex: 1;
}

.block-text {
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
  margin: 0;
}

.icon {
  display: flex;
  height: 1.25rem;
  width: 1.25rem;
}

.login-history {
  color: #8e4ec6;
}

.grant {
  color: #f76b15;
}

.aclgroup-remove {
  color: #8b8d98;
}

.aclgroup-add {
  color: #46a758;
}

.batch-revert {
  color: #2056b4;
}

.icon svg {
  fill: currentColor;
  height: initial;
}

.bold {
  font-weight: 700;
}

.block-id {
  color: #777;
}
</style>