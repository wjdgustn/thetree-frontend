<template>
  <SettingItemSelect
      :label="$t('components.wiki_setting.language')"
      ckey="lang"
      :default="$i18next.language"
      @change="$i18next.changeLanguage($event.target.value)"
      noSave
  >
    <option v-for="locale in locales" :value="locale.code">{{locale.name}}</option>
  </SettingItemSelect>
  <SettingItemSelect
      v-if="session.account.type !== 1"
      :label="$t('views.mypage.skin')"
      ckey="skin"
      :default="skinName"
      @change="skinChange"
      noSave
  >
    <option value="default">{{$t('views.mypage.default_skin')}}</option>
    <option v-for="skin in config.skins">{{skin}}</option>
  </SettingItemSelect>
  <SettingItemSelect :label="$t('components.wiki_setting.theme.name')" ckey="wiki.theme" default="auto">
    <option value="auto">{{$t('components.wiki_setting.theme.auto')}}</option>
    <option value="light">{{$t('components.wiki_setting.theme.light')}}</option>
    <option value="dark">{{$t('components.wiki_setting.theme.dark')}}</option>
  </SettingItemSelect>
  <SettingItemCheckbox :label="$t('components.wiki_setting.unfold_wiki_link')" ckey="wiki.unfold_wiki_link" />
  <SettingItemCheckbox :label="$t('components.wiki_setting.nowrap_wiki_table')" ckey="wiki.nowrap_wiki_table" />
  <SettingItemCheckbox :label="$t('components.wiki_setting.hide_heading_content')" ckey="wiki.hide_heading_content" />
  <SettingItemCheckbox :label="$t('components.wiki_setting.show_folding')" ckey="wiki.show_folding" />
  <SettingItemSelect :label="$t('components.wiki_setting.strike.name')" ckey="wiki.strike" default="show">
    <option value="show">{{$t('components.wiki_setting.strike.show')}}</option>
    <option value="remove">{{$t('components.wiki_setting.strike.remove')}}</option>
    <option value="hide">{{$t('components.wiki_setting.strike.hide')}}</option>
  </SettingItemSelect>
  <SettingItemSelect :label="$t('components.wiki_setting.footnote_type.name')" ckey="wiki.footnote_type" :default="footnoteType">
    <option value="default">{{$t('components.wiki_setting.footnote_type.default')}}</option>
    <option value="popover">{{$t('components.wiki_setting.footnote_type.popover')}}</option>
    <option value="popup">{{$t('components.wiki_setting.footnote_type.popup')}}</option>
    <option value="unfold">{{$t('components.wiki_setting.footnote_type.unfold')}}</option>
  </SettingItemSelect>
  <SettingItemSelect :label="$t('components.wiki_setting.image_hide.name')" ckey="wiki.image_hide" default="show">
    <option value="show">{{$t('components.wiki_setting.image_hide.show')}}</option>
    <option value="hide">{{$t('components.wiki_setting.image_hide.hide')}}</option>
    <option value="hide_1mb">{{$t('components.wiki_setting.image_hide.hide_1mb')}}</option>
  </SettingItemSelect>
  <SettingItemCheckbox :label="$t('components.wiki_setting.disable_image_lazy')" ckey="wiki.disable_image_lazy"/>
  <SettingItemSelect :label="$t('components.wiki_setting.category_position.name')" ckey="wiki.category_position" default="top">
    <option value="top">{{$t('components.wiki_setting.category_position.top')}}</option>
    <option value="bottom">{{$t('components.wiki_setting.category_position.bottom')}}</option>
    <option value="both">{{$t('components.wiki_setting.category_position.both')}}</option>
  </SettingItemSelect>
  <SettingItemSelect label="기본 편집 모드" ckey="wiki.default_edit_mode" :default="defaultEditMode">
    <template v-for="mode in editModes">
      <option :value="mode.name">{{mode.label}}</option>
    </template>
  </SettingItemSelect>
  <SettingItemCheckbox :label="$t('components.wiki_setting.no_relative_date')" ckey="wiki.no_relative_date" />
</template>
<script>
import Common from '@/mixins/common'
import SettingItemCheckbox from '@/components/settingItemCheckbox'
import SettingItemSelect from '@/components/settingItemSelect'

import { isMobile } from '@/utils'

export default {
  mixins: [Common],
  components: {
    SettingItemCheckbox,
    SettingItemSelect
  },
  data() {
    return {
      skinName: __THETREE_SKIN_NAME__,
      locales: __THETREE_LOCALES__
    }
  },
  computed: {
    footnoteType() {
      return isMobile ? 'popup' : 'popover'
    },
    editModes() {
      return [
        ...this.$store.state.thetreePlugins.editor.map(a => a.pluginInfo),
        {
          name: 'raw',
          label: 'RAW 편집'
        }
      ]
    },
    defaultEditMode() {
      return isMobile ? 'raw' : this.editModes[0].name
    }
  },
  methods: {
    async skinChange(e) {
      await this.internalRequestAndProcess('/member/ipskin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          skin: e.target.value
        }),
        noProgress: true
      })
    }
  }
}
</script>