
<template>
  <div class="sample-view">
    <div class="sample-view-head">
      <span class="text">{{$t('sample.physicianDoctor-statements')}}</span>
    </div>
    <v-card outlined class="sample-view-info-wrapper">
      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.SamplingReason')}}</span>
        <!-- <span class="text">{{statement.SamplingReason | enum('samplingReason')}}</span> -->
      </div>
      <div class="long-text">{{samplingReasons}}</div>
      <v-divider />

      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.ExaminationFindings')}}</span>
        <!-- <span class="text">{{statement.ExaminationFindings }}</span> -->
      </div>
      <div class="long-text">{{examinationFindings}}</div>
      <v-divider />

      <div class="sample-view-info">
        <span class="info-caption">{{$t('sample.statement.ExaminationFindingDescription')}}</span>
        <span class="text">{{statement.OtherExaminationFindings }}</span>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ITreatingPhysicianStatementsPapSmear } from '~/models/reception/IStatementPapSmear.ts'
import samplingReason from '~/enums/samplingReason'
import sampleTreatingPhysicianExaminationFindings from '~/enums/sampleTreatingPhysicianExaminationFindings'
export default Vue.extend({
  props: {
    statement: {
      type: Object as () => ITreatingPhysicianStatementsPapSmear,
      default: function() {
        return <ITreatingPhysicianStatementsPapSmear>{}
      }
    }
  },
  data() {
    return {
      samplingReasons: '',
      examinationFindings: ''
    }
  },
  watch: {
    statement: {
      handler(val, oldVal) {
        this.samplingReasons = ''
        if (val.SamplingReasonList) {
          this.samplingReasons = val.SamplingReasonList.map(x =>samplingReason[x]).join('، ')
        }

        this.examinationFindings = ''
        if (val.ExaminationFindingList) {
          this.examinationFindings = val.ExaminationFindingList.map(x => sampleTreatingPhysicianExaminationFindings[x]).join('، ')
        }
      },
      deep: true
    }
  }
})
</script>