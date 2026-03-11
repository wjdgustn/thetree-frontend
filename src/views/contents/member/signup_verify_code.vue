<template>
  <SeedForm :class="$style.form" method="post">
    <p>{{$t('views.signup_verify_code.message')}}</p>
    <FormErrorAlert/>
    <SeedFormBlock newStyle label="PIN" inputId="pinInput" name="pin">
      <InputField pattern="\d*" type="text" id="pinInput" name="pin"/>
    </SeedFormBlock>
    <input type="hidden" ref="cancelInput" name="cancel">
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" type="event" @click="cancelVerify">{{$t('views.signup_verify_code.cancel')}}</GeneralButton>
        <GeneralButton ref="submitButton" :class="$style.button" theme="primary" type="submit">{{$t('views.signup_verify_code.submit')}}</GeneralButton>
      </div>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import InputField from '@/components/form/inputField'
import GeneralButton from '@/components/generalButton'
import FormErrorAlert from '@/components/form/formErrorAlert'

export default {
  components: {
    FormErrorAlert,
    GeneralButton,
    InputField,
    SeedFormBlock,
    SeedForm
  },
  methods: {
    cancelVerify() {
      this.$refs.cancelInput.value = 'true'
      this.$refs.submitButton.$el.click()
    }
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>