<style lang="scss">
.property-group-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  // transform: translateX(20px);
  padding-top: 15px;
}
.property-group-title {
  text-align: left;
  font-weight: bold;
  font-size: 16px;
  padding-right: 10px;
}
.property-group-head{
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>
<template>
  <div class="property-group-wrapper">
    <div class="property-group-head">
      <div class="property-group-title" v-if="propertyGroup.title">{{propertyGroup.title}}</div>
      <v-divider />
    </div>
    <template v-if="propertyGroup.innerGroupList">
      <propertyGroupComponent
        v-for="(groupElement, index) in propertyGroup.innerGroupList"
        :key="index"
        :propertyGroup="groupElement"
      />
    </template>

    <template v-if="propertyGroup.innerPropertyList">
      <property-component
        v-for="(propertyElement, propertyIndex) in propertyGroup.innerPropertyList"
        :key="propertyIndex"
        :propertyElement="propertyElement"
      />
    </template>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import propertyComponent from './property-component.vue'
export default Vue.extend({
  name: 'propertyGroupComponent',
  props: ['propertyGroup'],
  components: { propertyComponent }
})
</script>