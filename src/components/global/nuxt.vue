<template>
  <div v-if="$store.state.page.contentHtml" v-html="$store.state.page.contentHtml"></div>
  <component v-else :is="$store.state.viewData.viewComponent"></component>
</template>