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
      const result = ['button', 'button-unreactive']

      switch(this.theme) {
        case 'secondary': result.push('button-secondary'); break
        case 'primary': result.push('button-primary'); break
        case 'danger': result.push('button-danger'); break
        case 'super': result.push('button-super'); break
        case 'brand': result.push('button-brand'); break
      }

      if(this.size === 'small') result.push('button-small-size')
      else if(this.size === 'big') result.push('button-big-size')

      return result
    }
  }
}
</script>
<style scoped>
.round {
  border-radius: 1.5rem;
}
</style>