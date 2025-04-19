<template>
  <SeedForm method="post">
    <FormErrorAlert/>
    <p>새로운 비밀번호를 입력해주세요</p>
    <SeedFormBlock label="비밀번호" inputId="passwordInput" name="password">
      <SeedFormInput type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock label="비밀번호 확인" inputId="passwordConfirmInput" name="password_confirm">
      <SeedFormInput type="password" id="passwordConfirmInput" name="password_confirm"/>
    </SeedFormBlock>
    <div class="buttons-block">
      <SeedButton submit>비밀번호 변경</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'
import SeedButton from '@/components/seedButton'
import FormErrorAlert from '@/components/form/formErrorAlert'

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
form {
  width: 100%;
}

@media screen and (min-width: 34rem) {
  form {
    margin: 0 auto;
    width: 28rem;
  }
}

.seed-form-input {
  margin: 0;
  width: 100%;
}

.buttons-block {
  float: right;
}

p {
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 0;
}
</style>