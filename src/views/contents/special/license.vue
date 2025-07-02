<template>
  <h2>the tree</h2>

  <p>v{{version}}<span v-if="branch"> ({{branch}})</span></p>
  <p>엔진 업데이트: <LocalDate :date="commitDate"/> (<LocalDate :date="commitDate" forceRelative/>)</p>
  <ul>
    <li :title="beDate">Backend: {{commitId}}</li>
    <li :title="feDate">Frontend: {{commitIds.frontend}}</li>
    <li :title="skinDate">Skin: {{commitIds.skin}}</li>
  </ul>

  <p>Copyright <a href="https://github.com/wjdgustn">hyonsu</a> all rights reserved.</p>

  <h3>Contributors</h3>
  <ul>
    <li>admin@hyonsu.com (backend & frontend)</li>
  </ul>

  <h3>Open source license</h3>
  <ul>
    <li>
      <pre>{{openSourceLicense}}</pre>
    </li>
  </ul>
</template>
<script>
import LocalDate from '@/components/localDate'

import { formatDate } from '@/utils'

export default {
  components: {
    LocalDate
  },
  data() {
    return {
      ...this.$store.state.viewData,
      commitIds: __THETREE_COMMIT_IDS__,
      commitDates: __THETREE_COMMIT_DATES__
    }
  },
  computed: {
    beDate() {
      return formatDate(this.commitDate)
    },
    feDate() {
      return formatDate(this.commitDates.frontend)
    },
    skinDate() {
      return formatDate(this.commitDates.skin)
    }
  }
}
</script>