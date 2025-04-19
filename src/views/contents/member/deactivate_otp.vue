<template>
  <FormErrorAlert/>
  <SeedForm method="post">
    <SeedFormBlock label="PIN" inputId="pinInput" name="pin">
      <SeedFormInput type="text" id="pinInput" name="pin" maxlength="6"/>
    </SeedFormBlock>
    <div class="button-block">
      <SeedButton danger>비활성화</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'
import SeedButton from '@/components/seedButton'

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
  width: 100%
}

@media screen and (min-width: 34rem) {
  form {
    margin:0 auto;
    width: 28rem
  }
}

input {
  width: calc(100% - .7rem);
}

.button-block {
  margin-top: 2rem;
  text-align: right;
}
</style>