<template>
  <SeedForm method="post" enctype="multipart/form-data">
    <input ref="fileInput" @change="fileChange" type="file" accept="image/*,video/*" name="file" multiple hidden>

    <FormErrorAlert/>

    <div class="form-block">
      <label for="fakeFileInput">{{$t('views.upload.select_file')}}</label>
      <div class="file-block" @click="$refs.fileInput.click">
        <input ref="fakeFileInput" type="text" id="fakeFileInput" readonly>
        <span>
          <SeedButton type="button">{{$t('views.upload.select_button')}}</SeedButton>
        </span>
      </div>
    </div>
    <div class="form-block">
      <label for="documentInput">{{documentLabel}}</label>
      <input ref="documentInput" v-model="document" type="text" id="documentInput" name="document">
      <ShowError tag="document"/>
    </div>
    <textarea name="text" wrap="soft" v-model="text"/>
    <div class="form-block">
      <label for="licenseSelect">{{$t('views.upload.license')}}</label>
      <SearchableSelect name="license" inputId="licenseSelect" :options="data.licenses" v-model="license"/>
      <ShowError tag="license"/>
    </div>
    <p v-if="data.licenseText" v-html="data.licenseText"/>
    <div class="form-block">
      <label for="categorySelect">{{$t('views.upload.category')}}</label>
      <SearchableSelect name="category" inputId="categorySelect" :options="data.categories"/>
      <ShowError tag="category"/>
    </div>
    <div class="form-block">
      <label for="logInput">{{logLabel}}</label>
      <input v-model="log" type="text" id="logInput" name="log">
    </div>

    <span v-html="data.editagree_text"/>
    <div>
      <IpWarn/>
    </div>
    <SeedButton submit>{{$t('views.upload.upload')}}</SeedButton>
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
      license: null,
      log: '',
      text: ''
    }
  },
  mounted() {
    this.license = this.data.defaultLicense
    this.text = this.data.file_upload_template
  },
  watch: {
    '$route.query.document'(newValue) {
      if(newValue) this.document = newValue
    }
  },
  computed: {
    documentLabel() {
      let result = this.$t('views.upload.document_label')
      if(this.document)
        result += ` (${this.document.length}/255)`
      return result
    },
    logLabel() {
      let result = this.$t('views.upload.log_label')
      if(this.log)
        result += ` (${this.log.length}/255)`
      return result
    }
  },
  methods: {
    fileChange(e) {
      const fileCount = e.srcElement.files.length
      if(fileCount > 10) {
        alert(this.$t('views.upload.max_file_amount', { count: 10 }))
        return e.preventDefault()
      }

      if(fileCount <= 1) {
        this.$refs.fakeFileInput.value = this.$refs.fileInput.value
        if(fileCount === 1) this.document ||= this.$t('namespaces.파일', { lng: this.config.lang || 'ko' }) + ':' + this.$refs.fileInput.files[0].name
        this.$refs.documentInput.disabled = false
      }
      else {
        this.$refs.fakeFileInput.value = [...e.srcElement.files].map(a => `"${a.name}"`).join(', ')
        this.document = ''
        this.$refs.documentInput.disabled = true
      }
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

form input[disabled] {
  opacity: .5;
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

form p {
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 0;
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