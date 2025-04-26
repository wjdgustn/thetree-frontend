<template>
  <component
    :is="multiline ? 'textarea' : 'input'"
    class="input"
    :class="{ multiline }"
    :value="modelValue"
    @input="onInput"
    @keydown="whenKeyDown"
    @paste="whenPaste"
    :name="name"
    v-bind="$attrs"
    ref="input"
  />
</template>
<script>
export default {
  inject: {
    submittingSeedForm: {
      default: false
    }
  },
  props: {
    modelValue: String,
    hasError: Boolean,
    multiline: Boolean,
    whenInput: Function,
    whenKeyDown: Function,
    whenPaste: Function,
    name: String
  },
  emits: ['update:modelValue'],
  mounted() {
    this.updateError()
  },
  watch: {
    submittingSeedForm(newValue) {
      this.$refs.input.disabled = newValue
    },
    error() {
      this.updateError()
    }
  },
  computed: {
    fieldError() {
      return this.name && this.$store.state.viewData.fieldErrors?.[this.name]
    },
    error() {
      return !!(this.hasError || this.fieldError || this.$store.state.viewData.errorAlert)
    }
  },
  methods: {
    onInput(e) {
      this.whenInput?.(e)
      this.$emit('update:modelValue', e.target.value)
    },
    focus() {
      this.$refs.input.focus()
    },
    updateError() {
      const classList = this.$refs.input.classList
      if(this.error) classList.add('error')
      else classList.remove('error')
    }
  }
}
</script>
<style scoped>
.input {
  appearance: none;
  background-color: var(--light-article-background-color, var(--article-background-color, #fff));
  border: 1px solid #d5d5d5;
  border-radius: 4px;
  display: block;
  font-size: .9rem;
  line-height: 1.5;
  padding: .3rem .75rem;
}

.theseed-dark-mode .input {
  background-color: #282829;
  border-color: #484848;
}

.input {
  --focus-outline-color: var(--brand-bright-color-2,#e3e3e3);
  --focus-box-shadow-style: var(--focus-outline-color) 0 0 0 0.2rem;
}

.input:focus-visible {
  box-shadow: var(--focus-box-shadow-style);
  transition: box-shadow .1s linear;
}

.theseed-dark-mode .input:focus-visible {
  --focus-outline-color: var(--brand-bright-color-2, #45474b);
}

.input[type=number] {
  appearance: textfield;
}

.input::-webkit-inner-spin-button,.input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.multiline {
  scrollbar-width: thin;
}

.error {
  --focus-outline-color: #f1c7cc !important;
  border-color: #b42e3b;
}

.theseed-dark-mode .error {
  --focus-outline-color: #8b3f46 !important;
  border-color: #861520;
}

.input[disabled] {
  --focus-outline-color: none !important;
  background-color: #f7f7f7;
  border-color: #f0f0f0;
  color: #d9d9d9;
}

.theseed-dark-mode .theseed-dark-mode .input[disabled] {
  --focus-outline-color: none !important;
  background-color: #373737;
  border-color: #424242;
  color: #777;
}

.input[disabled]:hover {
  cursor: not-allowed;
}
</style>