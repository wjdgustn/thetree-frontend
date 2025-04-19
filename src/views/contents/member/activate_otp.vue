<template>
  <FormErrorAlert/>
  <ol>
    <li>
      휴대 전화에 <b>Google Authenticator</b> 앱을 설치합니다.
      (<a href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2" rel="noopener" target="_blank">Android</a>
      / <a href="https://itunes.apple.com/kr/app/google-authenticator/id388497605" rel="noopener" target="_blank">iOS</a>)
    </li>
    <li>
      앱을 열고 바코드 스캔을 클릭해서 아래 QR코드를 스캔합니다.
      <br>
      <img :src="$store.state.viewData.qrcode">
    </li>
    <li>
      표시되는 코드를 아래에 입력해서 활성화 합니다.
    </li>
  </ol>
  <SeedForm method="POST">
    <SeedFormBlock label="PIN" inputId="pinInput" name="pin">
      <SeedFormInput type="text" id="pinInput" name="pin" maxlength="6"/>
    </SeedFormBlock>
    <div class="button-block">
      <SeedButton submit>활성화</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'
import SeedButton from '@/components/seedButton'

export default {
  components: {
    SeedForm,
    FormErrorAlert,
    SeedFormBlock,
    SeedFormInput,
    SeedButton
  }
}
</script>
<style scoped>
form {
  width: 100%;
}

@media screen and (min-width: 34rem) {
  form {
    margin:0 auto;
    width: 28rem;
  }
}

input {
  width: calc(100% - .7rem);
}

.button-block {
  margin-top: 2rem;
  text-align: right;
}
</style>