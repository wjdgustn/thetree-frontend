<template>
  <p v-if="error" v-text="error.msg"/>
</template>
<script>
export default {
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  computed: {
    error() {
      return this.tag && this.$store.state.viewData.fieldErrors?.[this.tag]
    }
  }
}
</script>
<style scoped>
p {
  color: red;
}
</style>