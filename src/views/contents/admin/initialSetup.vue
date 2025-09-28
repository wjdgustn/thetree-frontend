<template>
  <Heading
    title="스킨 설치"
    :folded="THETREE_SKIN_NAME !== 'plain'">
    <div :class="[$style.form, $style['form--full']]">
      <SeedFormBlock label="설치할 스킨의 Git 레포지토리 URL을 입력하세요." inputId="skinRepoInput" newStyle>
        <InputField id="skinRepoInput" v-model="repoUrl"/>
      </SeedFormBlock>
      <SeedFormBlock label="설치할 스킨의 이름을 입력하세요." inputId="skinNameInput" newStyle>
        <InputField id="skinNameInput" v-model="skinName"/>
      </SeedFormBlock>
      <div>
        <GeneralButton theme="primary" type="button" :whenClick="installSkin">설치</GeneralButton>
      </div>
    </div>
  </Heading>
  <Heading
    title="base_url 설정"
    :folded="baseUrlIsSet">
    <Alert v-if="!baseUrlIsSet" theme="danger">base_url이 현재 접속한 주소와 다릅니다.</Alert>
    <SeedForm method="post" action="/admin/config/configjson" :class="[$style.form, $style['form--full']]">
      <input type="hidden" name="config" value="publicConfig.json">
      <input type="hidden" name="key" value="base_url">
      <SeedFormBlock label="base_url" inputId="baseUrlInput" newStyle>
        <InputField id="baseUrlInput" v-model="baseUrl" name="value"/>
      </SeedFormBlock>
      <div>
        <GeneralButton theme="primary" type="submit">변경</GeneralButton>
        <GeneralButton type="button" :whenClick="setBaseUrlToOrigin">현재 접속 URL 입력</GeneralButton>
      </div>
    </SeedForm>
  </Heading>
  <Heading
      title="권장 ACLGroup 생성"
      :folded="data.hasAclGroup">
    <p>생성 그룹 목록</p>
    <ul>
      <li>차단된 사용자</li>
      <li>로그인 허용 차단</li>
      <li>경고</li>
    </ul>
    <GeneralButton theme="primary" :whenClick="addAclGroup" :disabled="data.hasAclGroup">권장 ACLGroup 생성</GeneralButton>
  </Heading>
  <Heading
    title="이름공간 ACL 설정"
    :folded="data.hasNsacl">
    <Alert theme="primary" v-if="data.namespaces.at(-1) === '삭제된사용자'">추가할 이름공간이 있다면 nsacl 설정 전 <NuxtLink to="/admin/config">config 페이지</NuxtLink>의 serverConfig.json에서 namespaces에 이름공간을 추가해주세요.</Alert>
    <p>권장 이름공간 ACL 설명</p>
    <ul>
      <li>아무나 읽기, 삭제, 토론, 편집 요청 허용</li>
      <li>차단된 사용자, 경고 보유 시 편집 차단</li>
      <li>로그인 허용 차단 지원</li>
      <li>admin에게 ACL 조정 허용</li>
      <li>사용자 문서는 본인과 관리자만 편집 허용</li>
      <li>휴지통, 운영 문서는 관리자만 열람 허용</li>
    </ul>
    <GeneralButton theme="primary" :whenClick="addNsacl" :disabled="data.hasNsacl">권장 이름공간 ACL 생성</GeneralButton>
    <GeneralButton theme="danger" :whenClick="removeAllNsacl">모든 이름공간 ACL 제거</GeneralButton>
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

export default {
  mixins: [Common],
  provide() {
    return {
      submittingSeedForm: computed(() => this.submitting)
    }
  },
  components: {
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

      baseUrl: this.$store.state.config['wiki.canonical_url']
    }
  },
  watch: {
    repoUrl() {
      this.skinName = this.repoUrl.split(/[-_]/).at(-1)
    }
  },
  computed: {
    baseUrlIsSet() {
      return this.$store.state.config['wiki.canonical_url'] === location.origin
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
      await this.internalPost('/aclgroup/group_add', {
        name: '차단된 사용자'
      })
      await this.internalPost('/aclgroup/group_add', {
        name: '로그인 허용 차단'
      })
      await this.internalPost('/aclgroup/group_add', {
        name: '경고'
      })
      await this.reloadView()
    },
    async addNsacl() {
      const aclNames = ['Read', 'Edit', 'Move', 'Delete', 'CreateThread', 'WriteThreadComment', 'EditRequest', 'ACL']
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
    },
    async removeAllNsacl() {

    }
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>