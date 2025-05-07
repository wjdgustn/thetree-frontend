<template>
  <template v-if="domains.length">
    <p>
      이메일 허용 목록이 활성화 되어 있습니다.
      <br>이메일 허용 목록에 존재하는 메일만 사용할 수 있습니다.
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