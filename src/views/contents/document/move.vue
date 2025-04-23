<template>
  <SeedForm method="post" captcha>
    <SeedFormBlock label="변경할 문서 제목" id="titleInput" name="title">
      <input type="text" id="titleInput" name="title">
    </SeedFormBlock>
    <SeedFormBlock :label="logLabel" inputId="logInput" name="log">
      <input v-model="log" type="text" id="logInput" name="log">
    </SeedFormBlock>
    <label>
      <input type="checkbox" name="mode" value="swap">
      문서를 서로 맞바꾸기
    </label>
    <BlinkRedWarn v-if="session.account.type !== 1">비로그인 상태로 편집합니다. 로그인하지 않은 상태로 문서 편집을 저장하면, 편집 역사에 본인이 사용하는 IP({{session.account.name}}) 주소 전체가 영구히 기록됩니다.</BlinkRedWarn>
    <div v-else/>
    <div class="button-block">
      <SeedButton submit>이동</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import BlinkRedWarn from '@/components/blinkRedWarn'
import SeedButton from '@/components/seedButton'

export default {
  components: {
    SeedButton,
    BlinkRedWarn,
    SeedFormBlock,
    SeedForm
  },
  data() {
    return {
      log: ''
    }
  },
  computed: {
    logLabel() {
      let result = '요약'
      if(this.log)
        result += ` (${this.log.length}/255)`
      return result
    }
  }
}
</script>
<style scoped>
input {
  font-size: .9rem;
}

input[type=text] {
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  line-height: 1.5;
  margin: 0;
  padding: .25rem .5rem;
  width: 100%;
}

input[type=text][readonly] {
  background-color: #eceeef;
  opacity: 1;
}

.theseed-dark-mode input[type=text] {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

input[type=checkbox] {
  line-height: inherit;
  margin: 0;
  padding: 0;
}

label {
  display: inline-block;
  margin-bottom: .5rem;
}

div.button-block {
  float: right;
}
</style>