<template>
  <div>
    <BlinkRedWarn v-if="session.account.type !== 1">
      {{$t('components.ip_warn.' + (discuss ? 'discuss' : 'document'), { ip: session.account.name })}}
    </BlinkRedWarn>
  </div>
</template>
<script>
import BlinkRedWarn from '@/components/blinkRedWarn'

export default {
  components: {
    BlinkRedWarn
  },
  props: {
    discuss: Boolean
  }
}
</script>