<template>
  <FormErrorAlert/>
  <div v-if="step === 1" :class="[$style.form, $style['form--large']]">
    <div :class="$style.form__row">
      <div :class="$style['form__section-title']">1단계</div>
      <div>
        <p>모바일 장치에 일회용 비밀번호 (OTP) 등록을 위한 인증기 애플리케이션을 설치합니다.</p>
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
        <p>위의 예시 외에도 본인이 선호하는 인증기 애플리케이션을 사용할 수 있습니다.</p>
        <p>
          [<FontAwesomeIcon :class="$style.icon" icon="triangle-exclamation" /> 주의]
          <br>
          일회용 비밀번호를 설정하면 계정에 어떤 영향을 주는지 이해하는 경우에만 설정하세요.
        </p>
      </div>
    </div>
    <div :class="[$style.form__row, $style['form__row--buttons']]">
      <div :class="$style.form__buttons">
        <GeneralButton :class="$style.button" :whenClick="nextStep">
          <span>다음</span>
          <FontAwesomeIcon icon="chevron-right"/>
        </GeneralButton>
      </div>
    </div>
  </div>
  <div v-if="step === 2" :class="[$style.form, $style['form--large']]">
    <div :class="$style.form__row">
      <div :class="$style['form__section-title']">2단계</div>
      <div>
        <ol>
          <li>인증기 애플리케이션을 실행합니다.</li>
          <li>코드 추가를 클릭합니다.</li>
          <li>화면에 표시되는 단계를 따릅니다.</li>
        </ol>
        <p>모바일 장치에서 등록을 시도하는 경우, QR 코드를 클릭해서 바로 인증기 애플리케이션에 등록할 수 있습니다.</p>
      </div>
    </div>
    <div :class="[$style.form__row, $style['form__row--center']]">
      <a :href="data.qrUrl" class="qrcode">
        <img :src="data.qrcode">
      </a>
    </div>
    <div :class="$style.form__row">
      <p>만약 QR 코드를 사용할 수 없는 경우, 아래의 비밀키를 사용하세요.</p>
    </div>
    <div :class="[$style.form__row, $style['form__row--self-center']]">
      <label>비밀키</label>
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
        <span>이전</span>
      </GeneralButton>
      <GeneralButton :class="$style.button" :whenClick="nextStep">
        <span>다음</span>
        <FontAwesomeIcon icon="chevron-right"/>
      </GeneralButton>
    </div>
  </div>
  <SeedForm v-if="step === 3" :class="[$style.form, $style['form--large']]" method="post">
    <div style="margin: 0 0 1rem">
      <div :class="$style['form__section-title']">3단계</div>
      <div>
        <p>아래에 일회용 비밀번호를 입력해서 2단계 인증을 활성화 할 수 있습니다.</p>
      </div>
    </div>
    <SeedFormBlock newStyle label="일회용 비밀번호 (OTP)" inputId="pinInput" name="pin">
      <PinInput name="pin"/>
    </SeedFormBlock>
    <div :class="[$style.form__row, $style['form__row--between'], $style['form__row--buttons']]">
      <GeneralButton :class="$style.button" :whenClick="prevStep">
        <FontAwesomeIcon icon="chevron-left"/>
        <span>이전</span>
      </GeneralButton>
      <GeneralButton :class="$style.button" type="submit" theme="primary">제출</GeneralButton>
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
      toast('비밀키가 복사되었습니다.')
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