<template>
  <LinkTab :items="[
      {
        title: $t('views.notifications.status.unread'),
        href: '?status=unread',
        active: !$route.query.status || $route.query.status === 'unread'
      },
      {
        title: $t('views.notifications.status.read'),
        href: '?status=read',
        active: $route.query.status === 'read'
      },
      {
        title: $t('views.notifications.status.all'),
        href: '?status=all',
        active: $route.query.status === 'all'
      }
  ]"/>
  <div class="top-button-group">
    <PrevNextBtn flex v-bind="data.pageProps"/>
    <GeneralButton v-if="showSubscribePushUI" :whenClick="subscribePushNotificationButton" :disabled="disableSubscribePushUI">{{$t('views.notifications.turn_on_push')}}</GeneralButton>
    <GeneralButton :whenClick="readAll" :disabled="!session.notifications.length">{{$t('views.notifications.read_all')}}</GeneralButton>
  </div>
  <ul class="list">
    <li v-if="data.items.length" v-for="item in data.items" class="row-parent" :class="{ read: item.read }">
      <component :to="item.url" :is="item.url ? 'NuxtLink' : 'div'" class="row row-link">
        <div class="item">
            <span class="icon" :class="iconClass(item.type)">
              <FontAwesomeIcon :icon="iconName(item.type)" />
            </span>
        </div>
        <div class="item content">
          <template v-if="item.type === NotificationTypes.UserDiscuss">
            <div>
              <i18next :translation="$t('views.notifications.messages.user_discuss')">
                <template #user>
                  <AuthorSpan :account="item.comment.user"/>
                </template>
                <template #link>
                  <NuxtLink :to="'/thread/' + item.thread.url">{{item.thread.topic}} #{{item.comment.id}}</NuxtLink>
                </template>
              </i18next>
            </div>
            <div class="text">{{removeHtmlTags(item.comment.contentHtml)}}</div>
          </template>
          <template v-else-if="item.type === NotificationTypes.Mention">
            <div>
              <i18next :translation="$t('views.notifications.messages.mention')">
                <template #user>
                  <AuthorSpan :account="item.comment.user"/>
                </template>
                <template #link>
                  <NuxtLink :to="'/thread/' + item.thread.url">{{item.thread.topic}} #{{item.comment.id}}</NuxtLink>
                </template>
              </i18next>
              <span class="document-group">
                <span class="document-icon">
                  <FontAwesomeIcon icon="fa-regular fa-file-lines" />
                </span>
                <NuxtLink :to="doc_action_link(item.document, 'discuss')" class="document-link">{{doc_fulltitle(item.document)}}</NuxtLink>
              </span>
            </div>
            <div class="text">{{removeHtmlTags(item.comment.contentHtml)}}</div>
          </template>
          <template v-else-if="item.type === NotificationTypes.Owner || item.type === NotificationTypes.Plugin">
            <div v-html="item.data" class="html-notification"/>
          </template>

          <div class="text">
            <LocalDate :date="item.createdAt" relative/>
          </div>
        </div>
        <div class="buttons-wrap">
          <GeneralButton v-if="item.read" size="small" :whenClick="() => markNotification(item.uuid, false)">{{$t('views.notifications.mark_unread')}}</GeneralButton>
          <GeneralButton v-else size="small" :whenClick="() => markNotification(item.uuid, true)">{{$t('views.notifications.mark_read')}}</GeneralButton>
        </div>
      </component>
    </li>
    <li v-else class="row-parent">
      <div class="row no-item">
        ({{$t('views.notifications.checked_all')}})
      </div>
    </li>
  </ul>
  <PrevNextBtn flex v-bind="data.pageProps"/>
</template>
<script>
import Common from '@/mixins/common'

import Comment from '@/components/comment'
import LinkTab from '@/components/linkTab'
import PrevNextBtn from '@/components/prevNextBtn'
import NuxtLink from '@/components/global/nuxtLink'
import AuthorSpan from '@/components/authorSpan'
import LocalDate from '@/components/localDate'
import GeneralButton from '@/components/generalButton'
import Alert from '@/components/alert'

const NotificationTypes = {
  UserDiscuss: 0,
  Mention: 1,
  Owner: 2,
  Plugin: 3
}

export default {
  mixins: [Common],
  components: {
    Alert,
    GeneralButton,
    LocalDate,
    AuthorSpan,
    NuxtLink,
    PrevNextBtn,
    LinkTab,
    Comment
  },
  data() {
    return {
      NotificationTypes,
      showSubscribePushUI: false,
      disableSubscribePushUI: false
    }
  },
  mounted() {
    this.onLoaded()
  },
  watch: {
    $route() {
      this.onLoaded()
    }
  },
  computed: {
    pushNotificationSupported() {
      return ('serviceWorker' in navigator) && ('PushManager' in window)
    }
  },
  methods: {
    async onLoaded() {
      if(this.pushNotificationSupported) {
        const subscribed = await this.subscribedPushNotification()
        if(!subscribed)
          this.showSubscribePushUI = true
      }
    },
    iconClass(type) {
      return ({
        [NotificationTypes.UserDiscuss]: 'icon-user-discuss',
        [NotificationTypes.Mention]: 'icon-mention',
        [NotificationTypes.Owner]: 'icon-owner'
      })[type]
    },
    iconName(type) {
      return ({
        [NotificationTypes.UserDiscuss]: 'comments',
        [NotificationTypes.Mention]: 'at',
        [NotificationTypes.Owner]: 'bullhorn',
        [NotificationTypes.Plugin]: 'bell'
      })[type]
    },
    async markNotification(uuid, read) {
      await this.internalRequestAndProcess(`/member/notifications/${uuid}/${read ? 'read' : 'unread'}`, {
        method: 'POST'
      });
    },
    async readAll() {
      await this.internalRequestAndProcess('/member/notifications/read', {
        method: 'POST'
      });
    },
    async subscribedPushNotification() {
      if(!this.pushNotificationSupported) return false

      const registration = await navigator.serviceWorker.getRegistration()
      const subscription = registration && await registration.pushManager.getSubscription()
      return !!subscription
    },
    async subscribePushNotificationButton() {
      this.disableSubscribePushUI = true
      try {
        return await this.subscribePushNotification()
      } finally {
        this.disableSubscribePushUI = false
      }
    },
    async subscribePushNotification() {
      if(!this.pushNotificationSupported) return

      const subscribed = await this.subscribedPushNotification()
      if(subscribed) return

      const status = await Notification.requestPermission()
      if(status === 'denied')
        return alert(this.$t('views.notifications.permission_denied'))

      const { applicationServerKey } = await this.internalRequest('/member/notifications/subscribe')

      const registration = await navigator.serviceWorker.register('/sw.js')
      console.log(registration);
      if(!registration.active) await new Promise(resolve => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          newWorker.addEventListener('statechange', () => {
            if(newWorker.state === 'activated')
              resolve()
          })
        })
      })
      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      })
      console.log(pushSubscription)

      await this.internalRequestAndProcess('/member/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(pushSubscription)
      })

      this.showSubscribePushUI = false;
    }
  }
}
</script>
<style scoped>
.link-tab {
  margin-bottom: 1rem;
}

.list {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

.row {
  display: flex;
  gap: 1rem;
  margin: 0 0 .6rem;
  padding: .6rem .75rem 0;
}

.row-parent {
  border-top: 1px solid #e0e0e0;
}

.theseed-dark-mode .row-parent {
  border-color: #434343;
}

@media screen and (max-width: 727.98px) {
  .row {
    margin: 0 0 .75rem;
    padding: .75rem 0 0 .75rem;
  }
}

@media screen and (max-width: 371.98px) {
  .row {
    flex-direction: column;
    gap: .5rem;
  }
}

.row-parent:last-child {
  border-bottom: 1px solid #e0e0e0;
}

.row:last-child {
  margin: 0;
  padding-bottom: .6rem;
}

@media screen and (max-width: 727.98px) {
  .row:last-child {
    padding-bottom: .75rem;
  }
}

.theseed-dark-mode .row-parent:last-child {
  border-color: #434343;
}

.row:hover {
  background-color: #fbfbfb;
}

.theseed-dark-mode .row:hover {
  background-color: #2a2a2a;
}

.item {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
  row-gap: .25rem;
}

.content {
  flex: 1;
}

.icon {
  display: flex;
  height: 1.25rem;
  width: 1.25rem;
}

.icon svg {
  fill: currentColor;
  height: initial;
}

.text {
  color: #777;
  font-size: .9rem;
}

.document-icon {
  color: #aaa;
  display: inline-block;
  margin: 0 .3rem 0 .15rem;
  width: .65rem;
}

.document-icon svg {
  height: 100%;
  margin: 0 0 -.1em;
  width: 100%;
  fill: currentColor;
}

.document-group {
  font-size: .85rem;
  margin: 0 0 0 .35rem;
}

.document-link {
  color: var(--light-text-color, var(--text-color, #212529));
}

.theseed-dark-mode .document-link {
  color: var(--dark-text-color, var(--text-color, #e0e0e0));
}

.row-link {
  color: inherit;
}

.row-link:hover, .row-link:focus {
  text-decoration: none;
}

.icon-user-discuss {
  color: #46a758;
}

.icon-mention {
  color: #2056b4;
}

.icon-owner {
  color: #d64a58;
}

.buttons-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: .4rem;
}

.read {
  opacity: .5;
}

.top-button-group {
  align-items: center;
  display: flex;
  gap: .5rem;
  justify-content: space-between;
  margin: 1rem 0;
}

.top-button-group .page-group {
  flex: 1;
  margin: 0;
}

.no-item {
  color: #888;
  justify-content: center;
  align-items: center;
}

.html-notification {
  white-space: break-spaces;
}
</style>