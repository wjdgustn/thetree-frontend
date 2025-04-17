<template>
  <SettingItem v-bind="$props">
    <select :id="ckey" v-model="value">
      <slot/>
    </select>
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
    default: String
  }
}
</script>
<style scoped>
select {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  color: #55595c;
  display: block;
  line-height: 1.5;
  margin: 0;
  max-width: 16rem;
  padding: .375rem .75rem;
  width: 100%;
}
</style>