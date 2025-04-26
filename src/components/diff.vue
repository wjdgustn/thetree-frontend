<template>
  <table class="diff-table">
    <thead>
    <tr>
      <th></th>
      <th></th>
      <th class="texttitle">{{title}}</th>
    </tr>
    </thead>

    <tbody v-html="diffHtml"></tbody>
  </table>
</template>
<script>
export default {
  props: {
    title: String,
    diffHtml: {
      type: String,
      required: true
    }
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

table :deep(tbody) {
  th {
    background: #eed;
    border: 1px solid #bbc;
    color: #886;
    font-size: 11px;
    font-weight: 400;
    padding: .3em .5em .1em 2em;
    text-align: right;
    user-select: none;
    vertical-align: top;
    word-break: normal;
  }

  td {
    padding: .4em .4em 0;
    vertical-align: top;
  }

  .skip {
    background-color: #efefef;
    border: 1px solid #aaa;
    border-right-color: #bbc;
  }

  div {
    word-wrap: break-word;
    word-break: break-all;
  }

  .delete {
    background-color: #fdd;
  }

  .insert {
    background-color: #cfc;
  }

  del.diff {
    background-color: #fff;
    color: #999;
    text-decoration: line-through;
  }

  ins.diff {
    background-color: #50ff50;
    text-decoration: none;
  }
}

.theseed-dark-mode table :deep(tbody) {
  th {
    background: #27292d;
    border: 1px solid #383b40;
    color: #8a8a8a;
  }

  .skip {
    background-color: #2d2f34;
    border: 1px solid #383b40;
  }

  .delete {
    background-color: #943838;
  }

  .insert {
    background-color: #3b5a3b;
  }

  del.diff {
    background-color: #d05d5d;
    color: #ddd;
  }

  ins.diff {
    background-color: #1c751c;
  }
}
</style>