<template>
  <FormErrorAlert/>

  <Alert v-if="$route.query.redirected === '1' && viewData.isEditRequest && viewData.aclMessage">
    <strong>[알림]</strong>
    문서를 편집할 권한이 없기 때문에 편집 요청으로 이동되었습니다.
    <div v-html="viewData.aclMessage"></div>
  </Alert>

  <WikiContent :content="viewData.contentHtml"/>

  <template v-if="viewData.conflict">
    <Diff :title="`r${viewData.conflict.editedRev} vs 사용자 입력`" :diffHtml="viewData.conflict.diff.diffHtml"/>
    <span class="conflict-error">자동 병합에 실패했습니다! 수동으로 수정된 내역을 아래 텍스트 박스에 다시 입력해주세요.</span>
  </template>

  <SeedForm :beforeSubmit="beforeSubmit" method="post" :captcha="viewData.useCaptcha">
    <input type="hidden" v-for="(value, name) in viewData.body" :name="name" :value="value">

    <ul>
      <li v-for="tab in tabs">
        <button @click="activeTab = tab" type="button" :class="{ active: activeTab === tab }" v-text="tab.label"/>
      </li>

      <li v-if="activeTab.buttons?.length" class="editor-buttons">
        <div v-for="button in activeTab.buttons">
          <button type="button" @click="getTabComponent(activeTab.name).onButtonClick?.(button.name)" v-text="button.label"/>
        </div>
      </li>
    </ul>

    <div class="tabs">
      <div v-for="tab in tabs.filter(a => a.component)" :class="{ active: activeTab === tab }">
        <component :ref="'pluginTab_' + tab.name" v-if="tab.component" :is="tab.component"/>
      </div>
      <div :class="{ active: activeTab.name === 'raw' }">
        <textarea ref="textInput" name="text" wrap="soft" :value="viewData.content"/>
      </div>
      <div class="preview" :class="{ active: activeTab.name === 'preview', loading: !preview.content }">
        <WikiContent v-if="preview.content" :content="preview.content" :categories="preview.categories"/>
        <Loading v-else/>
      </div>
    </div>

    <div class="log-block">
      <label for="logInput">요약</label>
      <SeedFormInput id="logInput" name="log"/>
    </div>

    <label>
      <input ref="agreeCheckbox" type="checkbox" name="agree" value="Y" :checked="viewData.editagreeAgreed">
      <span v-html="viewData.editagree_text"/>
    </label>

    <BlinkRedWarn v-if="session.account.type !== 1">비로그인 상태로 편집합니다. 로그인하지 않은 상태로 문서 편집을 저장하면, 편집 역사에 본인이 사용하는 IP({{session.account.name}}) 주소 전체가 영구히 기록됩니다.</BlinkRedWarn>

    <SeedButton submit>저장</SeedButton>
  </SeedForm>
</template>
<script>
import Common from '@/mixins/common'
import { isMobile } from '@/utils'
import WikiContent from '@/components/wiki/wikiContent'
import Alert from '@/components/alert'
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedButton from '@/components/seedButton'
import SeedFormInput from '@/components/form/seedFormInput'
import Diff from '@/components/diff'
import Loading from '@/components/loading'
import BlinkRedWarn from '@/components/blinkRedWarn'

export default {
  mixins: [Common],
  components: {
    WikiContent,
    Alert,
    SeedForm,
    FormErrorAlert,
    SeedButton,
    SeedFormInput,
    Diff,
    Loading,
    BlinkRedWarn
  },
  data() {
    return {
      tabs: [
        {
          name: 'raw',
          label: 'RAW 편집'
        },
        {
          name: 'preview',
          label: '미리보기'
        }
      ],
      activeTab: null,
      initialContent: null,
      preview: {
        content: null,
        categories: null
      }
    }
  },
  created() {
    this.tabs.unshift(...this.$store.state.thetreePlugins.editor.map(a => ({
      ...a.pluginInfo,
      component: a
    })))
    let activeTabName = this.$store.state.localConfig['wiki.default_edit_mode']
    if(!this.tabs.some(a => a.name === activeTabName)) activeTabName = null
    activeTabName ??= isMobile ? 'raw' : this.tabs[0].name
    this.activeTab = this.tabs.find(a => a.name === activeTabName)

    this.initialContent = this.viewData.content

    this.$store.state.components.mainView.beforeLeave = this.beforeLeave
  },
  watch: {
    activeTab(newValue, oldValue) {
      if(!oldValue) return

      this.updateContent(oldValue)

      if(newValue.name === 'preview')
        this.loadPreview()
    }
  },
  methods: {
    beforeLeave() {
      this.updateContent()
      if(this.viewData.content !== this.initialContent)
        return confirm('변경된 사항이 저장되지 않았습니다.')
      return true
    },
    getTabComponent(name) {
      return this.$refs['pluginTab_' + name]?.[0]
    },
    updateContent(from) {
      from ??= this.activeTab

      if(from.name === 'raw')
        this.viewData.content = this.$refs.textInput.value

      const fromComponent = this.getTabComponent(from.name)
      const activeComponent = this.getTabComponent(this.activeTab.name)

      if(fromComponent) this.viewData.content = fromComponent.getValue()
      activeComponent?.setValue(this.viewData.content)
    },
    async beforeSubmit() {
      if(!this.$refs.agreeCheckbox.checked) {
        alert('수정하기 전에 먼저 문서 배포 규정에 동의해 주세요.')
        return false
      }

      this.updateContent()
      await this.$nextTick()
    },
    async loadPreview() {
      this.preview.content = null
      this.preview.categories = null

      const json = await this.internalRequest(this.doc_action_link(this.data.document, 'preview'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          content: this.viewData.content
        }).toString(),
        noProgress: true
      })

      this.preview.content = json.contentHtml
      this.preview.categories = json.categories
    }
  }
}
</script>
<style scoped>
span.conflict-error {
  color: red;
  font-weight: 700;
  padding-bottom: 5px;
  padding-top: 5px;
}

form ul {
  border-bottom: 1px solid #ddd;
  height: 36px;
  list-style: none;
  margin-bottom: 0;
  margin-top: 0;
  padding-left: 0;
}

.theseed-dark-mode form ul {
  border-color: #383b40;
}

form li {
  float: left;
  margin-bottom: -1px;
}

form li+li {
  margin-left: .2rem;
}

form li button {
  background: none;
  border: 1px solid transparent;
  border-radius: .25rem .25rem 0 0;
  cursor: pointer;
  display: block;
  font-size: .9rem;
  padding: .5em 1em;
}

.theseed-dark-mode form li button {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

form li button.active {
  background-color: #fff;
  border-color: #ddd #ddd transparent;
  color: #55595c;
}

.theseed-dark-mode form li button.active {
  background-color: #383b40;
}

form div.tabs {
  border: 1px solid #ddd;
  border-top: none;
}

.theseed-dark-mode form div.tabs {
  border-color: #383b40;
}

form div.tabs>div {
  display: none;
}

form div.tabs>div.active {
  display: block;
}

form div.tabs>div.preview {
  height: 30rem;
  overflow: auto;
  padding: 10px;
}

form div.preview.loading {
  background-color: #ccc;
  text-align: center;
}

.log-block {
  margin-bottom: 15px;
  margin-top: 1rem;
}

form label {
  display: inline-block;
  margin-bottom: .5rem;
}

form div.log-block input {
  border-radius: 0;
  font-size: .9rem;
  line-height: 1.5;
  padding: .25rem .5rem;
  width: 100%;
  margin: 0;
}

form input[type=checkbox] {
  color: inherit;
  font: inherit;
  margin: 0 .25rem 0 0;
  padding: 0;
}

form>button {
  float: right;
  margin-bottom: 2rem;
  width: 100px;
}

form textarea {
  border: none;
  border-radius: 0;
  color: #55595c;
  font-family: inherit;
  font-size: .9rem;
  height: 30rem;
  margin: 0;
  padding: .25rem .5rem;
  resize: vertical;
  width: 100%;
}

form li.editor-buttons {
  float: right;
}

form li.editor-buttons>div {
  display: inline-block;
}
</style>