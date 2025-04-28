<template>
  <div v-if="$store.state.page.contentHtml" v-html="$store.state.page.contentHtml" @click="onDynamicContentClick"></div>
  <component v-else :is="$store.state.viewData.viewComponent"></component>
</template>
<script>
import Common from '@/mixins/common'

export default {
  mixins: [Common]
}
</script>