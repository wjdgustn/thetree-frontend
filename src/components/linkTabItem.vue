<template>
  <li ref="item">
    <NuxtLink :to="href" class="item" :class="{ active }">
      <slot/>
    </NuxtLink>
  </li>
</template>
<script>
import NuxtLink from '@/components/global/nuxtLink'

export default {
  components: {
    NuxtLink
  },
  props: {
    href: {
      type: String,
      required: true
    },
    active: Boolean
  }
}
</script>
<style scoped>
.item {
  color: var(--light-text-color, var(--text-color, #212529));
  display: inline-block;
  padding: .5rem .75rem;
  position: relative;
  text-align: center;
  text-decoration: none;
  white-space: nowrap;
  width: 100%;
}

.item:after {
  background-color: var(--navigation-item-underline-color, transparent);
  bottom: 0;
  content: "";
  height: 4px;
  left: 1rem;
  pointer-events: none;
  position: absolute;
  right: 1rem;
}

.item:not(.active):hover {
  --navigation-item-underline-color: var(--brand-bright-color-2, #e3e3e3);
}

.active {
  --navigation-item-underline-color: var(--brand-bright-color-1, #d5d5d5);
  color: var(--brand-color-1, #bcbcbc);
  font-weight: 600;
}

.theseed-dark-mode .item {
  color: var(--dark-text-color, var(--text-color, #e0e0e0));
}

.theseed-dark-mode .item:not(.theseed-dark-mode .active):hover {
  --navigation-item-underline-color: var(--brand-bright-color-2, #45474b);
}

.theseed-dark-mode .active {
  --navigation-item-underline-color: var(--brand-bright-color-1, #45474b);
}
</style>