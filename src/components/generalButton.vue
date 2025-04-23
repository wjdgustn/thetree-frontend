<template>
  <component :is="block ? 'div' : 'span'" v-if="disable" role="button" :class="buttonClass">
    <slot/>
  </component>
  <a v-else-if="whenClick" href="#" role="button" :class="buttonClass" @click.prevent="click">
    <slot/>
  </a>
  <button v-else-if="type === 'submit' || type === 'reset'" :type="type" :class="buttonClass">
    <slot/>
  </button>
  <NuxtLink v-else :to="href" :rel="nofollow ? 'nofollow' : null" role="button" :class="buttonClass">
    <slot/>
  </NuxtLink>
</template>
<script>
import NuxtLink from '@/components/global/nuxtLink'

export default {
  inject: {
    submittingSeedForm: {
      default: false
    }
  },
  components: {
    NuxtLink
  },
  props: {
    type: String,
    theme: String,
    href: [String, Object],
    nofollow: Boolean,
    size: String,
    disabled: Boolean,
    block: Boolean,
    value: String,
    whenClick: Function
  },
  methods: {
    click(e) {
      this.whenClick?.(e)
    }
  },
  computed: {
    disable() {
      return this.disabled || this.submittingSeedForm
    },
    buttonClass() {
      const result = ['button']

      switch(this.theme) {
        case 'secondary': result.push('button-secondary'); break
        case 'primary': result.push('button-primary'); break
        case 'danger': result.push('button-danger'); break
        case 'super': result.push('button-super'); break
        case 'brand': result.push('button-brand'); break
      }

      if(this.disable) result.push('button-disabled')

      if(this.size === 'small') result.push('button-small-size')
      else if(this.size === 'big') result.push('button-big-size')

      if(this.block) result.push('button--block')

      return result
    }
  }
}
</script>