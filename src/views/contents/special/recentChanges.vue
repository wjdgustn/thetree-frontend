<template>
  <HistoryTypeTab/>
  <template v-if="session.quick_block">
    <CheckBox
        :checked="$route.query.userDoc === '1'"
        :whenChange="e => $router.push({ query: { userDoc: e.target.checked ? '1' : undefined } })"
        style="float:right">
      사용자 문서 보기
    </CheckBox>
    <div style="clear:both"/>
  </template>
  <div class="list-table">
    <div class="table-row table-heading">
      <div class="table-item">문서</div>
      <div class="table-item">기능</div>
      <div class="table-item">수정자</div>
      <div class="table-item">수정 시간</div>
    </div>
    <div v-for="rev in data.revs" :key="rev.uuid" class="table-row">
      <div class="table-item">
        <NuxtLink :to="doc_action_link(rev.document.parsedName, 'w')">{{doc_fulltitle(rev.document.parsedName)}}</NuxtLink>
        <DiffCount :count="rev.diffLength" class="history-diff-count"/>
      </div>
      <div class="table-item table-buttons">
        <div class="table-buttons-wrap">
          <GeneralButton size="small" :href="doc_action_link(rev.document.parsedName, 'history')">역사</GeneralButton>
          <GeneralButton size="small" :disabled="rev.rev === 1" :href="doc_action_link(rev.document.parsedName, 'diff', { uuid: rev.uuid })">비교</GeneralButton>
          <GeneralButton size="small" :href="doc_action_link(rev.document.parsedName, 'discuss')">토론</GeneralButton>
        </div>
      </div>
      <div class="table-item">
        <span>
          <AuthorSpan :account="rev.user"/>
          <template v-if="rev.api">(API)</template>
        </span>
      </div>
      <div class="table-item">
        <LocalDate :date="rev.createdAt" relative/>
      </div>
      <div v-if="rev.infoText || rev.log" class="table-item history-log">
        <span v-if="rev.log">{{rev.log}}</span>
        <i v-if="rev.infoText" v-html="' (' + rev.infoText + ')'"/>
      </div>
    </div>
  </div>
</template>
<script>
import Common from '@/mixins/common'
import LinkTab from '@/components/linkTab'
import NuxtLink from '@/components/global/nuxtLink'
import DiffCount from '@/components/diffCount'
import GeneralButton from '@/components/generalButton'
import AuthorSpan from '@/components/authorSpan'
import LocalDate from '@/components/localDate'
import HistoryTypeTab from '@/components/historyTypeTab'
import CheckBox from '@/components/form/checkBox'

export default {
  mixins: [Common],
  components: {
    CheckBox,
    HistoryTypeTab,
    LinkTab,
    NuxtLink,
    DiffCount,
    GeneralButton,
    AuthorSpan,
    LocalDate
  }
}
</script>
<style scoped>
@media screen and (max-width: 1023.98px) {
  .table-heading+.table-row {
    border-top:1px solid #e0e0e0;
  }

  .theseed-dark-mode .table-heading+.table-row {
    border-top-color: #575757;
  }
}

.link-tab {
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.list-table {
  display: flex;
  flex-direction: column;
}

.table-row {
  border-bottom: 1px solid #e0e0e0;
  display: grid;
}

.theseed-dark-mode .table-row {
  border-bottom-color: #575757;
}

.table-row:not(.table-heading):hover {
  background-color: #fbfbfb;
}

.theseed-dark-mode .table-row:not(.table-heading):hover {
  background-color: #2a2a2a;
}

.table-heading {
  border-bottom-width: 2px;
  font-weight: 600;
}

@media screen and (max-width: 1023.98px) {
  .table-heading {
    display: none;
  }

  .table-heading+.table-row {
    border-top: 1px solid #e0e0e0;
  }
}

.table-item {
  padding: .5rem .75rem;
}

.table-buttons {
  align-items: center;
  display: flex;
  padding-bottom: 0;
  padding-top: 0;
}

@media screen and (max-width: 1023.98px) {
  .table-buttons {
    align-items: flex-start;
  }
}

.history-log {
  grid-column: 1/5;
}

.table-item+.history-log {
  color: #777;
  font-size: .9rem;
  margin: -.25rem 0 0;
  padding: 0 .75rem .5rem 1.5rem;
}

.theseed-dark-mode .table-item+.history-log {
  color: #bbb;
}

.table-buttons-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: .4rem;
  height: 100%;
  padding: .4rem 0 0;
}

.history-diff-count {
  font-size: .8rem;
  margin: 0 0 0 .35rem;
  vertical-align: bottom;
}

.table-row {
  grid-template-columns: 1fr 10rem 11rem 13rem;
}

@media screen and (max-width: 1399.98px) {
  .table-row {
    grid-template-columns: 1fr 10rem 9rem 12rem;
  }
}

@media screen and (max-width: 1023.98px) {
  .table-row {
    gap: .1rem;
    grid-template-columns: 1fr 1fr;
    padding: .5rem;
  }
}

@media screen and (max-width: 371.98px) {
  .table-row {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 1023.98px) {
  .table-item {
    margin:0 !important;
    padding: 0 !important;
  }

  .table-item:first-child,.table-item:nth-child(4),.table-item:nth-child(5) {
    grid-column: 1/3;
  }
}

@media screen and (max-width: 371.98px) {
  .table-item:first-child,.table-item:nth-child(4),.table-item:nth-child(5) {
    grid-column:1;
  }
}

@media screen and (max-width: 1023.98px) {
  .table-item:first-child {
    font-size:1.05rem;
    margin-bottom: .15rem !important;
  }
}

@media screen and (max-width: 371.98px) {
  .table-item:first-child {
    margin-bottom:0 !important;
  }
}

@media screen and (max-width: 1023.98px) {
  .table-item:nth-child(3) {
    align-items: center;
    display: flex;
    text-align: right;
  }

  .table-item:nth-child(3)>* {
    flex: 1;
  }
}

@media screen and (max-width: 371.98px) {
  .table-item:nth-child(3) {
    text-align: initial;
  }
}

@media screen and (max-width: 1023.98px) {
  .table-item:nth-child(4) {
    color: #888;
    font-size: .85rem;
    order: -1;
  }
}
</style>