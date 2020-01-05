<style lang="scss">
.expandable-textarea {
  .v-input__slot {
    padding-left: 15px !important;
    padding-bottom: 4px !important;
    .v-input__append-inner {
      position: absolute;
      left: 20px;
    }
  }
}
.expand-icon {
  margin: 0 !important;
  padding: 0 !important;
  width: 24px !important;
  height: 24px !important;
  min-height: 24px !important;
  min-width: 24px !important;

  img {
    width: 24px;
    height: 24px;
  }
}
</style>
<template>
  <div class="expandable-textarea">
    <v-textarea v-bind="$attrs" outlined autocomplete="off" v-model="model">
      <template v-slot:append>
        <v-btn class="expand-icon" text @click="expand">
        </v-btn>
      </template>
    </v-textarea>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import textareaDialog from '~/components/common/expanded-textarea-dialog.vue'
export default Vue.extend({
  inject: ['$validator'],
  $_veeValidate: {
    value() {
      return this.value
    },
    name() {
      return this.name
    }
  },
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default:''
    }
  },
  data() {
    return {
      model: new String(this.value)
    }
  },
  methods: {
    expand() {
      this.$dialog
        .show({
          component: textareaDialog,
          props: {
            defaultText: (<any>this).model
          }
        })
        .then(data => {
          (<any>this).model = data
        })
    }
  },
  watch: {
    value: function(val) {
      (<any>this).model = val
    },
    model: function(val) {
      this.$emit('input', val)
    }
  }
})
</script>