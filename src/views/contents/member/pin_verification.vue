<template>
  <FormErrorAlert/>
  <SeedForm ref="form" method="post" action="/member/login/pin">
    <input type="hidden" name="autologin" :value="autologin">

    <p>
      {{$t('views.pin_verification.new_device')}}<br>
      <template v-if="useTotp">
        <span v-if="passkey">{{$t('views.pin_verification.passkey_verify')}}</span>
        <span v-else>{{$t('views.pin_verification.otp_verify')}}</span>
      </template>
      <template v-else>
        <i18next :translation="$t('views.pin_verification.email_verify')">
          <template #email>
            <b>{{email}}</b>
          </template>
        </i18next>
      </template>
    </p>

    <template v-if="passkey">
      <div class="passkey-icon">
        <FontAwesomeIcon icon="key" />
      </div>
      <FlexFormBlock class="padding">
        <GeneralButton :whenClick="passkeyLogin" theme="primary" block>{{$t('views.pin_verification.passkey_login_button')}}</GeneralButton>
      </FlexFormBlock>
    </template>
    <template v-else>
      <FlexFormBlock>
        <PinInput ref="pinInput" name="pin"/>
      </FlexFormBlock>
    </template>

    <FlexFormBlock :class="{ 'buttons padding': !passkey }">
      <CheckBox name="trust">{{$t('views.pin_verification.trust')}}</CheckBox>
      <template #buttons v-if="!passkey">
        <GeneralButton type="submit" theme="primary">{{$t('views.pin_verification.login_button')}}</GeneralButton>
      </template>
    </FlexFormBlock>

    <FlexFormBlock v-if="data.hasPasskey" class="other-method">
      <div class="other-method-title">{{$t('views.pin_verification.other_method')}}</div>

      <GeneralButton v-if="passkey" class="other-method-button" :whenClick="togglePasskey">
        <div class="other-method-icon">
          <FontAwesomeIcon icon="mobile-screen" />
        </div>
        <div class="other-method-content">
          <div>{{$t('views.pin_verification.otp_method')}}</div>
          <div class="other-method-description">
            {{$t('views.pin_verification.otp_method_description')}}
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
          <div>{{$t('views.pin_verification.passkey_method')}}</div>
          <div class="other-method-description">
            {{$t('views.pin_verification.passkey_method_description')}}
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
import { startAuthentication, WebAuthnAbortService } from '@simplewebauthn/browser'

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
  beforeUnmount() {
    WebAuthnAbortService.cancelCeremony()
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
        if(e.code === 'ERROR_CEREMONY_ABORTED') return
        console.error(e)
        alert(e.toString())
        this.$refs.form.submitting = false
        return
      }

      await this.internalRequestAndProcess('/member/login/pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          challenge: asseResp,
          autologin: this.autologin
        })
      })

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