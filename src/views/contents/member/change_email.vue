<template>
  <FormErrorAlert/>
  <SeedForm method="post">
    <SeedFormBlock label="비밀번호" inputId="passwordInput" name="password">
      <SeedFormInput type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock label="이메일">
      <p v-text="$store.state.viewData.email"></p>
    </SeedFormBlock>
    <SeedFormBlock label="새 이메일" inputId="emailInput" name="email">
      <SeedFormInput type="email" id="emailInput" name="email"/>
    </SeedFormBlock>
    <div class="button-block">
      <SeedButton submit>이메일 변경</SeedButton>
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