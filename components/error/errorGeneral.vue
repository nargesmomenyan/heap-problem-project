<template>
  <div class="error-page">
    <h2>{{errorMessage}}</h2>
    <br />
    <p>
      {{$t('app.title')}}
      <a href="/">صفحه اصلی</a>
    </p>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },
   props: {
    error: {
      type: Object,
      default: null
    }
  },
  computed: {
    errorMessage() {
      let code = this.$route.query.code
      if (code && code === 'authorization')
        return this.$t('msg.UI.unauthorized')
      else if (this.error.message) return this.error.message
      else this.$t('msg.UI.fail')
    }
  },
  beforeMount() {
    this.$loader.destroy()
  }
  
}
</script>

<style scoped>
.error-page {
  margin-top: 10rem;
  text-align: center;
}

.error-page a {
  text-decoration: none;
  color: red;
}

.error-page a:hover,
.error-page a:active {
  color: salmon;
}
</style>

