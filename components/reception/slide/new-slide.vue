<style lang="scss" >
#slideWrapper {
  width: 396px;
  height: 100%;
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.3);
  padding: 20px;
  display: flex;
  flex-direction: column;

  .slide-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    .slide-head-title {
      font-size: 1rem;
      color: $form-caption-color;
    }
  }

  .barcode-wrapper {
    height: 64px;
    width: 356px;
    margin-bottom: 30px;
    //   .slide-barcode {
    // height: 64px;
    //   width: 356px;
    //   }
  }
  .slide-gap {
    height: 15px;
  }

  .btn-wrapper {
    text-align: left;
  }
}
</style>
<template>
  <div ref="wrapper" id="slideWrapper">
    <div class="slide-head">
      <div class="slide-head-title">{{title}}</div>
    </div>
    <div class="reception-form">
      <v-textField
        outlined
        :label="$t('slide.number')"
        v-validate="'required'"
        :placeholder="$t('slide.number')+$t('placeholder.enter')"
        v-model="slide.SlideNumber"
        name="slideNumber"
        :data-vv-as="$t('slide.number')"
        :error-messages="errors.collect('slideNumber')"
      ></v-textField>

      <v-select
        :attach="true"
        :label="$t('slide.slidingTechnique')"
        :items="slidingTechniques"
        outlined
        :placeholder="$t('slide.slidingTechnique')+$t('placeholder.enter')"
        v-model="slide.SlidingTechnique"
      ></v-select>

      <div class="barcode-wrapper">
        <img class="slide-barcode" :src="getSlideBarcode()" />
      </div>

      <v-textarea
        :label="$t('slide.description')"
        outlined
        rows="3"
        :placeholder="$t('slide.description')+$t('placeholder.enter')"
        v-model="slide.SlidingDetail"
        hide-details
      ></v-textarea>
    </div>
    <div class="slide-gap"></div>
    <div class="btn-wrapper">
      <v-btn class="medium" @click="saveSlide">تأیید و ثبت</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISlide } from '~/models/reception/ISlide'
import slidingTechnique from '~/enums/slidingTechnique'

export default Vue.extend({
  props: {
    slideProp: {
      required: true,
      type: Object as () => ISlide
    },
    step: {
      required: true,
      type: String,
      default: 'reception'
    }
  },
  watch: {
    slideProp: {
      handler() {
        this.slide = Object.assign({}, this.slideProp)
      },
      deep: true
    }
  },
  data() {
    return {
      slidingTechniques: this.$enum.slidingTechnique.toSelect,
      slide: Object.assign({}, this.slideProp),
      title:
        this.slideProp && this.slideProp.Id
          ? this.$t('slide.edit-title')
          : this.$t('slide.add-title')
    }
  },
  methods: {
    saveSlide() {
      let loader = this.$loader.show(this.$refs.wrapper)

      this.$validator.validateAll().then(valid => {
        if (valid) {
          let service =
            this.step == 'reception'
              ? this.$service.reception.saveSlide(this.slide)
              : !this.slide.Id
              ? this.$service.processingReception.saveSlide(this.slide)
              : this.$service.processingReception.editSlide(this.slide)

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
    },
    getSlideBarcode() {
    }
  }
})
</script>