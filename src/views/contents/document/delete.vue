<template>
  <SeedForm method="post" :beforeSubmit="beforeSubmit">
    <SeedFormBlock :label="logLabel" inputId="logInput" name="log">
      <input v-model="log" type="text" id="logInput" name="log">
    </SeedFormBlock>
    <label>
      <input ref="agreeCheckbox" type="checkbox" name="agree" value="Y">
      {{$t('views.delete.agree')}}
    </label>
    <p>
      <b>
        <i18next :translation="$t('views.delete.notify')">
          <template #nbsp>
            &nbsp;
          </template>
        </i18next>
      </b>
      <i18next :translation="$t('views.delete.notify_content')">
        <template #moveLink>
          <NuxtLink :to="doc_action_link(data.document, 'move')">{{$t('views.delete.move_link_text')}}</NuxtLink>
        </template>
      </i18next>
    </p>
    <IpWarn/>
    <div class="button-block">
      <SeedButton danger>{{$t('views.delete.submit')}}</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import NuxtLink from '@/components/global/nuxtLink'
import SeedButton from '@/components/seedButton'
import IpWarn from '@/components/ipWarn'

export default {
  mixins: [Common],
  components: {
    IpWarn,
    SeedButton,
    NuxtLink,
    SeedFormBlock,
    SeedForm
  },
  data() {
    return {
      log: ''
    }
  },
  computed: {
    logLabel() {
      let result = this.$t('views.delete.log_label')
      if(this.log)
        result += ` (${this.log.length}/255)`
      return result
    }
  },
  methods: {
    beforeSubmit() {
      if(!this.$refs.agreeCheckbox.checked) {
        alert(this.$t('views.delete.check_agree'))
        return false
      }
    }
  }
}
</script>
<style scoped>
input {
  font-size: .9rem;
}

input[type=text] {
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  line-height: 1.5;
  margin: 0;
  padding: .25rem .5rem;
  width: 100%;
}

input[type=text][readonly] {
  background-color: #eceeef;
  opacity: 1;
}

.theseed-dark-mode input[type=text] {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

input[type=checkbox] {
  line-height: inherit;
  margin: 0;
  padding: 0;
}

label {
  display: inline-block;
  margin-bottom: .5rem;
}

p {
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 0;
}

div.button-block {
  float: right;
}
</style>