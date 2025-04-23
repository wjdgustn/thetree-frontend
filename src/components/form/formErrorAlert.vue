<template>
  <Alert v-if="errorAlert" error><b>[오류!]</b> {{errorAlert}}</Alert>
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
    },
    '$store.state.viewData.errorAlertExists'() {
      this.$store.state.viewData.errorAlertExists = true
    }
  }
}
</script>