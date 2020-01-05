<style lang="scss">
#slide-img-tools-wrapper {
  width: 1200px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .slide-img-wrapper {
    display: flex;
    flex-direction: row;
    width: 100%;
    /* Firefox */
    height: -moz-calc(100% - 150px);
    /* WebKit */
    height: -webkit-calc(100% - 150px);
    /* Opera */
    height: -o-calc(100% - 150px);
    /* Standard */
    height: calc(100% - 150px);

    .slide-img-zoom {
      width: calc(100%-70px);
      width: -moz-calc(100%-70px);
      width: -webkit-calc(100%-70px);
      width: -o-calc(100%-70px);
      width: 900px;
      background-repeat: repeat;
      background-size: cover;
      overflow: hidden;
      // img {
      //   flex-shrink: 0;
      //   min-width: 100%;
      //   min-height: 100%;
      // }
    }
    .slide-tools-wrapper {
      width: 70px;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: center;
    }
    .image-zoom-in-out {
      width: 32px;
      height: 64px;
      border-radius: 4px;
      border: solid 1px $primary-color;
      background-color: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2px;

      .image-zoom {
        width: 24px;
        height: 24px;
        border: solid 1px $primary-color;
        background-color: #ffffff;
        color: $primary-color !important;
        margin: 0;
        .v-icon {
          font-size: 24px !important;
          font-weight: bold !important;
        }
      }
      .theme--light.v-divider {
        border: 1px solid $primary-color !important;
        width: 80%;
        margin: 2px 4px;
      }
    }
  }

  .slide-image-bottom {
    height: 150px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    .slide-img-layers-wrapper {
      width: 60%;
      height: 100%;

      .slide-image-head {
        align-items: center;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;

        .slide-image-head-caption {
          height: 100%;
          padding-left: 20px;
        }
        .v-input--radio-group__input {
          flex-direction: row;

          .v-label {
            padding-right: 0;
            padding-left: 12px;
          }
        }
        .v-input--selection-controls {
          margin: 0 !important;
          padding: 0 !important;
        }
      }
      .slide-image-layers {
        padding-bottom: 5px;
        display: flex;
        flex-direction: row-reverse;

        .image-layer {
          position: relative;

          border-radius: 4px;

          box-shadow: 2px 0 0 rgba(95, 94, 94, 0.3);

          .layer-number {
            position: absolute;
            width: 24px;
            height: 24px;
            background-color: #015374;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
          }
        }
        .image-first-layer {
          width: 600px;
          height: 96px;
          box-shadow: 2px -2px 2px 0 rgba(95, 94, 94, 0.3);
        }
        .image-other-layers {
          height: 96px;
          width: 35px;
        }
      }
    }
    .slide-arrow-keys {
      display: flex;
      justify-content: flex-end;
      flex-direction: column;
      padding: 10px;
      div {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
      }
      .arrow-key {
        width: 40px;
        height: 32px;
        border-radius: 4px !important;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
        border: solid 1px $primary-color;
        color: $primary-color !important;
        background-color: #ffffff;
      }
    }
  }
}
</style>
<template>
  <div id="slide-img-tools-wrapper">
    <div class="slide-img-wrapper">
      <div class="slide-tools-wrapper">
        <v-btn icon text>
          <v-icon>la-compress-arrows-alt</v-icon>
        </v-btn>
        <div class="image-zoom-in-out">
          <v-btn class="image-zoom" icon>
            <v-icon>la-plus</v-icon>
          </v-btn>
          <v-divider class="zoom-divider"></v-divider>
          <v-btn class="image-zoom" icon>
            <v-icon>la-minus</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="slide-img-zoom">
        sdfsdf
        <slideImageMap />
        <!-- <img :src="imageSrc || '~assets/img/reception/slide-img.png'" /> -->
      </div>
    </div>
    <div class="slide-image-bottom">
      <div class="slide-arrow-keys">
        <div>
          <v-btn class="arrow-key" icon>
            <v-icon>arrow_drop_up</v-icon>
          </v-btn>
        </div>
        <div>
          <v-btn class="arrow-key" icon>
            <v-icon>arrow_right</v-icon>
          </v-btn>
          <v-btn class="arrow-key" icon>
            <v-icon>arrow_drop_down</v-icon>
          </v-btn>
          <v-btn class="arrow-key" icon>
            <v-icon>arrow_left</v-icon>
          </v-btn>
        </div>
      </div>
      <div class="slide-img-layers-wrapper">
        <div class="slide-image-head">
          <span class="slide-image-head-caption">{{$t('slide.image.showLayer')}}:</span>
          <v-radio-group hide-details>
            <v-radio v-for="(i, index) in 3" :key="index" :value="i"></v-radio>
            <!-- :label="$t('slide.image.layer')+(i|persianDigit)" -->
          </v-radio-group>
        </div>
        <div class="slide-image-layers">
          <div
            v-for="i in 2"
            :key="i"
            class="image-layer"
            :class="i==1? 'image-first-layer':'image-other-layers'"
          >
            <div class="layer-number">{{i|persianDigit}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import slideImageMap from '~/components/reception/slide/slide-img-map.vue'
export default Vue.extend({
  components: { slideImageMap },
  props: {
    slideId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      imageSrc: ''
    }
  },
  mounted() {
    // this.slideGetScanArea()
  },
  methods: {
    async slideGetScanArea() {
      this.imageSrc = await this.$service.processingReception.slideScanAreaGetFile()
    }
  }
})
</script>