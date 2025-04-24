<template>
  <SeedForm method="post" :beforeSubmit="beforeSubmit" captcha>
    <SeedFormBlock :label="logLabel" inputId="logInput" name="log">
      <input v-model="log" type="text" id="logInput" name="log">
    </SeedFormBlock>
    <label>
      <input ref="agreeCheckbox" type="checkbox" name="agree" value="Y">
      문서 이동 및 일부 내용 제거가 아닌 문서 전체를 삭제하기 위한 기능임을 확인합니다.
    </label>
    <p>
      <b>알림!&nbsp;:</b>
      문서의 제목을 변경하려는 경우 <NuxtLink :to="doc_action_link(data.document, 'move')">문서 이동</NuxtLink> 기능을 사용해 주세요.
      문서 이동 기능을 사용할 수 없는 경우 토론 기능이나 게시판을 통해 대행 요청을 해주세요.
    </p>
    <IpWarn/>
    <div class="button-block">
      <SeedButton danger>삭제</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import NuxtLink from '@/components/global/nuxtLink'
import SeedButton from '@/components/seedButton'
import IpWarn from '@/components/ipWarn'

export default {
  mixins: [Common],
  components: {
    IpWarn,
    SeedButton,
    NuxtLink,
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
  },
  methods: {
    beforeSubmit() {
      if(!this.$refs.agreeCheckbox.checked) {
        alert('문서 삭제에 대한 안내를 확인해 주세요.')
        return false
      }
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

p {
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 0;
}

div.button-block {
  float: right;
}
</style>