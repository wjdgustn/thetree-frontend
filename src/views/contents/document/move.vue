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
    <IpWarn/>
    <div v-else/>
    <div class="button-block">
      <SeedButton submit>이동</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedButton from '@/components/seedButton'
import IpWarn from '@/components/ipWarn'

export default {
  components: {
    IpWarn,
    SeedButton,
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