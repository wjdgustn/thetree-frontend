<template>
  <span>
    <input v-model="model" type="hidden" :name="name"/>
    <select v-model="select" :disabled="disable">
      <option v-if="unblock" value="-1">해제</option>
      <option v-for="(label, value) in TemplateDuration" :value="value">{{label}}</option>
      <option value="raw">직접입력</option>
    </select>
    <template v-if="select === 'raw'">
      <input v-model="rawNumber" ref="rawNumber" :class="{ invalid: rawNumber && isNaN(rawNumber) }" :disabled="disable"/>
      <select v-model="rawUnit" :disabled="disable">
        <option value="1">초</option>
        <option value="60">분</option>
        <option value="3600">시간</option>
        <option value="86400">일</option>
        <option value="604800">주</option>
      </select>
    </template>
  </span>
</template>
<script>
const TemplateDuration = {
  0: '영구',
  86400: '하루',
  259200: '3일',
  432000: '5일',
  604800: '7일',
  1209600: '2주',
  1814400: '3주',
  2419200: '4주',
  4838400: '2개월',
  7257600: '3개월',
  14515200: '6개월',
  29030400: '1년'
}

export default {
  inject: {
    submittingSeedForm: {
      default: false
    }
  },
  props: {
    name: String,
    disabled: Boolean,
    value: {
      type: Number,
      default: 0
    },
    unblock: Boolean
  },
  data() {
    return {
      model: this.value,
      select: this.value,
      rawNumber: '',
      rawUnit: '1',
      TemplateDuration
    }
  },
  computed: {
    disable() {
      return this.disabled || this.submittingSeedForm
    }
  },
  emits: ['change'],
  watch: {
    model(newValue) {
      this.$emit('change', newValue)
    },
    value(newValue) {
      this.model = newValue
      if(TemplateDuration[newValue] || this.unblock && newValue === '-1') {
        this.select = newValue
        this.rawNumber = ''
        this.rawUnit = '1'
      }
      else {
        this.select = 'raw'
        this.rawNumber = newValue
        this.rawUnit = '1'
      }
    },
    select(newValue, oldValue) {
      if(newValue !== oldValue) {
        if(newValue === 'raw')
          this.$nextTick(() => this.$refs.rawNumber.focus())
        else {
          if(oldValue === 'raw') {
            this.rawNumber = ''
            this.rawUnit = '1'
          }
          this.model = newValue
        }
      }
    },
    rawUnit() {
      this.calcRaw()
    },
    rawNumber() {
      this.calcRaw()
    }
  },
  methods: {
    calcRaw() {
      if(this.select !== 'raw') return
      const num = parseInt(this.rawNumber)
      this.model = isNaN(num) ? '' : this.rawUnit * num
    }
  }
}
</script>
<style scoped>
input, select {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  display: inline-block;
  font-size: .9rem;
  line-height: 1.5;
  margin: 0 0 0 .7rem;
  padding: .25rem .5rem;
}

.theseed-dark-mode input, .theseed-dark-mode select {
  background-color: #000;
  color: #ddd;
}

input[disabled], select[disabled] {
  opacity: .5;
}

input.invalid {
  color: red;
}
</style>