<template>
  <SettingItem>
    <input v-model="value" :id="ckey" @change="changed" :type="type" placeholder="입력">
  </SettingItem>
</template>
<script>
import SettingItem from '@/components/settingItem'

export default {
  extends: SettingItem,
  components: {
    SettingItem
  },
  props: {
    type: {
      type: String,
      default: 'text'
    },
    default: {
      type: String
    }
  },
  methods: {
    changed() {
      this.$store.state.localConfigSetValue(this.ckey, this.value)
    }
  }
}
</script>
<style scoped>
input {
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