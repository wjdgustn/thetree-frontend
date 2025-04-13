<template>
  <WikiContent :content="$store.state.viewData.contentHtml"></WikiContent>
</template>
<script>
import WikiContent from '@/components/wikiContent.vue';

export default {
  components: {
    WikiContent
  }
}
</script>