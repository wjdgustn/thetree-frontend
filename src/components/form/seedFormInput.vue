<template>
  <component
      class="seed-form-input"
      :is="tag"
      v-bind="$attrs"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      ref="input"
  >
    <slot/>
  </component>
</template>
<script>
export default {
  inject: {
    submittingSeedForm: {
      default: false
    }
  },
  props: {
    modelValue: {
      type: [String, Boolean],
      default: ''
    },
    tag: {
      type: String,
      default: 'input'
    }
  },
  emits: ['update:modelValue'],
  watch: {
    submittingSeedForm(newValue) {
      this.$refs.input.disabled = newValue
    }
  }
}
</script>
<style scoped>
.seed-form-input {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  display: inline-block;
  font-size: .9rem;
  line-height: 1.5;
  margin: 0 0 0 .7rem;
  padding: .25rem .5rem;
}

.theseed-dark-mode .seed-form-input {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}
</style>