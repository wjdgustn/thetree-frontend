<template>
  <template v-if="domains.length">
    <p>
      {{$t('components.email_whitelist.text_1')}}
      <br>{{$t('components.email_whitelist.text_2')}}
    </p>
    <ul>
      <li v-for="domain in domains">{{domain}}</li>
    </ul>
  </template>
</template>
<script>
export default {
  props: {
    domains: {
      type: Array,
      required: true
    }
  }
}
</script>