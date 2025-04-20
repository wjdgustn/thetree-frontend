<template>
  <div>
    <p><slot/></p>
  </div>
</template>
<style scoped>
@keyframes blinkWhite {
  0% {
    color: #000;
  }

  to {
    color: red;
  }
}

@keyframes blinkDark {
  0% {
    color: #fff;
  }

  to {
    color: red;
  }
}

div>p {
  animation: blinkWhite 1s infinite alternate;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 0;
}
</style>