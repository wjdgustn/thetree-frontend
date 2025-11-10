<template>
  <SettingItem :="$props">
    <InputField class="setting-input" v-model="value" :id="ckey" :whenInput="changed" :type="type" placeholder="입력"/>
  </SettingItem>
</template>
<script>
import SettingItem from '@/components/settingItem'
import InputField from '@/components/form/inputField'

export default {
  extends: SettingItem,
  components: {
    InputField,
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
.setting-input {
  width: 17rem;
}
</style>