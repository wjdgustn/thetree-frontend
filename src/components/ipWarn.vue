<template>
  <div>
    <BlinkRedWarn v-if="session.account.type !== 1">
      <template v-if="discuss">
        비로그인 상태로 토론에 참여합니다. 토론 내역에 IP({{session.account.name}}) 주소 전체가 영구히 기록됩니다.
      </template>
      <template v-else>
        비로그인 상태로 편집합니다. 로그인하지 않은 상태로 문서 편집을 저장하면, 편집 역사에 본인이 사용하는 IP({{session.account.name}}) 주소 전체가 영구히 기록됩니다.
      </template>
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