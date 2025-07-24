<template>
  <ContributionTab/>
  <div>전체 {{data.total}}회</div>
  <div style="margin-bottom:1rem">
    <PrevNextBtn flex v-bind="data.pageProps"/>
  </div>
  <div class="list-table">
    <div class="table-row table-heading">
      <div class="table-item">제목</div>
      <div class="table-item">시간</div>
    </div>
    <div v-if="data.items.length" v-for="item in data.items" class="table-row">
      <div class="table-item">
        <NuxtLink :to="`/thread/${item.thread.url}#${item.id}`">#{{item.id}} {{item.thread.topic}}</NuxtLink>
        <span class="document-group">
          <span class="document-icon">
            <FontAwesomeIcon icon="fa-regular fa-file-lines" />
          </span>
          <NuxtLink :to="doc_action_link(item.thread.document.parsedName, 'discuss')" class="document-link">{{doc_fulltitle(item.thread.document.parsedName)}}</NuxtLink>
        </span>
      </div>
      <div class="table-item">
        <LocalDate :date="item.createdAt" relative/>
      </div>
    </div>
    <div v-else class="table-row">
      <div class="table-item no-item">
        (기여 내역이 없습니다.)
      </div>
    </div>
  </div>
  <div style="margin-top:1rem">
    <PrevNextBtn flex v-bind="data.pageProps"/>
  </div>
</template>
<script>
import Common from '@/mixins/common'
import ContributionTab from '@/components/contributionTab'
import PrevNextBtn from '@/components/prevNextBtn'
import NuxtLink from '@/components/global/nuxtLink'
import LocalDate from '@/components/localDate'

export default {
  mixins: [Common],
  components: {
    LocalDate,
    NuxtLink,
    PrevNextBtn,
    ContributionTab
  }
}
</script>
<style scoped>
@media screen and (max-width: 1023.98px) {
  .table-heading+.table-row {
    border-top: 1px solid #e0e0e0;
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

.document-icon {
  color: #aaa;
  display: inline-block;
  margin: 0 .3rem 0 .15rem;
  width: .65rem;
}

.document-icon svg {
  height: 100%;
  margin: 0 0 -.1em;
  width: 100%;
  fill: currentColor;
}

.document-group {
  font-size: .85rem;
  margin: 0 0 0 .35rem;
}

.document-link {
  color: var(--light-text-color, var(--text-color, #212529));
}

.theseed-dark-mode .document-link {
  color: var(--dark-text-color, var(--text-color, #e0e0e0));
}

.table-row {
  grid-template-columns: 1fr 13rem;
}

@media screen and (max-width: 1023.98px) {
  .table-row {
    gap: .1rem;
    grid-template-columns: none;
    padding: .5rem;
  }

  .table-item {
    margin: 0 !important;
    padding: 0 !important;
  }

  .table-item:first-child {
    font-size: 1.05rem;
  }

  .table-item:nth-child(2) {
    color: #888;
    font-size: .85rem;
    order: -1;
  }
}

.no-item {
  color: #888;
  grid-column: 1/4;
  text-align: center;
}
</style>