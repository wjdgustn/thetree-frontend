<template>
  <div class="form-block">
    <label v-if="label" :for="inputId" v-text="label"></label>
    <slot/>
    <p v-if="fieldError" v-text="fieldError.msg"></p>
    <div v-if="$slots.buttons" class="buttons-group">
      <slot name="buttons"/>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    inputId: String,
    name: String,
    label: String
  },
  computed: {
    fieldError() {
      return this.name && this.$store.state.viewData.fieldErrors?.[this.name]
    }
  }
}
</script>
<style scoped>
.form-block {
  align-items: stretch;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  margin-bottom: 1rem;
}

p {
  color: red;
  margin: 0;
}

.flex-start {
  align-items: flex-start;
}

.buttons {
  gap: 1rem;
  align-items: center;
  flex-direction: row;
  justify-content: flex-end;
}

.padding {
  padding-top: .5rem;
}

.buttons-group {
  align-items: center;
  column-gap: .5rem;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
}

.buttons-group :deep(.button) {
  min-width: 4rem;
}
</style>