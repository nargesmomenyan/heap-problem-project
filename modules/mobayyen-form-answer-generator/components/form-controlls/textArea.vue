<template>
  <div class="form-group">

    <v-textarea
      :error-messages="errorMessages"
      auto-grow
      v-bind="Object.assign($attrs,field)"
      v-model="model"
      outlined
    ></v-textarea>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import mixins from './mixins'
export default Vue.extend({
  mixins: [mixins]
})
</script>
