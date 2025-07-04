<template>
  <table>
    <thead>
    <tr>
      <th></th>
      <th></th>
      <th class="texttitle">r{{data.rev}}</th>
    </tr>
    </thead>
    <tbody>
    <tr v-for="(item, index) in data.blameLines">
      <th v-if="item.diff" :rowspan="item.diff.count" :style="{ 'background-color': item.diff.user.color }">
        <NuxtLink v-if="item.diff.history.rev !== 1" :to="doc_action_link(data.document, 'diff', { uuid: item.diff.uuid })">
          r{{item.diff.history.rev}}
        </NuxtLink>
        <template v-else>r{{item.diff.history.rev}}</template>
        <br>
        <AuthorSpan :account="item.diff.user"/>
        <template v-if="item.diff.history.infoText">
          <br>
          <i>
            <NuxtLink
                v-if="item.diff.history.type === 5"
                :to="doc_action_link(data.document, 'blame', { uuid: item.diff.uuid })">
              ({{item.diff.history.infoText}})
            </NuxtLink>
            <template v-else>
              ({{item.diff.history.infoText}})
            </template>
          </i>
        </template>
      </th>
      <th>{{index + 1}}</th>
      <td>{{item.content}}</td>
    </tr>
    </tbody>
  </table>
</template>
<script>
import Common from '@/mixins/common'
import NuxtLink from '@/components/global/nuxtLink'
import AuthorSpan from '@/components/authorSpan'

export default {
  mixins: [Common],
  components: {
    NuxtLink,
    AuthorSpan
  }
}
</script>
<style scoped>
table {
  border: 1px solid #a9a9a9;
  border-collapse: collapse;
  font-size: .9rem;
  white-space: pre-wrap;
}

.theseed-dark-mode table {
  border-color: #383b40;
}

table tbody th {
  background: #eed;
  border: 1px solid #bbc;
  color: #886;
  font-size: 11px;
  font-weight: 400;
  padding: .3em .5em .1em 2em;
  text-align: right;
  user-select: none;
  vertical-align: top;
}

.theseed-dark-mode table tbody th {
  background: #27292d;
  border: 1px solid #383b40;
  color: #8a8a8a;
}

table thead {
  background: #efefef;
  border-bottom: 1px solid #bbc;
  font-family: Verdana;
}

.theseed-dark-mode table thead {
  background: #2d2f34;
  border-bottom: 1px solid #383b40;
}

table thead th.texttitle {
  text-align: left;
}

table tbody th {
  word-break: normal;
}

table tbody td {
  padding: .4em .4em 0;
  vertical-align: top;
}

table div {
  word-wrap: break-word;
  word-break: break-all;
}
</style>