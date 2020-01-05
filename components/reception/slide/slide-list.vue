<style lang="scss" >
.slide-wrapper {
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
  .slide-empty {
    width: 100%;
    height: 444px;
    border-radius: 4px;
    border: dashed 1px $form-info-color;
    display: flex;
    justify-content: center;
    align-items: center;
    div {
      padding: 4px 0;
      text-align: center;

      img {
        width: 128px;
        height: 128px;
        margin-bottom: 12px;
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
    <div ref="wrapper" class="slide-wrapper">
      <v-row v-if="dataIsFetched">
        <div class="slide-wrapper-head">
          <v-col sm="12" md="6" class="slide-head-title">لام‌ها</v-col>
          <v-col class="slide-head-button" v-if="items && items.length>0" sm="12" md="6">
            <v-btn class="medium" @click="addSlide">افزودن لام</v-btn>
          </v-col>
        </div>
      </v-row>
      <v-row v-if="dataIsFetched">
        <v-col sm="12">
          <div v-if="items && items.length>0" class="slide-list">
            <vr-scroll-bar class="vr-scrollbar">
              <div class="slide" v-for="(slide, index) in items" :key="index">
                <slideInfo :step="step" :slideProp="slide" @slideUpdated="getSlideList()" />
              </div>
            </vr-scroll-bar>
          </div>

          <div v-else class="slide-empty">
            <div>
              <div>
              </div>
              <div>در حال حاضر، هیچ لامی ساخته نشده است.</div>
              <div class="action">
                <v-btn @click="addSlide">افزودن لام</v-btn>
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
import { ISlide } from '~/models/reception/ISlide'
import newSlide from './new-slide.vue'
import slideInfo from './slide-info.vue'
import { VRDataGrid } from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
import { slideStatusEnum } from '../../../enums/slideStatus'
import fileUpload from '~/components/common/file-upload.vue'

export default Vue.extend({
  components: { newSlide, slideInfo, fileUpload },
  props: {
    sampleId: {
      type: Number,
      required: true
    },
    receptionId: {
      type: Number,
      required: true
    },
    step: {
      required: true,
      type: String,
      default: 'reception'
    }
  },
  data() {
    let items: ISlide[] = []
    return {
      dialog: false,
      items: items,
      dataIsFetched: false
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
          if (this.step && this.step != 'reception') {
            this.$emit('slidesChanged', this.items)
          }
        })
        .catch(error => {
          this.$toast.error().show({
            customClass: 'toast-customClass error',
            message: error.message || this.$t('msg.UI.fail'),
            top: true
          })
        })
        .finally(() => {
          this.dataIsFetched = true
          loader.hide()
        })
    },
    addSlide() {
      let slide: ISlide = {
        Id: 0,
        SampleId: this.sampleId,
        ReceptionId: this.receptionId
      }
      this.$dialog
        .show({
          component: newSlide,
          props: {
            slideProp: slide,
            step: this.step
          }
        })
        .then(data => {
          if (data == 'success') {
            this.getSlideList()
          }
        })
    },
    cancel() {
      this.$emit('hide')
    }
  }
})
</script>