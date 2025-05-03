<template>
  <Alert v-if="legacySkin && session.notifications.length && !hideNotificationAlert" theme="primary" closable @close="hideNotificationAlert = true">
    확인하지 않은 알림이 {{session.notifications.length}}개<template v-if="session.notifications.length >= 5"> 이상</template> 있습니다. <NuxtLink to="/member/notifications">여기를 눌러</NuxtLink> 확인하세요.
  </Alert>
  <div v-if="$store.state.page.contentHtml" v-html="$store.state.page.contentHtml" @click="onDynamicContentClick"></div>
  <component v-else :is="$store.state.viewData.viewComponent"></component>
</template>
<script>
import Common from '@/mixins/common'

import Alert from '@/components/alert'
import NuxtLink from '@/components/global/nuxtLink'

export default {
  components: {
    Alert,
    NuxtLink
  },
  mixins: [Common],
  data() {
    return {
      hideNotificationAlert: false
    }
  },
  computed: {
    legacySkin() {
      return ['liberty', 'buma'].includes(__THETREE_SKIN_NAME__)
    }
  }
}
</script>