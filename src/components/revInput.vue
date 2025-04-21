<template>
  <SeedForm>
    <div class="rev-input" :class="blockClass">
      <InputField ref="input" v-model="value" class="input-field" type="number" name="from" pattern="\d+" min="1" required/>
      <span class="r-text">r</span>
      <GeneralButton v-if="showClearButton" class="clear-button" :whenClick="clear">
        <FontAwesomeIcon icon="circle-xmark"/>
      </GeneralButton>
      <GeneralButton type="submit">
        <FontAwesomeIcon icon="share"/>
      </GeneralButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import GeneralButton from '@/components/generalButton'
import InputField from '@/components/form/inputField'

export default {
  components: {
    SeedForm,
    GeneralButton,
    InputField
  },
  props: {
    blockClass: String
  },
  data() {
    return {
      value: this.$route.query.from
    }
  },
  computed: {
    showClearButton() {
      return !!this.value
    }
  },
  methods: {
    clear() {
      this.value = ''
      this.$refs.input.focus()
    }
  }
}
</script>
<style scoped>
.top-page-item {
  display: inline-flex;
}

.rev-input {
  height: 100%;
  position: relative;
}

.r-text {
  color: #888;
  left: .75rem;
  position: absolute;
  top: calc(50% - .7rem);
  z-index: 201;
}

.theseed-dark-mode .r-text {
  color: var(--text-color, hsla(0, 0%, 88%, .749));
}

.input-field {
  padding-left: 1.25rem;
  padding-right: 1.875rem;
  width: 6rem;
}

.clear-button {
  align-items: center;
  border: none;
  border-radius: 4px !important;
  color: #aaa;
  display: inline-flex;
  justify-content: center;
  padding: .35rem;
  position: absolute;
  right: 2.7rem;
  top: calc(50% - .775rem);
  z-index: 201;
}

.theseed-dark-mode .clear-button {
  color: var(--text-color, hsla(0, 0%, 88%, .749));
}

.clear-button:hover {
  color: #555;
}

.clear-button svg {
  width: .815rem;
  fill: currentColor;
}
</style>