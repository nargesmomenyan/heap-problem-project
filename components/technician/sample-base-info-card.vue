<style lang="scss">
.wrapper-sample-base {
  padding: 0;
  margin: 0;
}
</style>
<template>
  <div class="wrapper-sample-base">
    <div v-if="shortInfo" class="wrapper-sample-base">
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.sampleTypeTitle')}}</span>
        <span class="text">{{sample.Type | enum('sampleType')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.status')}}</span>
        <span class="text">{{sample.SampleStatus | enum('sampleStatus')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.SamplingMethod')}}</span>
        <span class="text">{{sample.SamplingMethod |enum('samplingMethod')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.SamplingDevice')}}</span>
        <span class="text">{{sample.SamplingDevice |enum('samplingDevice')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row last-row">
        <span class="info-caption">{{$t('sample.ProcessingMethod')}}</span>
        <span class="text">{{sample.ProcessingMethod |enum('sampleProcessingMethod')}}</span>
      </div>
    </div>

    <div v-else id="wrapper-sample-base">
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.sampleTypeTitle')}}</span>
        <span class="text">{{sample.Type | enum('sampleType')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.status')}}</span>
        <span class="text">{{sample.SampleStatus | enum('sampleStatus')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.SamplingMethod')}}</span>
        <span class="text">{{sample.SamplingMethod |enum('samplingMethod')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.SamplingDevice')}}</span>
        <span class="text">{{sample.SamplingDevice |enum('samplingDevice')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.ProcessingMethod')}}</span>
        <span class="text">{{sample.ProcessingMethod |enum('sampleProcessingMethod')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.SamplingArea')}}</span>
        <span class="text">{{sample.SamplingArea |enum('samplingArea')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.SamplingAreaDetail')}}</span>
        <span class="text">{{sample.SamplingAreaDetail}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.samplingDate')}}</span>
        <span class="text">{{sample.SamplingDate | persianDate|persianDigit }}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.fixator')}}</span>
        <span class="text">{{sample.Fixator |enum('sampleFixator')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.receptionType')}}</span>
        <span class="text">{{sample.receptionType |enum('receptionType')}}</span>
      </div>
      <v-divider />
      <div class="action-info-row">
        <span class="info-caption">{{$t('sample.deliveryDate')}}</span>
        <span class="text">{{sample.DeliveryDate | persianDate | persianDigit }}</span>
      </div>
      <v-divider />
      <div class="action-info-row last-row">
        <span class="info-caption">{{$t('sample.ContainerExists')}}</span>
        <span class="text">{{sample.ContainerExists ?'بله':'خیر' }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISample } from '~/models/reception/ISample'
export default Vue.extend({
  props: {
    shortInfo: {
      Type: Boolean,
      default: false
    },
    sample: {
      Type: Object as () => ISample,
      required: true
    }
  }
})
</script>