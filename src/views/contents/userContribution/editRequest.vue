<template>
  <ContributionTab/>
  <div>전체 {{data.total}}회</div>
  <div style="margin-bottom:1rem">
    <PrevNextBtn flex v-bind="pageProps"/>
  </div>
  <div :class="$style.table">
    <div :class="[$style.row, $style['row--head'], 'table-row']">
      <div :class="[$style.column, 'table-column']">편집 요청</div>
      <div :class="[$style.column, 'table-column']">상태</div>
      <div :class="[$style.column, 'table-column']">시간</div>
    </div>
    <div v-if="data.items.length" v-for="item in data.items" :class="[$style.row, 'table-row']">
      <div :class="[$style.column, 'table-column']">
        <NuxtLink :to="'/edit_request/' + item.url">편집요청 {{item.url}}</NuxtLink>
        <DiffCount class="diff-count" :count="item.diffLength"/>
        <span class="document-group">
          <span class="document-icon">
            <FontAwesomeIcon icon="fa-regular fa-file-lines" />
          </span>
          <NuxtLink :to="doc_action_link(item.document.parsedName, 'discuss')" class="document-link">{{doc_fulltitle(item.document.parsedName)}}</NuxtLink>
        </span>
      </div>
      <div :class="[$style.column, 'table-column']">{{['OPEN', 'ACCEPTED', 'CLOSED', 'LOCKED'][item.status]}}</div>
      <div :class="[$style.column, 'table-column']">
        <LocalDate :date="item.lastUpdatedAt" relative/>
      </div>
      <div v-if="item.createdUser" :class="[$style.column, $style['column--full'], 'table-column', 'author-text']">
        (사용자
        <AuthorSpan :account="item.createdUser"/>의
        편집 요청)
      </div>
    </div>
    <div v-else :class="[$style.row, 'table-row']">
      <div :class="[$style.column, $style['column--single'], 'table-column']">
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
import PrevNextBtn from '@/components/prevNextBtn'
import NuxtLink from '@/components/global/nuxtLink'
import DiffCount from '@/components/diffCount'
import LocalDate from '@/components/localDate'
import AuthorSpan from '@/components/authorSpan'

export default {
  mixins: [Common],
  components: {
    AuthorSpan,
    LocalDate,
    DiffCount,
    NuxtLink,
    PrevNextBtn,
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
<style module>
@import '@/styles/table.css';
</style>
<style scoped>
.link-tab {
  margin-bottom: 1rem;
  margin-top: 1rem;
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

.diff-count {
  font-size: .8rem;
  margin: 0 0 0 .35rem;
  vertical-align: bottom;
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
  display: grid;
  grid-template-columns: 1fr 10rem 13rem;
}

@media screen and (max-width: 1023.98px) {
  .table-row {
    column-gap: .75rem;
    grid-template-columns: auto 1fr;
    padding: .5rem;
    row-gap: .1rem;
  }

  .table-column {
    margin: 0 !important;
    padding: 0 !important;
  }
}

.author-text {
  font-style: italic;
  grid-column: 1/3;
}

@media screen and (max-width: 1023.98px) {
  .table-column:first-child {
    font-size: 1.05rem;
    grid-column: 1/3;
  }

  .table-column:nth-child(2) {
    font-size: .85rem;
    order: -1;
  }

  .table-column:nth-child(3) {
    color: #888;
    font-size: .85rem;
    order: -2;
  }
}
</style>