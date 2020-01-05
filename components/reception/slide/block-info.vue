<style lang="scss">
#block-slide-wrapper {
  cursor: pointer;
  .block-wrapper {
    width: 100%;
    height: 103px;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 20px 5px;

    .block-info {
      width: 80%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      .block-info-detail {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 60px;
        padding: 0 10px;

        .block-info-caption {
          color: $form-info-color;
          font-size: 0.875rem;
          height: 40px;
        }
        .block-info-text {
          color: $form-info-color;
          font-size: 0.75rem;
          height: 20px;
          text-align: center;
        }
      }
    }

    .block-action {
      display: flex;
      height: 100%;
      width: 20%;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

<template>
  <div id="block-slide-wrapper" ref="blockInfoWrapper">
    <div class="block-wrapper" @click="showBlockEditDialog()">
      <div class="block-info">
        <div v-if="canDeleteSlide()" class="block-info-detail">
          <v-btn text icon @click.stop="deleteBlock()">
          </v-btn>
        </div>
        <div class="block-info-detail">
          <span class="block-info-caption">{{$t('block.number')}}</span>
          <span class="block-info-text">{{1}}</span>
        </div>
        <div class="block-info-detail">
          <span class="block-info-caption">{{$t('block.detail')}}</span>
          <span class="block-info-text">{{block.Detail}}</span>
        </div>
      </div>
      <div v-if="step=='technician'" class="block-action">
        <v-btn @click.stop="blockAddSlide" text>
          <v-icon>la-plus</v-icon>
          {{$t('block.add-slide')}}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IBlock } from '~/models/reception/IBlock'
import newSlide from './new-slide.vue'
import { ISlide } from '~/models/reception/ISlide'
import newBlock from '~/components/reception/slide/new-block.vue'
export default Vue.extend({
  components: { newSlide },
  props: {
    blockProp: {
      type: Object as () => IBlock,
      required: false
    },
    step: {
      type: String,
      required: true
    }
  },
  watch: {
    blockProp: {
      handler() {
        this.block = this.blockProp
      },
      deep: true
    }
  },
  data() {
    return {
      block: this.blockProp || <IBlock>{ Detail: ' جزئیات بلاک ', Id: 0 }
    }
  },
  methods: {
    canDeleteSlide(){
     return this.$authorization.check('SampleProcessing/RemoveBlockFromPass')
    },
    blockAddSlide() {
      let slide: ISlide = {
        Id: 0,
        SampleId: this.block.SampleId,
        BlockId: this.block.Id
      }
      this.$dialog
        .show({
          component: newSlide,
          props: {
            slideProp: slide,
            step: 'technician'
          }
        })
        .then(data => {
          if (data == 'success') {
            this.$emit('dataChanged')
          }
        })
    },
    async deleteBlock() {
      this.$dialog
        .confirm({
          title: this.$t('block.delete-warning-title').toString(),
          message: this.$t('block.delete-warning-msg').toString(),
          ok_txt: this.$t('confirm.ok_txt').toString(),
          cancel_txt: this.$t('confirm.cancel_txt').toString(),
          dialog_wrapper_custom_class:
            'dialog-wrapper-confirm-cancel-technician'
        })
        .then(data => {
          
          let loader = this.$loader.show(this.$refs.blockInfoWrapper)

          this.$service.processingReception
            .deleteBlock(this.block)
            .then(result => {
              loader.hide()
              this.$emit('dataChanged')
            })
            .catch(() => {
              loader.hide()
            })
        })
    },
    showBlockEditDialog() {
      this.$dialog
        .show({
          component: newBlock,
          props: {
            blockProp: this.block
          }
        })
        .then(data => {
          if (data == 'success') {
            this.$emit('dataChanged')
          }
        })
    }
  }
})
</script>