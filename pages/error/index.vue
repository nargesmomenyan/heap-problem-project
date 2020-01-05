<template>
  <div>
    <errorGeneral/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import errorGeneral from '~/components/error/errorGeneral.vue'
export default Vue.extend({
  components: {
    errorGeneral
  },
  layout: 'landing'
})
</script>

