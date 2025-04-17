<template>
  <Alert v-if="errorAlert" error>{{errorAlert}}</Alert>
</template>
<script>
import Alert from '@/components/alert'

export default {
  components: {
    Alert
  },
  computed: {
    errorAlert() {
      return this.$store.state.viewData.errorAlert
    }
  },
  watch: {
    errorAlert() {
      this.$store.state.viewData.errorAlertExists = true
    }
  }
}
</script>