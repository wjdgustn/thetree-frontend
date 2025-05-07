<template>
  <SeedForm>
    <select name="namespace" :value="$route.query.namespace || ''">
      <option value="">전체</option>
      <option v-for="item in data.readableNamespaces">{{item}}</option>
    </select>
    <select name="target" :value="$route.query.target || 'title_content'">
      <option value="title_content">제목/내용</option>
      <option value="title">제목</option>
      <option value="content">내용</option>
      <option value="raw">원문</option>
    </select>
    <input type="text" name="q" :value="$route.query.q || ''">
    <SeedButton submit>검색</SeedButton>
  </SeedForm>
  <Alert>
    <div class="alert-block">
      <i class="ion-ios-arrow-forward"/>
      찾는 문서가 없나요? 문서로 바로 갈 수 있습니다.
    </div>
    <div class="alert-button">
      <SeedLinkButton :to="doc_action_link($route.query.q, 'w')">'{{$route.query.q}}' 문서로 가기</SeedLinkButton>
    </div>
    <div class="clear"/>
  </Alert>
  <div class="info-text">전체 {{data.totalHits}} 건 / 처리 시간 {{data.processingTime / 1000}}초</div>

  <section>
    <div v-for="item in data.hits">
      <h4>
        <i class="ion-md-document"/>
        <NuxtLink :to="doc_action_link(item, 'w')">{{doc_fulltitle(item)}}</NuxtLink>
      </h4>
      <div v-html="item.content || item.raw"/>
    </div>

    <nav>
      <ul>
        <li v-for="i in pageNum">
          <NuxtLink :to="{ query: { page: i } }" :class="{ active: i.toString() === (this.$route.query.page || '1') }">{{i}}</NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="clear"/>
  </section>
</template>
<script>
import Common from '@/mixins/common'
import SeedForm from '@/components/form/seedForm'
import SeedButton from '@/components/seedButton'
import Alert from '@/components/alert'
import SeedLinkButton from '@/components/seedLinkButton'
import NuxtLink from '@/components/global/nuxtLink'

export default {
  mixins: [Common],
  components: {
    NuxtLink,
    SeedLinkButton,
    Alert,
    SeedButton,
    SeedForm
  },
  computed: {
    pageNum() {
      const num = parseInt(this.$route.query.page) || 1
      const start = num - (num % 10) + 1
      const end = Math.min(num + 9, this.data.totalPages)
      const result = []
      for(let i = start; i <= end; i++)
        result.push(i)
      return result
    }
  }
}
</script>
<style scoped>
select {
  min-width: 5rem;
}

input {
  min-width: 20rem;
}

input, select {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  font-size: .9rem;
  line-height: 1.5;
  margin: 0;
  padding: .25rem .5rem;
}

form {
  margin-bottom: 1rem;
  margin-top: 1rem;
}

.theseed-dark-mode input, .theseed-dark-mode select {
  background-color: #000;
  color: #ddd;
}

div.alert-block {
  float: left;
  line-height: 2.1rem;
}

div.alert-button {
  float: right;
}

div.clear {
  clear: both;
}

div.info-text {
  padding-bottom: .9rem;
}

div.info-text, section>div {
  border-bottom: 1px solid #e5e5e5;
}

section>div {
  padding-bottom: 1.1rem;
}

section>div>h4 {
  color: inherit;
  font-family: inherit;
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: .9rem;
  margin-top: 1.3rem;
}

section>div>h4>a {
  color: inherit !important;
}

section>div>h4>i {
  background-color: #555;
  border-radius: 16px;
  color: #fff;
  margin-right: 4px;
  padding: 0 8px 1px 9px;
  text-align: center;
}

section>div>div span.search-highlight {
  background-color: #555;
  border-radius: 4px;
  color: #fff;
  padding: 0 .2em;
}

nav {
  float: right;
}

nav>ul {
  border-radius: .25rem;
  display: inline-block;
  margin-bottom: 1rem;
  margin-top: 1rem;
  padding-left: 0;
}

nav>ul>li {
  display: inline;
}

nav>ul>li>a {
  background-color: #fff;
  border: 1px solid #ddd;
  color: #0275d8;
  float: left;
  line-height: 1.5;
  margin-left: -1px;
  padding: .5rem .75rem;
  position: relative;
  text-decoration: none;
}

nav>ul>li>a:focus,nav>ul>li>a:hover {
  background-color: #eceeef;
  border-color: #ddd;
  color: #014c8c
}

nav>ul>li:first-child>a {
  border-bottom-left-radius: .25rem;
  border-top-left-radius: .25rem;
  margin-left: 0;
}

nav>ul>li>a.active {
  font-weight: 700;
}
</style>