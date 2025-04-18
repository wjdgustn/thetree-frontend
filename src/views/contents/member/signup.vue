<template>
  <FormErrorAlert/>
  <SeedForm method="post" captcha>
    <FlexFormBlock>
      <pre class="signup-terms" v-html="terms"></pre>
    </FlexFormBlock>
    <FlexFormBlock name="agree">
      <CheckBox name="agree">동의합니다.</CheckBox>
    </FlexFormBlock>
    <FlexFormBlock label="Email" inputId="emailInput" name="email">
      <InputField id="emailInput" name="email"/>
    </FlexFormBlock>

    <EmailWhitelist :domains="emailWhitelist"/>

    <FlexFormBlock buttons padding>
      <template #buttons>
        <GeneralButton type="submit" theme="primary">가입</GeneralButton>
      </template>
    </FlexFormBlock>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import InputField from '@/components/form/inputField'
import GeneralButton from '@/components/generalButton'
import FlexFormBlock from '@/components/form/flexFormBlock'
import CheckBox from '@/components/form/checkBox'
import EmailWhitelist from '@/components/emailWhitelist'

export default {
  components: {
    SeedForm,
    FormErrorAlert,
    FlexFormBlock,
    InputField,
    GeneralButton,
    CheckBox,
    EmailWhitelist
  },
  data() {
    return this.$store.state.viewData
  }
}
</script>
<style scoped>
form {
  margin: 0 auto;
  max-width: 40rem;
}

.signup-terms {
  appearance: none;
  background-color: var(--light-article-background-color, var(--article-background-color, #fff));
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  display: block;
  font-size: .9rem;
  line-height: 1.5;
  padding: .3rem .75rem;
  height: 30rem;
  scrollbar-width: thin;
  white-space: break-spaces;
  resize: vertical;
  margin: 0;
}
</style>