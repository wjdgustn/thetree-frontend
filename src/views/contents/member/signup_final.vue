<template>
  <SeedForm method="post">
    <SeedFormBlock label="이메일" inputId="emailInput" name="email">
      <SeedFormInput id="emailInput" name="email" readonly :value="data.email"/>
    </SeedFormBlock>
    <SeedFormBlock label="사용자 이름" inputId="usernameInput" name="username">
      <template v-if="data.name">
        <SeedFormInput id="usernameInput" :value="data.name" readonly/>
        <input type="hidden" name="username" value="special:bypass">
      </template>
      <SeedFormInput v-else id="usernameInput" name="username"/>
    </SeedFormBlock>
    <SeedFormBlock label="암호" inputId="passwordInput" name="password">
      <SeedFormInput id="passwordInput" name="password" type="password"/>
    </SeedFormBlock>
    <SeedFormBlock label="암호 확인" inputId="passwordConfirmInput" name="password_confirm">
      <SeedFormInput id="passwordConfirmInput" name="password_confirm" type="password"/>
    </SeedFormBlock>
    <SeedButton submit>가입</SeedButton>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedButton from '@/components/seedButton'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'

export default {
  components: {
    SeedForm,
    SeedButton,
    SeedFormBlock,
    SeedFormInput
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

input {
  width: calc(100% - .7rem);
}

form button {
  float: right;
  margin-top: 2rem;
  width: 5rem;
}
</style>