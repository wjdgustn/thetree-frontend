<template>
  <FormErrorAlert/>
  <SeedForm method="post">
    <SeedFormBlock :label="$t('views.withdraw.password')" inputId="passwordInput" name="password">
      <SeedFormInput type="password" id="passwordInput" name="password"/>
    </SeedFormBlock>
    <SeedFormBlock name="pledge">
      <label for="pledgeInput">
        <span class="pledge pledge-correct">{{redPledge}}</span>
        <span class="pledge">{{normalPledge}}</span>
      </label>
      <SeedFormInput @input="pledgeChange" @paste.prevent type="text" id="pledgeInput" name="pledge" :placeholder="pledge" autocomplete="off"/>
    </SeedFormBlock>
    <p>{{$t('views.withdraw.last_activity', { duration: durationToExactString(noActivityTime) })}}</p>
    <p>{{$t('views.withdraw.no_recover')}}</p>
    <p>
      {{$t('views.withdraw.no_signup_' + (blacklistDays ? 'duration' : 'forever'), { blacklistDays })}}
      {{$t('views.withdraw.hash_save_' + (blacklistDays ? 'duration' : 'forever'), { blacklistDays })}}
    </p>
    <div class="button-block">
      <SeedButton danger>{{$t('views.withdraw.submit')}}</SeedButton>
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