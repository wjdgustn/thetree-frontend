<template>
  <SeedForm method="post">
    <SeedFormBlock label="Username" for="usernameInput" name="username">
      <SeedFormInput id="usernameInput" name="username" required/>
    </SeedFormBlock>
    <label v-if="data.hidelogPerm">
      hidelog:
      <input type="checkbox" name="hidelog" value="Y">
    </label>
    <div class="button-block">
      <SeedButton submit>확인</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedButton from '@/components/seedButton'
import SeedForm from '@/components/form/seedForm'
import SeedFormInput from '@/components/form/seedFormInput'

export default {
  components: {
    SeedFormInput,
    SeedForm,
    SeedButton,
    SeedFormBlock
  }
}
</script>
<style scoped>
@media screen and (min-width: 34rem) {
  form label {
    display: block;
  }
}

form label {
  margin-bottom: 0.5rem;
}

form div.button-block {
  margin-top: 2rem;
  text-align: right;
}
</style>