<template>
  <div ref="div" v-html="content" class="wiki-content" @click="onDynamicContentClick" :class="{ 'wiki-thread-content': discuss }"></div>
</template>
<script>
import Common from '@/mixins/common'

export default {
  mixins: [Common],
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