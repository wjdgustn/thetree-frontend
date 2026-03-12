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
      <input type="checkbox" id="close_editrequestsInput" name="closeEditRequests" value="Y" checked>
      <label for="close_editrequestsInput">{{$t('views.batch_revert.close_edit_requests')}}</label>
    </SeedFormBlock>
    <SeedFormBlock name="hideThreadComments">
      <input type="checkbox" id="hide_threadInput" name="hideThreadComments" value="Y" checked>
      <label for="hide_threadInput">{{$t('views.batch_revert.hide_thread_comments')}}</label>
    </SeedFormBlock>
    <SeedFormBlock name="revertContributions">
      <input type="checkbox" id="revert_documentInput" name="revertContributions" value="Y" checked>
      <label for="revert_documentInput">{{$t('views.batch_revert.revert_contributions')}}</label>
    </SeedFormBlock>
    <SeedFormBlock name="revertEditRequests">
      <input type="checkbox" id="revert_editrequestInput" name="revertEditRequests" value="Y" checked>
      <label for="revert_editrequestInput">{{$t('views.batch_revert.revert_edit_requests')}}</label>
    </SeedFormBlock>
    <SeedFormBlock v-if="data.hidelogPerm" name="revertContributions">
      <input type="checkbox" id="hidelogInput" name="hidelog" value="Y">
      <label for="hidelogInput">hidelog</label>
    </SeedFormBlock>
    <div class="button-block">
      <SeedButton submit>{{$t('views.batch_revert.submit')}}</SeedButton>
    </div>
  </SeedForm>

  <div v-if="data.result">
    <p>{{$t('views.batch_revert.result')}}</p>
    <ul>
      <li v-for="item in data.result.resultText" v-html="item"></li>
    </ul>

    <template v-if="data.result.failResultText.length">
      <p>{{$t('views.batch_revert.failed_list')}}</p>
      <ul style="color: red">
        <li v-for="item in data.result.failResultText" v-html="item"></li>
      </ul>
    </template>

    <div>
      <SeedButton @click="data.result = null">{{$t('views.batch_revert.ok')}}</SeedButton>
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