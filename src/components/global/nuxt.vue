<template>
  <Alert v-if="legacySkin && session.notifications.length && !hideNotificationAlert" theme="primary" closable @close="hideNotificationAlert = true">
    <i18next :translation="$t('components.nuxt.unchecked_notification' + (session.notifications.length >= 5 ? '_many' : ''), { count: session.notifications.length })">
      <template #link>
        <NuxtLink to="/member/notifications">{{$t('components.nuxt.unchecked_notification_link_text')}}</NuxtLink>
      </template>
    </i18next>
  </Alert>
  <template v-if="$store.state.page.contentHtml">
    <div v-html="$store.state.page.contentHtml" @click="onDynamicContentClick"></div>
    <p v-if="page.title === $t('titles.error') && data.document">
      <GeneralButton :href="doc_action_link(data.document, 'w')">{{$t('components.nuxt.go_back_to_document')}}</GeneralButton>
    </p>
  </template>
  <component v-else :is="$store.state.viewData.viewComponent"></component>
</template>
<script>
import Common from '@/mixins/common'

import Alert from '@/components/alert'
import NuxtLink from '@/components/global/nuxtLink'
import GeneralButton from '@/components/generalButton.vue';

export default {
  components: {
    GeneralButton,
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