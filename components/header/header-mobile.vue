<style lang="scss">
.app-bar-mobile {
  padding: 0;
  margin: 0;

  .v-toolbar {
    border: 0 !important;
    height: 110px !important;
  }
  .v-toolbar__content {
    padding: 0 !important;
    height: 110px !important;
    display: flex;
    flex-direction: column;
    justify-content: stretch;
  }

  .tool-bar {
    height: 64px;
    width: 100%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 20px;
    padding-left: 20px;
  }

  .tool-bar-right {
    display: flex;
    align-items: center;
    height: 100%;
  }
}
</style>

<template>
  <section>
    <v-app-bar prominent fixed class="app-bar-mobile">
      <div class="tool-bar">
        <div class="tool-bar-right">
          <div class="lab-title-wrapper">
            <div class="lab-title">{{$t('app.lab-title')}}</div>
          </div>
          <div class="tab-wrapper">
            <appNavigation :mini-variant="miniVariant"></appNavigation>
          </div>
        </div>
        <div class="extra-menu-mobile">
          <div class="action" v-if="extraMenu"></div>
        </div>
      </div>
    </v-app-bar>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    
})
</script>