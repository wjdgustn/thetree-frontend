<template>
  <div class="form-block" :class="{
    'flex-start': flexStart,
    buttons,
    padding
  }">
    <label v-if="label" :for="inputId">{{label}}</label>
    <slot/>
    <ShowError v-if="name" :tag="name"/>
    <div v-if="$slots.buttons" class="buttons-group">
      <slot name="buttons"/>
    </div>
  </div>
</template>
<script>
import ShowError from '@/components/showError'

export default {
  components: {
    ShowError
  },
  props: {
    inputId: String,
    name: String,
    label: String,
    flexStart: Boolean,
    buttons: Boolean,
    padding: Boolean
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