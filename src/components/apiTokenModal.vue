<template>
  <VueFinalModal @closed="closed" v-slot="{ close }" classes="thetree-modal-container" content-class="thetree-modal-content" escToClose>
    <SeedForm method="post" action="/member/generate_api_token">
      <h4>API Token 발급</h4>
      <FormErrorAlert/>

      <template v-if="apiToken">
        <SeedFormBlock label="토큰:">
          <SeedFormInput readonly :value="apiToken"/>
        </SeedFormBlock>
        <ul>
          <li>발급된 토큰은 이 창을 닫으면 다시 확인할 수 없습니다.</li>
          <li>토큰은 비밀번호와 같이 취급해주세요.</li>
        </ul>
      </template>
      <SeedFormBlock v-else label="비밀번호:" name="password">
        <SeedFormInput type="password" name="password"/>
      </SeedFormBlock>

      <div class="modal-button-block">
        <SeedButton v-if="!apiToken" danger large>생성</SeedButton>
        <SeedButton type="button" large @click="close" v-text="apiToken ? '닫기' : '취소'"/>
      </div>
    </SeedForm>
  </VueFinalModal>
</template>
<script>
import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedButton from '@/components/seedButton'
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'

export default {
  components: {
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
    }
  }
}
</script>
<style scoped>
form {
  box-sizing: border-box;
  flex: 1 0 auto;
  font-size: 14px;
  padding: 15px;
  width: 100%;
}

form h4 {
  font-weight: 600;
  margin: 0;
  padding: 0;
}

form div {
  margin-bottom: 0;
}

form :deep(div label) {
  margin-block-start: 1em;
  margin-bottom: 0;
}

form .seed-form-input {
  margin: 0;
  width: 100%;
}

.modal-button-block {
  float: right;
  margin-bottom: 1rem;
  margin-top: 1rem;
}
</style>