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
  --input-color: var(--light-text-color, var(--text-color, #212529));
  --input-background-color: #fcfcfb;
  --input-border-color: #dfe1e2;
  appearance: none;
  background-color: var(--input-background-color);
  border: 1px solid var(--input-border-color);
  border-radius: 4px;
  color: var(--input-color);
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

.theseed-dark-mode .signup-terms {
  --input-color: var(--dark-text-color, var(--text-color, #e0e0e0));
  --input-background-color: #2d2e2f;
  --input-border-color: #5c5c5c;
}
</style>