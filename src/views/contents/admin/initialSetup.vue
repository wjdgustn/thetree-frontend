<template>
  <Heading
    :title="$t('views.initial_setup.install_skin')"
    :folded="THETREE_SKIN_NAME !== 'plain'">
    <div :class="[$style.form, $style['form--full']]">
      <SeedFormBlock :label="$t('views.initial_setup.skin_git_repo_url')" inputId="skinRepoInput" newStyle>
        <InputField id="skinRepoInput" v-model="repoUrl"/>
      </SeedFormBlock>
      <SeedFormBlock :label="$t('views.initial_setup.skin_name')" inputId="skinNameInput" newStyle>
        <InputField id="skinNameInput" v-model="skinName"/>
      </SeedFormBlock>
      <div>
        <GeneralButton theme="primary" type="button" :whenClick="installSkin">{{$t('views.initial_setup.install')}}</GeneralButton>
      </div>
    </div>
  </Heading>
  <Heading
    :title="$t('views.initial_setup.set_base_url')"
    :folded="baseUrlIsSet">
    <Alert v-if="!baseUrlIsSet" theme="danger">{{$t('views.initial_setup.different_base_url')}}</Alert>
    <SeedForm method="post" action="/admin/config/configjson" :class="[$style.form, $style['form--full']]">
      <input type="hidden" name="config" value="publicConfig.json">
      <input type="hidden" name="key" value="base_url">
      <SeedFormBlock label="base_url" inputId="baseUrlInput" newStyle>
        <InputField id="baseUrlInput" v-model="baseUrl" name="value"/>
      </SeedFormBlock>
      <div>
        <GeneralButton theme="primary" type="submit">{{$t('views.initial_setup.change')}}</GeneralButton>
        <GeneralButton type="button" :whenClick="setBaseUrlToOrigin">{{$t('views.initial_setup.set_base_url_to_origin')}}</GeneralButton>
      </div>
    </SeedForm>
  </Heading>
  <Heading
      :title="$t('views.initial_setup.generate_default_aclgroup')"
      :folded="data.hasAclGroup">
    <p>$t('views.initial_setup.generate_group_list')</p>
    <ul>
      <li v-for="item in recommandedGroupList">{{item}}</li>
    </ul>
    <GeneralButton theme="primary" :whenClick="addAclGroup" :disabled="data.hasAclGroup">$t('views.initial_setup.generate_default_aclgroup')</GeneralButton>
  </Heading>
  <Heading
    :title="$t('views.initial_setup.setup_nsacl')"
    :folded="data.hasNsacl">
    <Alert theme="primary" v-if="data.namespaces.at(-1) === '삭제된사용자'">
      <i18next :translation="$t('views.initial_setup.add_namespace_before_nsacl')">
        <template #link>
          <NuxtLink to="/admin/config">{{$t('views.initial_setup.config_link_text')}}</NuxtLink>
        </template>
      </i18next>
    </Alert>
    <p>{{$t('views.initial_setup.default_aclgroup_guide.title')}}</p>
    <ul>
      <li>{{$t('views.initial_setup.default_aclgroup_guide.list_1')}}</li>
      <li>{{$t('views.initial_setup.default_aclgroup_guide.list_2')}}</li>
      <li>{{$t('views.initial_setup.default_aclgroup_guide.list_3')}}</li>
      <li>{{$t('views.initial_setup.default_aclgroup_guide.list_4')}}</li>
      <li>{{$t('views.initial_setup.default_aclgroup_guide.list_5')}}</li>
      <li>{{$t('views.initial_setup.default_aclgroup_guide.list_6')}}</li>
    </ul>
    <GeneralButton theme="primary" :whenClick="addNsacl" :disabled="data.hasNsacl">{{$t('views.initial_setup.generate_default_nsacl')}}</GeneralButton>
    <GeneralButton theme="danger" :whenClick="removeAllNsacl">{{$t('views.initial_setup.remove_all_nsacl')}}</GeneralButton>
  </Heading>
  <Heading
    :title="$t('views.initial_setup.branding')"
    :folded="changedWikiName || changedFrontPage">
    <p>
      <i18next :translation="$t('views.initial_setup.branding_guide')">
        <template #link>
          <NuxtLink to="/admin/config">{{$t('views.initial_setup.config_link_text')}}</NuxtLink>
        </template>
      </i18next>
    </p>
    <p><CheckMarkText :checked="changedWikiName">{{$t('views.initial_setup.change_wiki_name')}}</CheckMarkText></p>
    <p><CheckMarkText :checked="changedFrontPage">{{$t('views.initial_setup.change_frontpage')}}</CheckMarkText></p>
  </Heading>
  <Heading :title="$t('views.initial_setup.guide')">
    <p>{{$t('views.initial_setup.guide_description')}}</p>
    <p><CheckMarkText :checked="data.useEmailVerification">{{$t('views.initial_setup.use_email_verification')}}</CheckMarkText></p>
    <p><CheckMarkText :checked="data.useCaptcha">{{$t('views.initial_setup.use_captcha')}}</CheckMarkText></p>
    <p><CheckMarkText :checked="data.useSearchEngine">{{$t('views.initial_setup.use_search_engine')}}</CheckMarkText></p>
    <p><CheckMarkText :checked="data.useRedis">{{$t('views.initial_setup.use_redis')}}</CheckMarkText></p>
    <p><CheckMarkText :checked="data.useS3">{{$t('views.initial_setup.use_s3')}}</CheckMarkText></p>
  </Heading>
</template>
<script>
import { computed } from 'vue'

import Common from '@/mixins/common'
import Heading from '@/components/heading'
import SeedFormBlock from '@/components/form/seedFormBlock'
import InputField from '@/components/form/inputField'
import GeneralButton from '@/components/generalButton'
import SeedForm from '@/components/form/seedForm'
import Alert from '@/components/alert'
import CheckMarkText from '@/components/checkMarkText'

export default {
  mixins: [Common],
  provide() {
    return {
      submittingSeedForm: computed(() => this.submitting)
    }
  },
  components: {
    CheckMarkText,
    Alert,
    SeedForm,
    GeneralButton,
    InputField,
    SeedFormBlock,
    Heading
  },
  data() {
    return {
      submitting: false,
      THETREE_SKIN_NAME: __THETREE_SKIN_NAME__,

      repoUrl: '',
      skinName: '',

      baseUrl: this.$store.state.config['wiki.canonical_url'],

      recommandedGroupList: [
        this.$t('default_aclgroups.blocked_user'),
        this.$t('default_aclgroups.block_edit_request'),
        this.$t('default_aclgroups.login_allowed_block'),
        this.$t('default_aclgroups.warn_keyword')
      ]
    }
  },
  watch: {
    repoUrl() {
      this.skinName = this.repoUrl.split(/[-_]/).at(-1)
    }
  },
  computed: {
    baseUrlIsSet() {
      return !import.meta.env.SSR && this.$store.state.config['wiki.canonical_url'] === location.origin
    },
    changedWikiName() {
      return this.$store.state.config['wiki.site_name'] !== '테스트위키'
    },
    changedFrontPage() {
      return this.$store.state.config['wiki.front_page'] !== 'FrontPage'
    }
  },
  methods: {
    async reloadView() {
      await this.$store.state.components.mainView.loadView()
    },
    async internalPost(url, data, andProcess = false) {
      this.submitting = true
      const options = [url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
      }]
      if(andProcess) await this.internalRequestAndProcess(...options)
      else await this.internalRequest(...options)
      this.submitting = false
    },
    async installSkin() {
      await this.internalPost('/admin/developer/skin/add', {
        name: this.skinName,
        url: this.repoUrl
      })
      await this.internalPost('/admin/developer/skin/build', {
        name: this.skinName
      }, true)
    },
    setBaseUrlToOrigin() {
      this.baseUrl = location.origin
    },
    async addAclGroup() {
      for(let name of this.recommandedGroupList) {
        await this.internalPost('/aclgroup/group_add', {
          name
        })
      }
      await this.reloadView()
    },
    async addNsacl() {
      const aclTypes = ['Read', 'Edit', 'Move', 'Delete', 'CreateThread', 'WriteThreadComment', 'EditRequest', 'ACL']
      const addRule = async (namespace, aclType, data = {}) => await this.internalPost(this.doc_action_link({ namespace, title: 'dummy' }, 'acl'), {
        target: 'namespace',
        aclType,
        ...data,
        duration: 0
      })

      await addRule('문서', 'Read', {
        conditionType: 'Perm',
        permission: 'any',
        actionType: 'Allow'
      })

      for(let aclType of ['Edit', 'CreateThread', 'WriteThreadComment']) {
        await addRule('문서', aclType, {
          conditionType: 'ACLGroup',
          conditionContent: this.$t('default_aclgroups.warn_keyword'),
          actionType: 'Deny'
        })
        await addRule('문서', aclType, {
          conditionType: 'ACLGroup',
          conditionContent: this.$t('default_aclgroups.blocked_user'),
          actionType: 'Deny'
        })
        await addRule('문서', aclType, {
          conditionType: 'Perm',
          permission: 'member',
          actionType: 'Allow'
        })
        await addRule('문서', aclType, {
          conditionType: 'ACLGroup',
          conditionContent: this.$t('default_aclgroups.login_allowed_block'),
          actionType: 'Deny'
        })
        await addRule('문서', aclType, {
          conditionType: 'Perm',
          permission: 'any',
          actionType: 'Allow'
        })
      }

      await addRule('문서', 'Move', {
        conditionType: 'Perm',
        permission: 'member_signup_15days_ago',
        actionType: 'Allow'
      })
      await addRule('문서', 'Delete', {
        conditionType: 'Perm',
        permission: 'any',
        actionType: 'Allow'
      })

      await addRule('문서', 'EditRequest', {
        conditionType: 'ACLGroup',
        conditionContent: this.$t('default_aclgroups.warn_keyword'),
        actionType: 'Deny'
      })
      await addRule('문서', 'EditRequest', {
        conditionType: 'ACLGroup',
        conditionContent: this.$t('default_aclgroups.block_edit_request'),
        actionType: 'Deny'
      })
      await addRule('문서', 'EditRequest', {
        conditionType: 'Perm',
        permission: 'member',
        actionType: 'Allow'
      })
      await addRule('문서', 'EditRequest', {
        conditionType: 'ACLGroup',
        conditionContent: this.$t('default_aclgroups.blocked_user'),
        actionType: 'Deny'
      })
      await addRule('문서', 'EditRequest', {
        conditionType: 'Perm',
        permission: 'any',
        actionType: 'Allow'
      })

      await addRule('문서', 'ACL', {
        conditionType: 'Perm',
        permission: 'admin',
        actionType: 'Allow'
      })

      for(let namespace of this.data.namespaces) {
        for(let aclType of aclTypes) {
          if(namespace === '아이피사용자' && !['Read', 'CreateThread', 'WriteThreadComment'].includes(aclType)) continue

          if(namespace === '사용자' && aclType === 'Edit') {
            await addRule(namespace, aclType, {
              conditionType: 'Perm',
              permission: 'match_username_and_document_title',
              actionType: 'GotoOtherNS',
              actionContent: '문서'
            })
            await addRule(namespace, aclType, {
              conditionType: 'Perm',
              permission: 'admin',
              actionType: 'GotoOtherNS',
              actionContent: '문서'
            })
          }
          else {
            const isAdmin = namespace.includes(this.$t('views.initial_setup.mod_keyword')) || namespace.includes(this.$t('views.initial_setup.trash_keyword'))
            await addRule(namespace, aclType, {
              conditionType: 'Perm',
              permission: isAdmin ? 'admin' : 'any',
              actionType: 'GotoOtherNS',
              actionContent: '문서'
            })
          }
        }
      }
    },
    async removeAllNsacl() {
      await this.internalPost('/admin/initial_setup/remove_all_nsacl', {}, true)
    }
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>