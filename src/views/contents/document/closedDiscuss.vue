<template>
  <ul>
    <li v-for="(item, index) in data.threads">
      {{index + 1}}.
      <NuxtLink :to="'/thread/' + item.url">{{item.topic}}</NuxtLink>
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