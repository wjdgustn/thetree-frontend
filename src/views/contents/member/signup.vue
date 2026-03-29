<template>
  <FormErrorAlert/>
  <SeedForm method="post">
    <FlexFormBlock>
      <Terms/>
    </FlexFormBlock>
    <FlexFormBlock name="agree">
      <CheckBox name="agree">{{agreeText}}</CheckBox>
    </FlexFormBlock>
    <FlexFormBlock :label="$t('views.signup.email')" inputId="emailInput" name="email">
      <InputField id="emailInput" name="email"/>
    </FlexFormBlock>

    <EmailWhitelist :domains="emailWhitelist"/>

    <FlexFormBlock buttons padding>
      <template #buttons>
        <GeneralButton type="submit" theme="primary">{{$t('views.signup.submit')}}</GeneralButton>
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
import Terms from '@/components/terms'

export default {
  components: {
    Terms,
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
</style>