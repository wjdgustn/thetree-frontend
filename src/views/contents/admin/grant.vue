<template>
  <SeedForm>
    <SeedFormBlock name="username">
      Username
      <SeedFormInput name="username" required/>
    </SeedFormBlock>
    <div class="button-block">
      <SeedButton submit>확인</SeedButton>
    </div>
  </SeedForm>

  <SeedForm v-if="data.targetUser" method="post">
    <input type="hidden" name="uuid" :value="data.targetUser.uuid">

    <h3>{{data.targetUser.name}}</h3>
    <p v-for="item in data.allPermissions">
      <label :for="item + 'Input'" :class="{ 'disabled-perm': !data.grantablePermissions.includes(item) }">{{item}}</label>
      &nbsp;<input
        type="checkbox"
        :id="item + 'Input'"
        :name="item"
        value="Y"
        :checked="data.targetUser.permissions.includes(item)"
        :disabled="!data.grantablePermissions.includes(item)"
    >
    </p>
    <div class="button-block">
      <label v-if="data.hidelogPerm">
        hidelog:
        <input type="checkbox" name="hidelog" value="Y">
      </label>
      <SeedButton submit>확인</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'
import SeedButton from '@/components/seedButton'

export default {
  components: {
    SeedButton,
    SeedFormInput,
    SeedFormBlock,
    SeedForm
  }
}
</script>
<style scoped>
form input, form label {
  display: inline-block;
}

form div.button-block {
  margin-top: 2rem;
  text-align: right;
}

.disabled-perm {
  opacity: .5;
}
</style>