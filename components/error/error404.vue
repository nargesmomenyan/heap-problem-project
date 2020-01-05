<template>
  <div class="error-page">
    <div class="error-container">
      <h1 class="title">OOPS!</h1>
      <div class="subtitle">Something went wrong here</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  height: 100vh;
  background: Url('./404.jpg') center/cover no-repeat border-box;
}

.error-container {
  margin-top: 26rem;
  position: absolute;
  color: white;
  text-align: center;
  width: 100vw;
}

.tr1-enter {
  opacity: 0;
}
.tr1-enter-active {
  transition: opacity 2s;
}

.title {
  font-size: 5rem;
  text-align: center;
  font-weight: 500;
  margin: 0;
}

.subtitle {
  font-size: 2.5rem;
  text-align: center;
  font-weight: 700;
}

@media screen and (max-width: 40rem) {
  .title {
    font-size: 2.5rem;
  }
  .subtitle {
    font-size: 1.5rem;
  }
}
</style>

