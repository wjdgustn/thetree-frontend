<template>
  <RouterLink v-bind="$props" custom v-slot="{ href }">
    <a ref="link" v-bind="$attrs" :href="href" @click="click"><slot/></a>
  </RouterLink>
</template>
<script>
import { RouterLink } from 'vue-router';

export default {
  props: {
    ...RouterLink.props
  },
  methods: {
    click(e) {
      if(e.metaKey || e.ctrlKey || e.defaultPrevented) return

      this.$store.state.components.mainView.routerPush(this.$refs.link.getAttribute('href')).then()
      e.preventDefault()
    }
  }
}
</script>