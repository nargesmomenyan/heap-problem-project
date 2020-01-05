<style lang="scss" scoped>
#pass-description-wrapper {
  padding: 20px;
  width: 606px;
  height: 570px;
  color: $form-info-color;
  position: relative;
  .description-head {
    font-size: 16px;
    padding: 5px 0;
  }
  .description-text {
    font-size: 14px;
    padding: 5px 0;
  }
  .description-close {
    text-align: left;
    width: 95%;
    position: absolute;
    bottom: 10px;
  }
}
</style>
<template>
  <div id="pass-description-wrapper">
    <div class="description-head">{{$t('pass.description')}}</div>
    <div class="description-text">{{description}}</div>
    <div class="description-close">
      <v-btn @click="close">{{$t('pass.close-description')}}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    description: {
      type: String,
      required: true
    }
  },
  methods: {
    close() {
      this.$emit('hide')
    }
  }
})
</script>