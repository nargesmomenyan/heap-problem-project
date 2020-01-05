<style lang="scss">
#diagnosis-sample-info-wrapper {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  padding: 20px;
  width: 100%;
  cursor: pointer;
  .row {
    padding: 0;
    margin: 0;
  }

  text-align: right;

  .slide-right {
    width: 60%;
    height: 100%;
    margin-left: 30px;
    display: flex;
    flex-direction: column;

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

      .slide-img {
        width: 90%;
        height: 32px;
        background-repeat: repeat;
        background-size: contain;
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
  }
}
</style>
<template>
  <div id="diagnosis-sample-info-wrapper" ref="slideInfoWrapper" @click="diagnosis(slide)">
    <div class="slide-right">
      <v-row class="slide-info-wrapper">
        <v-col md="12">
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
      <v-row class="slide-status-wrapper">
        <v-col md="3">
          <div class="slide-caption">
            <div class="slide-caption">{{$t('slide.img')}}</div>
          </div>
        </v-col>
        <v-col md="9">
          <div class="slide-img">
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="slide-left">
      <v-row>
        <v-col md="12">
          <div class="slide-description">
            <div md="12" class="slide-info-caption">توضیحات</div>
            <div md="12" class="slide-info-text">{{slide.SlidingDetail}}</div>
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

export default Vue.extend({
  components: {},
  props: {
    slideProp: {
      type: Object as () => ISlide,
      required: true
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
      slide: Object.assign({}, this.slideProp)
    }
  },
  mounted() {},
  methods: {
    diagnosis() {
      this.$router.push(
        `/diagnosticianDoctors/receptions/${this.slide.ReceptionId}/${this.slide.SampleId}/diagnosis?slideId=${this.slide.Id}`
      )
    }
  }
})
</script>