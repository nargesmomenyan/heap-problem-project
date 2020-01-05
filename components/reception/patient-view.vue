
<template>
  <div ref="wrapper" class="reception-view">
    <div class="reception-view-head">

      <span class="text">{{$t('reception.patient-info')}}</span>
    </div>

    <div class="reception-view-wrapper reception-form">
      <v-row>
        <v-col xs="12" md="6">
          <v-text-field
            :label="$t('individualUser.firstName')"
            outlined
            :readonly="true"
            v-model="patient.FirstName"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col xs="12" md="6">
          <v-text-field
            :label="$t('individualUser.lastName')"
            :readonly="true"
            outlined
            v-model="patient.LastName"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12" md="6">
          <v-text-field
            :readonly="true"
            :label="$t('individualUser.nationalCode')"
            v-model="patient.NationalCode"
            outlined
            hide-details
          ></v-text-field>
        </v-col>
        <v-col xs="12" md="6">
          <v-select
          :attach="true"
            :readonly="true"
            outlined
            :label="$t('individualUser.gender')"
            :items="this.$enum.gender.toSelect"
            v-model="patient.Gender"
            hide-details
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="8" md="4">
          <vr-date-picker
            :readonly="true"
            :label="$t('individualUser.birthDate')"
            outlined
            v-model="patient.BirthDate"
            hide-details
          ></vr-date-picker>
        </v-col>
        <v-col xs="12" md="6" />
      </v-row>
      <v-row>
        <v-col xs="12" md="6">
          <v-text-field
            outlined
            :readonly="true"
            :label="$t('individualUser.phoneNumber')"
            v-model="patient.PhoneNumber"
            hide-details
          ></v-text-field>
        </v-col>

        <v-col xs="12" md="6">
          <v-text-field
            outlined
            :readonly="true"
            :label="$t('individualUser.mobileNumber')"
            v-model="patient.MobileNumber"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12" md="12">
          <v-textarea
            outlined
            :readonly="true"
            rows="1"
            :label="$t('individualUser.address')"
            v-model="patient.Address"
            class="outlined-text-area"
            hide-details
          ></v-textarea>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IPatient } from '~/models/user-roles/IPatient'

export default Vue.extend({

  props: {
    patient_prop: {
      type: Object as () => IPatient,
      default: <IPatient>{ Id: 0 }
    }
  },
  data() {
    return {
      patient: this.patient_prop
    }
  },
  watch: {
    patient_prop: {
      handler(val, oldVal) {
        this.patient = val
      },
      deep: true
    }
  },
  computed: {},
  methods: {}
})
</script>