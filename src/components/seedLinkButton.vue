<template>
  <NuxtLink :to="$props.to" :disabled="disable || null" @click.capture="clickBlocker" :class="{
    large: $props.large,
    green: $props.green,
    submit: $props.submit,
    info: $props.info,
    danger: $props.danger,
    block: $props.block
  }"><slot/></NuxtLink>
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
    to: {
      type: String,
      required: true
    },
    disabled: Boolean,
    large: Boolean,
    green: Boolean,
    submit: Boolean,
    info: Boolean,
    danger: Boolean,
    block: Boolean
  },
  computed: {
    disable() {
      return this.disabled || this.submittingSeedForm
    }
  },
  methods: {
    clickBlocker(e) {
      if(this.disable) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
  }
}
</script>
<style scoped>
a {
  background-color: #fff;
  border: .0625rem solid #ccc;
  color: #373a3c!important;
  cursor: pointer;
  display: inline-block;
  font-size: .9rem;
  font-weight: 400;
  line-height: 1.5;
  padding: .2rem .7rem;
  text-align: center;
  text-decoration: none!important;
  touch-action: manipulation;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

a:not([disabled]):active, a:not([disabled]):hover {
  background-color: #e6e6e6;
  border-color: #adadad;
}

.theseed-dark-mode a {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd !important;
}

.theseed-dark-mode a:not([disabled]):active, .theseed-dark-mode a:not([disabled]):hover {
  background-color: #2d2f34;
  border-color: #383b40;
}

a[disabled] {
  cursor: not-allowed;
  opacity: .65;
}

a.large {
  padding: .75rem 1.25rem;
}

a.green {
  background-color: #5cb85c;
  border-color: #5cb85c;
  color: #fff !important;
}

a.green:not([disabled]):active, a.green:not([disabled]):hover {
  background-color: #449d44;
  border-color: #419641;
}

a.submit {
  background-color: #0275d8;
  border-color: #0275d8;
  color: #fff !important;
}

a.submit:not([disabled]):active,a.submit:not([disabled]):hover {
  background-color: #025aa5;
  border-color: #01549b;
}

a.info {
  background-color: #5bc0de;
  border-color: #5bc0de;
  color: #fff !important;
}

a.info:not([disabled]):active,a.info:not([disabled]):hover {
  background-color: #31b0d5;
  border-color: #2aabd2;
}

a.danger {
  background-color: #d9534f;
  border-color: #d9534f;
  color: #fff !important;
}

a.danger:not([disabled]):active, a.danger:not([disabled]):hover {
  background-color: #c9302c;
  border-color: #c12e2a;
}

a.block {
  display: block;
}
</style>