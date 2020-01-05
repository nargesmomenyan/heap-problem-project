
<style lang="scss">
</style>
<template>
  <div class="sample-view">
    <div class="sample-view-head">
      <span class="text">{{$t('sample.patient-statements')}}</span>
    </div>
    <v-card outlined class="sample-view-info-wrapper">
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.FirstDayOfLastMenstruation')}}</span>
        <span class="text">{{statement.FirstDayOfLastMenstruation |persianDate |persianDigit}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.Pregnant')}}</span>
        <span class="text">{{statement.Pregnant?'بله':'خیر' }}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.ContraceptionMethods')}}</span>
        <!-- <span class="text">{{conteraceptionMethods}}</span> -->
      </div>
      <div class="long-text">{{conteraceptionMethods}}</div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.ContraceptionMethodsDescription')}}</span>
        <span class="text">{{statement.PreventionMethodDescription}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.HormonalDrug')}}</span>
        <span class="text">{{statement.HormonTheraphyDetail}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.NumberOfPregnancy')}}</span>
        <span class="text">{{statement.NumberOfPregnancy}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.NumberOfDeliveries')}}</span>
        <span class="text">{{statement.NumberOfDeliveries}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.NumberOfAbortions')}}</span>
        <span class="text">{{statement.NumberOfAbortions}}</span>
      </div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.ClinicalFindings')}}</span>
        <!-- <span class="text">{{statement.ClinicalFindings}}</span> -->
      </div>
      <div class="long-text">{{clinicalFindings}}</div>
      <v-divider />
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.PatientComplaints')}}</span>
        <!-- <span class="text">{{statement.PatientComplaints}}</span> -->
      </div>
      <div class="long-text">{{patientComplaints}}</div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IPatientStatementsPapSmear } from '~/models/reception/IStatementPapSmear.ts'
import contraceptionMethod from '~/enums/contraceptionMethod'
import samplePatientClinicalFindings from '~/enums/samplePatientClinicalFindings'
import samplePatientComplaints from '~/enums/samplePatientComplaints'

export default Vue.extend({
  props: {
    statement: {
      type: Object as () => IPatientStatementsPapSmear,
      default: function() {
        return <IPatientStatementsPapSmear>{}
      }
    }
  },
  data() {
    return {
      conteraceptionMethods: '',
      clinicalFindings: '',
      patientComplaints: ''
    }
  },
  watch: {
    statement: {
      handler(val, oldVal) {
        this.conteraceptionMethods = ''
        if (val.ContraceptionMethodList) {
          this.conteraceptionMethods = val.ContraceptionMethodList.map(x => contraceptionMethod[x]).join('، ')
        }

        this.clinicalFindings = ''
        if (val.ClinicalFindingList) {
          this.clinicalFindings = val.ClinicalFindingList.map(x => samplePatientClinicalFindings[x]).join('، ')
        }

        this.patientComplaints = ''
        if (val.PatientComplaintList) {
          this.patientComplaints = val.PatientComplaintList.map(x => samplePatientComplaints[x]).join('، ')
        }
      },
      deep: true
    }
  }
})
</script>