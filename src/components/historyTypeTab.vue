<template>
  <LinkTab
      class="link-tab"
      :items="[
          {
            title: '전체',
            href: '?logtype=all',
            active: !$route.query.logtype || $route.query.logtype === 'all'
          },
          {
            title: '새 문서',
            href: '?logtype=create',
            active: $route.query.logtype === 'create'
          },
          {
            title: '삭제',
            href: '?logtype=delete',
            active: $route.query.logtype === 'delete'
          },
          {
            title: '이동',
            href: '?logtype=move',
            active: $route.query.logtype === 'move'
          },
          {
            title: '되돌림',
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