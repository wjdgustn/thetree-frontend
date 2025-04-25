<template>
  <Heading title="설정">
    <Heading v-for="item in data.jsonConfigs" :level="3" :title="item.name">
      <SeedForm method="post" action="/admin/config/configjson">
        <input type="hidden" name="config" :value="item.name">
        <textarea name="content" rows="15" :value="item.content"/>
        <GeneralButton theme="primary" type="submit">적용</GeneralButton>
      </SeedForm>
    </Heading>

    <Heading :level="3" title="텍스트" folded>
      <SeedForm method="post" action="/admin/config/stringconfig/add">
        <input name="key" placeholder="key" required>
        <GeneralButton theme="primary" type="submit">추가</GeneralButton>
        <GeneralButton theme="primary" type="event" @click="internalGet('/admin/config/tools/fixstringconfig')">stringConfig.example.json 필드 추가</GeneralButton>
      </SeedForm>

      <SeedForm v-for="(value, key) in data.stringConfig" method="post" action="/admin/config/stringconfig">
        <input type="hidden" name="key" :value="key">
        <Heading :title="key" :level="4" folded>
          <textarea name="value" rows="10" :value="value"/>
          <GeneralButton theme="primary" type="submit">적용</GeneralButton>
          <GeneralButton theme="danger" type="event" @click="internalGet(`/admin/config/tools/removestringconfig?key=${encodeURIComponent(key)}`)">삭제</GeneralButton>
        </Heading>
      </SeedForm>
    </Heading>
  </Heading>

  <Heading title="기능 비활성화">
    <div class="wiki-content">
      <div class="wiki-table-wrap">
        <table class="wiki-table">
          <tbody>
          <tr class="table-heading">
            <td>Method</td>
            <td>Type</td>
            <td>Condition</td>
            <td>MessageType</td>
            <td>Message</td>
            <td>Action</td>
          </tr>
          
          <tr v-for="(item, index) in data.disabledFeatures">
            <td style="min-width: 100px;">{{item.method}}</td>
            <td style="min-width: 100px;">{{item.type}}</td>
            <td style="max-width: 300px; white-space: nowrap; overflow-x: auto;">{{item.condition}}</td>
            <td style="min-width: 120px;">{{item.messageType}}</td>
            <td style="min-width: 100px;">{{item.message}}</td>
            <td>
              <SeedButton danger @click="internalGet(`/admin/config/tools/deletedisabledfeature?index=${index}`)">삭제</SeedButton>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>

    <SeedForm method="post" action="/admin/config/disabledfeatures">
      <select v-model="disabledFeature.template">
        <option v-for="(item, index) in data.disabledFeaturesTemplates" :value="index">{{item.name}}</option>
      </select>
      <select name="methodField" v-model="disabledFeature.method">
        <option>ALL</option>
        <option>GET</option>
        <option>POST</option>
        <option>PUT</option>
        <option>DELETE</option>
      </select>
      <select name="type" v-model="disabledFeature.type">
        <option>string</option>
        <option>js</option>
      </select>
      <input name="condition" placeholder="condition" required v-model="disabledFeature.condition">
      <select name="messageType" v-model="disabledFeature.messageType">
        <option>flexible</option>
        <option>res.error</option>
        <option>plaintext</option>
      </select>
      <input name="message" placeholder="message" v-model="disabledFeature.message">
      <GeneralButton theme="primary" type="submit">추가</GeneralButton>
    </SeedForm>
  </Heading>

  <Heading title="openNAMU 기여 이동" folded>
    <SeedForm method="post" action="/admin/config/migratecontribution">
      <input name="from" placeholder="openNAMU 기여자 이름(O: 포함)" required>
      <input name="to" placeholder="새 기여자 이름" required>
      <GeneralButton theme="primary" type="submit">이동</GeneralButton>
    </SeedForm>
  </Heading>
</template>
<script>
import Common from '@/mixins/common'
import Heading from '@/components/heading'
import SeedForm from '@/components/form/seedForm'
import GeneralButton from '@/components/generalButton'
import SeedButton from '@/components/seedButton'

export default {
  mixins: [Common],
  components: {
    SeedButton,
    GeneralButton,
    SeedForm,
    Heading
  },
  data() {
    return {
      disabledFeature: {
        template: 0,
        method: 'ALL',
        type: 'string',
        condition: '',
        messageType: 'flexible',
        message: ''
      }
    }
  },
  watch: {
    'disabledFeature.template'() {
      const template = this.data.disabledFeaturesTemplates[this.disabledFeature.template]
      Object.assign(this.disabledFeature, template)
    }
  },
  methods: {
    async internalGet(url) {
      await this.internalRequestAndProcess(url)
    }
  }
}
</script>
<style scoped>
.button {
  margin-right: .25em;
}

.table-heading {
  font-weight: 600;
}
</style>