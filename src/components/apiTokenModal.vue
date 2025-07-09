<template>
  <Modal @closed="closed" v-slot="props">
    <div class="modal-block">
      <div class="modal-title">API Token 발급</div>
      <FormErrorAlert/>
      <SeedForm method="post" action="/member/generate_api_token" :class="[$style.form, $style['form--full']]">
        <template v-if="apiToken">
          <div :class="$style.form__row">
            <InputField multiline readonly class="token-textarea" :value="apiToken"/>
          </div>
          <div :class="$style.form__row">
            <ul :class="$style.list">
              <li>발급된 토큰은 이 창을 닫으면 다시 확인할 수 없습니다.</li>
              <li>토큰은 비밀번호와 같이 취급해주세요.</li>
            </ul>
          </div>
          <div :class="[$style.form__row, $style['form__row--buttons']]">
            <div :class="$style.form__buttons">
              <GeneralButton :whenClick="copyToken">토큰 복사</GeneralButton>
              <GeneralButton :class="$style.button" :whenClick="props.close">닫기</GeneralButton>
            </div>
          </div>
        </template>
        <template v-else>
          <div :class="$style.form__row">
            <label for="passwordInput">비밀번호</label>
            <InputField type="password" id="passwordInput" name="password"/>
            <p :class="[$style.text, $style['text--help']]">
              사용자 계정의 비밀번호를 입력하세요.
            </p>
          </div>
          <div :class="[$style.form__row, $style['form__row--buttons']]">
            <div :class="$style.form__buttons">
              <GeneralButton :class="$style.button" :whenClick="props.close">취소</GeneralButton>
              <GeneralButton :class="$style.button" type="submit" theme="primary">발급</GeneralButton>
            </div>
          </div>
        </template>
      </SeedForm>
    </div>
  </Modal>
</template>
<script>
import { toast } from 'vue-sonner'

import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedButton from '@/components/seedButton'
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'
import Modal from '@/components/modal'
import InputField from '@/components/form/inputField'
import GeneralButton from '@/components/generalButton'

export default {
  components: {
    GeneralButton,
    InputField,
    Modal,
    FormErrorAlert,
    SeedButton,
    SeedForm,
    SeedFormBlock,
    SeedFormInput
  },
  computed: {
    apiToken() {
      return this.$store.state.viewData.apiToken
    }
  },
  methods: {
    closed() {
      this.$store.state.viewData.apiToken = null
    },
    copyToken() {
      navigator.clipboard.writeText(this.apiToken)
      toast('API 토큰이 복사되었습니다.')
    }
  }
}
</script>
<style module>
@import '@/styles/form.css';
</style>
<style scoped>
.modal-block {
  padding: 1rem;
  width: 100%;
}

.modal-title {
  font-size: 1.05rem;
  font-weight: 500;
  margin: 0 0 1rem;
}

.token-textarea {
  height: 5rem;
  resize: none;
  word-break: break-all;
}
</style>