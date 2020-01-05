
<template>
  <div class="sample-base">
    <div class="reception-form">
      <v-row>
        <v-col md12 xs12>
          <v-select
          :attach="true"
            :items="this.$enum.sampleType.toSelect"
            outlined
            :label="$t('sample.sampleTypeTitle')"
            v-model="sample.Type"
            v-validate="'required'"
            name="SampleType"
            :data-vv-as="$t('sample.sampleTypeTitle')"
            :error-messages="errors.collect('baseInfo.SampleType')"
            data-vv-scope="baseInfo"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col md6 xs12>
          <v-select
          :attach="true"
            :items="this.$enum.samplingMethod.toSelect"
            outlined
            :label="$t('sample.SamplingMethod')"
            v-model="sample.SamplingMethod"
            v-validate="'required'"
            name="SamplingMethod"
            :data-vv-as="$t('sample.SamplingMethod')"
            :error-messages="errors.collect('baseInfo.SamplingMethod')"
            data-vv-scope="baseInfo"
          ></v-select>
        </v-col>
        <v-col md6 xs12>
          <v-select
          :attach="true"
            :items="this.$enum.samplingDevice.toSelect"
            outlined
            :label="$t('sample.SamplingDevice')"
            v-model="sample.SamplingDevice"
            v-validate="'required'"
            name="SamplingDevice"
            :data-vv-as="$t('sample.SamplingDevice')"
            :error-messages="errors.collect('baseInfo.SamplingDevice')"
            data-vv-scope="baseInfo"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col md6 xs12>
          <v-select
          :attach="true"
            outlined
            :label="$t('sample.ProcessingMethod')"
            v-model="sample.ProcessingMethod"
            :items="this.$enum.sampleProcessingMethod.toSelect"
            v-validate="'required'"
            name="ProcessingMethod"
            :error-messages="errors.collect('baseInfo.ProcessingMethod')"
            :data-vv-as="$t('sample.ProcessingMethod')"
            data-vv-scope="baseInfo"
          ></v-select>
        </v-col>
        <v-col md6 xs12></v-col>
      </v-row>
      <v-row>
        <v-col md6 xs12>
          <v-select
          :attach="true"
            outlined
            :label="$t('sample.SamplingArea')"
            v-model="sample.SamplingArea"
            :items="this.$enum.samplingArea.toSelect"
            v-validate="'required'"
            name="samplingArea"
            :error-messages="errors.collect('baseInfo.samplingArea')"
            :data-vv-as="$t('sample.SamplingArea')"
            data-vv-scope="baseInfo"
          ></v-select>
        </v-col>
        <v-col md6 xs12>
          <v-textarea
            outlined
            :label="$t('sample.SamplingAreaDetail')"
            rows="1"
            v-model="sample.SamplingAreaDetail"
            hide-details
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col md6 xs12>
          <vr-date-picker
            :label="$t('sample.samplingDate')"
            outlined
            v-model="sample.SamplingDate"
            v-validate="'required'"
            name="samplingDate"
            :error-messages="errors.collect('baseInfo.samplingDate')"
            :data-vv-as="$t('sample.samplingDate')"
            data-vv-scope="baseInfo"
          ></vr-date-picker>
        </v-col>
        <v-col md6 xs12>
          <v-select
          :attach="true"
            outlined
            :label="$t('sample.fixator')"
            v-model="sample.Fixator"
            :items="this.$enum.sampleFixator.toSelect"
            v-validate="'required'"
            name="fixator"
            :error-messages="errors.collect('baseInfo.fixator')"
            :data-vv-as="$t('sample.fixator')"
            data-vv-scope="baseInfo"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col md6 xs12>
          <v-select
          :attach="true"
            outlined
            :label="$t('sample.receptionType')"
            v-model="sample.ReceptionType"
            :items="this.$enum.receptionType.toSelect"
            v-validate="'required'"
            name="receptionType"
            :error-messages="errors.collect('baseInfo.receptionType')"
            :data-vv-as="$t('sample.receptionType')"
            data-vv-scope="baseInfo"
          ></v-select>
        </v-col>
        <v-col md6 xs12>
          <vr-date-picker
            :label="$t('sample.deliveryDate')"
            autocomplete="off"
            outlined
            v-model="sample.DeliveryDate "
            v-validate="'required'"
            name="DeliveryDate "
            :error-messages="errors.collect('baseInfo.DeliveryDate ')"
            :data-vv-as="$t('sample.deliveryDate')"
            data-vv-scope="baseInfo"
          ></vr-date-picker>
        </v-col>
      </v-row>
      <v-row>
        <v-col md12 xs12>
          <v-textarea
            outlined
            :label="$t('sample.SamplingDetail')"
            rows="1"
            v-model="sample.SamplingDetail"
            hide-details
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row>
        <v-col md6 xs12>
          <v-checkbox
            :label="$t('sample.ContainerExists')"
            v-model="sample.ContainerExists"
            hide-details
          ></v-checkbox>
        </v-col>
      </v-row>
    </div>

    <div class="action">
      <v-btn class="medium" @click="submit">{{$t('actions.next')}}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISample } from '~/models/reception/ISample'
import { sampleTypeEnum } from '~/enums/sampleType'
import receptionType from '~/enums/receptionType'
import { receptionTypeEnum } from '~/enums/receptionType'

export default Vue.extend({
  props: {
    sampleProp: {
      default: <ISample>{
        Type: sampleTypeEnum.PapSmear,
        ReceptionType: receptionTypeEnum.normal
      }
    }
  },
  data() {
    return {
      sample: this.sampleProp,      
    }
  },
  watch: {
    sampleProp: {
      handler(val, oldVal) {
        this.sample = val
      },
      deep: true
    }
  },
  methods: {
    submit() {
      this.$validator.validateAll('baseInfo').then(valid => {
        if (valid) {
          this.$emit('sampleInfo', this.sample)
        }
      })
    }
  },
  mounted() {}
})
</script>