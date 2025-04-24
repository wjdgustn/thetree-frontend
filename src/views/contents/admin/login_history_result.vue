<template>
  <p>마지막 로그인 UA : {{data.userAgent}}</p>
  <p>이메일 : {{data.targetUser?.email}}</p>
  <PrevNextBtn flex v-bind="pageProps"/>
  <div>
    <table>
      <thead>
      <tr>
        <th>DATE</th>
        <th>TYPE</th>
        <th>IP</th>
        <th>DEVICE</th>
        <th>UA</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in data.logs">
        <td>
          <LocalDate :date="item.createdAt"/>
        </td>
        <td v-text="['Login', 'IPChange'][item.type] ?? item.type"/>
        <td>{{item.ip}}</td>
        <td>{{item.device}}</td>
        <td>{{item.userAgent}}</td>
      </tr>
      </tbody>
    </table>
  </div>
  <PrevNextBtn v-bind="pageProps"/>
</template>
<script>
import PrevNextBtn from '@/components/prevNextBtn'
import LocalDate from '@/components/localDate'

export default {
  components: {
    LocalDate,
    PrevNextBtn
  },
  computed: {
    pageProps() {
      const prevItem = this.data.prevItem
      const nextItem = this.data.nextItem
      return {
        prev: prevItem ? { query: { until: prevItem._id } } : null,
        next: nextItem ? { query: { from: nextItem._id } } : null
      }
    }
  }
}
</script>
<style scoped>
div {
  overflow-x: auto;
}

table {
  background-color: transparent;
  border-collapse: collapse;
  border-spacing: 0;
  margin-bottom: 1rem;
  max-width: 100%;
  width: 100%;
}

table td, table th {
  border-top: 1px solid #eceeef;
  line-height: 1.5;
  padding: 0.5rem 0.7rem;
  white-space: nowrap;
}

table tr:last-of-type td {
  border-bottom: 1px solid #eceeef;
}

table th {
  border-bottom: 2px solid #eceeef;
  text-align: left;
  vertical-align: bottom;
}

label {
  margin-bottom: 15px;
  vertical-align: middle;
}
</style>