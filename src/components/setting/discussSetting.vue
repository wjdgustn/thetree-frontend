<template>
  <SettingItemSelect :label="$t('components.wiki_setting.strike.name')" ckey="wiki.strike" default="show">
    <option value="show">{{$t('components.wiki_setting.strike.show')}}</option>
    <option value="remove">{{$t('components.discuss_setting.strike.remove')}}</option>
    <option value="hide">{{$t('components.wiki_setting.strike.hide')}}</option>
  </SettingItemSelect>
  <SettingItemSelect :label="$t('components.discuss_setting.bold')" ckey="wiki.bold" default="show">
    <option value="show">{{$t('components.wiki_setting.strike.show')}}</option>
    <option value="remove">{{$t('components.discuss_setting.strike.remove')}}</option>
    <option value="hide">{{$t('components.wiki_setting.strike.hide')}}</option>
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