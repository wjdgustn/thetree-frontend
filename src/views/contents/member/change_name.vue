<template>
  <FormErrorAlert/>
  <SeedForm :class="$style.form" method="post">
    <SeedFormBlock newStyle label="비밀번호" inputId="passwordInput" name="password">
      <InputField type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle label="이름">
      <InputField readonly disabled type="text" :value="session.account.name"/>
    </SeedFormBlock>
    <SeedFormBlock newStyle label="새 이름" inputId="nameInput" name="name">
      <InputField type="text" id="nameInput" name="name"/>
    </SeedFormBlock>
    <div :class="$style.form__row">
      <p :class="$style.text">30일마다 변경할 수 있습니다.</p>
    </div>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" type="submit" theme="primary">이름 변경</GeneralButton>
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