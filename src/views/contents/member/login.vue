<template>
  <FormErrorAlert/>
  <SeedForm method="post" captcha>
    <FlexFormBlock label="Email" name="email" inputId="emailInput">
      <InputField id="emailInput" name="email"/>
    </FlexFormBlock>
    <FlexFormBlock label="Password" name="password" inputId="passwordInput">
      <InputField id="passwordInput" name="password" type="password"/>
    </FlexFormBlock>
    <FlexFormBlock flexStart>
      <NuxtLink to="/member/recover_password">비밀번호를 잊으셨나요?</NuxtLink>
    </FlexFormBlock>
    <FlexFormBlock buttons padding>
      <CheckBox name="autologin">자동 로그인</CheckBox>
      <template #buttons>
        <GeneralButton href="/member/signup">계정 만들기</GeneralButton>
        <GeneralButton type="submit" theme="primary">로그인</GeneralButton>
      </template>
    </FlexFormBlock>

    <input type="hidden" name="redirect" :value="$route.query.redirect">
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import FlexFormBlock from '@/components/form/flexFormBlock'
import InputField from '@/components/form/inputField'
import NuxtLink from '@/components/global/nuxtLink'
import CheckBox from '@/components/form/checkBox'
import GeneralButton from '@/components/generalButton'

export default {
  components: {
    SeedForm,
    FormErrorAlert,
    FlexFormBlock,
    InputField,
    NuxtLink,
    CheckBox,
    GeneralButton
  }
}
</script>
<style scoped>
form {
  margin: 0 auto;
  max-width: 28rem;
}

.buttons-group {
  align-items: center;
  column-gap: .5rem;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
}
</style>