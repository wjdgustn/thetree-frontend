<template>
  <FormErrorAlert/>
  <LinkTab
      tab
      :items="[
          ...(data.thread ? [{
            title: $t('views.acl.tabs.thread'),
            href: '#thread',
            active: aclCategory === 'thread'
          }] : []),
          {
            title: $t('views.acl.tabs.document'),
            href: '#document',
            active: aclCategory === 'document'
          },
          {
            title: $t('views.acl.tabs.namespace'),
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
                <template v-else>{{$t('views.acl.forever')}}</template>
              </td>
              <td>
                <SeedButton v-if="editable" danger @click="deleteRule(element)">{{$t('views.acl.delete')}}</SeedButton>
              </td>
            </tr>
          </template>
        </draggable>
        <tbody v-else>
        <tr>
          <td colspan="5">
            <template v-if="aclCategory === 'thread'">
              <i18next :translation="$t('views.acl.no_rule')">
                <template #tabLink>
                  <NuxtLink :to="'#document.' + aclType">{{$t('views.acl.tabs.document')}}</NuxtLink>
                </template>
              </i18next>
            </template>
            <template v-else-if="aclCategory === 'document'">
              <i18next :translation="$t('views.acl.no_rule')">
                <template #tabLink>
                  <NuxtLink :to="'#namespace.' + aclType">{{$t('views.acl.tabs.namespace')}}</NuxtLink>
                </template>
              </i18next>
            </template>
            <template v-else>
              {{$t('views.acl.namespace_no_rule')}}
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
            <option value="Perm">{{$t('views.acl.conditions.perm')}}</option>
            <option value="User">{{$t('views.acl.conditions.user')}}</option>
            <option value="IP">{{$t('views.acl.conditions.ip')}}</option>
            <option value="GeoIP">{{$t('views.acl.conditions.geoip')}}</option>
            <option value="ACLGroup">{{$t('views.acl.conditions.aclgroup')}}</option>
          </select>
          <template v-if="form.conditionType === 'Perm'">
            <select v-model="form.permissionSelect" :name="form.permissionSelect === 'custom' ? null : 'permission'">
              <option value="any">{{$t('permissions.any')}}</option>
              <option value="ip">{{$t('permissions.ip')}}</option>
              <option value="member">{{$t('permissions.member')}}</option>
              <option value="admin">{{$t('permissions.admin')}}</option>
              <option value="member_signup_15days_ago">{{$t('permissions.member_signup_15days_ago')}}</option>
              <option value="document_contributor">{{$t('permissions.document_contributor')}}</option>
              <option value="contributor">{{$t('permissions.contributor')}}</option>
              <option value="match_username_and_document_title">{{$t('permissions.match_username_and_document_title')}}</option>
              <option value="mobile_verified_member">{{$t('permissions.mobile_verified_member')}}</option>
              <option value="auto_verified_member">{{$t('permissions.auto_verified_member')}}</option>
              <option value="custom">{{$t('views.acl.custom')}}</option>
            </select>
            <input v-if="form.permissionSelect === 'custom'" name="permission" placeholder="permission">
          </template>
          <template v-else-if="form.conditionType === 'ACLGroup'">
            <select ref="aclGroupSelect" @change="aclGroupIndex = $event.srcElement.selectedIndex" :name="aclGroupIndex === aclGroups.length ? null : 'conditionContent'">
              <option v-for="item in aclGroups">{{item.name}}</option>
              <option>{{$t('views.acl.custom')}}</option>
            </select>
            <input v-if="aclGroupIndex === aclGroups.length" name="conditionContent" :placeholder="$t('views.acl.aclgroup_name')">
          </template>
          <input v-else type="text" name="conditionContent">
        </div>
      </div>
      <div class="acl-edit-group">
        <label>Action :</label>
        <div>
          <select name="actionType" v-model="form.actionType">
            <option value="Allow">{{$t('views.acl.actions.allow')}}</option>
            <option value="Deny">{{$t('views.acl.actions.deny')}}</option>
            <option value="GotoNS" v-if="aclCategory !== 'namespace'">{{$t('views.acl.actions.gotons')}}</option>
            <option value="GotoOtherNS">{{$t('views.acl.actions.gotootherns')}}</option>
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
      <SeedButton submit>{{$t('views.acl.add')}}</SeedButton>
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
    aclNames() {
      return {
        read: this.$t('acl.types.0'),
        edit: this.$t('acl.types.1'),
        move: this.$t('acl.types.2'),
        delete: this.$t('acl.types.3'),
        create_thread: this.$t('acl.types.4'),
        write_thread_comment: this.$t('acl.types.5'),
        edit_request: this.$t('acl.types.6'),
        acl: 'ACL'
      }
    },
    availableAclTypes() {
      return this.aclCategory === 'thread' ? ['read', 'write_thread_comment'] : Object.keys(this.aclNames)
    },
    aclTypes() {
      return this.availableAclTypes.map(a => ({
        name: a,
        title: this.aclNames[a],
        href: `#${this.aclCategory}.${a}`,
        active: this.aclType === a,
        index: Object.keys(this.aclNames).indexOf(a)
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