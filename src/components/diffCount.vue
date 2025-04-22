<template>
  <span
      :class="{ plus: count > 0, minus: count < 0 }"
      v-text="countStr"
  />
</template>
<script>
export default {
  props: {
    count: {
      type: Number,
      required: true,
      default: 0
    }
  },
  computed: {
    countStr() {
      return this.count > 0 ? '+' + this.count : this.count
    }
  }
}
</script>
<style scoped>
span {
  color: gray;
}

span.plus {
  color: green;
}

span.minus {
  color: red;
}
</style>