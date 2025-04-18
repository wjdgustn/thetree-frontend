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
  <RouterLink v-else :to="href" :rel="nofollow ? 'nofollow' : null" role="button" :class="buttonClass">
    <slot/>
  </RouterLink>
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

      if(this.block) result.push('button-block')

      return result
    }
  }
}
</script>
<style scoped>
.button {
  --button-normal-color: colors.$light-text-color;
  --button-normal-background-color: var(--light-article-background-color, var(--article-background-color, #fff));
  --button-normal-border-color: #d5d5d5;
  --button-color: var(--button-normal-color);
  --button-background-color: var(--button-normal-background-color);
  --button-border: 1px solid;
  --button-border-color: var(--button-normal-border-color);
  --button-border-radius: 4px;
  align-items: center;
  background-color: var(--button-background-color);
  border: 1px solid;
  border: var(--button-border);
  border-color: var(--button-border-color);
  border-radius: var(--button-border-radius);
  color: var(--button-color) !important;
  display: inline-flex;
  font-size: .9rem;
  justify-content: center;
  line-height: 1.5;
  overflow: hidden;
  padding: .3rem .75rem;
  text-decoration: none!important;
  transition: background-color .1s ease-in,box-shadow .1s linear;
  white-space: nowrap;
}

.theseed-dark-mode .button {
  --button-normal-color: var(--dark-text-color, var(--text-color, #e0e0e0));
  --button-normal-background-color: #282829;
  --button-normal-border-color: #484848;
}

@media screen and (max-width: 727.98px) {
  .button:not(.button-unresponsive) {
    padding: .4rem .75rem;
  }
}

@media screen and (max-width: 319.98px) {
  .button:not(.button-unresponsive) {
    padding: .3rem .75rem;
  }
}

.button:not(.button-unreactive) {
  cursor: pointer;
}

.button:not(.button-unreactive):not(.button-disabled):hover {
  --button-hover-color: var(--button-color);
  --button-background-hover-color: #f2f2f2;
  background-color: var(--button-background-hover-color);
  color: var(--button-hover-color);
  text-decoration: none;
}

.theseed-dark-mode .button:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: #555;
}

.button:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #f2f2f2;
  background-color: var(--button-background-focus-color);
}

.theseed-dark-mode .button:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #515151;
}

.button:not(.button-unreactive):not(.button-disabled) {
  --focus-outline-color: var(--brand-bright-color-2, #e3e3e3);
  --focus-box-shadow-style: var(--focus-outline-color) 0 0 0 0.2rem;
}

.button:not(.button-unreactive):not(.button-disabled):focus-visible {
  box-shadow: var(--focus-box-shadow-style);
  transition: box-shadow .1s linear;
}

.theseed-dark-mode .button:not(.button-unreactive):not(.button-disabled):focus-visible {
  --focus-outline-color: var(--brand-bright-color-2, #45474b);
}

.button-secondary:not(.button-disabled) {
  --button-color: #fff;
  --button-background-color: #686868;
  --button-border-color: #7f7f7f;
}

.theseed-dark-mode .button-secondary:not(.button-disabled) {
  --button-background-color: #5a5a5a;
  --button-border-color: #5b5b5b;
}

.button-secondary:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: #505050;
}

.theseed-dark-mode .button-secondary:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: #474747;
}

.button-secondary:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #5e5e5e;
}

.theseed-dark-mode .button-secondary:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #4a4a4a;
}

.button-secondary:not(.button-unreactive):not(.button-disabled):focus-visible {
  box-shadow: 0 0 0 .2rem #939393;
}

.theseed-dark-mode .button-secondary:not(.button-unreactive):not(.button-disabled):focus-visible {
  box-shadow: 0 0 0 .2rem #505050;
}

.button-primary:not(.button-disabled) {
  --button-color: #fff;
  --button-background-color: #3f82e6;
  --button-border-color: #7eaaed;
}

.theseed-dark-mode .button-primary:not(.button-disabled) {
  --button-background-color: #1555b5;
  --button-border-color: #052e6d;
}

.button-primary:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: #4078cd;
}

.theseed-dark-mode .button-primary:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: #1e5ebd;
}

.button-primary:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #4b85db;
}

.theseed-dark-mode .button-primary:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #1758ba;
}

.button-primary:not(.button-unreactive):not(.button-disabled):focus-visible {
  box-shadow: 0 0 0 .2rem #b0caf3;
}

.theseed-dark-mode .button-primary:not(.button-unreactive):not(.button-disabled):focus-visible {
  box-shadow: 0 0 0 .2rem #0d3e8f;
}

.button-danger:not(.button-disabled) {
  --button-color: #fff;
  --button-background-color: #d64a58;
  --button-border-color: #b42e3b;
}

.theseed-dark-mode .button-danger:not(.button-disabled) {
  --button-background-color: #75121c;
  --button-border-color: #861520;
}

.button-danger:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: #c1434f;
}

.theseed-dark-mode .button-danger:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: #8d101d;
}

.button-danger:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #c74552;
}

.theseed-dark-mode .button-danger:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #84111c;
}

.button-danger:not(.button-unreactive):not(.button-disabled):focus-visible {
  box-shadow: 0 0 0 .2rem #f1c7cc;
}

.theseed-dark-mode .button-danger:not(.button-unreactive):not(.button-disabled):focus-visible {
  box-shadow: 0 0 0 .2rem #8b3f46;
}

.button-super:not(.button-disabled) {
  --button-color: #fff;
  --button-background-color: #639;
  --button-border-color: #7234b1;
}

.theseed-dark-mode .button-super:not(.button-disabled) {
  --button-background-color: #401d63;
  --button-border-color: #451576;
}

.button-super:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: #673697;
}

.theseed-dark-mode .button-super:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: #5a2f84;
}

.button-super:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #753eac;
}

.theseed-dark-mode .button-super:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: #50277a;
}

.button-super:not(.button-unreactive):not(.button-disabled):focus-visible {
  box-shadow: 0 0 0 .2rem #7844ac;
}

.theseed-dark-mode .button-super:not(.button-unreactive):not(.button-disabled):focus-visible {
  box-shadow: 0 0 0 .2rem #4f2a74;
}

.button-brand:not(.button-disabled) {
  --button-color: #fff;
  --button-background-color: var(--brand-color-1, #bcbcbc);
}

.button-brand:not(.button-unreactive):not(.button-disabled):focus {
  --button-background-focus-color: var(--brand-color-2, #c7c7c7);
}

.button-brand:not(.button-unreactive):not(.button-disabled):hover {
  --button-background-hover-color: var(--brand-color-2, #c7c7c7);
}

.button-disabled {
  --button-color: #d9d9d9;
  --button-background-color: #f7f7f7;
  --button-border-color: #f0f0f0;
}

.theseed-dark-mode .button-disabled {
  --button-color: #777;
  --button-background-color: #373737;
  --button-border-color: #424242;
}

.button-disabled:not(.button-disabled-unreactive):hover {
  cursor: not-allowed;
}

.button-small-size {
  font-size: .8rem;
  height: 1.6rem;
  min-width: 2.4rem;
  padding: .1rem .3rem;
  --button-border-color: #e0e0e0;
  --button-border-radius: 3px;
}

.theseed-dark-mode .button-small-size {
  --button-border-color: #484848;
}

.button-small-size svg {
  height: .8rem;
}

@media screen and (max-width: 1023.98px) {
  .button-small-size:not(.button-unresponsive) {
    height: 1.7rem;
    min-width: 2.6rem;
  }
}

.button-big-size {
  font-size: 1.05rem;
  padding: .75rem 1.25rem;
}

.button-block {
  display: flex;
  width: 100%;
}

.button svg {
  height: .85rem;
  fill: currentColor;
}
</style>