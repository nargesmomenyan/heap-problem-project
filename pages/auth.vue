<style lang="scss" scoped>
</style>
<template>
  <Auth />
</template>
<script lang="ts">
import Vue from 'vue'
import Auth from '~/components/auth/index.vue'
export default Vue.extend({
  layout: 'landing',
  components: { Auth }
})
</script>
