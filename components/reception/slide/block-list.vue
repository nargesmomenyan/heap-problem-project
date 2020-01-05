<style lang="scss" >
#block-list-wrapper {
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
  .block-wrapper-head {
    margin-bottom: 20px;
    width: 100%;
    text-align: right;
    display: flex;
    justify-content: space-between;

    .block-head-title {
      color: $form-title-color;
      font-size: 14px;
      display: flex;
      text-align: right;
      align-items: center;
    }
    .block-head-button {
      text-align: left;
    }
  }

  .block-list {
    width: 100%;
    height: 60vh;
    border-radius: 4px;
    border: solid 1px $form-inactive-info-color;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .block-card {
      margin-bottom: 15px;
    }
  }
  .block-empty {
    width: 100%;
    height: 444px;
    border-radius: 4px;
    border: solid 1px $form-inactive-info-color;
    display: flex;
    justify-content: center;
    align-items: center;
    .block-empty-text {
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
      .v-btn {
        width: 100%;
      }
    }
  }
}
</style>

<template>
  <section>
    <div ref="wrapper" id="block-list-wrapper">
      <v-row>
        <div class="block-wrapper-head">
          <v-col sm="12" md="6" class="block-head-title">{{$t('block.blocks-head')}}</v-col>
          <v-col class="block-head-button" v-if="items && items.length>0" sm="12" md="6">
            <v-btn class="medium" @click="addBlock">{{$t('block.add-block')}}</v-btn>
          </v-col>
        </div>
      </v-row>
      <v-row>
        <v-col sm="12">
          <div v-if="items && items.length>0" class="block-list">
            <vr-scroll-bar class="vr-scrollbar">
              <div class="block-card" v-for="(block, index) in items" :key="index">
                <blockInfo :blockProp="block" @dataChanged="getBlockList()" :step="'doctor'" />
              </div>
            </vr-scroll-bar>
          </div>
          <div v-else class="block-empty">
            <div>
              <div>
              </div>
              <div class="block-empty-text">{{$t('block.empty-text')}}</div>
              <div class="action">
                <v-btn class="reverse" @click="addBlock">{{$t('block.add-block')}}</v-btn>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import blockInfo from '~/components/reception/slide/block-info.vue'
import { ISample } from '../../../models/reception/ISample'
import { IBlock } from '~/models/reception/IBlock'
import newBlock from '~/components/reception/slide/new-block.vue'
export default Vue.extend({
  components: { blockInfo },
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
          this.items = await this.$service.processingReception.sampleGetBlocks(
            this.sample.Id
          )
          
        } catch (error) {
          this.$toast.error().show({
            message: error.message || this.$t('msg.UI.fail-get-info'),
            top: true,
            customClass: 'toast-customClass error'
          })
        }

        loader.hide()
      }
    },
    addBlock() {
      let block: IBlock = {
        Id: 0,
        SampleId: this.sample.Id
      }
      this.$dialog
        .show({
          component: newBlock,
          props: {
            blockProp: block
          }
        })
        .then(data => {
          if (data == 'success') {
            this.getBlockList()
          }
        })
    }
  }
})
</script>