<template>
  <FormErrorAlert/>
  <SeedForm :class="$style.form" method="post">
    <SeedFormBlock newStyle :label="$t('views.change_email.password')" inputId="passwordInput" name="password">
      <InputField type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle :label="$t('views.change_name.name')">
      <InputField readonly disabled type="text" :value="session.account.name"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle :label="$t('views.change_name.new_name')" inputId="nameInput" name="name">
      <InputField type="text" id="nameInput" name="name"/>
    </SeedFormBlock>
    <div :class="$style.form__row">
      <p :class="$style.text">{{$t('views.change_name.cooldown')}}</p>
    </div>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" type="submit" theme="primary">{{$t('views.change_name.submit')}}</GeneralButton>
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