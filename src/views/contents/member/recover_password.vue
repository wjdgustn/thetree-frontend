<template>
  <SeedForm method="POST">
    <FormErrorAlert/>
    <SeedFormBlock label="이메일" inputId="emailInput" name="email">
      <SeedFormInput type="email" id="emailInput" name="email"/>
    </SeedFormBlock>
    <div class="buttons-block">
      <SeedButton submit>찾기</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'
import SeedButton from '@/components/seedButton'
import FormErrorAlert from '@/components/form/formErrorAlert'

export default {
  components: {
    SeedForm,
    FormErrorAlert,
    SeedFormBlock,
    SeedFormInput,
    SeedButton
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

.seed-form-input {
  margin: 0;
  width: 100%;
}

.buttons-block {
  float: right;
}
</style>