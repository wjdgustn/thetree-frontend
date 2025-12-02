<template>
  <Modal v-slot="props">
    <div class="setting-block">
      <button @click="props.close">×</button>
      <h1>설정</h1>
      <header>
        <ul>
          <template v-for="tab in tabs">
            <li :class="{ 'selected-tab': selectedTab === tab }" @click="selectTab(tab)">{{tab.label}}</li>
          </template>
        </ul>
      </header>
      <TransitionGroup name="slide-fade" tag="section" mode="out-in">
        <template v-for="tab in tabs">
          <div v-if="tab === selectedTab" :key="tab.name">
            <SettingItemSelect
                v-if="session.account.type !== 1 && selectedTab.name === 'skin'"
                label="스킨"
                ckey="skin"
                :default="skinName"
                @change="skinChange"
                noSave
            >
              <option value="default">기본 스킨</option>
              <option v-for="skin in config.skins">{{skin}}</option>
            </SettingItemSelect>
            <component :is="tab.component"/>
          </div>
        </template>
      </TransitionGroup>
    </div>
  </Modal>
</template>
<script>
import { markRaw } from 'vue'

import Common from '@/mixins/common'
import WikiSetting from '@/components/setting/wikiSetting'
import DiscussSetting from '@/components/setting/discussSetting'
import Modal from '@/components/modal'
import SettingItemSelect from '@/components/settingItemSelect'

export default {
  mixins: [Common],
  components: {
    SettingItemSelect,
    Modal
  },
  data() {
    return {
      tabs: [
        {
          name: 'wiki',
          label: '위키',
          component: markRaw(WikiSetting)
        },
        {
          name: 'discuss',
          label: '토론',
          component: markRaw(DiscussSetting)
        },
        {
          name: 'skin',
          label: '스킨',
          component: this.$slots.default
        }
      ],
      selectedTab: null,
      skinName: __THETREE_SKIN_NAME__
    }
  },
  created() {
    this.selectedTab = this.tabs[0]
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab
    },
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
<style scoped>
button {
  background: 0 0;
  border: 0;
  color: #000;
  cursor: pointer;
  float: right;
  font-size: 1.5rem!important;
  font-weight: 700;
  line-height: 1;
  margin: 0 0 0 .5rem;
  opacity: .2;
  overflow: visible;
  padding: 0;
  position: relative;
  right: 0;
  text-shadow: 0 1px 0 #fff;
  text-transform: none;
  top: 0;
}

.theseed-dark-mode button {
  color: #fff;
}

button:focus,button:hover {
  cursor: pointer;
  opacity: .5;
  text-decoration: none;
}

.slide-fade-enter-active {
  transition: all .2s ease;
}

.slide-fade-leave-active {
  transition: all .2s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter, .slide-fade-leave-active, .slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

div.setting-block {
  padding: 1rem;
}

header {
  border: 1px solid #ccc;
  height: 2.6rem;
  margin-bottom: 1.2rem;
  padding: .3rem;
}

header>ul {
  list-style: none outside none !important;
  margin-bottom: 0;
  margin-top: 0;
  padding-left: 0;
}

header>ul>li {
  border-radius: 0;
  color: #000;
  cursor: pointer;
  display: block;
  float: left;
  padding: .3rem .5rem;
  user-select: none;
}

.theseed-dark-mode header>ul>li {
  color: #ddd;
}

header>ul>li.selected-tab {
  background-color: #ababab;
  color: #fff;
}

section>div {
  min-height: 700px;
}

h1 {
  color: inherit;
  font-family: inherit;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 .5rem;
}
</style>