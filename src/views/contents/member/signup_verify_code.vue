<template>
  <SeedForm :class="$style.form" method="post">
    <p>입력하신 전화번호로 전송된 PIN을 입력해주세요.</p>
    <FormErrorAlert/>
    <SeedFormBlock newStyle label="PIN" inputId="pinInput" name="pin">
      <InputField pattern="\d*" type="text" id="pinInput" name="pin"/>
    </SeedFormBlock>
    <input type="hidden" ref="cancelInput" name="cancel">
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" type="event" @click="cancelVerify">취소</GeneralButton>
        <GeneralButton ref="submitButton" :class="$style.button" theme="primary" type="submit">인증</GeneralButton>
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