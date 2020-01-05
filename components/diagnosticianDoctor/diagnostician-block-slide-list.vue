<style lang="scss" >
#diagnosis-block-slide-list-wrapper {
  width: 100%;
  padding: 0;

  .row {
    padding: 0;
    margin: 0;
    .col {
      padding: 0;
      margin: 0;
    }
  }
  .diagnosis-block-wrapper-head {
    margin-bottom: 20px;
    width: 100%;
    text-align: right;
  }

  .diagnosis-block-slide-list {
    width: 100%;
    height: 60vh;
    border-radius: 4px;
    border: solid 1px $form-inactive-info-color;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .diagnosis-block-card {
      margin-bottom: 15px;

      .diagnosis-block-slide {
        width: 100%;
        height: 158px;
        border-radius: 4px;
        border: dashed 1px $primary-color;
        border-image-source: url('~assets/img/border-dashed-lg-gap.png');
        border-image-repeat: round;
        border-image-slice: 1;
        border-image-width: 0 1px 1px 1px;
        border-top: none;
      }
    }
  }
    .diagnosis-block-empty {
    width: 100%;
    height: 444px;
    border-radius: 4px;
    border: solid 1px $form-inactive-info-color;
    display: flex;
    justify-content: center;
    align-items: center;
    .diagnosis-block-empty-text {
      color: $form-title-color;
      font-size: 14px;
      font-weight: 500;
    }
    div {
      padding: 10px 0;
      text-align: center;

      img {
        width: 283.2px;
        height: 96px;
      }
     
    }
  }
}
</style>

<template>
  <section>
    <div ref="wrapper" id="diagnosis-block-slide-list-wrapper">
      <v-row>
        <div class="diagnosis-block-wrapper-head">
          <v-col md="12" class="diagnosis-slide-head-title">{{$t('block.blocks-slides-head')}}</v-col>
        </div>
      </v-row>
      <v-row>
        <v-col sm="12">
          <div v-if="items && items.length>0" class="diagnosis-block-slide-list">
            <vr-scroll-bar class="vr-scrollbar">
              <div class="diagnosis-block-card" v-for="(block, index) in items" :key="index">
                <blockInfo :blockProp="block" @dataChanged="getBlockList()" :step="'technician'" />
                <template v-if="block.Slides">
                  <div class="diagnosis-block-slide" v-for="(slide, index) in block.Slides" :key="index">
                    <slideInfo
                      :step="'technician'"
                      :slideProp="slide"
                      @slideUpdated="getBlockList()"
                    />
                  </div>
                </template>
              </div>
            </vr-scroll-bar>
          </div>
          <div v-else class="diagnosis-block-empty">
            <div>
              <div>
              </div>
              <div class="diagnosis-block-empty-text">{{$t('block.empty-text')}}</div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import blockInfo from '~/components/diagnosticianDoctor/diagnostician-block-info.vue'
import { ISample } from '~/models/reception/ISample'
import { IBlock } from '~/models/reception/IBlock'
import slideInfo from '~/components/diagnosticianDoctor/diagnostician-slide-info.vue'
export default Vue.extend({
  components: { blockInfo, slideInfo },
  props: {
    sample: {
      type: Object as () => ISample,
      required: true
    }
  },
  data() {
    return {
      items: <IBlock[]>[]
    }
  },
  watch: {
    sample: {
      handler(val, oldVal) {},
      deep: true
    }
  },
  mounted() {
    this.getBlockList()
  },
  methods: {
    async getBlockList() {
      if (this.sample && this.sample.Id) {
        let loader = this.$loader.show(this.$refs.wrapper)
        try {
          this.items = await this.$service.processingReception.sampleGetBlocksWithSlides(
            this.sample.Id
          )
          this.$emit('blocksChanged', this.items)
        } catch (error) {
          this.$toast.error().show({
            message: error.message || this.$t('msg.UI.fail-get-info'),
            top: true,
            customClass: 'toast-customClass error'
          })
        }

        loader.hide()
      }
    }
  }
})
</script>