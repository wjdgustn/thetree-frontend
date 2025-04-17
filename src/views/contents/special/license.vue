<template>
  <h2>the tree</h2>

  <p>v{{version}}<span v-if="branch"> ({{branch}})</span></p>
  <p>엔진 업데이트: <LocalDate :date="commitDate"/> (<LocalDate :date="commitDate" forceRelative/>)</p>
  <ul>
    <li>Backend: {{commitId}}</li>
    <li>Frontend: {{commitIds.frontend}}</li>
    <li>Skin: {{commitIds.skin}}</li>
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

export default {
  components: {
    LocalDate
  },
  data() {
    return {
      ...this.$store.state.viewData,
      commitIds: __THETREE_COMMIT_IDS__
    }
  }
}
</script>