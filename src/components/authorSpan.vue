<template>
  <ContextMenu class="author-span">
    <a :class="{
      'name-bold': isBold,
      'name-deleted': isDeleted,
      'name-migrated': isMigrated
    }"
       :href="nameLink"
       :style="nameStyle"
       v-text="accountName"
       @click.prevent
    />
    <template #menu>
      todo
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
      return this.discuss ? this.discussAdmin && isAccount : isAccount
    },
    isMigrated() {
      return this.account.type === 2
    },
    accountName() {
      return this.isDeleted ? '(삭제된 사용자)' : this.account.name
    },
    nameStyle() {
      if(!this.isDeleted) return this.account.userCSS
    },
    accountType() {
      let str = this.account.type === 0 ? 'IP' : '사용자'
      if(this.account.type === 2) str = '마이그레이션된 ' + str

      if(this.account.admin) str += ' (관리자)'
      else if(this.discussAdmin) str += ' (전 관리자)'

      return str
    }
  },
  methods: {
    onBlockButtonClick() {
      console.log('TODO: QuickACLGroup')
      const note = `${this.pos ? this.pos + ' ' : ''}긴급차단`
      // this.openQuickACLGroup({
      //   ...(this.account.type === 0 ? {
      //     ip: this.account.name
      //   } : {
      //     username: this.account.name
      //   }),
      //   note
      // })
    },
    copyUuid() {
      if(!this.account.uuid) return
      navigator.clipboard.writeText(this.account.uuid)
      toast(`사용자 ${this.account.name}의 UUID가 복사되었습니다.`)
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

.ubbqzKtB {
  padding: .25rem 1rem;
}

.fHLdjObB {
  font-size: .8rem;
}

._4j\+uispq {
  font-size: .95rem;
  font-weight: 600;
  line-height: 1;
  margin: 0 0 .3rem;
}
</style>