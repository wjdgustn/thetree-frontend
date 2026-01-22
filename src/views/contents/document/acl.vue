<template>
  <FormErrorAlert/>
  <LinkTab
      tab
      :items="[
          ...(data.thread ? [{
            title: '토론 ACL',
            href: '#thread',
            active: aclCategory === 'thread'
          }] : []),
          {
            title: '문서 ACL',
            href: '#document',
            active: aclCategory === 'document'
          },
          {
            title: '이름공간 ACL',
            href: '#namespace',
            active: aclCategory === 'namespace'
          }
      ]"
  />
  <LinkTab
      style="margin-top: 0.5rem"
      tab
      :items="aclTypes"
  />
  <div>
    <h4>{{activeAclType.title}}</h4>
    <div class="acl-table">
      <table>
        <colgroup>
          <col style="width: 60px"/>
          <col/>
          <col style="width: 80px"/>
          <col style="width: 200px"/>
          <col style="width: 60px"/>
        </colgroup>
        <thead>
        <tr>
          <th>No</th>
          <th>Condition</th>
          <th>Action</th>
          <th>Expiration</th>
          <th></th>
        </tr>
        </thead>
        <draggable v-if="rules.length" v-model="rules" tag="tbody" @end="dragEnd" itemKey="uuid" :disabled="!editable" :delay="100" :delayOnTouchOnly="true">
          <template #item="{element, index}">
            <tr>
              <td>{{index + 1}}</td>
              <td>{{element.condition}}</td>
              <td v-html="element.action"/>
              <td>
                <LocalDate v-if="element.expiresAt" :date="element.expiresAt"/>
                <template v-else>영구</template>
              </td>
              <td>
                <SeedButton v-if="editable" danger @click="deleteRule(element)">삭제</SeedButton>
              </td>
            </tr>
          </template>
        </draggable>
        <tbody v-else>
        <tr>
          <td colspan="5">
            <template v-if="aclCategory === 'thread'">
              (규칙이 존재하지 않습니다. <NuxtLink :to="'#document.' + aclType">문서 ACL</NuxtLink>이 적용됩니다.)
            </template>
            <template v-else-if="aclCategory === 'document'">
              (규칙이 존재하지 않습니다. <NuxtLink :to="'#namespace.' + aclType">이름공간 ACL</NuxtLink>이 적용됩니다.)
            </template>
            <template v-else>
              (규칙이 존재하지 않습니다. 모두 거부됩니다.)
            </template>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <SeedForm v-if="editable" method="post" :action="doc_action_link(data.document, 'acl')">
      <input v-if="data.thread" type="hidden" name="thread" :value="data.thread.url">
      <input type="hidden" name="target" :value="aclCategory">
      <input type="hidden" name="aclType" :value="aclType === 'acl' ? 'ACL' : snakeToCamelCase(aclType)">

      <div class="acl-edit-group not-group">
        <label>not</label>
        <div>
          <CheckBox name="not" value="Y"/>
        </div>
      </div>
      <div class="acl-edit-group">
        <label>Condition</label>
        <div>
          <select v-model="form.conditionType" name="conditionType">
            <option value="Perm">권한</option>
            <option value="User">사용자</option>
            <option value="IP">아이피</option>
            <option value="GeoIP">GeoIP</option>
            <option value="ACLGroup">ACL그룹</option>
          </select>
          <template v-if="form.conditionType === 'Perm'">
            <select v-model="form.permissionSelect" :name="form.permissionSelect === 'custom' ? null : 'permission'">
              <option value="any">아무나</option>
              <option value="ip">아이피 사용자</option>
              <option value="member">로그인된 사용자</option>
              <option value="admin">관리자</option>
              <option value="member_signup_15days_ago">가입한지 15일 지난 사용자</option>
              <option value="document_contributor">해당 문서 기여자</option>
              <option value="contributor">위키 기여자</option>
              <option value="match_username_and_document_title">문서 제목과 사용자 이름이 일치</option>
              <option value="mobile_verified_member">모바일 인증된 사용자</option>
              <option value="auto_verified_member">자동 인증된 사용자</option>
              <option value="custom">직접 입력</option>
            </select>
            <input v-if="form.permissionSelect === 'custom'" name="permission" placeholder="permission">
          </template>
          <template v-else-if="form.conditionType === 'ACLGroup'">
            <select ref="aclGroupSelect" @change="aclGroupIndex = $event.srcElement.selectedIndex" :name="aclGroupIndex === aclGroups.length ? null : 'conditionContent'">
              <option v-for="item in aclGroups">{{item.name}}</option>
              <option>직접 입력</option>
            </select>
            <input v-if="aclGroupIndex === aclGroups.length" name="conditionContent" placeholder="ACL그룹 이름">
          </template>
          <input v-else type="text" name="conditionContent">
        </div>
      </div>
      <div class="acl-edit-group">
        <label>Action :</label>
        <div>
          <select name="actionType" v-model="form.actionType">
            <option value="Allow">허용</option>
            <option value="Deny">거부</option>
            <option value="GotoNS" v-if="aclCategory !== 'namespace'">이름공간ACL 실행</option>
            <option value="GotoOtherNS">다른 이름공간ACL 실행</option>
          </select>
          <input v-if="form.actionType === 'GotoOtherNS'" name="actionContent" placeholder="namespace">
        </div>
      </div>
      <div class="acl-edit-group">
        <label>Duration :</label>
        <div>
          <DurationSelector name="duration"/>
        </div>
      </div>
      <SeedButton submit>추가</SeedButton>
    </SeedForm>
  </div>
</template>
<script>
import draggable from 'vuedraggable'

import Common from '@/mixins/common'
import LinkTab from '@/components/linkTab'
import LocalDate from '@/components/localDate'
import SeedButton from '@/components/seedButton'
import NuxtLink from '@/components/global/nuxtLink'
import SeedForm from '@/components/form/seedForm'
import DurationSelector from '@/components/durationSelector'
import FormErrorAlert from '@/components/form/formErrorAlert'
import CheckBox from '@/components/form/checkBox'

import { isMobile } from '@/utils'

const aclNames = {
  read: '읽기',
  edit: '편집',
  move: '이동',
  delete: '삭제',
  create_thread: '토론 생성',
  write_thread_comment: '토론 댓글',
  edit_request: '편집 요청',
  acl: 'ACL'
}

export default {
  mixins: [Common],
  components: {
    CheckBox,
    FormErrorAlert,
    NuxtLink,
    SeedButton,
    LocalDate,
    LinkTab,
    draggable,
    SeedForm,
    DurationSelector
  },
  data() {
    return {
      rules: [],
      form: {
        conditionType: 'Perm',
        permissionSelect: 'any',
        actionType: ''
      },
      isMobile,
      prevAclCategory: null,
      aclGroups: [],
      aclGroupIndex: 0,
      hash: null
    }
  },
  methods: {
    updateRules() {
      const isNS = this.aclCategory === 'namespace'

      let aclKey = 'acl'
      if(isNS) aclKey = 'namespaceACL'
      else if(this.aclCategory === 'thread') aclKey = 'threadACL'

      this.rules = this.data[aclKey][this.activeAclType.index]

      if(this.prevAclCategory !== this.aclCategory)
        this.form.actionType = isNS ? 'Allow' : 'GotoNS'

      this.prevAclCategory = this.aclCategory
    },
    async dragEnd() {
      await this.internalRequestAndProcess('/action/acl/reorder', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          acls: JSON.stringify(this.rules.map(a => a.uuid))
        }).toString()
      })
    },
    async deleteRule(rule) {
      await this.internalRequestAndProcess('/action/acl/delete?acl=' + rule.uuid)
    },
    async loadACLGroups() {
      const res = await this.internalRequest('/aclgroup/groups', {
        noProgress: true
      })
      this.aclGroups = Object.values(res)
      await this.$nextTick()
      this.$refs.aclGroupSelect.selectedIndex = 0
    }
  },
  mounted() {
    this.hash = this.$route.hash
    this.updateRules()
  },
  watch: {
    $route() {
      this.hash = this.$route.hash
      this.updateRules()
    },
    data() {
      this.updateRules()
    },
    'form.conditionType'(newValue) {
      if(newValue === 'ACLGroup')
        this.loadACLGroups()
    }
  },
  computed: {
    availableAclTypes() {
      return this.aclCategory === 'thread' ? ['read', 'write_thread_comment'] : Object.keys(aclNames)
    },
    aclTypes() {
      return this.availableAclTypes.map(a => ({
        name: a,
        title: aclNames[a],
        href: `#${this.aclCategory}.${a}`,
        active: this.aclType === a,
        index: Object.keys(aclNames).indexOf(a)
      }))
    },
    activeAclType() {
      return this.aclTypes.find(a => a.name === this.aclType)
    },
    aclCategory() {
      return (this.hash || '').split('.')[0].slice(1) || (this.data.thread ? 'thread' : 'document')
    },
    aclType() {
      let defaultType = 'read'
      if(this.aclCategory === 'document')
        defaultType = 'edit'
      else if(this.aclCategory === 'thread')
        defaultType = 'write_thread_comment'

      let selected = (this.hash || '').split('.')[1]
      if(!this.availableAclTypes.includes(selected))
        selected = null

      return selected || defaultType
    },
    editable() {
      return this.data[this.aclCategory === 'namespace' ? 'editableNSACL' : 'editableACL']
    }
  }
}
</script>
<style scoped>
h4 {
  color: inherit;
  font-family: inherit;
  font-size: 1.4em;
  font-weight: 700;
  line-height: 1.1;
  margin: 1.2em 0 .8em;
}

table {
  background-color: transparent;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 1rem;
  white-space: nowrap;
}

div.acl-table, table {
  max-width: 100%;
  width: 100%;
}

div.acl-table {
  overflow-x: auto;
}

table td,table th {
  border-top: 1px solid #eceeef;
  line-height: 1.5;
  padding: .5rem .7rem;
}

table td {
  cursor: move;
}

table tr:last-of-type td {
  border-bottom: 1px solid #eceeef;
}

table th {
  border-bottom: 2px solid #eceeef;
  text-align: left;
  vertical-align: bottom;
}

div.acl-edit-group, label {
  display: inline-block;
  margin-bottom: 0;
  vertical-align: middle;
}

.not-group {
  margin-right: .25rem;
}

small {
  font-size: 70%;
  font-weight: 400;
}

table td[colspan] {
  cursor: auto;
  text-align: center;
}

.theseed-dark-mode input, .theseed-dark-mode select {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}
</style>