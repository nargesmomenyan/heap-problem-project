<style lang="scss" >
</style>

<template>
  <div class="sample-view">
    <div class="sample-view-head">
      <span class="text">اطلاعات آزمایش</span>
    </div>
    <v-card outlined class="sample-view-info-wrapper">
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.sampleTypeTitle')}}</span>
        <span class="text">{{sample.Type | enum('sampleType')}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.SamplingMethod')}}</span>
        <span class="text">{{sample.SamplingMethod |enum('samplingMethod')}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.SamplingDevice')}}</span>
        <span class="text">{{sample.SamplingDevice |enum('samplingDevice')}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.ProcessingMethod')}}</span>
        <span class="text">{{sample.ProcessingMethod |enum('sampleProcessingMethod')}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.SamplingArea')}}</span>
        <span class="text">{{sample.SamplingArea |enum('samplingArea')}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.SamplingAreaDetail')}}</span>
        <span class="text">{{sample.SamplingAreaDetail}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.samplingDate')}}</span>
        <span class="text">{{sample.SamplingDate | persianDate|persianDigit  }}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.fixator')}}</span>
        <span class="text">{{sample.Fixator |enum('sampleFixator')}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.receptionType')}}</span>
        <span class="text">{{sample.receptionType |enum('receptionType')}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.deliveryDate')}}</span>
        <span class="text">{{sample.DeliveryDate | persianDate | persianDigit }}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.ContainerExists')}}</span>
        <span class="text">{{sample.ContainerExists ?'بله':'خیر' }}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.SamplingDetail')}}</span>
        <span class="text">{{sample.SamplingDetail }}</span>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISample } from '~/models/reception/ISample'

export default Vue.extend({
  props: {
    sample: {}
  },
  data() {
    return {}
  },
  watch: {
    sampleProp: {
      handler(val, oldVal) {},
      deep: true
    }
  },
  methods: {},
  mounted() {}
})
</script>