<template>
  <h3>{{$t('views.discuss.edit_request')}}</h3>
  <ul>
    <li v-for="item in data.openEditRequests">
      <NuxtLink :to="'/edit_request/' + item.url">{{$t('views.user_contribution.edit_request_link', { slug: item.url })}}</NuxtLink>
    </li>
  </ul>
  <p>
    <NuxtLink :to="doc_action_link(data.document, 'discuss', { state: 'closed_edit_requests' })">[{{$t('views.discuss.see_closed_edit_request')}}]</NuxtLink>
  </p>

  <h3>{{$t('views.discuss.discuss')}}</h3>
  <ul>
    <li v-for="(item, index) in data.openThreads">
      <NuxtLink :to="'#s-' + index + 1">{{index + 1}}</NuxtLink>
      <span>.&nbsp;</span>
      <NuxtLink :to="'/thread/' + item.url">{{item.topic}}</NuxtLink>
    </li>
  </ul>
  <p>
    <NuxtLink :to="doc_action_link(data.document, 'discuss', { state: 'close' })">[{{$t('views.discuss.see_closed_discuss')}}]</NuxtLink>
  </p>

  <div v-for="(item, index) in data.openThreads">
    <SeedForm :beforeSubmit="goConfirm" method="post" class="delete-thread-form" :action="'/admin/thread/' + item.url + '/delete'" noCaptcha>
      <SeedButton v-if="data.permissions.delete" type="submit" danger>{{$t('views.thread.delete_thread')}}</SeedButton>
    </SeedForm>
    <h2>{{index + 1}}. <NuxtLink :to="'/thread/' + item.url" :id="'s-' + index">{{item.topic}}</NuxtLink></h2>
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

  <h3>{{$t('views.discuss.new_topic')}}</h3>

  <Alert v-if="doc_fulltitle(page.data.document) === config['wiki.front_page']">
    <strong>[{{$t('views.thread.warn')}}]</strong>
    {{$t('views.thread.front_page_warn', { document: doc_fulltitle(page.data.document) })}}
  </Alert>

  <FormErrorAlert/>
  <SeedForm method="post">
    <SeedFormBlock :label="$t('views.discuss.topic_label')" inputId="topicInput" name="topic">
      <input ref="topicInput" type="text" id="topicInput" name="topic">
    </SeedFormBlock>
    <CommentPreviewTab ref="commentPreviewTab"/>
    <IpWarn discuss/>
    <SeedButton class="submit-button" submit>{{$t('views.discuss.submit')}}</SeedButton>
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
import FormErrorAlert from '@/components/form/formErrorAlert'
import Alert from '@/components/alert'
import CommentPreviewTab from '@/components/commentPreviewTab'

export default {
  mixins: [Common],
  components: {
    CommentPreviewTab,
    Alert,
    FormErrorAlert,
    IpWarn,
    Comment,
    SeedFormBlock,
    SeedButton,
    SeedForm,
    NuxtLink
  },
  created() {
    this.$store.state.components.mainView.beforeLeave = this.beforeLeave
  },
  methods: {
    goConfirm() {
      return confirm('go?')
    },
    beforeLeave() {
      if(this.$refs.topicInput?.value || this.$refs.commentPreviewTab.$refs.commentInput?.value)
        return confirm(this.$t('views.edit.not_saved'))
      return true
    }
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