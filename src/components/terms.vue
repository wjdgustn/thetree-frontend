<template>
  <pre v-html="data.terms"></pre>
</template>
<style scoped>
pre {
  --input-color: var(--light-text-color, var(--text-color, #212529));
  --input-background-color: #fcfcfb;
  --input-border-color: #dfe1e2;
  appearance: none;
  background-color: var(--input-background-color);
  border: 1px solid var(--input-border-color);
  border-radius: 4px;
  color: var(--input-color);
  display: block;
  font-size: .9rem;
  line-height: 1.5;
  padding: .3rem .75rem;
  height: 30rem;
  scrollbar-width: thin;
  white-space: break-spaces;
  resize: vertical;
  margin: 0;
}

.theseed-dark-mode pre {
  --input-color: var(--dark-text-color, var(--text-color, #e0e0e0));
  --input-background-color: #2d2e2f;
  --input-border-color: #5c5c5c;
}
</style>