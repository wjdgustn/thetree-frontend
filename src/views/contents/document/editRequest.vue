<template>
  <h3>
    <AuthorSpan :account="editRequest.createdUser" :pos="pos"/>가
    <LocalDate :date="editRequest.createdAt"/>에 요청
  </h3>
  <hr>
  <div class="margin-block">
    <label>기준 판</label>
    r{{data.baseRev.rev}}
    <DiffCount :count="editRequest.diffLength"/>
  </div>
  <div class="margin-block">
    <label>편집 요약</label>
    {{editRequest.log}}
  </div>
  <Modal v-if="editRequest.status === 0" v-model="showCloseModal" v-slot="props" classes="close-modal">
    <SeedForm method="post" :action="'/edit_request/' + editRequest.url + '/close'" :afterSubmit="afterCloseSubmit">
      <h4>편집 요청 닫기</h4>
      <div>
        <p>사유:</p>
        <input type="text" name="close_reason">
      </div>
      <div v-if="data.permissions.status">
        <p>이 편집 요청을 다시 열수 없게 잠금</p>
        <input type="checkbox" name="lock" value="Y">
      </div>
      <div class="button-block">
        <SeedButton submit large>닫기</SeedButton>
        <SeedButton type="button" large @click="props.close">취소</SeedButton>
      </div>
    </SeedForm>
  </Modal>

  <WikiContent :content="data.contentHtml"/>

  <div class="action-block">
    <div v-if="editRequest.status === 0">
      <h4>이 편집 요청을...</h4>
      <div>
        <LocalDate :date="editRequest.lastUpdatedAt"/>에 마지막으로 수정됨
      </div>
      <div class="button-block">
        <SeedForm method="post" :action="'/edit_request/' + editRequest.url + '/accept'">
          <SeedButton green large :disabled="data.conflict || !data.editable" v-tooltip="acceptTooltip">Accept</SeedButton>
        </SeedForm>
        <SeedButton @click="showCloseModal = true" large :disabled="!data.editable && !data.selfCreated" v-tooltip="closeTooltip">Close</SeedButton>
        <SeedLinkButton info large :to="'/edit_request/' + editRequest.url + '/edit'" :disabled="!data.selfCreated" v-tooltip="editTooltip">Edit</SeedLinkButton>
      </div>
    </div>
    <div v-else-if="editRequest.status === 1">
      <h4>편집 요청이 승인되었습니다.</h4>
      <div>
        <LocalDate :date="editRequest.lastUpdatedAt"/>에
        <AuthorSpan :account="editRequest.lastUpdateUser" :pos="pos"/>가
        r{{editRequest.acceptedRev.rev}}
        <span class="history-action">
          (<NuxtLink :to="doc_action_link(data.document, 'w', { uuid: editRequest.acceptedRev.uuid })" rel="nofollow">보기</NuxtLink>
          | <NuxtLink :to="doc_action_link(data.document, 'raw', { uuid: editRequest.acceptedRev.uuid })" rel="nofollow">RAW</NuxtLink>
          | <NuxtLink :to="doc_action_link(data.document, 'diff', { uuid: editRequest.acceptedRev.uuid })" rel="nofollow">비교</NuxtLink>)
        </span>
        으로 승인함.
      </div>
    </div>
    <div v-else>
      <h4>편집 요청이 닫혔습니다.</h4>
      <div>
        <LocalDate :date="editRequest.lastUpdatedAt"/>에
        <AuthorSpan :account="editRequest.lastUpdateUser" :pos="pos"/>가
        편집 요청을
        <template v-if="editRequest.status === 3">닫고 잠갔습니다.</template>
        <template v-else>닫았습니다.</template>
      </div>
      <p v-if="editRequest.closedReason">사유: {{editRequest.closedReason}}</p>
      <div class="button-block">
        <SeedForm method="post" :action="'/edit_request/' + editRequest.url + '/reopen'">
          <SeedButton green large :disabled="reopenInfo.disabled" v-tooltip="reopenInfo.tooltip">Reopen</SeedButton>
        </SeedForm>
      </div>
    </div>
  </div>

  <template v-if="data.showContent">
    <ul>
      <li><button :class="{ active: activeTab === 'compare' }" @click="activeTab = 'compare'">비교</button></li>
      <li><button :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">미리보기</button></li>
    </ul>
    <div class="tabs">
      <div :class="{ active: activeTab === 'compare' }">
        <Diff :title="`편집 요청 ${editRequest.url}`" :diffHtml="data.diff.diffHtml"/>
      </div>
      <div class="preview-tab" :class="{ active: activeTab === 'preview', loading: !preview.content }">
        <WikiContent v-if="preview.content" :content="preview.content" :categories="preview.categories"/>
        <Loading v-else/>
      </div>
    </div>
  </template>
</template>
<script>
import { vTooltip } from 'floating-vue'

import Common from '@/mixins/common'
import AuthorSpan from '@/components/authorSpan'
import LocalDate from '@/components/localDate'
import DiffCount from '@/components/diffCount'
import SeedForm from '@/components/form/seedForm'
import SeedButton from '@/components/seedButton'
import WikiContent from '@/components/wiki/wikiContent'
import SeedLinkButton from '@/components/seedLinkButton'
import Loading from '@/components/loading'
import Diff from '@/components/diff'
import NuxtLink from '@/components/global/nuxtLink'
import Modal from '@/components/modal'

export default {
  mixins: [Common],
  directives: {
    tooltip: vTooltip
  },
  components: {
    Modal,
    NuxtLink,
    Diff,
    Loading,
    SeedLinkButton,
    WikiContent,
    SeedButton,
    SeedForm,
    DiffCount,
    LocalDate,
    AuthorSpan

  },
  data() {
    return {
      showCloseModal: false,
      activeTab: 'compare',
      preview: {
        content: null,
        categories: null
      }
    }
  },
  computed: {
    editRequest() {
      return this.data.editRequest
    },
    pos() {
      return '편집 요청' + this.editRequest.url
    },
    acceptTooltip() {
      return this.data.conflict
          ? '이 편집 요청은 충돌된 상태입니다. 요청자가 수정해야 합니다.'
          : (this.data.editable ? '이 편집 요청을 문서에 적용합니다.' : '이 문서를 편집할 수 있는 권한이 없습니다.')
    },
    closeTooltip() {
      return this.data.selfCreated || this.data.editable
          ? '이 편집 요청을 닫습니다.'
          : '편집 요청을 닫기 위해서는 요청자 본인이거나 문서를 편집할 수 있는 권한이 있어야 합니다.'
    },
    editTooltip() {
      return this.data.selfCreated
          ? '편집 요청을 수정합니다.'
          : '요청자 본인만 수정할 수 있습니다.'
    },
    reopenInfo() {
      let disabled = false
      let tooltip = '이 편집 요청을 다시 엽니다.'

      const updateThreadStatusPerm = this.data.permissions.status

      if(this.editRequest.status === 3) {
        if(!updateThreadStatusPerm) {
          disabled = true
          tooltip = '이 편집 요청은 잠겨있어서 다시 열 수 없습니다.'
        }
      }
      else {
        if(!this.data.selfCreated && !updateThreadStatusPerm) {
          disabled = true
          tooltip = '편집 요청을 다시 열기 위해서는 요청자 본인이거나 권한이 있어야 합니다.'
        }
      }

      return { disabled, tooltip }
    }
  },
  watch: {
    activeTab(newValue) {
      if(newValue === 'preview')
        this.loadPreview()
    }
  },
  methods: {
    async loadPreview() {
      this.preview.content = null
      this.preview.categories = null

      const res = await this.internalRequest(this.doc_action_link(this.data.document, 'preview'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          content: this.editRequest.content
        }).toString(),
        noProgress: true
      })

      this.preview.content = res.contentHtml
      this.preview.categories = res.categories
    },
    afterCloseSubmit() {
      this.showCloseModal = false
    }
  }
}
</script>
<style scoped>
h3 {
  color: inherit;
  font-family: inherit;
  font-size: 1.75rem;
  line-height: 1.1;
  margin-bottom: .5rem;
  margin-top: 0
}

hr {
  border: 0;
  border-top: .0625rem solid #ccc;
  height: 0;
  margin: .5em 0
}

.theseed-dark-mode hr {
  border-top-color: #383b40
}

div.margin-block {
  margin-bottom: 15px;
}

label {
  display: inline-block;
  font-weight: 700;
  margin-bottom: .5rem;
}

div.action-block {
  border: .0625rem solid #e5e5e5;
  border-radius: .25rem;
  margin-bottom: .75rem;
  position: relative;
}

div.action-block>div {
  padding: 1.25rem;
}

div.action-block>div>h4 {
  color: inherit;
  font-family: inherit;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: .75rem;
  margin-top: 0;
}

div.action-block>div>p {
  margin-bottom: 1rem;
  margin-top: 0;
}

div.action-block>div>form {
  display: inline;
}

div.button-block {
  column-gap: .25rem;
  display: flex;
}

ul {
  border-bottom: 1px solid #ddd;
  height: 36px;
  list-style: none;
  margin-bottom: 0;
  margin-top: 0;
  padding-left: 0;
}

ul:after,ul:before {
  content: " ";
  display: table;
}

li {
  float: left;
  margin-bottom: -1px;
}

li+li {
  margin-left: .2rem;
}

li button {
  background: none;
  border: 1px solid transparent;
  border-radius: .25rem .25rem 0 0;
  cursor: pointer;
  display: block;
  font-size: .9rem;
  padding: .5em 1em;
}

li button.active {
  background-color: #fff;
  border-color: #ddd #ddd transparent;
  color: #55595c;
}

.theseed-dark-mode div.action-block,.theseed-dark-mode div.tabs,.theseed-dark-mode ul {
  border-color: #383b40;
}

.theseed-dark-mode li button {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

.theseed-dark-mode li button.active {
  background-color: #383b40;
}

div.tabs:before {
  clear: both;
  content: "";
  display: table;
}

div.tabs {
  border: 1px solid #ddd;
  border-top: none;
}

div.tabs>div {
  display: none;
}

div.tabs>div.active {
  display: block;
}

div.tabs>div.preview-tab {
  height: 30rem;
  overflow: auto;
  padding: 10px;
}

div.tabs>div.preview-tab.loading {
  background-color: #ccc;
  text-align: center;
}

div.close-modal form {
  box-sizing: border-box;
  flex: 1 0 auto;
  font-size: 14px;
  padding: 15px;
  width: 100%;
}

div.close-modal form div p {
  margin-bottom: 0;
}

div.close-modal form h4 {
  font-weight: 600;
  margin: 0;
  padding: 0;
}

div.close-modal form input[type=text] {
  margin: 0;
  width: 100%;
}

div.close-modal form div.button-block {
  float: right;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

span.history-action {
  font-size: 8pt;
}
</style>