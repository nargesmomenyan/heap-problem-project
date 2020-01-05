<style lang="scss">
.textField{
  width: 280px !important;
}
</style>
<template>
  <div class="form-group">
    <v-text-field
      :error-messages="errorMessages"
      v-bind="Object.assign($attrs,field)"
      v-model="model"
      outlined
      :label="field.label"
      class="textField"
    ></v-text-field>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import mixins from './mixins'
export default Vue.extend({
  mixins: [mixins]
})
</script>
