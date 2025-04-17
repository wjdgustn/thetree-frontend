<template>
  <VueFinalModal classes="vfm-padding" content-class="vfm-content">
    <div class="setting-block">
      <button>×</button>
      <h1>설정</h1>
      <header>
        <ul>
          <template v-for="tab in tabs">
            <li v-text="tab.label" :class="{ 'selected-tab': selectedTab === tab }" @click="selectTab(tab)"></li>
          </template>
        </ul>
      </header>
      <TransitionGroup name="slide-fade" tag="section" mode="out-in">
        <template v-for="tab in tabs">
          <div v-if="tab === selectedTab" :key="tab.name">
            <component :is="tab.component"/>
          </div>
        </template>
      </TransitionGroup>
    </div>
  </VueFinalModal>
</template>
<script>
import { markRaw } from 'vue'

import WikiSetting from '@/components/setting/wikiSetting'
import DiscussSetting from '@/components/setting/discussSetting.vue'
import SkinSetting from 'skin/components/settingModal'

export default {
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
      selectedTab: null
    }
  },
  created() {
    this.selectedTab = this.tabs[0]
  },
  methods: {
    selectTab(tab) {
      this.selectedTab = tab
    }
  }
}
</script>
<style>
.vfm-padding {
  overflow-y: scroll;
  padding: 1rem .5rem;
}

.vfm-content {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: .25rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 600px;
  position: relative;
}

.theseed-dark-mode .vfm-content {
  background-color: #2d2f34;
  border-color: #2d3748;
}
</style>
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