<template>
  <SettingItem v-bind="$props">
    <div class="select-block">
      <label>
        <input type="checkbox" :id="ckey" v-model="value">
        사용
      </label>
    </div>
  </SettingItem>
</template>
<script>
import SettingItem from '@/components/settingItem';

export default {
  extends: SettingItem,
  components: {
    SettingItem
  },
  props: {
    default: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style scoped>
.select-block {
  display: block;
  margin-bottom: .75rem;
  padding-left: 1rem;
  position: relative;
}

label {
  cursor: pointer;
  font-weight: 400;
  margin-bottom: 0;
  padding-left: 1.25rem;
}

input {
  color: inherit;
  line-height: inherit;
  font: inherit;
  margin: .25rem 0 0 -1.25rem;
  position: static;
}
</style>