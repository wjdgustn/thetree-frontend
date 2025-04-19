<template>
  <Diff :title="`r${oldRev} vs r${rev}`" :diffHtml="diff.diffHtml"></Diff>
</template>
<script>
import Diff from '@/components/diff'

export default {
  components: {
    Diff
  },
  data() {
    return this.$store.state.viewData
  }
}
</script>