<template>
  <h3>
    <i18next :translation="$t('views.edit_request.name_and_date')">
      <template #createdUser>
        <AuthorSpan :account="editRequest.createdUser" :pos="pos"/>
      </template>
      <template #createdAt>
        <LocalDate :date="editRequest.createdAt"/>
      </template>
    </i18next>
  </h3>
  <hr>
  <div class="margin-block">
    <label>{{$t('views.edit_request.base_rev')}}</label>
    r{{data.baseRev.rev}}
    <DiffCount :count="editRequest.diffLength"/>
  </div>
  <div class="margin-block">
    <label>{{$t('views.edit_request.log')}}</label>
    {{editRequest.log}}
  </div>
  <Modal v-if="editRequest.status === 0" v-model="showCloseModal" v-slot="props" classes="close-modal">
    <SeedForm method="post" :action="'/edit_request/' + editRequest.url + '/close'" :afterSubmit="afterCloseSubmit">
      <h4>{{$t('views.edit_request.close_modal.title')}}</h4>
      <div>
        <p>{{$t('views.edit_request.reason')}}:</p>
        <input type="text" name="close_reason">
      </div>
      <div v-if="data.permissions.status">
        <p>{{$t('views.edit_request.close_modal.lock')}}</p>
        <input type="checkbox" name="lock" value="Y">
      </div>
      <div class="button-block">
        <SeedButton submit large>{{$t('views.edit_request.close_modal.close')}}</SeedButton>
        <SeedButton type="button" large @click="props.close">{{$t('views.edit_request.close_modal.cancel')}}</SeedButton>
      </div>
    </SeedForm>
  </Modal>

  <WikiContent :content="data.contentHtml"/>

  <div class="action-block">
    <div v-if="editRequest.status === 0">
      <h4>{{$t('views.edit_request.this_edit_request')}}</h4>
      <div>
        <i18next :translation="$t('views.edit_request.edit_date')">
          <template #lastUpdatedAt>
            <LocalDate :date="editRequest.lastUpdatedAt"/>
          </template>
        </i18next>
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
      <h4>{{$t('views.edit_request.accepted_title')}}</h4>
      <div>
        <i18next :translation="$t('views.edit_request.accepted_description', { rev: editRequest.acceptedRev.rev })">
          <template #lastUpdatedAt>
            <LocalDate :date="editRequest.lastUpdatedAt"/>
          </template>
          <template #lastUpdateUser>
            <AuthorSpan :account="editRequest.lastUpdateUser" :pos="pos"/>
          </template>
          <template #action>
            <span class="history-action">
          (<NuxtLink :to="doc_action_link(data.document, 'w', { uuid: editRequest.acceptedRev.uuid })" rel="nofollow">{{$t('document.w')}}</NuxtLink>
          | <NuxtLink :to="doc_action_link(data.document, 'raw', { uuid: editRequest.acceptedRev.uuid })" rel="nofollow">{{$t('document.raw')}}</NuxtLink>
          | <NuxtLink :to="doc_action_link(data.document, 'diff', { uuid: editRequest.acceptedRev.uuid })" rel="nofollow">{{$t('document.diff')}}</NuxtLink>)
        </span>
          </template>
        </i18next>
      </div>
    </div>
    <div v-else>
      <h4>{{$t('views.edit_request.closed_title')}}</h4>
      <div>
        <i18next :translation="$t(`views.edit_request.${editRequest.status === 3 ? 'locked' : 'closed'}_description`)">
          <template #lastUpdatedAt>
            <LocalDate :date="editRequest.lastUpdatedAt"/>
          </template>
          <template #lastUpdateUser>
            <AuthorSpan :account="editRequest.lastUpdateUser" :pos="pos"/>
          </template>
        </i18next>
      </div>
      <p v-if="editRequest.closedReason">{{$t('views.edit_request.reason')}}: {{editRequest.closedReason}}</p>
      <div class="button-block">
        <SeedForm method="post" :action="'/edit_request/' + editRequest.url + '/reopen'">
          <SeedButton green large :disabled="reopenInfo.disabled" v-tooltip="reopenInfo.tooltip">Reopen</SeedButton>
        </SeedForm>
      </div>
    </div>
  </div>

  <template v-if="data.showContent">
    <ul>
      <li><button :class="{ active: activeTab === 'compare' }" @click="activeTab = 'compare'">{{$t('views.edit_request.compare')}}</button></li>
      <li><button :class="{ active: activeTab === 'preview' }" @click="activeTab = 'preview'">{{$t('views.edit_request.preview')}}</button></li>
    </ul>
    <div class="tabs">
      <div :class="{ active: activeTab === 'compare' }">
        <Diff :title="$t('views.user_contribution.edit_request_link', { slug: editRequest.url })" :diffHtml="data.diff.diffHtml"/>
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
      return this.$t('document.edit_request') + this.editRequest.url
    },
    acceptTooltip() {
      return this.data.conflict
          ? this.$t('views.edit_request.accept_tooltip_conflict')
          : (this.data.editable ? this.$t('views.edit_request.accept_tooltip') : this.$t('views.edit_request.accept_tooltip_missing_perm'))
    },
    closeTooltip() {
      return this.data.selfCreated || this.data.editable
          ? this.$t('views.edit_request.close_tooltip')
          : this.$t('views.edit_request.close_tooltip_missing_perm')
    },
    editTooltip() {
      return this.data.selfCreated
          ? this.$t('views.edit_request.edit_tooltip')
          : this.$t('views.edit_request.edit_tooltip_not_self')
    },
    reopenInfo() {
      let disabled = false
      let tooltip = this.$t('views.edit_request.reopen_tooltip')

      const updateThreadStatusPerm = this.data.permissions.status

      if(this.editRequest.status === 3) {
        if(!updateThreadStatusPerm) {
          disabled = true
          tooltip = this.$t('views.edit_request.reopen_tooltip_locked')
        }
      }
      else {
        if(!this.data.selfCreated && !updateThreadStatusPerm) {
          disabled = true
          tooltip = this.$t('views.edit_request.reopen_tooltip_missing_perm')
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