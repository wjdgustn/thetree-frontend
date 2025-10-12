<template>
  <SeedForm :class="$style.form" method="post">
    <SeedFormBlock newStyle label="전화번호" inputId="phoneNumberInput" name="phoneNumber">
      <SearchableSelect name="countryCode" :options="countryCodes" ref="countryCode"/>
      <ShowError tag="countryCode" :class="$style.text"/>
      <InputField pattern="\d*" type="text" id="phoneNumberInput" name="phoneNumber"/>
    </SeedFormBlock>
    <p v-if="data.verifyText" v-html="data.verifyText"/>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" theme="primary" type="submit">인증</GeneralButton>
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

export default {
  components: {
    GeneralButton,
    SearchableSelect,
    ShowError,
    InputField,
    SeedFormBlock,
    SeedForm
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
        this.$refs.countryCode.modelValue = defaultCountryCode
    }
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>