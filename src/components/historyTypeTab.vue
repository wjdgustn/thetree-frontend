<template>
  <LinkTab
      class="link-tab"
      :items="[
          {
            title: $t('components.history_type_tab.all'),
            href: '?logtype=all',
            active: !$route.query.logtype || $route.query.logtype === 'all'
          },
          {
            title: $t('components.history_type_tab.create'),
            href: '?logtype=create',
            active: $route.query.logtype === 'create'
          },
          {
            title: $t('components.history_type_tab.delete'),
            href: '?logtype=delete',
            active: $route.query.logtype === 'delete'
          },
          {
            title: $t('components.history_type_tab.move'),
            href: '?logtype=move',
            active: $route.query.logtype === 'move'
          },
          {
            title: $t('components.history_type_tab.revert'),
            href: '?logtype=revert',
            active: $route.query.logtype === 'revert'
          }
      ]"
  />
</template>
<script>
import LinkTab from '@/components/linkTab'

export default {
  components: {
    LinkTab
  }
}
</script>