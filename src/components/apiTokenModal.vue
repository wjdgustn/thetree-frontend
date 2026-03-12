<template>
  <Modal @closed="closed" v-slot="props">
    <div class="modal-block">
      <div class="modal-title">{{$t('components.api_token_modal.title')}}</div>
      <FormErrorAlert/>
      <SeedForm method="post" action="/member/generate_api_token" :class="[$style.form, $style['form--full']]">
        <template v-if="apiToken">
          <div :class="$style.form__row">
            <InputField multiline readonly class="token-textarea" :value="apiToken"/>
          </div>
          <div :class="$style.form__row">
            <ul :class="$style.list">
              <li>{{$t('components.api_token_modal.cant_see_again')}}</li>
              <li>{{$t('components.api_token_modal.token_like_pw')}}</li>
            </ul>
          </div>
          <div :class="[$style.form__row, $style['form__row--buttons']]">
            <div :class="$style.form__buttons">
              <GeneralButton :whenClick="copyToken">{{$t('components.api_token_modal.copy')}}</GeneralButton>
              <GeneralButton :class="$style.button" :whenClick="props.close">{{$t('components.api_token_modal.close')}}</GeneralButton>
            </div>
          </div>
        </template>
        <template v-else>
          <div :class="$style.form__row">
            <label for="passwordInput">{{$t('components.api_token_modal.password')}}</label>
            <InputField type="password" id="passwordInput" name="password"/>
            <p :class="[$style.text, $style['text--help']]">
              {{$t('components.api_token_modal.input_password')}}
            </p>
          </div>
          <div :class="[$style.form__row, $style['form__row--buttons']]">
            <div :class="$style.form__buttons">
              <GeneralButton :class="$style.button" :whenClick="props.close">{{$t('components.api_token_modal.cancel')}}</GeneralButton>
              <GeneralButton :class="$style.button" type="submit" theme="primary">{{$t('components.api_token_modal.submit')}}</GeneralButton>
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
      toast(this.$t('components.api_token_modal.copied_token'))
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