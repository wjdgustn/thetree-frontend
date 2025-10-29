<template>
  <VSelect
      :placeholder="placeholder"
      v-model="value"
      v-bind="$attrs"
  />
  <input v-if="name" :name="name" type="hidden" :value="value?.value ?? value">
</template>
<script>
import VSelect from 'vue-select'

export default {
  components: {
    VSelect
  },
  props: {
    name: String,
    placeholder: {
      type: String,
      default: '선택'
    },
    modelValue: Object
  },
  data() {
    return {
      value: this.modelValue
    }
  },
  emits: ['update:modelValue'],
  watch: {
    value(newValue) {
      this.$emit('update:modelValue', newValue)
    },
    modelValue(newValue) {
      this.value = newValue
    }
  }
}
</script>
<style scoped>
:deep() {
  --vs-dropdown-option--active-bg: var(--brand-color-1, #5897fb);
}
</style>
<style>
.theseed-dark-mode .vs__search::-moz-placeholder {
  background: #27292d;
  color: #ddd;
}

.theseed-dark-mode .vs__dropdown-menu,.theseed-dark-mode .vs__dropdown-toggle,.theseed-dark-mode .vs__search::placeholder {
  background: #27292d;
  color: #ddd;
}

.theseed-dark-mode .vs__dropdown-option,.theseed-dark-mode .vs__selected {
  color: #ddd;
}

.theseed-dark-mode .vs__clear,.theseed-dark-mode .vs__open-indicator {
  fill: #ddd;
}
</style>