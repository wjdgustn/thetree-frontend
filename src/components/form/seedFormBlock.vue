<template>
  <div>
    <label v-if="label" :for="inputId">{{label}}</label>
    <slot/>
    <ShowError v-if="name" :tag="name"/>
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
    label: String
  }
}
</script>
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