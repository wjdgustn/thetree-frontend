<template>
  <div class="list-table">
    <div class="table-row table-heading">
      <div class="table-item">문서명</div>
      <div class="table-item">문서 수정 시각</div>
      <div class="table-item"></div>
    </div>
    <div v-for="item in data.stars" class="table-row">
      <div class="table-item">
        <NuxtLink :to="doc_action_link(item.document.parsedName, 'w')">{{doc_fulltitle(item.document.parsedName)}}</NuxtLink>
      </div>
      <div class="table-item">
        <LocalDate :date="item.rev.createdAt" relative/>
      </div>
      <div class="table-item table-buttons">
        <GeneralButton
            v-if="item.removed"
            class="toggle-button"
            size="small"
            theme="primary"
            title="추가"
            type="event"
            @click="toggleStar(item)"
            :disabled="disableButton"
        >
          <FontAwesomeIcon class="button-icon" icon="plus" />
          <span class="button-text">추가</span>
        </GeneralButton>
        <GeneralButton
            v-else
            class="toggle-button"
            size="small"
            theme="danger"
            title="삭제"
            type="event"
            @click="toggleStar(item)"
            :disabled="disableButton"
        >
          <FontAwesomeIcon class="button-icon" icon="trash-can" />
          <span class="button-text">삭제</span>
        </GeneralButton>
      </div>
    </div>
  </div>
</template>
<script>
import Common from '@/mixins/common'
import NuxtLink from '@/components/global/nuxtLink'
import LocalDate from '@/components/localDate'
import GeneralButton from '@/components/generalButton'

export default {
  mixins: [Common],
  components: {
    GeneralButton,
    LocalDate,
    NuxtLink
  },
  data() {
    return {
      disableButton: false
    }
  },
  methods: {
    async toggleStar(item) {
      this.disableButton = true

      const res = await this.internalRequestAndProcess(
          this.doc_action_link(item.document.parsedName, 'member/' + (item.removed ? 'star' : 'unstar'))
      )
      if(res?.code === 204) item.removed = !item.removed
      this.disableButton = false
    }
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

.table-row {
  grid-template-columns: 1fr 13rem 3rem
}

@media screen and (max-width: 1399.98px) {
  .table-row {
    grid-template-columns: 1fr 12rem 3rem;
  }
}

@media screen and (max-width: 1023.98px) {
  .table-row {
    gap: .1rem;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto auto;
    padding: .5rem;
  }

  .table-item {
    margin: 0 !important;
    padding: 0 !important;
  }

  .table-item:first-child {
    font-size: 1.05rem;
    grid-column: 1/2;
  }

  .table-item:nth-child(2) {
    color: #888;
    font-size: .85rem;
    grid-column: 1/2;
    order: -1;
  }
}

.table-item:nth-child(3) {
  justify-content: flex-end;
}

@media screen and (max-width: 1023.98px) {
  .table-item:nth-child(3) {
    grid-column: 2;
    grid-row: 1/3;
  }

  .toggle-button {
    height: 2.25rem;
    margin: 0 0 0 .5rem;
    min-width: auto;
    width: 2.25rem;
  }
}

.button-icon {
  display: none;
  overflow: inherit !important;
}

@media screen and (max-width: 1023.98px) {
  .button-icon {
    display: initial;
  }

  .button-text {
    display: none;
  }
}
</style>