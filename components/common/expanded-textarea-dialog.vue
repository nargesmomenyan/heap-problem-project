<style lang="scss">
.expanded-textarea-wrapper {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 606px;
  height: 570px;

  .expanded-textarea-head {
    font-size: 16px;
    color: $form-title-color;
    padding: 30px 25px 10px 25px;
  }
  .expanded-textarea-text {
    padding: 10px 25px;
    .v-input__slot {
      padding-left: 15px !important;
      padding-bottom: 4px !important;
    }
  }
  .expanded-textarea-action {
    height: 64px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    box-shadow: 0 -2px 4px 0 rgba(0, 0, 0, 0.3);
    padding: 0 25px;
    position: absolute;
    bottom: 0;
  }
}
</style>
<template>
  <div class="expanded-textarea-wrapper">
    <div class="expanded-textarea-head">{{$t('common.description')}}</div>
    <div class="expanded-textarea-text">
      <v-textarea outlined rows="21" v-model="text" hide-details></v-textarea>
    </div>
    <div class="expanded-textarea-action">
      <v-btn @click="close">{{$t('actions.save-close')}}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    defaultText: {
      default: '',
      type: String
    }
  },
  data() {
    return {
      text: this.defaultText
    }
  },
  methods: {
    close() {
      this.$emit('hide', this.text)
    }
  }
})
</script>