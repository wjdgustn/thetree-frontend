<template>
  <SeedForm method="post">
    <input type="hidden" name="uuid" :value="data.uuid">
    <WikiContent :content="data.contentHtml"/>
    <textarea readonly :value="data.content"/>
    <SeedFormBlock label="요약" inputId="logInput" name="log">
      <input type="text" id="logInput" name="log">
    </SeedFormBlock>
    <div class="button-block">
      <SeedButton submit>되돌리기</SeedButton>
    </div>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import WikiContent from '@/components/wiki/wikiContent'
import SeedFormBlock from '@/components/form/seedFormBlock'
import SeedButton from '@/components/seedButton'

export default {
  components: {SeedButton, SeedFormBlock, WikiContent, SeedForm}

}
</script>
<style scoped>
input, textarea {
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  font-family: inherit;
  font-size: .9rem;
  line-height: 1.5;
  margin: 0;
  padding: .25rem .5rem;
  width: 100%;
}

input[readonly], textarea[readonly] {
  background-color: #eceeef;
  opacity: 1;
}

textarea {
  height: 600px;
  overflow: auto;
}

.theseed-dark-mode input,.theseed-dark-mode textarea {
  background-color: #000;
  color: #ddd;
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