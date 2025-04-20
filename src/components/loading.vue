<template>
  <div class="loading-block">
    <div v-for="i in 12"/>
  </div>
</template>
<style scoped>
.loading-block {
  display: inline-block;
  height: 64px;
  position: relative;
  width: 64px;
}

.loading-block div {
  animation: loadingAnimation 1.2s linear infinite;
  transform-origin: 32px 32px;
}

.loading-block div:after {
  background: #fff;
  border-radius: 20%;
  content: " ";
  display: block;
  height: 14px;
  left: 29px;
  position: absolute;
  top: 3px;
  width: 5px;
}

.loading-block div:first-child {
  animation-delay: -1.1s;
  transform: rotate(0deg);
}

.loading-block div:nth-child(2) {
  animation-delay: -1s;
  transform: rotate(30deg);
}

.loading-block div:nth-child(3) {
  animation-delay: -.9s;
  transform: rotate(60deg);
}

.loading-block div:nth-child(4) {
  animation-delay: -.8s;
  transform: rotate(90deg);
}

.loading-block div:nth-child(5) {
  animation-delay: -.7s;
  transform: rotate(120deg);
}

.loading-block div:nth-child(6) {
  animation-delay: -.6s;
  transform: rotate(150deg);
}

.loading-block div:nth-child(7) {
  animation-delay: -.5s;
  transform: rotate(180deg);
}

.loading-block div:nth-child(8) {
  animation-delay: -.4s;
  transform: rotate(210deg);
}

.loading-block div:nth-child(9) {
  animation-delay: -.3s;
  transform: rotate(240deg);
}

.loading-block div:nth-child(10) {
  animation-delay: -.2s;
  transform: rotate(270deg);
}

.loading-block div:nth-child(11) {
  animation-delay: -.1s;
  transform: rotate(300deg);
}

.loading-block div:nth-child(12) {
  animation-delay: 0s;
  transform: rotate(330deg);
}

@keyframes loadingAnimation {
  0% {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>