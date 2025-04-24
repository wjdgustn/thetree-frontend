<template>
  <ul>
    <li v-for="item in viewData.editRequests">
      <NuxtLink :to="'/edit_request/' + item.url">편집 요청 {{item.url}}</NuxtLink>
    </li>
  </ul>
</template>
<script>
import NuxtLink from '@/components/global/nuxtLink'

export default {
  components: {
    NuxtLink
  }
}
</script>
<style scoped>
ul {
  margin: .4em 0 .4em 1.5em;
  padding-left: .5rem;
}

ul li {
  list-style: inherit !important;
  margin: .4em 0;
}
</style>