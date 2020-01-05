<style lang="scss">
#sample-info-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 20px;
  width: 100%;

  .row {
    padding: 0;
    margin: 0;
  }

  text-align: right;

  .clickable-slide {
    cursor: pointer;
  }
  .slide-right {
    width: 60%;
    height: 100%;
    margin-left: 30px;
    display: flex;
    flex-direction: column;

    .slide-delete {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
      text-align: center;
      height: 100%;
    }
    .slide-info-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      width: 100%;

      .slide-info {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .slide-info-detail {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          height: 60px;
        }
      }
    }
    .slide-status-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      min-height: 39px;
      max-height: 39px;
      overflow: hidden;
      width: 100%;
      .slide-caption {
        text-align: center;
        width: 100%;
      }

      .slide-progress-bar-wrapper {
        position: relative;
        z-index: 1;
        width: 100%;
        height: 30px;
        border-radius: 3px;
        border: solid 1px $primary-color;

        .slide-progress-bar {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          background-color: $primary-color;
          z-index: -1;
        }
      }

      .slide-img {
        width: 90%;
        height: 32px;
        background-repeat: repeat;
        background-size: contain;
        cursor: pointer;
      }
    }
  }
  .slide-info-caption {
    color: $form-info-color;
    font-size: 0.975rem;
    height: 30px;
  }
  .slide-info-text {
    color: $form-info-color;
    font-size: 0.75rem;
    height: 20px;
  }
  .slide-left {
    width: 40%;
    display: flex;
    flex-direction: row;
    .slide-description {
      width: 60%;
      display: flex;
      flex-direction: column;
    }
    .slide-upload {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .img-test {
    height: 100px;
    width: 100px;
    border: 1px solid pink;
  }
}
</style>
<template>
  <div
    id="sample-info-wrapper"
    ref="slideInfoWrapper"
    @click="showSlideEditDialog(slide)"
    :class="canEditSlide(slide)?'':'clickable-slide'"
  >
    <div class="slide-right">
      <v-row class="slide-info-wrapper">
        <v-col md="3">
          <div class="slide-delete">
            <v-btn v-if="canDeleteSlide(slide)" text icon @click.stop="deleteSlide()">
            </v-btn>
            <!-- <v-btn
              v-if=" step != 'reception' && canEditSlide(slide)"
              text
              icon
              @click.stop="showSlideEditDialog()"
            >
              <v-icon>la-pencil</v-icon>
            </v-btn>-->
          </div>
        </v-col>
        <v-col md="9">
          <div class="slide-info">
            <div class="slide-info-detail">
              <span class="slide-info-caption">شماره لام</span>
              <span class="slide-info-text">{{slide.SlideNumber}}</span>
            </div>
            <div class="slide-info-detail">
              <span class="slide-info-caption">روش لام‌گیری</span>
              <span class="slide-info-text">{{slide.SlidingTechnique | enum('slidingTechnique')}}</span>
            </div>
            <div class="slide-info-detail">
              <span class="slide-info-caption">وضعیت لام</span>
              <span class="slide-info-text">{{slide.SlideStatus | enum('slideStatus')}}</span>
            </div>
          </div>
        </v-col>
      </v-row>
      <v-row v-if="step && step!='reception'" class="slide-status-wrapper">
        <v-col md="3">
          <div class="slide-caption">
            <v-btn
              v-if="actionSlideIsEnabled()"
              @click.stop="slideAction(slide)"
              text
            >{{getSlideActionTitle(slide)}}</v-btn>
            <div v-else class="slide-caption">{{$t('slide.img')}}</div>
          </div>
        </v-col>
        <v-col md="9">
          <div v-if="slideImageIsVisible(slide)" class="slide-img">
          </div>
          <div v-else-if="progressbarIsVisible(slide)" class="slide-progress-bar-wrapper">
            <div class="slide-progress-bar" :style="`width: ${slideProcessPercentage}%`"></div>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="slide-left">
      <v-row>
        <v-col md="8">
          <div class="slide-description">
            <div md="12" class="slide-info-caption">توضیحات</div>
            <div md="12" class="slide-info-text">{{slide.SlidingDetail}}</div>
          </div>
        </v-col>
        <v-col v-if="canUploadSlideFile()" md="4">
          <div class="slide-upload">
            <file-upload
              :entity="{slideId: slide.Id}"
              :saveService="$service.processingReception.saveFile"
              :getService="$service.processingReception.slideScanAreaGetFile"
              :label="'افزودن تصویر'"
            />
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISlide } from '~/models/reception/ISlide'
import { slideStatusEnum } from '~/enums/slideStatus'
import newSlide from './new-slide.vue'
import slideImg from './slide-img.vue'
import fileUpload from '~/components/common/file-upload.vue'

export default Vue.extend({
  components: { fileUpload },
  props: {
    slideProp: {
      type: Object as () => ISlide,
      required: true
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
        this.slideGetProgressPercentage()
      },
      deep: true
    }
  },
  data() {
    return {
      slide: Object.assign({}, this.slideProp),

      slideProcessPercentage: 0,
      title:
        this.slideProp && this.slideProp.Id
          ? this.$t('slide.edit-title')
          : this.$t('slide.add-title')
    }
  },
  mounted() {
    this.slideGetProgressPercentage()
  },
  methods: {
    async deleteSlide() {
      this.$dialog
        .confirm({
          title: 'حذف لام',
          message: 'آیا از حذف لام اطمینان دارید؟',
          ok_txt: this.$t('confirm.ok_txt').toString(),
          cancel_txt: this.$t('confirm.cancel_txt').toString(),
          dialog_wrapper_custom_class:
            'dialog-wrapper-confirm-cancel-technician'
        })
        .then(data => {
          let loader = this.$loader.show(this.$refs.slideInfoWrapper)

          let service =
            this.step == 'reception'
              ? this.$service.reception.deleteSlide(this.slide)
              : this.$service.processingReception.deleteSlide(this.slide)

          service
            .then(result => {
              loader.hide()
              this.$emit('slideUpdated')
            })
            .catch(error => {
              this.$toast.error().show({
                message: error.message || this.$t('msg.UI.fail'),
                customClass: 'toast-customClass error',
                top: true
              })
              loader.hide()
            })
        })
    },
    showSlideEditDialog() {
      if (!this.canEditSlide()) {
        return
      }
      this.$dialog
        .show({
          component: newSlide,
          props: {
            slideProp: this.slide,
            step: this.step
          }
        })
        .then(data => {
          if (data == 'success') {
            this.$emit('slideUpdated')
          }
        })
    },
    canDeleteSlide() {
      if (this.slide.SlideStatus == slideStatusEnum.Scanning) {
        return false
      }
      return true
    },
    canEditSlide() {
      if (
        this.step != 'reception' &&
        (this.slide.SlideStatus == slideStatusEnum.Added ||
          this.slide.SlideStatus == slideStatusEnum.Processing)
      ) {
        return true
      }
      return false
    },
    canUploadSlideFile() {
      if (
        this.step != 'reception' &&
        this.slide.SlideStatus == slideStatusEnum.Scanning
      ) {
        return true
      }
      return false
    },
    slideImageIsVisible() {
      if (
        this.slide.SlideStatus &&
        this.slide.SlideStatus >= slideStatusEnum.Scanned
      ) {
        return true
      } else {
        return false
      }
    },
    actionSlideIsEnabled() {
      if (
        this.slide.SlideStatus == slideStatusEnum.Done ||
        this.slide.SlideStatus == slideStatusEnum.Fail
      ) {
        return false
      }
      return true
    },
    getSlideActionTitle() {
      let title = ''
      switch (this.slide.SlideStatus) {
        case slideStatusEnum.Added:
          title = this.$t('slide.start-processing').toString()
          break

        case slideStatusEnum.Processing:
          title = this.$t('slide.finish-processing').toString()
          break

        case slideStatusEnum.Processed:
          title = this.$t('slide.start-scanning').toString()
          break

        case slideStatusEnum.Scanning:
          title = this.$t('slide.finish-scanning').toString()
          break

        case slideStatusEnum.Scanned:
          title = this.$t('slide.confirm-slide').toString()
          break
      }

      return title
    },
    async slideAction() {
      let loader = this.$loader.show(this.$refs.slideInfoWrapper)
      try {
        switch (this.slide.SlideStatus) {
          case slideStatusEnum.Added:
            await this.$service.processingReception.startProccessingSlide(
              this.slide
            )
            break

          case slideStatusEnum.Processing:
            await this.$service.processingReception.finishProcessingSlide(
              this.slide
            )
            break

          case slideStatusEnum.Processed:
            await this.$service.processingReception.startScanningSlide(
              this.slide
            )
            break

          case slideStatusEnum.Scanning:
            await this.$service.processingReception.finishScanningSlide(
              this.slide
            )
            break

          case slideStatusEnum.Scanned:
            await this.$service.processingReception.confirmSlide(this.slide)
            break
        }
        this.$emit('slideUpdated')
        // this.updateSlideInfo()
      } catch (error) {
        this.$toast.error().show({
          message: error.message || this.$t('msg.UI.fail'),
          customClass: 'toast-customClass error',
          top: true
        })
      }
      loader.hide()
    },
    progressbarIsVisible() {
      if (
        this.slide.SlideStatus == slideStatusEnum.Added ||
        this.slide.SlideStatus == slideStatusEnum.Scanned ||
        this.slide.SlideStatus == slideStatusEnum.Done
      ) {
        return false
      }
      return true
    },
    slideGetProgressPercentage() {
      
      if (
        this.slide &&
        this.slide.SampleId &&
        this.slide.Id &&
        this.slide.SlideStatus &&
        this.step != 'reception' &&
        this.progressbarIsVisible()
      ) {
        let loader = this.$loader.show(this.$refs.slideInfoWrapper)
        this.$service.processingReception
          .slideGetProgressPercentage(this.slide.Id)
          .then(result => (this.slideProcessPercentage = result))
        loader.hide()
      }
    },
    updateSlideInfo() {
      if (this.slide && this.slide.SampleId && this.slide.Id) {
        let loader = this.$loader.show(this.$refs.slideInfoWrapper)

        this.$service.sample
          .slideGet(this.slide.Id)
          .then(result => {
            this.slide = result
            this.slideGetProgressPercentage()
          })
          .catch(error => {
            this.$toast.error().show({
              message: this.$t('msg.UI.fail-get-info').toString(),
              customClass: 'toast-customClass error',
              top: true
            })
          })
        loader.hide()
      }
    },
    showDialogSlideImage() {
      this.$dialog.show({
        component: slideImg,
        props: {
          slideId: this.slide.Id
        }
      })
    }
  }
})
</script>