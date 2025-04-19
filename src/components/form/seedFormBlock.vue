<template>
  <div>
    <label v-if="label" :for="inputId" v-text="label"></label>
    <slot/>
    <p v-if="fieldError" v-text="fieldError.msg"></p>
  </div>
</template>
<script>
export default {
  props: {
    inputId: String,
    name: String,
    label: String
  },
  computed: {
    fieldError() {
      return this.name && this.$store.state.viewData.fieldErrors?.[this.name]
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

p {
  color: red;
}
</style>