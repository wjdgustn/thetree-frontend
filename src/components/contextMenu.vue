<template>
  <PopperWrapper
      theme="contextmenu"
      :delay="0"
      :handleResize="true"
      :autoHide="true"
      :triggers="['click']"
      :placement="placement"
      :popperClass="['context-menu', { 'max-size': !noMaxSize }]"
  >
    <template #popper>
      <slot name="menu"/>
    </template>
    <slot/>
  </PopperWrapper>
</template>
<script>
import { PopperWrapper } from 'floating-vue'

export default {
  props: {
    placement: {
      type: String,
      default: 'bottom-start'
    },
    noMaxSize: Boolean
  },
  components: {
    PopperWrapper
  }
}
</script>
<style>
.context-menu .resize-observer {
  background-color: transparent;
  border: none;
  opacity: 0;
}

.context-menu .resize-observer, .context-menu .resize-observer object {
  display: block;
  height: 100%;
  left: 0;
  overflow: hidden;
  pointer-events: none;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: -1;
}

.context-menu {
  background-color: var(--light-article-background-color, var(--article-background-color, #fff));
  border: 1px solid #d5d5d5;
  border-radius: 6px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, .165), 0 4px 6px -4px rgba(0,0,0,.165);
  margin: .25rem 0 0;
  padding: .25rem 0;
  word-break: break-all;
  z-index: 1000;
}

.theseed-dark-mode .context-menu {
  background-color: var(--dark-article-background-color, var(--article-background-color, #1c1d1f));
  border-color: #484848;
}

.max-size {
  max-width: 15rem;
  min-width: 12rem;
}

.context-menu .v-popper__inner>div {
  display: flex;
  flex-direction: column;
}

.context-menu .v-popper__inner>div button,.context-menu .v-popper__inner>div>a,.context-menu .v-popper__inner>div>label,.context-menu .v-popper__inner>div>span {
  flex: 1;
  justify-content: flex-start !important;
  margin: .125rem .25rem;
  padding: .2rem .75rem !important;
  --button-normal-background-color: none;
  --button-border: none;
}

.theseed-dark-mode .context-menu .v-popper__inner>div button,
.theseed-dark-mode .context-menu .v-popper__inner>div>a,
.theseed-dark-mode .context-menu .v-popper__inner>div>label,
.theseed-dark-mode .context-menu .v-popper__inner>div>span {
  --button-normal-background-color: none;
}

.context-menu .v-popper__inner>div>label {
  padding: .1rem 2rem .1rem .5rem !important;
}

.context-menu .v-popper__inner>div>hr {
  border: 0;
  border-top: 1px solid #d5d5d5;
  margin: .25rem 0;
}

.theseed-dark-mode .context-menu .v-popper__inner>div>hr {
  border-color: #484848;
}

.context-menu .v-popper__arrow-container {
  display: none;
}
</style>