<style lang="scss">
.property-element-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-end; 
}
.property-inner-element{
   transform: translateX(20px);
}
</style>
<template>
  <div class="property-element-wrapper">
    <component
      v-validate="propertyElement.validation"
      v-model="propertyElement.model"
      :autocomplete="propertyElement.browserAutocomplete || 'off'"
      :disabled="propertyElement.disabled"
      :readonly="propertyElement.readonly"
      :items="propertyElement.items"
      :error-messages="errors.collect(propertyElement.model)"
      :name="propertyElement.model"
      :placeholder="propertyElement.placeholder"
      :suffix="propertyElement.suffix"
      :label="propertyElement.label"
      :append-icon="propertyElement.appendIcon"
      :prepend-icon="propertyElement.prependIcon"
      :multiple="propertyElement.multiple"
      :chips="propertyElement.chips"
      :return-object="propertyElement.returnObject"
      :outlined="true"
      :ref="propertyElement.ref"
      :is="propertyElement.component || `answer-control-${propertyElement.type}`"
      :field="propertyElement"
      :data-vv-as="propertyElement.label"
      :type="propertyElement.inputType"
      :hint="propertyElement.hint"

    ></component>
    <template v-if="propertyElement.items">
      <property-component class="property-inner-element"
        v-for="(innerPropertyElement , index) in propertyElement.items"
        :key="index"
        :propertyElement="innerPropertyElement"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import propertyComponent from './property-component.vue'
export default Vue.extend({
  name: 'propertyComponent',
  props: ['propertyElement'],
  components: { propertyComponent }
})
</script>