<template>
  <form v-bind="$attrs" @submit="submit">
    <slot/>
  </form>
</template>
<script>
import { computed } from 'vue'

export default {
  data() {
    return {
      submitting: false
    }
  },
  provide() {
    return {
      submittingSeedForm: computed(() => this.submitting)
    }
  },
  methods: {
    submit(e) {
      e.preventDefault()
      this.submitting = true
    }
  }
}
</script>