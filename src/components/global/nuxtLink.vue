<template>
  <RouterLink v-bind="$props" :to="actualTo" custom v-slot="{ href }">
    <a ref="link" v-bind="$attrs" :href="href" @click="click"><slot/></a>
  </RouterLink>
</template>
<script>
import { RouterLink } from 'vue-router';

export default {
  props: {
    ...RouterLink.props
  },
  data() {
    return {
      actualTo: this.to
    }
  },
  created() {
    if(typeof this.actualTo === 'string') return

    // vue-router 자체 router.resolve는 path를 이상하게 encode하는 듯
    const url = new URL(this.$route.fullPath, 'https://example.com')
    for(let [key, value] of Object.entries(this.actualTo.query)) {
      if(value === null) url.searchParams.delete(key)
      else url.searchParams.set(key, value)
    }
    this.actualTo= url.pathname + url.search
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