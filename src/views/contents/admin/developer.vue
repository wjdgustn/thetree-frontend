<template>
  <Heading
      title="업데이트"
      :folded="!data.checkUpdate && !hasUpdate">
    <p v-if="data.versionInfo.branch !== 'master'">브랜치: {{data.versionInfo.branch}}</p>
    <p>현재 버전: {{data.versionInfo.versionData.version}}</p>
    <ul>
      <li>Backend: {{data.versionInfo.commitId.slice(0, 7)}}(<LocalDate :date="data.versionInfo.commitDate"/>)</li>
      <li>Frontend: {{data.versionInfo.feCommitId.slice(0, 7)}}(<LocalDate :date="data.versionInfo.feCommitDate"/>)</li>
    </ul>
    <p>새 버전: {{data.newVersionInfo.versionData.version}}</p>
    <ul>
      <li>Backend: {{data.newVersionInfo.commitId.slice(0, 7)}}(<LocalDate :date="data.newVersionInfo.commitDate"/>)</li>
      <li>Frontend: {{data.newVersionInfo.feCommitId.slice(0, 7)}}(<LocalDate :date="data.newVersionInfo.feCommitDate"/>)</li>
    </ul>
    <p>
      마지막 업데이트 확인:
      <template v-if="data.newVersionInfo.lastUpdateCheck">
        <LocalDate :date="data.newVersionInfo.lastUpdateCheck"/> (<LocalDate :date="data.newVersionInfo.lastUpdateCheck" forceRelative/>)
      </template>
      <template v-else>
        없음
      </template>
      <template v-if="hasBEUpdate">
        <p>Backend 업데이트 내역</p>
        <ul>
          <li v-for="item in data.newCommits">
            <a :href="item.html_url" target="_blank">{{item.sha.slice(0, 7)}}</a>
            {{item.commit.message.split('\n')[0]}} - <a :href="item.author.html_url" target="_blank">{{item.commit.author.name}}</a>
          </li>
        </ul>
      </template>
      <template v-if="hasFEUpdate">
        <p>Frontend 업데이트 내역</p>
        <ul>
          <li v-for="item in data.newFECommits">
            <a :href="item.html_url" target="_blank">{{item.sha.slice(0, 7)}}</a>
            {{item.commit.message.split('\n')[0]}} - <a :href="item.author.html_url" target="_blank">{{item.commit.author.name}}</a>
          </li>
        </ul>
      </template>
    </p>
    <GeneralButton theme="primary" type="event" @click="internalGet('/admin/config/tools/checkupdate')">업데이트 확인</GeneralButton>
    <GeneralButton :disabled="!hasUpdate" theme="danger" type="event" @click="internalGet('/admin/config/tools/update')">업데이트</GeneralButton>
  </Heading>
  <Heading title="스킨">
    <SeedForm method="post" action="/admin/developer/skin/add">
      <input name="name" placeholder="name" required>
      <input name="url" placeholder="URL" required style="width:40%">
      <GeneralButton theme="primary" type="submit">추가</GeneralButton>
    </SeedForm>
    <GeneralButton theme="primary" type="event" @click="buildAllSkin">모두 빌드</GeneralButton>
    <Heading v-for="(commitId, name) in data.skinCommitIds" :title="name" :level="3" :folded="name === 'plain'" :key="name">
      <template v-if="data.skinInfos[name]">
        <p>빌드 정보</p>
        <ul>
          <li>
            Frontend: {{data.skinInfos[name].commitIds.frontend}}(<LocalDate :date="data.skinInfos[name].commitDates?.frontend ?? 0"/>)
            <template v-if="data.skinInfos[name].commitIds.frontend !== data.versionInfo.feCommitId.slice(0, 7)">
              (업데이트 필요)
            </template>
          </li>
          <li>
            Skin: {{data.skinInfos[name].commitIds.skin}}(<LocalDate :date="data.skinInfos[name].commitDates?.skin ?? 0"/>)
            <template v-if="commitId !== data.skinInfos[name].commitIds.skin">
              (업데이트 필요)
            </template>
          </li>
        </ul>
      </template>
      <template v-else>
        <p>빌드 없음</p>
      </template>
      <GeneralButton theme="primary" type="event" @click="internalPost('/admin/developer/skin/build', { name })">빌드</GeneralButton>
      <p>설치된 스킨: {{commitId}}</p>
      <GeneralButton theme="primary" type="event" @click="internalPost('/admin/developer/skin/update', { name })">업데이트</GeneralButton>
      <GeneralButton theme="danger" type="event" @click="internalPost('/admin/developer/skin/delete', { name })" :disabled="name === 'plain'">삭제</GeneralButton>
    </Heading>
  </Heading>
  <Heading title="도구">
    <GeneralButton theme="primary" type="event" @click="internalGet('/admin/config/tools/migrateopennamu')">openNAMU 데이터 마이그레이션</GeneralButton>
    <GeneralButton theme="primary" type="event" @click="internalGet('/admin/config/tools/mailtest')">이메일 전송 테스트</GeneralButton>
    <br><br>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/generateblame')">blame 없는 기록 blame 생성</GeneralButton>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/generatebacklink')">역링크/검색 문서 재생성</GeneralButton>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/generatebacklink_backlinkonly')">역링크만 재생성</GeneralButton>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/generatebacklink_searchonly')">검색 문서만 재생성</GeneralButton>
    <GeneralButton theme="danger" type="event" @click="internalGet('/admin/config/tools/resetsearchindex')">MeiliSearch 인덱스 재생성</GeneralButton>
  </Heading>
  <Heading title="Eval">
    <pre class="eval-output-parent"><code v-html="data.evalOutput"/></pre>
    <SeedForm ref="evalForm" method="post" action="/admin/developer/eval">
      <textarea rows="5" name="code" @keydown="evalKeydown"/>
      <GeneralButton theme="primary" type="submit">실행</GeneralButton>
    </SeedForm>
  </Heading>
  <Heading title="설정">
    <Heading v-for="item in data.jsonConfigs" :level="3" :title="item.name" folded>
      <SeedForm method="post" action="/admin/config/configjson">
        <input type="hidden" name="config" :value="item.name">
        <textarea name="content" rows="15" :value="item.content"/>
        <GeneralButton theme="primary" type="submit">적용</GeneralButton>
      </SeedForm>
    </Heading>
  </Heading>
  <Heading title="계정 만들기">
    <SeedForm method="post" action="/admin/developer/signup">
      <SeedFormBlock label="이메일" inputId="emailInput" name="email">
        <InputField id="emailInput" name="email" required/>
      </SeedFormBlock>
      <SeedFormBlock label="이름" inputId="nameInput" name="name">
        <InputField id="nameInput" name="name"/>
      </SeedFormBlock>
      <GeneralButton theme="primary" type="submit">URL 생성</GeneralButton>
    </SeedForm>
  </Heading>
  <Heading title="정적 파일">
    <p v-for="item in data.customStaticFiles" class="static-file">
      <a :href="item" target="_blank">{{item}}</a>
      <SeedButton danger @click="internalGet('/admin/config/tools/deletestaticfile?path=' + encodeURIComponent(item))">삭제</SeedButton>
    </p>
    <hr>
    <SeedForm method="post" action="/admin/developer/staticfile" enctype="multipart/form-data">
      <input name="path" placeholder="경로" value="/" required>
      <input name="filename" placeholder="파일 이름">
      <input type="file" name="file" required>
      <GeneralButton theme="primary" type="submit">업로드</GeneralButton>
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