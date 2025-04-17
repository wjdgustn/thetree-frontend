<template>
  <time :datetime="dateObject.toISOString()">{{dateString}}</time>
</template>
<script>
export default {
  props: {
    date: {
      type: [Number, String],
      required: true
    },
    format: {
      type: String,
      default: 'Y-m-d H:i:s'
    },
    relative: {
      type: Boolean,
      default: false
    },
    forceRelative: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currDate: new Date()
    }
  },
  computed: {
    dateObject() {
      return new Date(
          typeof this.date === 'string' || this.date * 1000 > Date.now()
              ? this.date
              : this.date * 1000);
    },
    isRelative() {
      return this.forceRelative || (this.relative && !this.$store.state.localConfig['wiki.no_relative_date']);
    },
    relativeDate() {
      const diff = this.currDate - this.dateObject;
      const relative = new Intl.RelativeTimeFormat('ko');

      let text;
      if(diff < 1000 * 10) text = '방금 전';
      else if(diff < 1000 * 60) text = relative.format(-Math.floor(diff / 1000), 'second');
      else if(diff < 1000 * 60 * 60) text = relative.format(-Math.floor(diff / 1000 / 60), 'minute');
      else if(diff < 1000 * 60 * 60 * 24) text = relative.format(-Math.floor(diff / 1000 / 60 / 60), 'hour');
      else if(diff < 1000 * 60 * 60 * 24 * 30) text = relative.format(-Math.floor(diff / 1000 / 60 / 60 / 24), 'day');

      return text;
    },
    formattedDate() {
      const strs = {
        Y: this.dateObject.getFullYear(),
        m: this.dateObject.getMonth() + 1,
        d: this.dateObject.getDate(),
        H: this.dateObject.getHours(),
        i: this.dateObject.getMinutes(),
        s: this.dateObject.getSeconds()
      }
      let result = this.format;
      for(let [key, value] of Object.entries(strs)) {
        result = result.replaceAll(key, value.toString().padStart(2, '0'));
      }
      return result;
    },
    dateString() {
      return this.isRelative ? this.relativeDate : this.formattedDate;
    }
  }
}
</script>