<style lang="scss">

.sample-steps-view-wrapper {
  background: hsl(0, 0%, 100%) 0% 0% no-repeat padding-box;
  display: flex;
  flex-direction: column;
  width: 1237px;
  height: 751px;
  .sample-steps-view-head {
    float: right;
    .v-icon {
      color: $form-clear-color;
      padding: 10px;
    }
  }
  .sample-steps-view-items {
    display: flex;
    padding: 15px 65px;
    @include respond-to(sm) {
      flex-direction: column;
    }
    @include respond-to(md) {
      flex-direction: row;
    }
    .sample-steps-view-items-gap {
      flex: 0 0 40px;
    }
    .sample-steps-view-item {
      width: 339px;
    }
  }
}
</style>
<template>
  <div ref="wrapper" class="sample-steps-view-wrapper">
    <div class="sample-steps-view-head">
      <v-btn icon>
        <v-icon @click="close">la-close</v-icon>
      </v-btn>
    </div>
    <div class="sample-steps-view-items">
      <div class="sample-steps-view-item">
        <sampleBaseInfo :sample="samplePapSmear" />
      </div>
      <div class="sample-steps-view-items-gap"></div>
      <div class="sample-steps-view-item">
        <statementsPatient :statement="samplePapSmear.PatientStatements" />
      </div>
      <div class="sample-steps-view-items-gap"></div>
      <div class="sample-steps-view-item">
        <statementsTreatingPhysician :statement="samplePapSmear.TreatingPhysicianStatements" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import statementsPatientPapSmear from '~/components/reception/sample/statements-patient-papSmear-view.vue'
import statementsTreatingPhysicianPapSmear from '~/components/reception/sample/statements-treatingPhysician-papSmear-view.vue'
import sampleBaseInfo from '~/components/reception/sample/sample-base-info-view.vue'
import { ISamplePapSmear } from '~/models/reception/ISamplePapSmear'
import { sampleTypeEnum } from '~/enums/sampleType'

export default Vue.extend({
  props: {
    receptionId: {
      type: Number,
      required: true
    },
    sampleId: {
      type: Number,
      default: 0
    }
  },
  components: {
    statementsPatient: statementsPatientPapSmear,
    statementsTreatingPhysician: statementsTreatingPhysicianPapSmear,
    sampleBaseInfo
  },
  mounted() {
    if (this.sampleId) {
      this.getSampleInfo()
    }
  },
  data() {
    return {
      step: 1,
      samplePapSmear: <ISamplePapSmear>{ ReceptionId: this.receptionId }
    }
  },
  methods: {
    async getSampleInfo() {
      let loader = this.$loader.show(this.$refs.wrapper)

      try {
        let sampleBase = await this.$service.sample.getSample(this.sampleId)
        if (sampleBase) {
          if (sampleBase.Type == sampleTypeEnum.PapSmear) {
            this.samplePapSmear = await this.$service.sample.getSamplePapSmear(
              this.receptionId,
              this.sampleId
            )
          } else if (sampleBase.Type == sampleTypeEnum.kidney) {
            this.samplePapSmear = await this.$service.sample.getSampleKidney(
              this.receptionId || 0,
              this.sampleId
            )
          }
        }
        loader.hide()
      } catch (error) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          top: true,
          message: error.message || this.$t('msg.UI.fail')
        })
        loader.hide()
        this.$emit('hide', 'fail')
      }
    },
    close() {
      this.$emit('hide')
    }
  }
})
</script>