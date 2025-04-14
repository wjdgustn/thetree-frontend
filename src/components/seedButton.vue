<template>
  <button v-bind="$attrs" :disabled="disabled" :class="{
    large: $props.large,
    green: $props.green,
    submit: $props.submit,
    info: $props.info,
    danger: $props.danger,
    block: $props.block
  }"><slot/></button>
</template>
<script>
import NuxtLink from '@/components/global/nuxtLink.vue'

export default {
  components: {
    NuxtLink
  },
  props: {
    disabled: Boolean,
    large: Boolean,
    green: Boolean,
    submit: Boolean,
    info: Boolean,
    danger: Boolean,
    block: Boolean
  }
}
</script>
<style scoped>
button {
  background-color: #fff;
  border: .0625rem solid #ccc;
  color: #373a3c;
  cursor: pointer;
  display: inline-block;
  font-size: .9rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  padding: .2rem .7rem;
  text-align: center;
  touch-action: manipulation;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  white-space: nowrap
}

button:not([disabled]):active, button:not([disabled]):hover {
  background-color: #e6e6e6;
  border-color: #adadad;
  text-decoration: none;
}

.theseed-dark-mode button {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

.theseed-dark-mode button:not([disabled]):active, .theseed-dark-mode button:not([disabled]):hover {
  background-color: #2d2f34;
  border-color: #383b40;
}

button[disabled] {
  cursor: not-allowed;
  opacity: .65;
}

button.large {
  padding: .75rem 1.25rem;
}

button.green {
  background-color: #5cb85c;
  border-color: #5cb85c;
  color: #fff;
}

button.green:not([disabled]):active, button.green:not([disabled]):hover {
  background-color: #449d44;
  border-color: #419641;
}

button.submit {
  background-color: #0275d8;
  border-color: #0275d8;
  color: #fff;
}

button.submit:not([disabled]):active, button.submit:not([disabled]):hover {
  background-color: #025aa5;
  border-color: #01549b;
}

button.info {
  background-color: #5bc0de;
  border-color: #5bc0de;
  color: #fff;
}

button.info:not([disabled]):active,button.info:not([disabled]):hover {
  background-color: #31b0d5;
  border-color: #2aabd2;
}

button.danger {
  background-color: #d9534f;
  border-color: #d9534f;
  color: #fff;
}

button.danger:not([disabled]):active, button.danger:not([disabled]):hover {
  background-color: #c9302c;
  border-color: #c12e2a;
}

button.block {
  display: block
}
</style>