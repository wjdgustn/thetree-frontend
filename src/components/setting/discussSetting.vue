<template>
  <SettingItemSelect label="취소선" ckey="wiki.strike" default="show">
    <option value="show">보이기</option>
    <option value="remove">취소선 제거</option>
    <option value="hide">숨기기</option>
  </SettingItemSelect>
  <SettingItemSelect label="굵음" ckey="wiki.bold" default="show">
    <option value="show">보이기</option>
    <option value="remove">취소선 제거</option>
    <option value="hide">숨기기</option>
  </SettingItemSelect>
</template>
<script>
import SettingItemCheckbox from '@/components/settingItemCheckbox';
import SettingItemSelect from '@/components/settingItemSelect';

export default {
  components: {
    SettingItemCheckbox,
    SettingItemSelect
  }
}
</script>