<template>
  <FormErrorAlert/>
  <SeedForm :class="$style.form" method="post">
    <SeedFormBlock newStyle :label="$t('views.change_email.password')" inputId="passwordInput" name="password">
      <InputField type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle :label="$t('views.change_email.email')">
      <InputField readonly disabled type="text" :value="data.email"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle :label="$t('views.change_email.new_email')" inputId="emailInput" name="email">
      <InputField type="email" id="emailInput" name="email"/>
    </SeedFormBlock>
    <EmailWhitelist :domains="data.emailWhitelist"/>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" type="submit" theme="primary">{{$t('views.change_email.submit')}}</GeneralButton>
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