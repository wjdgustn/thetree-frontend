<template>
  <FormErrorAlert/>
  <SeedForm :class="$style.form" method="post">
    <SeedFormBlock newStyle :label="$t('views.activate_otp.otp_label')" inputId="pinInput" name="pin">
      <PinInput name="pin"/>
    </SeedFormBlock>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" type="submit" theme="danger">{{$t('views.deactivate_otp.submit')}}</GeneralButton>
      </div>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedFormBlock from '@/components/form/seedFormBlock'
import PinInput from '@/components/form/pinInput'
import GeneralButton from '@/components/generalButton'

export default {
  components: {
    GeneralButton,
    PinInput,
    SeedForm,
    FormErrorAlert,
    SeedFormBlock
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>