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
        <GeneralButton disabled>({{$t('components.author_span.deleted')}})</GeneralButton>
      </template>
      <template v-if="account.type === 1">
        <GeneralButton :href="nameLink">{{$t('components.author_span.user_doc')}}</GeneralButton>
        <hr>
      </template>
      <template v-if="account.uuid">
        <GeneralButton :href="contribution_link(account.uuid)">{{$t('components.author_span.document_contribution')}}</GeneralButton>
        <GeneralButton :href="contribution_link_discuss(account.uuid)">{{$t('components.author_span.discuss_contribution')}}</GeneralButton>
        <template v-if="session.quick_block">
          <hr>
          <GeneralButton v-close-popover :whenClick="copyUuid">{{$t('components.author_span.copy_uuid')}}</GeneralButton>
          <GeneralButton :href="{ path: '/BlockHistory', query: { query: (account.type === 0 ? account.ip : account.uuid), target: 'text' } }">{{$t('components.author_span.block_history')}}</GeneralButton>
          <template v-if="isBlockable">
            <hr>
            <GeneralButton v-close-popover theme="danger" :whenClick="onBlockButtonClick">{{$t('components.author_span.block')}}</GeneralButton>
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
        return this.doc_action_link(`${this.$t('namespaces.사용자', { lng: this.config.lang || 'ko' })}:${this.account.name}`, 'w')
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
      return this.isDeleted ? `(${this.$t('components.author_span.deleted_user')})` : (this.account.name || this.account.ip)
    },
    nameStyle() {
      if(!this.isDeleted) return this.account.userCSS
    },
    accountType() {
      let str = this.$t('components.author_span.' + (this.account.type === 0 ? 'ip' : 'user'))
      if(this.account.type === 2) str = this.$t('components.author_span.migrated', { type: str })

      const admin = !!(this.account.flags & 1 << 5)
      const autoVerified = !!(this.account.flags & 1 << 1)
      const mobileVerified = !!(this.account.flags & 1 << 2)

      if(autoVerified && mobileVerified) str = this.$t('components.author_span.mobile_auto_verified', { type: str })
      else if(autoVerified) str = this.$t('components.author_span.auto_verified', { type: str })
      else if(mobileVerified) str = this.$t('components.author_span.mobile_verified', { type: str })

      if(admin) str += ` (${this.$t('components.author_span.admin')})`
      else if(this.discussAdmin) str += ` (${this.$t('components.author_span.prev_admin')})`

      return str
    },
    isBlockable() {
      return [0, 1].includes(this.account.type)
    }
  },
  methods: {
    onBlockButtonClick() {
      const note = this.$t('components.author_span.quick_block_note', { pos: this.pos || '' }).trim()
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
      toast(this.$t('components.author_span.copied_uuid', { accountName: this.accountName }))
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