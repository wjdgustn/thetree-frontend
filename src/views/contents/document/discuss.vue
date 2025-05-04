<template>
  <h3>편집 요청</h3>
  <ul>
    <li v-for="item in data.openEditRequests">
      <NuxtLink :to="'/edit_request/' + item.url">편집 요청 {{item.url}}</NuxtLink>
    </li>
  </ul>
  <p>
    <NuxtLink :to="doc_action_link(data.document, 'discuss', { state: 'closed_edit_requests' })">[닫힌 편집 요청 보기]</NuxtLink>
  </p>

  <h3>토론</h3>
  <ul>
    <li v-for="(item, index) in data.openThreads">
      <NuxtLink :to="'#s-' + index + 1" v-text="index + 1"/>
      <span>.&nbsp;</span>
      <NuxtLink :to="'/thread/' + item.url" v-text="item.topic"/>
    </li>
  </ul>
  <p>
    <NuxtLink :to="doc_action_link(data.document, 'discuss', { state: 'close' })">[닫힌 토론 목록 보기]</NuxtLink>
  </p>

  <div v-for="(item, index) in data.openThreads">
    <SeedForm method="post" class="delete-thread-form" :action="'/admin/thread/' + item.url + '/delete'">
      <SeedButton v-if="data.permissions.delete" type="submit" danger>[ADMIN] 스레드 삭제</SeedButton>
    </SeedForm>
    <h2>{{index + 1}}. <NuxtLink :to="'/thread/' + item.url" :id="'s-' + index" v-text="item.topic"/></h2>
    <div class="preview-group">
      <div v-for="(comment, index) in item.recentComments">
        <NuxtLink v-if="index === 1 && comment.id !== 2" :to="'/thread/' + item.url" class="comment-more">more...</NuxtLink>
        <Comment
            previewMode
            :thread="item"
            :slug="item.url"
            :comment="comment"
        />
      </div>
    </div>
  </div>

  <h3>새 주제 생성</h3>
  <SeedForm method="post" :captcha="session.user.type !== 1">
    <SeedFormBlock label="주제 :" inputId="topicInput" name="topic">
      <input type="text" id="topicInput" name="topic">

    </SeedFormBlock>
    <SeedFormBlock label="내용 :" inputId="contentInput" name="text">
      <textarea id="contentInput" name="text" rows="5"/>
    </SeedFormBlock>
    <IpWarn discuss/>
    <SeedButton class="submit-button" submit>전송</SeedButton>
  </SeedForm>
</template>
<script>
import Common from '@/mixins/common'
import NuxtLink from '@/components/global/nuxtLink'
import SeedForm from '@/components/form/seedForm'
import SeedButton from '@/components/seedButton'
import SeedFormBlock from '@/components/form/seedFormBlock'
import Comment from '@/components/comment'
import IpWarn from '@/components/ipWarn'

export default {
  mixins: [Common],
  components: {
    IpWarn,
    Comment,
    SeedFormBlock,
    SeedButton,
    SeedForm,
    NuxtLink
  }
}
</script>
<style scoped>
div.form-block {
  margin-bottom: 15px;
}

label {
  display: inline-block;
  margin-bottom: .2rem;
}

h3 {
  color: inherit;
  font-family: inherit;
  font-size: 1.6em;
  font-weight: 700;
  line-height: 1.1;
  margin: 1.2em 0 .8em;
}

h3:last-of-type {
  border-top: 2px dashed gray;
  margin: .2em 0 .8em;
  padding-top: 1.5em;
}

ul {
  margin: .4em 0 .4em 1.5em;
  padding-left: .5rem;
}

ul li {
  list-style: inherit !important;
  margin: .4em 0;
}

p {
  margin-bottom: 1rem;
  margin-top: 0;
}

div.preview-group >div {
  padding-left: 25px;
  width: 75%;
}

@media screen and (max-width: 700px) {
  div.preview-group >div {
    width: 100%;
  }
}

a.comment-more {
  background: #f4f4f4;
  border: 1px solid gray;
  display: block;
  font-weight: 700;
  margin-bottom: 25px;
  margin-left: 40px;
  padding: 5px;
  text-align: center;
  width: 80px;
}

.theseed-dark-mode a.comment-more {
  background-color: #325a56;
  color: #ddd;
}

a.comment-more:hover {
  background: #bac6f2;
}

.theseed-dark-mode a.comment-more:hover {
  background-color: #438a83;
}

form.delete-thread-form {
  float: right;
}

input, textarea {
  background-color: #fff;
  background-image: none;
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  display: block;
  line-height: 1.5;
  font: inherit;
  padding: .25rem .5rem;
  width: 100%;
}

.theseed-dark-mode input, .theseed-dark-mode textarea {
  background-color: #27292d;
  border-color: #383b40;
  color: #ddd;
}

textarea {
  margin: 0;
  resize: vertical;
}

input {
  margin: 5px 0 10px;
}

textarea[disabled] {
  background-color: #eceeef;
  cursor: not-allowed;
  opacity: 1;
}

button.submit-button {
  float: right;
  width: 8rem;
}
</style>