<template>
  <component :is="'h' + level" @click="toggleFold" class="wiki-heading" :class="{ 'wiki-heading-folded': fold }">
    <span>{{title}}</span>
  </component>
  <div v-show="!fold" class="wiki-heading-content">
    <slot/>
  </div>
</template>
<script>
export default {
  props: {
    level: {
      type: Number,
      default: 2
    },
    title: {
      type: String,
      required: true
    },
    folded: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fold: this.folded
    }
  },
  methods: {
    toggleFold() {
      this.fold = !this.fold
    }
  }
}
</script>
<style scoped>
.wiki-heading {
  cursor: pointer;
}

h1.wiki-heading {
  font-size: 2em;
}

h2.wiki-heading {
  font-size: 1.8em;
}

h3.wiki-heading {
  font-size: 1.6em;
}

h4.wiki-heading {
  font-size: 1.4em;
}

h5.wiki-heading {
  font-size: 1.2em;
}

h6.wiki-heading {
  font-size: 1em;
}

h1.wiki-heading,
h2.wiki-heading,
h3.wiki-heading,
h4.wiki-heading,
h5.wiki-heading,
h6.wiki-heading {
  border-bottom: 1px solid #ccc;
  margin: 1.2em 0 .8em;
  padding-bottom: 5px;
}

.theseed-dark-mode h1.wiki-heading,
.theseed-dark-mode h2.wiki-heading,
.theseed-dark-mode h3.wiki-heading,
.theseed-dark-mode h4.wiki-heading,
.theseed-dark-mode h5.wiki-heading,
.theseed-dark-mode h6.wiki-heading {
  border-bottom-color: #383b40;
}

.wiki-heading:before {
  color: #666;
  content: "";
  float: left;
  font-family: "Ionicons";
  font-size: .8em;
  font-weight: 400;
  line-height: 1.8em;
  margin: 0 .5rem 0 .2rem;
  text-align: center;
  width: .9em;
}

.wiki-heading.wiki-heading-folded {
  opacity: .5;
}

.wiki-heading.wiki-heading-folded:before {
  content: "";
}
</style>