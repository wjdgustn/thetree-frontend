<template>
  <textarea readonly :value="data.content"/>
</template>
<style scoped>
textarea {
  border: .0625rem solid #ccc;
  border-radius: 0;
  color: #55595c;
  font-family: inherit;
  font-size: .9rem;
  height: 600px;
  line-height: 1.5;
  margin: 0;
  overflow: auto;
  padding: .25rem .5rem;
  width: 100%;
}

textarea[readonly] {
  background-color: #eceeef;
  opacity: 1;
}

.theseed-dark-mode textarea {
  background-color: #000;
  color: #ddd;
}
</style>