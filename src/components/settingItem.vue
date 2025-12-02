<template>
  <div class="setting-item">
    <label :for="ckey">
      {{label}}
      <template v-if="note">
        <small> {{note}}</small>
      </template>
    </label>
    <div class="setting-item-content">
      <slot/>
    </div>
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
    },
    noSave: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      value: this.$store.state.localConfig[this.ckey] ?? this.default
    }
  },
  watch: {
    value(newValue) {
      if(!this.noSave) this.$store.state.localConfigSetValue(this.ckey, newValue)
    }
  }
}
</script>
<style scoped>
.setting-item {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  margin: 0 0 1rem;
}

.setting-item:last-child {
  margin: 0;
}

label {
  display: inline-block;
  margin-bottom: .5rem;
  user-select: none
}

small {
  font-size: 80%;
}

.setting-item-content {
  align-items: center;
  column-gap: 1rem;
  display: flex;
}
</style>