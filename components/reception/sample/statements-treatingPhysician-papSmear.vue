
<template>
  <div class="sample-statement">
    <div class="reception-form">
      <v-select
      :attach="true"
        outlined
        :label="$t('sample.statement.SamplingReason')"
        v-model="statement.SamplingReasonList"
        :items="this.$enum.samplingReason.toSelect"
        :multiple="true"
        chips
      ></v-select>

      <v-row>
        <v-col md12 xs12>
          <v-select
          :attach="true"
            :label="$t('sample.statement.ExaminationFindings')"
            outlined
            v-model="statement.ExaminationFindingList"
            :items="this.$enum.sampleTreatingPhysicianExaminationFindings.toSelect"
            :multiple="true"
            chips
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col md12 xs12>
          <v-text-field
            outlined
            v-model="statement.OtherExaminationFindings"
            :label="$t('sample.statement.ExaminationFindingDescription')"
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
import { ITreatingPhysicianStatementsPapSmear } from '~/models/reception/IStatementPapSmear.ts'
import contraceptionMethod from '~/enums/contraceptionMethod'
import samplingReason from '~/enums/samplingReason'
import { samplingReasonEnum } from '~/enums/samplingReason'

export default Vue.extend({
  props: {
    statementProp: {
      type: Object as () => ITreatingPhysicianStatementsPapSmear,
      default: function() {
        return <ITreatingPhysicianStatementsPapSmear>{}
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
  mounted() {
 
  }
})
</script>