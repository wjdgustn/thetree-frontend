<template>
  <ContextMenu class="author-span">
    <component :class="{
      'name-bold': isBold,
      'name-deleted': isDeleted,
      'name-deleted-span': !nameLink,
      'name-migrated': isMigrated
    }"
       :is="nameLink ? 'a' : 'span'"
       :href="nameLink"
       :style="nameStyle"
       v-text="accountName"
       @click.prevent
    />
    <template #menu>
      <div class="account-info">
        <div class="account-type" v-text="accountType"/>
        <div class="account-name" v-text="accountName"/>
      </div>
      <hr>
      <template v-if="isDeleted && !account.uuid">
        <GeneralButton disabled>(없음)</GeneralButton>
      </template>
      <template v-if="account.type === 1">
        <GeneralButton :href="nameLink">사용자 문서</GeneralButton>
        <hr>
      </template>
      <template v-if="account.uuid">
        <GeneralButton :href="contribution_link(account.uuid)">문서 기여 내역</GeneralButton>
        <GeneralButton :href="contribution_link_discuss(account.uuid)">토론 기여 내역</GeneralButton>
        <template v-if="session.quick_block">
          <hr>
          <GeneralButton v-close-popover :whenClick="copyUuid">UUID 복사</GeneralButton>
          <GeneralButton :href="{ path: '/BlockHistory', query: { query: account.uuid, target: 'text' } }">차단 내역 조회</GeneralButton>
          <template v-if="isBlockable">
            <hr>
            <GeneralButton v-close-popover theme="danger" :whenClick="onBlockButtonClick">차단</GeneralButton>
          </template>
        </template>
      </template>
    </template>
  </ContextMenu>
</template>
<script>
import { toast } from 'vue-sonner'
import { vClosePopper } from 'floating-vue'

import Common from '@/mixins/common'
import ContextMenu from '@/components/contextMenu'
import GeneralButton from '@/components/generalButton'

export default {
  mixins: [Common],
  components: {
    ContextMenu,
    GeneralButton
  },
  directives: {
    closePopover: vClosePopper
  },
  props: {
    account: {
      type: JSON,
      required: true
    },
    discuss: Boolean,
    discussAdmin: Boolean,
    pos: String
  },
  computed: {
    nameLink() {
      if(this.account.type === 1)
        return this.doc_action_link(`사용자:${this.account.name}`, 'w')
      else if(this.account.uuid)
        return this.contribution_link(this.account.uuid)
    },
    isDeleted() {
      return this.account.type === -1
    },
    isBold() {
      const isAccount = this.account.type === 1
      return this.discuss ? this.discussAdmin : isAccount
    },
    isMigrated() {
      return this.account.type === 2
    },
    accountName() {
      return this.isDeleted ? '(삭제된 사용자)' : (this.account.name || this.account.ip)
    },
    nameStyle() {
      if(!this.isDeleted) return this.account.userCSS
    },
    accountType() {
      let str = this.account.type === 0 ? 'IP' : '사용자'
      if(this.account.type === 2) str = '마이그레이션된 ' + str

      if(this.account.autoVerified) str = '자동 인증된 ' + str

      if(this.account.admin) str += ' (관리자)'
      else if(this.discussAdmin) str += ' (전 관리자)'

      return str
    },
    isBlockable() {
      return [0, 1].includes(this.account.type)
    }
  },
  methods: {
    onBlockButtonClick() {
      const note = `${this.pos ? this.pos + ' ' : ''}긴급차단`
      this.openQuickACLGroup({
        ...(this.account.type === 0 ? {
          ip: this.account.ip
        } : {
          username: this.account.name
        }),
        note
      })
    },
    copyUuid() {
      if(!this.account.uuid) return
      navigator.clipboard.writeText(this.account.uuid)
      toast(`사용자 '${this.account.name}'의 UUID가 복사되었습니다.`)
    }
  }
}
</script>
<style scoped>
.author-span {
  display: inline;
}

.name-bold {
  font-weight: 700;
}

.name-deleted {
  color: gray;
  font-style: italic;
}

.name-migrated {
  font-weight: 700;
  color: darkblue !important;
}

span.name-deleted-span {
  cursor: pointer;
}

.account-info {
  padding: .25rem 1rem;
}

.account-type {
  font-size: .8rem;
}

.account-name {
  font-size: .95rem;
  font-weight: 600;
  line-height: 1;
  margin: 0 0 .3rem;
}
</style>