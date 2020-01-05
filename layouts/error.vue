<template >
  <div class="main-content">
    <component :is="errorPage" :error="error"/>
  </div>
</template>

<script>
import error404 from '~/components/error/error404'
import error550 from '~/components/error/error550'
import errorGeneral from '~/components/error/errorGeneral'

export default {
  props: {
    error: {
      type: Object
    }
  },
  computed: {
    errorPage() {
      // if (this.error.statusCode === 404) {
      //   return error404
      // } else if (this.error.statusCode === 401) {
      //   return error550
      // } else {
        return errorGeneral
      // }
    }
  }
}
</script>
<style scoped>
.main-content {
  height: 100%;
}
</style>