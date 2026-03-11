<template>
  <p v-if="data.note">{{$t('views.signup_verify.message', { note: data.note })}}</p>
  <FormErrorAlert/>
  <SeedForm :class="$style.form" method="post">
    <SeedFormBlock newStyle :label="$t('views.signup_verify.phone')" inputId="phoneNumberInput" name="phoneNumber">
      <SearchableSelect name="countryCode" :options="countryCodes" v-model="countryCode"/>
      <ShowError tag="countryCode" :class="$style.text"/>
      <InputField pattern="\d*" type="text" id="phoneNumberInput" name="phoneNumber"/>
    </SeedFormBlock>
    <p v-if="data.verifyText" v-html="data.verifyText" class="verify-text"/>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" theme="primary" type="submit">{{$t('views.signup_verify.submit')}}</GeneralButton>
      </div>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import InputField from '@/components/form/inputField'
import ShowError from '@/components/showError'
import SearchableSelect from '@/components/SearchableSelect'
import GeneralButton from '@/components/generalButton'
import FormErrorAlert from '@/components/form/formErrorAlert'

export default {
  components: {
    FormErrorAlert,
    GeneralButton,
    SearchableSelect,
    ShowError,
    InputField,
    SeedFormBlock,
    SeedForm
  },
  data() {
    return {
      countryCode: null
    }
  },
  mounted() {
    this.init()
  },
  watch: {
    $route() {
      this.init()
    }
  },
  computed: {
    countryCodes() {
      return this.data.countryCodes.map(code => ({
        label: `${code.name} (+${code.dialCode})`,
        value: code.code
      }))
    }
  },
  methods: {
    init() {
      const defaultCountryCode = this.countryCodes.find(a => a.value === this.data.countryCode)
      if(defaultCountryCode)
        this.countryCode = defaultCountryCode
    }
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>
<style scoped>
.verify-text {
  white-space: break-spaces;
}
</style>