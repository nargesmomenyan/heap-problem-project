<style lang="scss">
.pregnant-check {
  margin-top: 0;
}
</style>
<template>
  <div class="sample-statement">
    <div class="reception-form">
      <v-row>
        <v-col md12 xs12>
          <v-select
            :attach="true"
            :label="$t('sample.statement.ContraceptionMethods')"
            outlined
            v-model="statement.ContraceptionMethodList"
            :items="this.$enum.contraceptionMethod.toSelect"
            :multiple="true"
            chips
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col md12 xs12>
          <v-text-field
            outlined
            v-model="statement.PreventionMethodDescription"
            :label="$t('sample.statement.ContraceptionMethodsDescription')"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md12 xs12>
          <v-select
            :attach="true"
            :label="$t('sample.statement.ClinicalFindings')"
            outlined
            v-model="statement.ClinicalFindingList"
            :items="this.$enum.samplePatientClinicalFindings.toSelect"
            :multiple="true"
            chips
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col md12 xs12>
          <v-select
            :attach="true"
            :label="$t('sample.statement.PatientComplaints')"
            outlined
            v-model="statement.PatientComplaintList"
            :items="this.$enum.samplePatientComplaints.toSelect"
            :multiple="true"
            chips
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col md6 xs12>
          <vr-date-picker
            outlined
            :label="$t('sample.statement.FirstDayOfLastMenstruation')"
            v-model="statement.FirstDayOfLastMenstruation"
            v-validate="'required'"
            name="FirstDayOfLastMenstruation"
            :error-messages="errors.collect('FirstDayOfLastMenstruation')"
            :data-vv-as="'FirstDayOfLastMenstruation'"
          ></vr-date-picker>
        </v-col>
        <v-col md6 xs12>
          <v-checkbox
            class="pregnant-check"
            :label="$t('sample.statement.Pregnant')"
            v-model="statement.Pregnant"
            persistent-hint
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-row>
        <v-col md12 xs12>
          <v-text-field
            outlined
            v-model="statement.HormonTheraphyDetail"
            :label="$t('sample.statement.HormonalDrug')"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col md4 xs12>
          <v-text-field
            outlined
            type="number"
            :label="$t('sample.statement.NumberOfPregnancy')"
            v-model="statement.NumberOfPregnancy"
          ></v-text-field>
        </v-col>
        <v-col md4 xs12>
          <v-text-field
            :label="$t('sample.statement.NumberOfDeliveries')"
            outlined
            type="number"
            v-model="statement.NumberOfDeliveries"
          ></v-text-field>
        </v-col>
        <v-col md4 xs12>
          <v-text-field
            :label="$t('sample.statement.NumberOfAbortions')"
            outlined
            type="number"
            v-model="statement.NumberOfAbortions"
          ></v-text-field>
        </v-col>
      </v-row>

      <div class="action">
        <v-btn class="medium" @click="submit">
          <span v-if="finalStep">{{ $t("actions.final-step")}}</span>
          <span v-else>{{ $t("actions.next")}}</span>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IPatientStatementsPapSmear } from '~/models/reception/IStatementPapSmear.ts'
import contraceptionMethod from '~/enums/contraceptionMethod'
import samplingReason from '~/enums/samplingReason'
import { samplingReasonEnum } from '~/enums/samplingReason'

export default Vue.extend({
  props: {
    statementProp: {
      type: Object as () => IPatientStatementsPapSmear,
      default: function() {
        return <IPatientStatementsPapSmear>{}
      }
    },
    finalStep: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      statement: this.statementProp
    }
  },
  watch: {
    statementProp: {
      handler(val, oldVal) {
        this.statement = val
      },
      deep: true
    }
  },
  methods: {
    submit() {
      this.$emit('statementInfo', this.statement)
    },
    previous() {
      this.$emit('previous')
    }
  },
  mounted() {}
})
</script>