<template>
  <SeedForm method="post">
    <SeedFormBlock label="UUID" inputId="uuidInput" name="uuid">
      <SeedFormInput type="text" id="uuidInput" name="uuid"/>
    </SeedFormBlock>
    <SeedFormBlock label="Duration" inputId="durationInput" name="duration">
      <SeedFormInput type="text" id="durationInput" name="duration" value="24h"/>
    </SeedFormBlock>
    <SeedFormBlock label="Reason" inputId="reasonInput" name="reason">
      <SeedFormInput type="text" id="reasonInput" name="reason"/>
    </SeedFormBlock>
    <SeedFormBlock name="closeEditRequests">
      <input type="checkbox" id="closeEditRequestsInput" name="closeEditRequests" value="Y">
      <label for="closeEditRequests">편집 요청 닫기</label>
    </SeedFormBlock>
    <SeedFormBlock name="hideThreadComments">
      <input type="checkbox" id="hideThreadCommentsInput" name="hideThreadComments" value="Y">
      <label for="hideThreadCommentsInput">토론 댓글 숨기기</label>
    </SeedFormBlock>
    <SeedFormBlock name="revertContributions">
      <input type="checkbox" id="revertContributionsInput" name="revertContributions" value="Y">
      <label for="revertContributionsInput">편집 되돌리기</label>
    </SeedFormBlock>
    <SeedFormBlock v-if="data.hidelogPerm" name="revertContributions">
      <input type="checkbox" id="hidelogInput" name="hidelogInput" value="Y">
      <label for="revertContributionsInput">hidelog</label>
    </SeedFormBlock>
    <div class="button-block">
      <SeedButton submit>실행</SeedButton>
    </div>
  </SeedForm>

  <div v-if="data.result">
    <p>작업 결과</p>
    <ul>
      <li v-for="item in data.result.resultText">{{item}}</li>
    </ul>

    <template v-if="data.result.failResultText.length">
      <p>실패 작업 목록</p>
      <ul style="color: red">
        <li v-for="item in data.result.failResultText">{{item}}</li>
      </ul>
    </template>

    <div>
      <SeedButton @click="data.result = null">확인</SeedButton>
    </div>
  </div>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedFormInput from '@/components/form/seedFormInput'
import SeedButton from '@/components/seedButton'

export default {
  components: {
    SeedButton,
    SeedFormInput,
    SeedFormBlock,
    SeedForm

  }
}
</script>
<style scoped>
form input, form label {
  display: inline-block;
}

form input {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  font-size: .9rem;
  line-height: 1.5;
  margin: 0 0 0 .7rem;
  padding: .25rem .5rem;
}

form input[type=text] {
  width: 100%;
}

form div.button-block {
  margin-top: 2rem;
  text-align: right;
}
</style>