<template>
  <div>
    <InputField
        v-for="i in length"
        ref="pinInput"
        class="pin-input"
        type="number"
        inputmode="numeric"
        pattern="\d*"
        autocomplete="asdf"
        @focus.prevent="focus"
        @input="input"
        @keydown="keydown"
        @paste="paste"
    />
    <input type="hidden" :name="name" :value="value">
  </div>
</template>
<script>
import InputField from '@/components/form/inputField'

export default {
  components: {
    InputField
  },
  props: {
    name: String,
    length: {
      type: Number,
      default: 6
    }
  },
  data() {
    return {
      value: ''
    }
  },
  watch: {
    value() {
      this.movePinTexts()
    }
  },
  methods: {
    movePinTexts() {
      const value = this.value
      for(let i in this.$refs.pinInput) {
        const fillInput = this.$refs.pinInput[i]
        const str = value[i]
        if(!str) break
        fillInput.$el.value = str
      }
      this.focus()
    },
    focus() {
      const inputs = this.$refs.pinInput
      inputs[Math.min(this.value.length, inputs.length - 1)].$el.focus()
    },
    input(e) {
      if(this.value.length >= this.length) {
        this.movePinTexts()
        return e.preventDefault()
      }
      this.value = this.$refs.pinInput.map(a => a.$el.value).join('') ?? ''
    },
    keydown(e) {
      if(e.key === 'Backspace') {
        this.value = this.value.slice(0, this.value.length - 1)
      }
    },
    paste(e) {
      const text = e.clipboardData.getData('text/plain')
      e.preventDefault()

      this.value = text.split('').filter(a => '0123456789'.includes(a)).slice(0, this.length).join('')
      this.movePinTexts()
    }
  }
}
</script>
<style scoped>
div {
  align-items: center;
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  margin: 1rem 0;
}

.pin-input {
  caret-color: transparent;
  font-size: 1.1rem;
  text-align: center;
  user-select: none;
  width: 2.25rem;
}
</style>