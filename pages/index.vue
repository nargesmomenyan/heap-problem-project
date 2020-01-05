<style lang="scss" >
.section-wrapper {
  width: 100%;
  text-align: center;
}
</style>

<template>
  <section class="section-wrapper">
    <slideImageMap />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import slideImageMap from '~/components/reception/slide/slide-img-map.vue'
export default Vue.extend({
  components: {slideImageMap},
  data() {
    return {}
  },
  async mounted() {},
  methods: {}
})
</script>
