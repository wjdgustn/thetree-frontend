<template>
  <div>
    <label :for="ckey">
      {{label}}
      <template v-if="note">
        <small> {{note}}</small>
      </template>
    </label>
    <slot/>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String
    },
    ckey: {
      type: String
    },
    note: {
      type: String
    }
  },
  data() {
    return {
      value: this.$store.state.localConfig[this.ckey] ?? this.default
    }
  },
  watch: {
    value(newValue) {
      this.$store.state.localConfigSetValue(this.ckey, newValue)
    }
  }
}
</script>
<style scoped>
div {
  margin-bottom: 15px
}

label {
  display: inline-block;
  margin-bottom: .5rem;
  user-select: none
}

small {
  font-size: 80%;
}
</style>