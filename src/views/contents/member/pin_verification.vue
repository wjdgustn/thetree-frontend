<template>
  <FormErrorAlert/>
  <SeedForm ref="form" method="post" action="/member/login/pin" captcha>
    <p>
      확인되지 않은 기기에서 로그인하셨습니다.<br>
      <template v-if="useTotp">
        <span v-if="passkey">Passkey을 사용하여 2단계 인증을 진행합니다.</span>
        <span v-else>Google Authenticator 코드를 입력해주세요.</span>
      </template>
      <template v-else>
        이메일(<b v-text="email"></b>)로 전송된 PIN을 입력해주세요.
      </template>
    </p>

    <template v-if="passkey">
      <div class="passkey-icon">
        <FontAwesomeIcon icon="key" />
      </div>
      <FlexFormBlock class="padding">
        <GeneralButton :whenClick="passkeyLogin" theme="primary" block>Passkey 로그인</GeneralButton>
      </FlexFormBlock>
    </template>
    <template v-else>
      <FlexFormBlock>
        <PinInput ref="pinInput" name="pin"/>
      </FlexFormBlock>
    </template>

    <FlexFormBlock :class="{ 'buttons padding': !passkey }">
      <CheckBox name="trust">이 기기를 신뢰</CheckBox>
      <template #buttons v-if="!passkey">
        <GeneralButton type="submit" theme="primary">로그인</GeneralButton>
      </template>
    </FlexFormBlock>

    <FlexFormBlock class="other-method">
      <div class="other-method-title">다른 인증 방법</div>

      <GeneralButton v-if="passkey" class="other-method-button" :whenClick="togglePasskey">
        <div class="other-method-icon">
          <FontAwesomeIcon icon="mobile-screen" />
        </div>
        <div class="other-method-content">
          <div>일회용 암호</div>
          <div class="other-method-description">
            이메일이나 OTP 앱에서 받은 일회용 인증 코드를 입력하여 인증합니다.
          </div>
        </div>
        <div class="other-method-arrow">
          <FontAwesomeIcon icon="chevron-right" />
        </div>
      </GeneralButton>
      <GeneralButton v-else class="other-method-button" :whenClick="togglePasskey">
        <div class="other-method-icon">
          <FontAwesomeIcon icon="key" />
        </div>
        <div class="other-method-content">
          <div>Passkey</div>
          <div class="other-method-description">
            지문, 얼굴 인식 또는 보안 키를 사용하여 인증합니다.
          </div>
        </div>
        <div class="other-method-arrow">
          <FontAwesomeIcon icon="chevron-right" />
        </div>
      </GeneralButton>
    </FlexFormBlock>
  </SeedForm>
</template>
<script>
import { startAuthentication } from '@simplewebauthn/browser'

import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import FlexFormBlock from '@/components/form/flexFormBlock'
import CheckBox from '@/components/form/checkBox'
import GeneralButton from '@/components/generalButton'
import PinInput from '@/components/form/pinInput'

export default {
  mixins: [Common],
  components: {
    SeedForm,
    FormErrorAlert,
    FlexFormBlock,
    CheckBox,
    GeneralButton,
    PinInput
  },
  data() {
    const viewData = this.$store.state.viewData
    return {
      ...viewData,
      passkey: viewData.hasPasskey
    }
  },
  mounted() {
    if(this.passkey) this.passkeyLogin()
    else this.$refs.pinInput.focus()
  },
  watch: {
    async passkey(newValue) {
      if(!newValue) {
        await this.$nextTick()
        this.$refs.pinInput.focus()
      }
    }
  },
  methods: {
    togglePasskey() {
      this.passkey = !this.passkey
    },
    async passkeyLogin() {
      this.$refs.form.submitting = true

      let asseResp
      try {
        asseResp = await startAuthentication({ optionsJSON: this.$store.state.page.data.passkeyData })
      } catch (e) {
        console.error(e)
        alert(e.toString())
        this.$refs.form.submitting = false
        return
      }

      const json = await this.internalRequest('/member/login/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          challenge: asseResp
        })
      })
      await this.processInternalResponse(json)

      this.$refs.form.submitting = false
    }
  }
}
</script>
<style scoped>
form {
  margin: 0 auto;
  max-width: 28rem;
}

.passkey-icon {
  color: var(--text-secondary-color, rgba(33, 37, 41, .749));
  margin: 4rem 0 2rem;
  text-align: center;
}

.passkey-icon svg {
  fill: currentColor;
  max-width: 5rem;
  height: inherit;
}

.other-method {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 4rem 0 0;
}

.other-method-title {
  font-size: 1.4rem;
  font-weight: 500;
}

.other-method-button {
  align-items: stretch;
  gap: .75rem;
  justify-content: flex-start;
  padding: .75rem;
}

.other-method-icon {
  height: 1.75rem;
  padding: .25rem;
  width: 1.75rem;
}

.other-method-icon svg {
  width: 100%;
  height: 100%;
}

.other-method-content {
  flex: 1;
  width: 0;
}

.other-method-description {
  font-size: .8rem;
  white-space: normal;
}

.other-method-arrow {
  align-items: center;
  display: flex;
  margin: 0 .25rem 0 0;
  width: .65rem;
}

.other-method-arrow svg {
  width: auto;
  height: auto;
}
</style>