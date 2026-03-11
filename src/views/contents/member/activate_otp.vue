<template>
  <FormErrorAlert/>
  <div v-if="step === 1" :class="[$style.form, $style['form--large']]">
    <div :class="$style.form__row">
      <div :class="$style['form__section-title']">{{$t('views.activate_otp.step', { count: 1 })}}</div>
      <div>
        <p>{{$t('views.activate_otp.install_app')}}</p>
        <ul>
          <li>
            Google OTP
            (<a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" rel="noopener" target="_blank">Play Store</a>,
            <a href="https://apps.apple.com/us/app/google-authenticator/id388497605" rel="noopener" target="_blank">App Store</a>)
          </li>
          <li>
            FreeOTP
            (<a href="https://play.google.com/store/apps/details?id=org.fedorahosted.freeotp" rel="noopener" target="_blank">Play Store</a>,
            <a href="https://apps.apple.com/us/app/freeotp-authenticator/id872559395" rel="noopener" target="_blank">App Store</a>)
          </li>
        </ul>
        <p>{{$t('views.activate_otp.other_app')}}</p>
        <p>
          [<FontAwesomeIcon :class="$style.icon" icon="triangle-exclamation" /> {{$t('views.activate_otp.warn')}}]
          <br>
          {{$t('views.activate_otp.understand')}}
        </p>
      </div>
    </div>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" :whenClick="nextStep">
          <span>{{$t('views.activate_otp.next')}}</span>
          <FontAwesomeIcon icon="chevron-right"/>
        </GeneralButton>
      </div>
    </div>
  </div>
  <div v-if="step === 2" :class="[$style.form, $style['form--large']]">
    <div :class="$style.form__row">
      <div :class="$style['form__section-title']">{{$t('views.activate_otp.step', { count: 2 })}}</div>
      <div>
        <ol>
          <li>{{$t('views.activate_otp.run_app')}}</li>
          <li>{{$t('views.activate_otp.add_code')}}</li>
          <li>{{$t('views.activate_otp.follow_step')}}</li>
        </ol>
        <p>{{$t('views.activate_otp.mobile_guide')}}</p>
      </div>
    </div>
    <div :class="[$style.form__row, $style['form__row--center']]">
      <a :href="data.qrUrl" class="qrcode">
        <img :src="data.qrcode">
      </a>
    </div>
    <div :class="$style.form__row">
      <p>{{$t('views.activate_otp.secret_key_guide')}}</p>
    </div>
    <div :class="[$style.form__row, $style['form__row--self-center']]">
      <label>{{$t('views.activate_otp.secret_key')}}</label>
      <div :class="$style['form__row-inner']">
        <InputField class="secret-input" readonly disabled center :value="data.secret"/>
        <GeneralButton class="copy-button" :whenClick="copySecret">
          <FontAwesomeIcon icon="fa-regular fa-copy"/>
        </GeneralButton>
      </div>
    </div>
    <div :class="[$style.form__row, $style['form__row--between'], $style['form__row--buttons']]">
      <GeneralButton :class="$style.button" :whenClick="prevStep">
        <FontAwesomeIcon icon="chevron-left"/>
        <span>{{$t('views.activate_otp.prev')}}</span>
      </GeneralButton>
      <GeneralButton :class="$style.button" :whenClick="nextStep">
        <span>{{$t('views.activate_otp.next')}}</span>
        <FontAwesomeIcon icon="chevron-right"/>
      </GeneralButton>
    </div>
  </div>
  <SeedForm v-if="step === 3" :class="[$style.form, $style['form--large']]" method="post">
    <div style="margin: 0 0 1rem">
      <div :class="$style['form__section-title']">{{$t('views.activate_otp.step', { count: 3 })}}</div>
      <div>
        <p>{{$t('views.activate_otp.put_code_for_enable')}}</p>
      </div>
    </div>
    <SeedFormBlock newStyle :label="$t('views.activate_otp.otp_label')" inputId="pinInput" name="pin">
      <PinInput name="pin"/>
    </SeedFormBlock>
    <div :class="[$style.form__row, $style['form__row--between'], $style['form__row--buttons']]">
      <GeneralButton :class="$style.button" :whenClick="prevStep">
        <FontAwesomeIcon icon="chevron-left"/>
        <span>{{$t('views.activate_otp.prev')}}</span>
      </GeneralButton>
      <GeneralButton :class="$style.button" type="submit" theme="primary">{{$t('views.activate_otp.submit')}}</GeneralButton>
    </div>
  </SeedForm>
</template>
<script>
import { toast } from 'vue-sonner'

import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedFormBlock from '@/components/form/seedFormBlock'
import GeneralButton from '@/components/generalButton'
import InputField from '@/components/form/inputField'
import PinInput from '@/components/form/pinInput'

export default {
  components: {
    PinInput,
    InputField,
    GeneralButton,
    SeedForm,
    FormErrorAlert,
    SeedFormBlock
  },
  data() {
    return {
      step: 1
    }
  },
  methods: {
    prevStep() {
      if(this.step > 1)
        this.step--;
    },
    nextStep() {
      if(this.step < 3)
        this.step++;
    },
    copySecret() {
      navigator.clipboard.writeText(this.data.secret)
      toast(this.$t('views.activate_otp.copied_secret_key'))
    }
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>
<style scoped>
.qrcode {
  padding: .5rem;
}

.qrcode, .secret-input {
  max-width: 17rem;
  width: 100%;
}

.copy-button {
  align-self: stretch;
  margin: 0 0 0 -.5rem;
}

.copy-button svg {
  overflow: hidden;
}
</style>