
<template>
  <div class="stepper-wrapper sample-steps-wrapper">
    <div class="sample-steps-head">
      <v-btn icon>
        <v-icon @click="close">la-close</v-icon>
      </v-btn>
    </div>
    <div class="sample-steps">
      <v-stepper v-model="currentStep">
        <v-stepper-header>
          <v-stepper-step editable step="1" :complete="step>1">
            <div :class="'sample-step-img '+ getCssClass(1)">
            </div>
            <div class="sample-step-text">{{$t('sample.sample-info')}}</div>
          </v-stepper-step>
          <v-divider :class="step>1?'active':''"></v-divider>
          <v-stepper-step :editable="step>=2" step="2">
            <div :class="'sample-step-img '+ getCssClass(2)">
            </div>
            <div class="sample-step-text">{{$t('sample.patient-statements-short')}}</div>
          </v-stepper-step>
          <v-divider :class="step>2?'active':''"></v-divider>
          <v-stepper-step :editable="step>=3" step="3">
            <div :class="'sample-step-img ' +getCssClass(3)">
            </div>
            <div class="sample-step-text">{{$t('sample.physicianDoctor-statements-short')}}</div>
          </v-stepper-step>
        </v-stepper-header>
        <v-stepper-items>
          <v-stepper-content step="1">
            <div class="sample-steps-content">
              <sampleBaseInfo :sampleProp="samplePapSmear" @sampleInfo="setSampleBaseInfo" />
            </div>
          </v-stepper-content>
          <v-stepper-content step="2">
            <div class="sample-steps-content">
              <statementsPatient
                :statementProp="samplePapSmear.PatientStatements"
                @previous="active_tab=0"
                @statementInfo="setPatientStatements"
              />
            </div>
          </v-stepper-content>
          <v-stepper-content step="3">
            <div class="sample-steps-content">
              <statementsTreatingPhysician
                :statementProp="samplePapSmear.TreatingPhysicianStatements"
                @previous="active_tab=1"
                @statementInfo="setTreatingPhysicianStatements"
                :finalStep="true"
              />
            </div>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import statementsPatientPapSmear from '~/components/reception/sample/statements-patient-papSmear.vue'
import statementsTreatingPhysicianPapSmear from '~/components/reception/sample/statements-treatingPhysician-papSmear.vue'
import sampleBaseInfo from '~/components/reception/sample/sample-base-info.vue'
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
    },
    sampleType: {
      type: Number,
      default: sampleTypeEnum.PapSmear
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
      currentStep: 1,
      samplePapSmear: <ISamplePapSmear>{ ReceptionId: this.receptionId }
    }
  },
  methods: {
    setSampleBaseInfo($event) {
      this.samplePapSmear = Object.assign(this.samplePapSmear, $event)
      this.currentStep = this.step = 2
    },
    setPatientStatements($event) {
      this.samplePapSmear.PatientStatements = $event
      this.currentStep = this.step = 3
    },
    async setTreatingPhysicianStatements($event) {
      this.samplePapSmear.TreatingPhysicianStatements = $event

      try {
        let result = await this.$service.reception.saveSamplePapSmear(
          this.samplePapSmear
        )

        if (result) {
          this.samplePapSmear.Id = result.Id
          this.$emit('hide', 'success')
        }
      } catch (error) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          top: true,
          message: error.message || this.$t('msg.UI.fail')
        })
      }
    },
    close() {
      this.$dialog
        .confirm({
          title: ' ',
          message: this.$t('msg.UI.warn-cancel').toString(),
          ok_txt: this.$t('actions.confirm-cancel').toString(),
          cancel_txt: this.$t('actions.cancel').toString(),
          dialog_wrapper_custom_class: 'dialog_wrapper_confirm-cancel-secretary'
        })
        .then(() => {
          this.$emit('hide', 'cancel')
        })
    },
    getSampleInfo() {
      let service =
        this.sampleType == sampleTypeEnum.PapSmear
          ? this.$service.sample.getSamplePapSmear(
              this.receptionId,
              this.sampleId
            )
          : this.$service.sample.getSampleKidney(
              this.receptionId,
              this.sampleId
            )

      service
        .then(data => {
          this.samplePapSmear = data
        })
        .catch(error => {
          this.$toast.error().show({
            customClass: 'toast-customClass error',
            top: true,
            message: error.message || this.$t('msg.UI.fail')
          })
          this.$emit('hide', 'fail')
        })
    },
    getCssClass(headerStep) {
      let cssClass = ''
      if (this.step < headerStep) {
        cssClass = 'inactive'
      } else if (this.step == headerStep) {
        cssClass = 'active'
      } else {
        cssClass = 'complete'
      }
      return cssClass
    }
  }
})
</script>