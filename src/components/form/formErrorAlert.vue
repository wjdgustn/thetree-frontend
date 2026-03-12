<template>
  <Alert v-if="errorAlert" error class="error-alert">
    <b>[{{$t('components.form_error_alert.error')}}]</b>
    &nbsp;<span v-html="errorAlert"/>
  </Alert>
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
<style scoped>
.error-alert {
  column-gap: 0;
}
</style>