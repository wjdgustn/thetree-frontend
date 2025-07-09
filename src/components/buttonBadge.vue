<template>
  <span :class="[badgeClass, { round }]">
    <slot/>
  </span>
</template>
<script>
export default {
  props: {
    theme: String,
    size: String,
    round: Boolean
  },
  computed: {
    badgeClass() {
      const result = [this.$style['base'], this.$style['button'], this.$style['button--unreactive']]

      switch(this.theme) {
        case 'secondary': result.push(this.$style['button--secondary']); break
        case 'primary': result.push(this.$style['button--primary']); break
        case 'danger': result.push(this.$style['button--danger']); break
        case 'super': result.push(this.$style['button--super']); break
        case 'brand': result.push(this.$style['button--brand']); break
      }

      if(this.size === 'small') result.push(this.$style['button--small-size'])
      else if(this.size === 'big') result.push(this.$style['button--big-size'])

      return result
    }
  }
}
</script>
<style module>
@import '@/styles/button.css';
</style>
<style scoped>
.round {
  border-radius: 1.5rem;
}
</style>