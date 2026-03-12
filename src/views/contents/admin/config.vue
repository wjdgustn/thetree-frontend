<template>
  <Heading :title="$t('views.config.config')">
    <Heading v-for="item in data.jsonConfigs" :level="3" :title="item.name">
      <SeedForm method="post" action="/admin/config/configjson">
        <input type="hidden" name="config" :value="item.name">
        <textarea name="content" rows="15" :value="item.content"/>
        <GeneralButton theme="primary" type="submit">{{$t('views.config.apply')}}</GeneralButton>
      </SeedForm>
    </Heading>

    <Heading :level="3" :title="$t('views.config.text')" folded>
      <SeedForm method="post" action="/admin/config/stringconfig/add">
        <input name="key" placeholder="key" required>
        <GeneralButton theme="primary" type="submit">{{$t('views.config.add')}}</GeneralButton>
        <GeneralButton theme="primary" type="event" @click="internalGet('/admin/config/tools/fixstringconfig')">{{$t('views.config.add_string_field')}}</GeneralButton>
      </SeedForm>

      <SeedForm v-for="(value, key) in data.stringConfig" :key="key" method="post" action="/admin/config/stringconfig">
        <input type="hidden" name="key" :value="key">
        <Heading :title="key" :level="4" folded>
          <textarea name="value" rows="10" :value="value"/>
          <GeneralButton theme="primary" type="submit">{{$t('views.config.apply')}}</GeneralButton>
          <GeneralButton theme="danger" type="event" @click="internalGet(`/admin/config/tools/removestringconfig?key=${encodeURIComponent(key)}`)">{{$t('views.config.delete')}}</GeneralButton>
        </Heading>
      </SeedForm>
    </Heading>
  </Heading>

  <Heading :title="$t('views.config.disable_feature')">
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
              <SeedButton danger @click="internalGet(`/admin/config/tools/deletedisabledfeature?index=${index}`)">{{$t('views.config.delete')}}</SeedButton>
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
      <GeneralButton theme="primary" type="submit">{{$t('views.config.add')}}</GeneralButton>
    </SeedForm>
  </Heading>

  <Heading :title="$t('views.config.move_opennamu_contributions')" folded>
    <SeedForm method="post" action="/admin/config/migratecontribution">
      <input name="from" :placeholder="$t('views.config.move_opennamu_from')" required>
      <input name="to" :placeholder="$t('views.config.move_opennamu_to')" required>
      <GeneralButton theme="primary" type="submit">{{$t('views.config.move_opennamu_submit')}}</GeneralButton>
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