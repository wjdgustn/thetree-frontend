<template>
  <Heading
      :title="$t('views.developer.update')"
      :folded="!data.checkUpdate && !hasUpdate">
    <p v-if="data.versionInfo.branch !== 'master'">{{$t('views.developer.branch')}}: {{data.versionInfo.branch}}</p>
    <p>{{$t('views.developer.current_version')}}: {{data.versionInfo.versionData.version}}</p>
    <ul>
      <li>Backend: {{data.versionInfo.commitId.slice(0, 7)}}(<LocalDate :date="data.versionInfo.commitDate"/>)</li>
      <li>Frontend: {{data.versionInfo.feCommitId.slice(0, 7)}}(<LocalDate :date="data.versionInfo.feCommitDate"/>)</li>
    </ul>
    <p>{{$t('views.developer.new_version')}}: {{data.newVersionInfo.versionData.version}}</p>
    <ul>
      <li>Backend: {{data.newVersionInfo.commitId.slice(0, 7)}}(<LocalDate :date="data.newVersionInfo.commitDate"/>)</li>
      <li>Frontend: {{data.newVersionInfo.feCommitId.slice(0, 7)}}(<LocalDate :date="data.newVersionInfo.feCommitDate"/>)</li>
    </ul>
    <p>
      {{$t('views.developer.last_update_check')}}:
      <template v-if="data.newVersionInfo.lastUpdateCheck">
        <LocalDate :date="data.newVersionInfo.lastUpdateCheck"/> (<LocalDate :date="data.newVersionInfo.lastUpdateCheck" forceRelative/>)
      </template>
      <template v-else>
        {{$t('views.developer.no_update_check')}}
      </template>
      <template v-if="hasBEUpdate">
        <p>{{$t('views.developer.backend_update_log')}}</p>
        <ul>
          <li v-for="item in data.newCommits">
            <a :href="item.html_url" target="_blank">{{item.sha.slice(0, 7)}}</a>
            {{item.commit.message.split('\n')[0]}} - <a :href="item.author.html_url" target="_blank">{{item.commit.author.name}}</a>
          </li>
        </ul>
      </template>
      <template v-if="hasFEUpdate">
        <p>{{$t('views.developer.front_update_log')}}</p>
        <ul>
          <li v-for="item in data.newFECommits">
            <a :href="item.html_url" target="_blank">{{item.sha.slice(0, 7)}}</a>
            {{item.commit.message.split('\n')[0]}} - <a :href="item.author.html_url" target="_blank">{{item.commit.author.name}}</a>
          </li>
        </ul>
      </template>
    </p>
    <GeneralButton theme="primary" type="event" @click="internalGet('/admin/config/tools/checkupdate')">{{$t('views.developer.check_update')}}</GeneralButton>
    <GeneralButton :disabled="!hasUpdate" theme="danger" type="event" @click="internalGet('/admin/config/tools/update')">{{$t('views.developer.do_update')}}</GeneralButton>
  </Heading>
  <Heading :title="$t('views.developer.skin')">
    <SeedForm method="post" action="/admin/developer/skin/add">
      <input name="name" placeholder="name" required>
      <input name="url" placeholder="URL" required style="width:40%">
      <GeneralButton theme="primary" type="submit">{{$t('views.developer.add')}}</GeneralButton>
    </SeedForm>
    <GeneralButton theme="primary" type="event" @click="buildAllSkin">{{$t('views.developer.build_all')}}</GeneralButton>
    <Heading v-for="(commitId, name) in data.skinCommitIds" :title="name" :level="3" :folded="name === 'plain'" :key="name">
      <template v-if="data.skinInfos[name]">
        <p>{{$t('views.developer.build_info')}}</p>
        <ul>
          <li>
            Frontend: {{data.skinInfos[name].commitIds.frontend}}(<LocalDate :date="data.skinInfos[name].commitDates?.frontend ?? 0"/>)
            <template v-if="data.skinInfos[name].commitIds.frontend !== data.versionInfo.feCommitId.slice(0, 7)">
              ({{$t('views.developer.need_update')}})
            </template>
          </li>
          <li>
            Skin: {{data.skinInfos[name].commitIds.skin}}(<LocalDate :date="data.skinInfos[name].commitDates?.skin ?? 0"/>)
            <template v-if="commitId !== data.skinInfos[name].commitIds.skin">
              ({{$t('views.developer.need_update')}})
            </template>
          </li>
        </ul>
      </template>
      <template v-else>
        <p>{{$t('views.developer.no_build')}}</p>
      </template>
      <GeneralButton theme="primary" type="event" @click="internalPost('/admin/developer/skin/build', { name })">{{$t('views.developer.build')}}</GeneralButton>
      <p>{{$t('views.developer.installed_skin')}}: {{commitId}}</p>
      <GeneralButton theme="primary" type="event" @click="internalPost('/admin/developer/skin/update', { name })">{{$t('views.developer.do_update')}}</GeneralButton>
      <GeneralButton theme="danger" type="event" @click="internalPost('/admin/developer/skin/delete', { name })" :disabled="name === 'plain'">{{$t('views.developer.delete')}}</GeneralButton>
    </Heading>
  </Heading>
  <Heading :title="$t('views.developer.tools.title')">
    <GeneralButton theme="primary" type="event" @click="internalGet('/admin/config/tools/migrateopennamu')">{{$t('views.developer.tools.migrateopennamu')}}</GeneralButton>
    <GeneralButton theme="primary" type="event" @click="internalGet('/admin/config/tools/mailtest')">{{$t('views.developer.tools.mailtest')}}</GeneralButton>
    <br><br>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/generateblame')">{{$t('views.developer.tools.generateblame')}}</GeneralButton>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/generatebacklink')">{{$t('views.developer.tools.generatebacklink')}}</GeneralButton>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/generatebacklink_backlinkonly')">{{$t('views.developer.tools.generatebacklink_backlinkonly')}}</GeneralButton>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/generatebacklink_searchonly')">{{$t('views.developer.tools.generatebacklink_searchonly')}}</GeneralButton>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/resetsearchindex')">{{$t('views.developer.tools.resetsearchindex')}}</GeneralButton>
  </Heading>
  <Heading title="Eval">
    <pre class="eval-output-parent"><code v-html="data.evalOutput"/></pre>
    <SeedForm ref="evalForm" method="post" action="/admin/developer/eval">
      <textarea rows="5" name="code" @keydown="evalKeydown"/>
      <GeneralButton theme="primary" type="submit">{{$t('views.developer.execute')}}</GeneralButton>
    </SeedForm>
  </Heading>
  <Heading :title="$t('views.config.config')">
    <Heading v-for="item in data.jsonConfigs" :level="3" :title="item.name" folded>
      <SeedForm method="post" action="/admin/config/configjson">
        <input type="hidden" name="config" :value="item.name">
        <textarea name="content" rows="15" :value="item.content"/>
        <GeneralButton theme="primary" type="submit">{{$t('views.config.apply')}}</GeneralButton>
      </SeedForm>
    </Heading>
  </Heading>
  <Heading :title="$t('views.developer.signup')">
    <SeedForm method="post" action="/admin/developer/signup">
      <SeedFormBlock :label="$t('views.developer.email')" inputId="emailInput" name="email">
        <InputField id="emailInput" name="email" required/>
      </SeedFormBlock>
      <SeedFormBlock :label="$t('views.developer.username')" inputId="nameInput" name="name">
        <InputField id="nameInput" name="name"/>
      </SeedFormBlock>
      <GeneralButton theme="primary" type="submit">{{$t('views.developer.generate_url')}}</GeneralButton>
    </SeedForm>
  </Heading>
  <Heading :title="$t('views.developer.static_file')">
    <p v-for="item in data.customStaticFiles" class="static-file">
      <a :href="item" target="_blank">{{item}}</a>
      <SeedButton danger @click="internalGet('/admin/config/tools/deletestaticfile?path=' + encodeURIComponent(item))">{{$t('views.developer.delete')}}</SeedButton>
    </p>
    <hr>
    <SeedForm method="post" action="/admin/developer/staticfile" enctype="multipart/form-data">
      <input name="path" :placeholder="$t('views.developer.path')" value="/" required>
      <input name="filename" :placeholder="$t('views.developer.filename')">
      <input type="file" name="file" required>
      <GeneralButton theme="primary" type="submit">{{$t('views.developer.upload')}}</GeneralButton>
    </SeedForm>
  </Heading>
</template>
<script>
import { computed } from 'vue'

import Common from '@/mixins/common'
import Heading from '@/components/heading'
import LocalDate from '@/components/localDate'
import GeneralButton from '@/components/generalButton'
import SeedForm from '@/components/form/seedForm'
import SeedButton from '@/components/seedButton'
import InputField from '@/components/form/inputField'
import SeedFormBlock from '@/components/form/seedFormBlock'
import CheckBox from '@/components/form/checkBox'

export default {
  mixins: [Common],
  provide() {
    return {
      submittingSeedForm: computed(() => this.submitting)
    }
  },
  components: {
    CheckBox,
    SeedFormBlock,
    InputField,
    SeedButton,
    SeedForm,
    GeneralButton,
    LocalDate,
    Heading
  },
  data() {
    return {
      submitting: false
    }
  },
  computed: {
    hasBEUpdate() {
      return this.data.versionInfo.commitId !== this.data.newVersionInfo.commitId
    },
    hasFEUpdate() {
      return this.data.versionInfo.feCommitId !== this.data.newVersionInfo.feCommitId
    },
    hasUpdate() {
      return this.hasBEUpdate || this.hasFEUpdate
    }
  },
  methods: {
    async internalGet(url) {
      this.submitting = true
      await this.internalRequestAndProcess(url)
      this.submitting = false
    },
    async internalPost(url, data) {
      this.submitting = true
      await this.internalRequestAndProcess(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(data).toString()
      })
      this.submitting = false
    },
    buildAllSkin() {
      this.internalPost('/admin/developer/skin/build', {
        name: Object.keys(this.data.skinCommitIds).filter(a => a !== 'plain')
      })
    },
    evalKeydown(e) {
      if(!e.shiftKey && e.key === 'Enter') {
        e.preventDefault()
        this.$refs.evalForm.$el.requestSubmit()
      }
    }
  }
}
</script>
<style scoped>
a[role=button], span[role=button], button {
  margin-right: .25em;
}

.eval-output-parent {
  width: 100%;
  height: 200px;
  resize: vertical;
}

pre {
  overflow: scroll;
}

pre code {
  background: none;
  border: none;
  padding: 0;
}

.static-file {
  width: 50%;
}

.static-file button {
  float: right;
}
</style>