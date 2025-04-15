<template>
  <div>
    <label :for="inputId" v-text="label"></label>
    <slot/>
  </div>
</template>
<script>
export default {
  props: {
    inputId: String,
    label: {
      type: String,
      required: true
    }
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