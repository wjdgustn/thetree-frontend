<template>
  <FormErrorAlert/>
  <SeedForm :class="$style.form" method="post">
    <SeedFormBlock newStyle label="비밀번호" inputId="passwordInput" name="password">
      <InputField type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle label="이메일">
      <InputField readonly disabled type="text" :value="data.email"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle label="새 이메일" inputId="emailInput" name="email">
      <InputField type="email" id="emailInput" name="email"/>
    </SeedFormBlock>
    <EmailWhitelist :domains="data.emailWhitelist"/>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" type="submit" theme="primary">이메일 변경</GeneralButton>
      </div>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedFormBlock from '@/components/form/seedFormBlock'
import InputField from '@/components/form/inputField'
import GeneralButton from '@/components/generalButton'
import EmailWhitelist from '@/components/emailWhitelist'

export default {
  components: {
    EmailWhitelist,
    GeneralButton,
    InputField,
    SeedForm,
    FormErrorAlert,
    SeedFormBlock
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>