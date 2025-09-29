<template>
  <span class="checkmark-text" :class="[checked ? 'checkmark-checked' : 'checkmark-x']">
    <FontAwesomeIcon v-if="checked" icon="fa-circle-check"/>
    <FontAwesomeIcon v-else icon="circle-xmark"/>
    <slot/>
  </span>
</template>
<script>
export default {
  props: {
    checked: {
      type: Boolean,
      required: true
    }
  }
}
</script>
<style scoped>
.checkmark-text {
  align-items: center;
  display: inline-flex;
  gap: .4rem;
}

.checkmark-checked {
  color: #00a91c;
}

.checkmark-x {
  color: #a80000;
}
</style>