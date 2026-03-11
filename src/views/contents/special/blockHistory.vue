<template>
  <SeedForm flex box class="search-form">
    <SelectMenu name="target" :value="$route.query.target || 'text'">
      <option value="text">{{$t('views.block_history.target.text')}}</option>
      <option value="author">{{$t('views.block_history.target.author')}}</option>
    </SelectMenu>
    <SelectMenu name="type" :value="$route.query.type || 'all'">
      <option value="all">{{$t('views.block_history.type_all')}}</option>
      <option v-for="i in Object.values(BlockHistoryTypes)" :value="i">{{typeName(i)}}</option>
    </SelectMenu>
    <InputField class="search-input" name="query" :placeholder="$t('views.block_history.search')" v-model="$route.query.query"/>
    <div class="button-block">
      <GeneralButton type="submit" theme="primary" class="search-button">{{$t('views.block_history.search')}}</GeneralButton>
      <GeneralButton :whenClick="reset">{{$t('views.block_history.reset')}}</GeneralButton>
    </div>
    <CheckBox
        v-if="data.permissions.dev"
        :checked="$route.query.showHidden === '1'"
        :whenChange="e => $router.push({ query: { showHidden: e.target.checked ? '1' : undefined } })"
        name="showHidden"
        value="1"
    >
      {{$t('views.block_history.show_hidden')}}
    </CheckBox>
  </SeedForm>
  <div class="top-page-block">
    <PrevNextBtn flex class="top-page" v-bind="pageProps"/>
    <CheckBox v-if="$i18next.language === 'ko'" v-model="useFormattedCopy">형식화된 복사 사용</CheckBox>
  </div>

  <ul class="block-list" @copy="onListCopy">
    <li v-for="item in data.logs" class="block-row">
      <div class="block-item">
        <span class="icon" :class="iconClass(item.type)">
          <FontAwesomeIcon :icon="iconName(item.type)" />
        </span>
      </div>
      <div class="block-item block-content">
        <div>
          <template v-if="item.hideLog">({{$t('views.block_history.hidden_prefix')}}) </template>
          <template v-if="item.type === BlockHistoryTypes.ACLGroupAdd">
            <i18next :translation="$t('views.block_history.messages.acl_group_add_' + (item.duration ? 'duration' : 'forever'), {
              userOrIp: $t('views.block_history.messages.' + (item.targetUser ? 'user' : 'ip')),
              blockNameText: (item.targetUser && item.targetUser.name !== item.targetUsername) ? $t('views.block_history.messages.block_name_text', { targetUsername: item.targetUsername }) : undefined,
              duration: durationToExactString(item.duration)
            })">
              <template #createdUser>
                <AuthorSpan :account="item.createdUser"/>
              </template>
              <template #targetUser>
                <AuthorSpan v-if="item.targetUser" :account="item.targetUser"/>
                <template v-else>{{item.targetContent}}</template>
              </template>
              <template #aclGroup>
                <span class="bold">{{item.aclGroup?.name || item.aclGroupName || item.aclGroup}}</span>
              </template>
            </i18next> <span class="block-id">#{{item.aclGroupId}}</span>
          </template>
          <template v-else-if="item.type === BlockHistoryTypes.ACLGroupRemove">
            <i18next :translation="$t('views.block_history.messages.acl_group_remove', {
              userOrIp: $t('views.block_history.messages.' + (item.targetUser ? 'user' : 'ip')),
              blockNameText: (item.targetUser && item.targetUser.name !== item.targetUsername) ? $t('views.block_history.messages.block_name_text', { targetUsername: item.targetUsername }) : undefined
            })">
              <template #createdUser>
                <AuthorSpan :account="item.createdUser"/>
              </template>
              <template #targetUser>
                <AuthorSpan v-if="item.targetUser" :account="item.targetUser"/>
                <template v-else>{{item.targetContent}}</template>
              </template>
            </i18next> <span class="block-id">#{{item.aclGroupId}}</span>
          </template>
          <template v-else-if="item.type === BlockHistoryTypes.Grant">
            <i18next :translation="$t('views.block_history.messages.grant')">
              <template #createdUser>
                <AuthorSpan :account="item.createdUser"/>
              </template>
              <template #targetUser v-if="item.targetUser">
                <AuthorSpan :account="item.targetUser"/>
              </template>
            </i18next>
          </template>
          <template v-else-if="item.type === BlockHistoryTypes.BatchRevert">
            <i18next :translation="$t('views.block_history.messages.batch_revert', {
              userOrIp: $t('views.block_history.messages.' + (item.targetUser ? 'user' : 'ip'))
            })">
              <template #createdUser>
                <AuthorSpan :account="item.createdUser"/>
              </template>
              <template #targetUser v-if="item.targetUser">
                <AuthorSpan :account="item.targetUser"/>
              </template>
            </i18next>
          </template>
          <template v-else-if="item.type === BlockHistoryTypes.LoginHistory">
            <i18next :translation="$t('views.block_history.messages.login_history')">
              <template #createdUser>
                <AuthorSpan :account="item.createdUser"/>
              </template>
              <template #targetUser v-if="item.targetUser">
                <AuthorSpan :account="item.targetUser"/>
              </template>
            </i18next>
          </template>
        </div>
        <div class="block-text" v-if="item.type === BlockHistoryTypes.Grant">
          {{item.content}}
        </div>
        <div class="block-text">
          <LocalDate :date="item.createdAt"/>
          <span v-if="item.type !== BlockHistoryTypes.Grant && item.content">
            ({{item.content}})
          </span>
        </div>
      </div>
    </li>
  </ul>

  <PrevNextBtn flex v-bind="pageProps"/>
</template>
<script>
import { escapeHtml, unescapeHtml, formatDate } from '@/utils'

import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import SelectMenu from '@/components/selectMenu'
import InputField from '@/components/form/inputField'
import GeneralButton from '@/components/generalButton'
import PrevNextBtn from '@/components/prevNextBtn'
import CheckBox from '@/components/form/checkBox'
import AuthorSpan from '@/components/authorSpan'
import LocalDate from '@/components/localDate'

const BlockHistoryTypes = {
  ACLGroupAdd: 0,
  ACLGroupRemove: 1,
  Grant: 2,
  BatchRevert: 3,
  LoginHistory: 4
}

export default {
  mixins: [Common],
  components: {
    LocalDate,
    AuthorSpan,
    CheckBox,
    PrevNextBtn,
    GeneralButton,
    InputField,
    SeedForm,
    SelectMenu
  },
  data() {
    return {
      BlockHistoryTypes,
      useFormattedCopy: this.$store.state.localConfig['block_history.use_formatted_copy'] ?? false
    }
  },
  watch: {
    useFormattedCopy(newValue) {
      this.$store.state.localConfigSetValue('block_history.use_formatted_copy', newValue)
    }
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
  },
  methods: {
    reset() {
      this.$router.push('/BlockHistory')
    },
    iconClass(type) {
      return ({
        [BlockHistoryTypes.ACLGroupAdd]: 'aclgroup-add',
        [BlockHistoryTypes.ACLGroupRemove]: 'aclgroup-remove',
        [BlockHistoryTypes.Grant]: 'grant',
        [BlockHistoryTypes.BatchRevert]: 'batch-revert',
        [BlockHistoryTypes.LoginHistory]: 'login-history'
      })[type]
    },
    iconName(type) {
      return ({
        [BlockHistoryTypes.ACLGroupAdd]: 'user-plus',
        [BlockHistoryTypes.ACLGroupRemove]: 'user-minus',
        [BlockHistoryTypes.Grant]: 'user-check',
        [BlockHistoryTypes.BatchRevert]: 'clock-rotate-left',
        [BlockHistoryTypes.LoginHistory]: 'user'
      })[type]
    },
    typeName(type) {
      return this.$t('views.block_history.types.' + ({
        [BlockHistoryTypes.ACLGroupAdd]: 'acl_group_add',
        [BlockHistoryTypes.ACLGroupRemove]: 'acl_group_remove',
        [BlockHistoryTypes.Grant]: 'grant',
        [BlockHistoryTypes.BatchRevert]: 'batch_revert',
        [BlockHistoryTypes.LoginHistory]: 'login_history'
      })[type])
    },
    userToText(user) {
      let link;
      let text;
      if(user.type === -1)
        text = '<i>(삭제된 사용자)</i>';
      else if(user.name || user.ip) {
        text = `<b>${escapeHtml(user.name || user.ip)}</b>`
        if(user.type === 1)
          link = this.doc_action_link(this.user_doc(user.name), 'w')
        else if(user.uuid)
          link = this.contribution_link(user.uuid)
      }

      link &&= new URL(link, location.href).toString()

      return link && text
          ? `<a href="${link}" target="_blank">${text}</a>`
          : text
    },
    onListCopy(e) {
      if(!this.useFormattedCopy) return

      const sel = document.getSelection()
      if(!sel || sel.rangeCount < 1) return

      const root = e.currentTarget
      const items = [...root.children]
          .filter(a => a.nodeType === Node.ELEMENT_NODE && a.classList.contains('block-row'))

      const findClosest = el => {
        while(el) {
          if(el.nodeType === Node.ELEMENT_NODE && el.classList.contains('block-row'))
            return el
          el = el.parentNode
        }
        return null
      }
      const startEl = findClosest(sel.getRangeAt(0).startContainer)
      const endEl = findClosest(sel.getRangeAt(sel.rangeCount - 1).endContainer)

      const startIndex = items.indexOf(startEl)
      const endIndex = items.indexOf(endEl)

      const htmlItems = []
      const textItems = []
      for(let i = startIndex; i <= endIndex; i++) {
        const item = this.data.logs[i]
        let li = '<li>'

        if(item.createdAt)
          li += `(${formatDate(item.createdAt)}) `

        li += `${this.userToText(item.createdUser) ?? '(사용자)'} 사용자가`

        if(item.targetUser) {
          li += ` ${this.userToText(item.targetUser) ?? '(사용자)'}`

          li += item.targetUser.type === 0
              ? ' IP'
              : ' 사용자'
          if(item.type === BlockHistoryTypes.BatchRevert)
            li += '의 기여를'
          else if([
            BlockHistoryTypes.ACLGroupAdd,
            BlockHistoryTypes.ACLGroupRemove
          ].includes(item.type))
            li += '를'

          if(item.targetUser && item.targetUser.name !== item.targetUsername)
            li += ` (차단 당시 이름: ${escapeHtml(item.targetUsername)})`
        }
        if([
          BlockHistoryTypes.ACLGroupAdd,
          BlockHistoryTypes.ACLGroupRemove,
          BlockHistoryTypes.BatchRevert
        ].includes(item.type)) {
          if(!item.targetUser && item.targetContent) {
            li += ` ${escapeHtml(item.targetContent)} IP를`
          }

          if(item.type === BlockHistoryTypes.BatchRevert) {
            li += ' 일괄 되돌림'
          }
          else {
            li += ` <b>${escapeHtml(
                item.aclGroup?.name || item.aclGroupName || item.aclGroup
            )}</b> ACL 그룹에${item.type === BlockHistoryTypes.ACLGroupRemove ? '서' : ''}`

            if(item.type === BlockHistoryTypes.ACLGroupAdd) {
              li += item.duration
                  ? ` ${this.durationToExactString(item.duration)} 동안`
                  : ' 영구적으로'
              li += ' 등록함'
            }
            else {
              li += ' 제거함'
            }

            li += ` <b>#${escapeHtml(item.aclGroupId)}</b>`
          }
        }
        else if(item.type === BlockHistoryTypes.Grant)
          li += `의 권한 설정`
        else if(item.type === BlockHistoryTypes.LoginHistory)
          li += `의 로그인 기록 조회`

        if(item.type === BlockHistoryTypes.Grant)
          li += `<br>권한: ${escapeHtml(item.content)}`
        else if(item.content)
          li += `<br>사유: ${escapeHtml(item.content)}`

        li += '</li>'

        htmlItems.push(li)

        const text = '- ' + li
            .replaceAll('<br>', '\n')
            .replace(/<[^>]*?>/g, '')
        textItems.push(unescapeHtml(text))
      }

      e.clipboardData.setData('text/html', `<ul>${htmlItems.join('')}</ul>`)
      e.clipboardData.setData('text/plain', textItems.join('\n') + '\n')

      e.preventDefault()
    }
  }
}
</script>
<style scoped>
@media screen and (max-width: 1023.98px) {
  .search-form {
    width: 100%;
  }
}

@media screen and (max-width: 727.98px) {
  .search-form {
    flex-direction: column;
  }

  .search-form>* {
    width: 100%;
  }
}

.block-list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.block-row {
  border-top: 1px solid #e0e0e0;
  display: flex;
  gap: 1rem;
  margin: 0 0 .6rem;
  padding: .6rem .75rem 0;
}

.theseed-dark-mode .block-row {
  border-color: #434343;
}

@media screen and (max-width: 727.98px) {
  .block-row {
    margin: 0 0 .75rem;
    padding: .75rem 0 0 .75rem;
  }
}

@media screen and (max-width: 371.98px) {
  .block-row {
    flex-direction: column;
    gap: .5rem;
  }
}

.block-row:last-child {
  border-bottom: 1px solid #e0e0e0;
  margin: 0;
  padding-bottom: .6rem;
}

@media screen and (max-width: 727.98px) {
  .block-row:last-child {
    padding-bottom: .75rem;
  }
}

.theseed-dark-mode .block-row:last-child {
  border-color: #434343;
}

.block-item {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  row-gap: .25rem
}

.block-content {
  flex: 1;
}

.block-text {
  color: #777;
  font-size: .9rem;
}

.search-input {
  width: 20rem;
}

@media screen and (max-width: 727.98px) {
  .search-input {
    width: 100%;
  }
}

.button-block {
  display: flex;
  gap: .5rem;
}

@media screen and (max-width: 727.98px) {
  .search-button {
    flex: 1;
  }
}

.top-page-block {
  align-items: center;
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin: 1rem 0;
}

@media screen and (max-width: 727.98px) {
  .top-page-block {
    align-items: normal;
    flex-direction: column;
  }
}

.top-page {
  flex: 1;
  margin: 0 !important;
}

.icon {
  display: flex;
  height: 1.25rem;
  width: 1.25rem;
}

.login-history {
  color: #8e4ec6;
}

.grant {
  color: #f76b15;
}

.aclgroup-remove {
  color: #8b8d98;
}

.aclgroup-add {
  color: #46a758;
}

.batch-revert {
  color: #2056b4;
}

.icon svg {
  fill: currentColor;
  height: initial;
}

.bold {
  font-weight: 700;
}

.block-id {
  color: #777;
}
</style>