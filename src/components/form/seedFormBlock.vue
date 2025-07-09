<template>
  <div :class="{ [$style.form__row]: newStyle }">
    <label v-if="label" :for="inputId">{{label}}</label>
    <slot/>
    <ShowError v-if="name" :tag="name" :class="{ [$style.text]: newStyle }"/>
  </div>
</template>
<script>
import ShowError from '@/components/showError'

export default {
  components: {
    ShowError
  },
  props: {
    inputId: String,
    name: String,
    label: String,
    newStyle: Boolean
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>
<style scoped>
div {
  margin-bottom: 15px;
}

@media screen and (min-width: 34rem) {
  div label {
    display: block;
  }
}

div label {
  margin-bottom: .5rem;
}
</style>