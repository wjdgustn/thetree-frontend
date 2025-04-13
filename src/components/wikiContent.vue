<template>
  <div v-html="content" class="wiki-content" :class="{ 'wiki-thread-content': discuss }"></div>
</template>
<script>
export default {
  props: {
    discuss: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: ''
    }
  }
}
</script>