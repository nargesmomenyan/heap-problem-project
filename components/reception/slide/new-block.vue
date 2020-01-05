<style lang="scss" >
#blockWrapper {
  width: 396px;
  height: 100%;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;

  .block-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .block-head-title {
      font-size: 1rem;
      color: $form-caption-color;
    }
  }

  .block-gap {
    height: 15px;
  }

  .btn-wrapper {
    text-align: left;
  }
}
</style>
<template>
  <div ref="wrapper" id="blockWrapper">
    <div class="block-head">
      <div class="block-head-title">{{title}}</div>
    </div>
    <div class="reception-form">
      <v-textarea
        v-validate="required"
        :label="$t('block.description')"
        outlined
        rows="5"
        :placeholder="$t('block.description')+$t('placeholder.enter')"
        v-model="block.Detail"
        :data-vv-as="$t('block.description')"
        :error-messages="errors.collect('description')"
        name="description"
      ></v-textarea>
    </div>
    <div class="block-gap"></div>
    <div class="btn-wrapper">
      <v-btn class="medium" @click="saveBlock">{{$t('actions.final-step')}}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IBlock } from '~/models/reception/IBlock'

export default Vue.extend({
  props: {
    blockProp: {
      required: true,
      type: Object as () => IBlock
    }
  },
  watch: {
    blockProp: {
      handler() {
        this.block = Object.assign({}, this.blockProp)
      },
      deep: true
    }
  },
  data() {
    return {
      block: Object.assign({}, this.blockProp),
      title:
        this.blockProp && this.blockProp.Id
          ? this.$t('block.edit-title')
          : this.$t('block.add-title')
    }
  },
  methods: {
    saveBlock() {
      let loader = this.$loader.show(this.$refs.wrapper)

      this.$validator.validateAll().then(valid => {
        if (valid) {
          let service = this.block.Id
            ? this.$service.processingReception.editBlock(this.block)
            : this.$service.processingReception.saveBlock(this.block)

          service
            .then(data => {
              this.$emit('hide', 'success')
              this.$toast.success().show({
                customClass: 'toast-customClass success',
                message: this.$t('msg.UI.success').toString(),
                top: true
              })
            })
            .catch(error => {
              this.$toast.error().show({
                customClass: 'toast-customClass error',
                top: true,
                message: error.message || this.$t('msg.UI.fail')
              })
            })
        }
      })
      loader.hide()
    }
  }
})
</script>