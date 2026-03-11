<template>
  <FormErrorAlert/>
  <SeedForm :class="$style.form" method="post">
    <SeedFormBlock newStyle :label="$t('views.change_password.current_password')" inputId="oldPasswordInput" name="old_password">
      <InputField type="password" id="oldPasswordInput" name="old_password"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle :label="$t('views.change_password.new_password')" inputId="passwordInput" name="password">
      <InputField type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle :label="$t('views.change_password.confirm_password')" inputId="passwordConfirmInput" name="password_confirm">
      <InputField type="password" id="passwordConfirmInput" name="password_confirm"/>
    </SeedFormBlock>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" type="submit" theme="primary">{{$t('views.change_password.submit')}}</GeneralButton>
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

export default {
  components: {
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