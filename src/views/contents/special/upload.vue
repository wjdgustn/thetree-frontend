<template>
  <SeedForm method="post" enctype="multipart/form-data">
    <input ref="fileInput" @change="fileChange" type="file" accept="image/*" name="file" hidden>

    <FormErrorAlert/>

    <div class="form-block">
      <label for="fakeFileInput">파일 선택</label>
      <div class="file-block" @click="$refs.fileInput.click">
        <input ref="fakeFileInput" type="text" id="fakeFileInput" readonly>
        <span>
          <SeedButton type="button">Select</SeedButton>
        </span>
      </div>
    </div>
    <div class="form-block">
      <label for="documentInput" v-text="documentLabel"/>
      <input ref="documentInput" v-model="document" type="text" id="documentInput" name="document">
      <ShowError tag="document"/>
    </div>
    <textarea name="text" wrap="soft"/>
    <div class="form-block">
      <label for="licenseSelect">라이선스</label>
      <SearchableSelect name="license" inputId="licenseSelect" :options="data.licenses"/>
      <ShowError tag="license"/>
    </div>
    <div class="form-block">
      <label for="categorySelect">분류</label>
      <SearchableSelect name="category" inputId="categorySelect" :options="data.categories"/>
      <ShowError tag="category"/>
    </div>
    <div class="form-block">
      <label for="logInput" v-text="logLabel"/>
      <input v-model="log" type="text" id="logInput" name="log">
    </div>

    <span v-html="data.editagree_text"/>
    <div>
      <IpWarn/>
    </div>
    <SeedButton submit>업로드</SeedButton>
  </SeedForm>
</template>
<script>
import SeedForm from '@/components/form/seedForm'
import SeedButton from '@/components/seedButton'
import ShowError from '@/components/showError'
import FormErrorAlert from '@/components/form/formErrorAlert'
import SearchableSelect from '@/components/SearchableSelect'
import IpWarn from '@/components/ipWarn'

export default {
  components: {
    IpWarn,
    SearchableSelect,
    FormErrorAlert,
    ShowError,
    SeedButton,
    SeedForm
  },
  data() {
    return {
      document: '',
      log: ''
    }
  },
  watch: {
    '$route.query.document'(newValue) {
      if(newValue) this.document = newValue
    }
  },
  computed: {
    documentLabel() {
      let result = '파일 이름'
      if(this.document)
        result += ` (${this.document.length}/255)`
      return result
    },
    logLabel() {
      let result = '요약'
      if(this.log)
        result += ` (${this.log.length}/255)`
      return result
    }
  },
  methods: {
    fileChange() {
      this.$refs.fakeFileInput.value = this.$refs.fileInput.value
      this.document ||= '파일:' + this.$refs.fileInput.files[0].name
    }
  }
}
</script>
<style scoped>
form input, form select {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  font-size: .9rem;
  line-height: 1.5;
  padding: .25rem .5rem;
  width: 100%;
}

form label {
  display: inline-block;
  margin-bottom: .5rem;
}

form textarea {
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  font-size: medium;
  font-stretch: normal;
  font-style: normal;
  font-variant: normal;
  font-weight: 400;
  line-height: normal;
  font: initial;
  font-size: .9rem;
  height: 30rem;
  margin: 0;
  padding: .25rem .5rem;
  resize: vertical;
  width: 100%;
}

form textarea[readonly] {
  background-color: #eceeef;
  opacity: 1;
}

form div.form-block {
  margin-bottom: 15px;
  margin-top: 1rem;
}

form input[type=checkbox] {
  color: inherit;
  line-height: inherit;
  font: inherit;
  margin: 0;
  padding: 0;
}

form div.form-block>div.file-block {
  border-collapse: separate;
  display: table;
  position: relative;
}

form div.form-block>div.file-block>input {
  border-radius: 0;
  display: table-cell;
  float: left;
  margin-bottom: 0;
  padding: .25rem .5rem;
  position: relative;
  width: 100%;
  z-index: 2;
}

form div.form-block>div.file-block>span {
  display: table-cell;
  font-size: 0;
  position: relative;
  vertical-align: middle;
  white-space: nowrap;
  width: 1%;
}

form div.form-block>div.file-block>span>button {
  border-radius: 0;
  margin-left: -1px;
  padding: .25rem .5rem;
  position: relative;
  z-index: 2;
}

form>span {
  margin-bottom: 2rem;
}

form>button {
  float: right;
  width: 100px;
}

.theseed-dark-mode form input, .theseed-dark-mode form select, .theseed-dark-mode form textarea {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}
</style>