<template>
  <WikiContent :content="$store.state.viewData.contentHtml"></WikiContent>
</template>
<script>
import WikiContent from '@/components/wiki/wikiContent';

export default {
  components: {
    WikiContent
  }
}
</script>