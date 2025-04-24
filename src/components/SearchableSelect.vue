<template>
  <VSelect
      :placeholder="placeholder"
      :value="modelValue"
      v-model="modelValue"
      v-bind="$attrs"
  />
  <input v-if="name" :name="name" type="hidden" :value="modelValue">
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
    value: String
  },
  data() {
    return {
      modelValue: this.value
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