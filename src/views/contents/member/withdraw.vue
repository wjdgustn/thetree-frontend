<template>
  <FormErrorAlert/>
  <SeedForm method="POST">
    <SeedFormBlock label="비밀번호" inputId="passwordInput" name="password">
      <SeedFormInput type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock name="pledge">
      <label for="pledgeInput">
        <span class="pledge pledge-correct" v-text="redPledge"/>
        <span class="pledge" v-text="normalPledge"/>
      </label>
      <SeedFormInput @input="pledgeChange" type="text" id="pledgeInput" name="pledge" :placeholder="pledge" autocomplete="off"/>
    </SeedFormBlock>
    <p>마지막 활동 후 {{durationToExactString(noActivityTime)}}이 지나야 삭제할 수 있습니다.</p>
    <p>계정 삭제 버튼을 누르면 모든 데이터가 즉시 삭제되며 복구가 불가능합니다.</p>
    <p>
      단,
      <template v-if="blacklistDays">
        {{blacklistDays}}일동안
      </template>
      <template v-else>
        영구적으로
      </template>
      재가입이 불가능하며, 이를 위해서 이메일, 기타 개인식별정보를 계정 삭제 후
      <template v-if="blacklistDays">
        {{blacklistDays}}일(영구 차단자는 영구적으로 보관될 수 있음)동안
      </template>
      <template v-else>
        영구적으로
      </template>
      원문을 알 수 없는 단방향 해시함수 결과값을 저장합니다.
    </p>
    <div class="button-block">
      <SeedButton danger>계정 삭제</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import FormErrorAlert from '@/components/form/formErrorAlert'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'
import SeedButton from '@/components/seedButton'

export default {
  mixins: [Common],
  components: {
    SeedForm,
    FormErrorAlert,
    SeedFormBlock,
    SeedFormInput,
    SeedButton
  },
  data() {
    return {
      ...this.$store.state.viewData,
      pledgeInput: ''
    }
  },
  computed: {
    correctLength() {
      let correctLen = 0
      for(let i in this.pledge) {
        const char1 = this.pledgeInput[i]
        const char2 = this.pledge[i]
        if(char1 !== char2) break
        correctLen++
      }
      return correctLen
    },
    redPledge() {
      return this.pledge.slice(0, this.correctLength)
    },
    normalPledge() {
      return this.pledge.slice(this.correctLength)
    }
  },
  methods: {
    pledgeChange(event) {
      this.pledgeInput = event.target.value
    }
  }
}
</script>
<style scoped>
input {
  width: calc(100% - .7rem);
}

.button-block {
  margin-top: 2rem;
  text-align: right;
}

.pledge {
  user-select: none;
}

.pledge-correct {
  color: red;
}
</style>