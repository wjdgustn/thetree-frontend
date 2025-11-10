<template>
  <SettingItemSelect label="테마" ckey="wiki.theme" default="auto">
    <option value="auto">자동 (시스템 설정)</option>
    <option value="light">라이트</option>
    <option value="dark">다크</option>
  </SettingItemSelect>
  <SettingItemCheckbox label="내용과 링크가 다른 링크 펼치기" ckey="wiki.unfold_wiki_link" />
  <SettingItemCheckbox label="표 워드랩 사용 안 함" ckey="wiki.nowrap_wiki_table" />
  <SettingItemCheckbox label="문단을 기본으로 접기" ckey="wiki.hide_heading_content" />
  <SettingItemCheckbox label="접기 문법을 기본으로 펼치기" ckey="wiki.show_folding" />
  <SettingItemSelect label="취소선" ckey="wiki.strike" default="show">
    <option value="show">보이기</option>
    <option value="remove">취소선 제거</option>
    <option value="hide">숨기기</option>
  </SettingItemSelect>
  <SettingItemSelect label="각주 표시 형식" ckey="wiki.footnote_type" :default="footnoteType">
    <option value="default">브라우저 기본</option>
    <option value="popover">팝오버</option>
    <option value="popup">팝업</option>
    <option value="unfold">펼침</option>
  </SettingItemSelect>
  <SettingItemSelect label="파일" ckey="wiki.image_hide" default="show">
    <option value="show">보이기</option>
    <option value="hide">숨기기</option>
    <option value="hide_1mb">1MB 이상 파일 숨기기</option>
  </SettingItemSelect>
  <SettingItemCheckbox label="파일 lazy load 비활성화" ckey="wiki.disable_image_lazy"/>
  <SettingItemSelect label="분류 위치" ckey="wiki.category_position" default="top">
    <option value="top">상단</option>
    <option value="bottom">하단</option>
    <option value="both">모두</option>
  </SettingItemSelect>
  <SettingItemSelect label="기본 편집 모드" ckey="wiki.default_edit_mode" :default="defaultEditMode">
    <template v-for="mode in editModes">
      <option :value="mode.name">{{mode.label}}</option>
    </template>
  </SettingItemSelect>
  <SettingItemCheckbox label="상대 시간 표기를 사용하지 않음" ckey="wiki.no_relative_date" />
</template>
<script>
import SettingItemCheckbox from '@/components/settingItemCheckbox';
import SettingItemSelect from '@/components/settingItemSelect';

import { isMobile } from '@/utils'
import SettingItemInput from '@/components/settingItemInput'

export default {
  components: {
    SettingItemCheckbox,
    SettingItemSelect
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
  }
}
</script>