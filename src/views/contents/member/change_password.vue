<template>
  <FormErrorAlert/>
  <SeedForm method="POST">
    <SeedFormBlock label="현재 비밀번호" inputId="oldPasswordInput" name="old_password">
      <SeedFormInput type="password" id="oldPasswordInput" name="old_password"/>
    </SeedFormBlock>
    <SeedFormBlock label="비밀번호" inputId="passwordInput" name="password">
      <SeedFormInput type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock label="비밀번호 확인" inputId="passwordConfirmInput" name="password_confirm">
      <SeedFormInput type="password" id="passwordConfirmInput" name="password_confirm"/>
    </SeedFormBlock>
    <div class="button-block">
      <SeedButton submit>비밀번호 변경</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'
import SeedButton from '@/components/seedButton'

export default {
  components: {
    SeedForm,
    FormErrorAlert,
    SeedFormBlock,
    SeedFormInput,
    SeedButton
  }
}
</script>
<style scoped>
input {
  width: calc(100% - .7rem);
}

.button-block {
  margin-top: 2rem;
  text-align: right;
}
</style>