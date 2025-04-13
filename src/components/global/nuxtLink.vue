<template>
  <RouterLink v-bind="$props" custom v-slot="{ href }">
    <a ref="link" v-bind="$attrs" :href="href" @click.prevent="click"><slot/></a>
  </RouterLink>
</template>
<script>
import { RouterLink } from 'vue-router';

export default {
  props: {
    ...RouterLink.props
  },
  methods: {
    click() {
      this.$store.state.components.mainView.routerPush(this.$refs.link.getAttribute('href')).then()
    }
  }
}
</script>