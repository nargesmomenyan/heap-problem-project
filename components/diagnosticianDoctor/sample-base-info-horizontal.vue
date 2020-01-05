<style lang="scss">
#sample-base-info-horizontal {
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;

  .action-info-col {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    color: $form-title-color;
    padding-left: 20px;
    .info-col-caption {
      font-size: 10px;
      padding-bottom: 10px;
    }
    .info-col-info-col-text {
      font-size: 12px;
    }
  }
}
</style>
<template>
  <div id="sample-base-info-horizontal">
    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.sampleTypeTitle')}}</span>
      <span class="info-col-info-col-text">{{sample.Type | enum('sampleType')}}</span>
    </div>

    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.status')}}</span>
      <span class="info-col-info-col-text">{{sample.SampleStatus | enum('sampleStatus')}}</span>
    </div>
    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.SamplingMethod')}}</span>
      <span class="info-col-info-col-text">{{sample.SamplingMethod |enum('samplingMethod')}}</span>
    </div>
    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.SamplingDevice')}}</span>
      <span class="info-col-info-col-text">{{sample.SamplingDevice |enum('samplingDevice')}}</span>
    </div>
    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.ProcessingMethod')}}</span>
      <span
        class="info-col-info-col-text"
      >{{sample.ProcessingMethod |enum('sampleProcessingMethod')}}</span>
    </div>

    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.SamplingArea')}}</span>
      <span class="info-col-text">{{sample.SamplingArea |enum('samplingArea')}}</span>
    </div>
    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.SamplingAreaDetail')}}</span>
      <span class="info-col-text">{{sample.SamplingAreaDetail}}</span>
    </div>
    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.samplingDate')}}</span>
      <span class="info-col-text">{{sample.SamplingDate | persianDate|persianDigit }}</span>
    </div>
    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.fixator')}}</span>
      <span class="info-col-text">{{sample.Fixator |enum('sampleFixator')}}</span>
    </div>
    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.receptionType')}}</span>
      <span class="info-col-text">{{sample.receptionType |enum('receptionType')}}</span>
    </div>
    <div class="action-info-col">
      <span class="info-col-caption">{{$t('sample.deliveryDate')}}</span>
      <span class="info-col-text">{{sample.DeliveryDate | persianDate | persianDigit }}</span>
    </div>
    <div class="action">
      <v-btn text @click="showDialogSampleInfo()">{{$t('actions.moreInfo')}}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISample } from '~/models/reception/ISample'
import samplePapSmear from '~/components/reception/sample/sample-papSmear-view.vue'
export default Vue.extend({
  props: {
    sample: {
      Type: Object as () => ISample,
      default: <ISample>{}
      // required: true
    }
  },
  data() {
    return {
    }
  },
  methods: {
    showDialogSampleInfo() {
      
      this.$dialog.show({
        dialog_wrapper_custom_class: 'dialog-wrapper-custom',
        component: samplePapSmear,
        props: {
          receptionId: (<any>this).sample.ReceptionId,
          sampleId: (<any>this).sample.Id
        }
      })
    }
  }
})
</script>