<template>
  <ContributionTab/>
  <HistoryTypeTab/>
  <div>전체 {{data.total}}회</div>
  <div style="margin-bottom:1rem">
    <PrevNextBtn flex v-bind="pageProps"/>
  </div>
  <div class="list-table">
    <div class="table-row table-heading">
      <div class="table-item">문서</div>
      <div class="table-item">기능</div>
      <div class="table-item">수정 시간</div>
    </div>
    <template v-if="data.revs.length" v-for="item in data.revs">
      <div class="table-row" :class="{ troll: item.troll }">
        <div class="table-item">
          <NuxtLink :to="doc_action_link(item.document.parsedName, 'w')">{{doc_fulltitle(item.document.parsedName)}}</NuxtLink>
          <span class="history-rev">(<NuxtLink class="history-rev-link" :to="doc_action_link(item.document.parsedName, 'w', { uuid: item.uuid })">r{{item.rev}}</NuxtLink>)</span>
          <DiffCount class="history-diff-count" :count="item.diffLength"/>
        </div>
        <div class="table-item table-buttons">
          <div class="table-buttons-wrap">
            <GeneralButton size="small" :to="doc_action_link(item.document.parsedName, 'history')">역사</GeneralButton>
            <GeneralButton size="small" :disabled="item.rev === 1" :to="doc_action_link(item.document.parsedName, 'diff', { uuid: item.uuid })">비교</GeneralButton>
            <GeneralButton size="small" :to="doc_action_link(item.document.parsedName, 'discuss')">토론</GeneralButton>
          </div>
        </div>
        <div class="table-item">
          <LocalDate :date="item.createdAt" relative/>
        </div>
        <div v-if="item.infoText || item.log" class="table-item history-log">
          <span v-if="item.log">{{item.log}}</span>
          <i v-if="item.infoText" v-html="' (' + item.infoText + ')'"/>
        </div>
      </div>
    </template>
    <div v-else class="table-row">
      <div class="table-item no-item">
        (기여 내역이 없습니다.)
      </div>
    </div>
  </div>
  <div style="margin-top:1rem">
    <PrevNextBtn flex v-bind="pageProps"/>
  </div>
</template>
<script>
import Common from '@/mixins/common'
import ContributionTab from '@/components/contributionTab'
import HistoryTypeTab from '@/components/historyTypeTab'
import PrevNextBtn from '@/components/prevNextBtn'
import NuxtLink from '@/components/global/nuxtLink'
import DiffCount from '@/components/diffCount'
import GeneralButton from '@/components/generalButton'
import LocalDate from '@/components/localDate'

export default {
  mixins: [Common],
  components: {
    LocalDate,
    GeneralButton,
    DiffCount,
    NuxtLink,
    PrevNextBtn,
    HistoryTypeTab,
    ContributionTab
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

.history-rev {
  font-size: .85rem;
  margin: 0 0 0 .35rem;
}

.table-row {
  grid-template-columns: 1fr 10rem 13rem;
}

@media screen and (max-width: 1399.98px) {
  .table-row {
    grid-template-columns: 1fr 10rem 12rem;
  }
}

@media screen and (max-width: 1023.98px) {
  .table-row {
    gap: .1rem;
    grid-template-columns: 1fr;
    padding: .5rem;
  }
}

.troll {
  text-decoration: line-through;
}

.history-rev-link {
  color: inherit;
}

@media screen and (max-width: 1023.98px) {
  .table-item {
    margin:0 !important;
    padding: 0 !important;
  }

  .table-item:first-child {
    font-size: 1.05rem;
    margin-bottom: .15rem !important;
  }

  .table-item:nth-child(3) {
    color: #888;
    font-size: .85rem;
    order: -1;
  }

  .table-item:nth-child(4) {
    grid-column: auto !important;
    margin-top: .15rem !important;
  }
}

.history-log {
  grid-column: 1/4;
}

.no-item {
  color: #888;
  grid-column: 1/4;
  text-align: center;
}
</style>