<style lang="scss" >
#diagnosis-slide-wrapper {
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
  .slide-wrapper-head {
    margin-bottom: 20px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .slide-head-title {
    display: flex;
    text-align: right;
    align-items: center;
    font-size: 0.875rem;
  }
  .slide-head-button {
    text-align: left;
  }
  .slide-list {
    width: 100%;
    height: 60vh;
    border-radius: 4px;
    border: solid 1px $form-inactive-info-color;
    padding: 20px;
    display: flex;
    flex-direction: column;
    .slide {
      border-radius: 4px;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
      margin: 10px 0;
    }
  }
}
</style>

<template>
  <section>
    <div ref="wrapper" id="diagnosis-slide-wrapper">
      <v-row>
        <div class="slide-wrapper-head">
          <v-col md="12" class="slide-head-title">{{$t('slide.slide-list')}}</v-col>
        </div>
      </v-row>
      <v-row>
        <v-col sm="12">
          <div class="slide-list">
            <vr-scroll-bar class="vr-scrollbar">
              <div class="slide" v-for="(slide, index) in items" :key="index">
                <slideInfo :step="step" :slideProp="slide" />
              </div>
            </vr-scroll-bar>
          </div>
        </v-col>
      </v-row>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISlide } from '~/models/reception/ISlide'
import slideInfo from './diagnostician-slide-info.vue'
import { VRDataGrid } from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
import { slideStatusEnum } from '~/enums/slideStatus'

export default Vue.extend({
  components: { slideInfo },
  props: {
    sampleId: {
      type: Number,
      required: true
    },
    receptionId: {
      type: Number,
      required: true
    }
  },
  data() {
    let items: ISlide[] = []
    return {
      items: items
    }
  },
  mounted() {
    this.getSlideList()
  },
  watch: {
    sampleId: {
      handler(val, oldVal) {
        this.getSlideList()
      },
      deep: true
    }
  },
  methods: {
    getSlideList() {
      let loader = this.$loader.show(this.$refs.wrapper)
      this.$service.sample
        .slideList(this.receptionId, this.sampleId)
        .then(data => {
          this.items = data
        })
        .catch(error => {
          this.$toast.error().show({
            customClass: 'toast-customClass error',
            message: error.message || this.$t('msg.UI.fail'),
            top: true
          })
        })
        .finally(() => {
          loader.hide()
        })
    },
    cancel() {
      this.$emit('hide')
    }
  }
})
</script>