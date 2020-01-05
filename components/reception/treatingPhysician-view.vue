
<template>
  <div ref="wrapper" class="reception-view">
    <div class="reception-view-head">

      <span class="text">اطلاعات پزشک معالج</span>
    </div>

    <div class="reception-view-wrapper reception-form">
      <v-row>
        <v-col xs="12" md="6">
          <v-text-field
            :readonly="true"
            :label="$t('individualUser.firstName')"
            v-model="treatingPhysician.FirstName"
            outlined
            hide-details
          ></v-text-field>
        </v-col>
        <v-col xs="12" md="6">
          <v-text-field
            :readonly="true"
            outlined
            :label="$t('individualUser.lastName')"
            v-model="treatingPhysician.LastName"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12" md="6">
          <v-select
          :attach="true"
            :readonly="true"
            outlined
            :label="$t('individualUser.gender')"
            :items="this.$enum.gender.toSelect"
            v-model="treatingPhysician.Gender"
            hide-details
          ></v-select>
        </v-col>
        <v-col xs="12" md="6" />
      </v-row>
      <v-row>
        <v-col xs="12" md="6">
          <v-text-field
            :readonly="true"
            outlined
            :label="$t('individualUser.phoneNumber')"
            v-model="treatingPhysician.PhoneNumber"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col xs="12" md="6">
          <v-text-field
            :readonly="true"
            outlined
            :label="$t('individualUser.mobileNumber')"
            v-model="treatingPhysician.MobileNumber"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12" md="6">
          <v-text-field
            :readonly="true"
            :label="$t('individualUser.role.doctorInfo.medicalSystemCode')"
            v-model="treatingPhysician.MedicalSystemCode"
            outlined
            hide-details
          ></v-text-field>
        </v-col>
        <v-col xs="12" md="6">
          <v-select
          :attach="true"
            :readonly="true"
            :items="expertises"
            :label="$t('individualUser.role.doctorInfo.expertise')"
            v-model="treatingPhysician.Expertise"
            item-text="Title"
            item-value="Id"
            outlined
            hide-details
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col xs="12" md="12">
          <v-textarea
            :readonly="true"
            outlined
            :label="$t('individualUser.address')"
            rows="1"
            v-model="treatingPhysician.Address"
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
import { ITreatingPhysician } from '~/models/user-roles/ITreatingPhysician'
import { IExpertise } from '~/models/IExpertise'
import expertiseSetTitle from '~/util/expertise'

export default Vue.extend({
  props: {
    treatingPhysician_prop: {
      default: <ITreatingPhysician>{}
    }
  },
  data() {
    return {
      treatingPhysician: this.treatingPhysician_prop,
      expertises: <IExpertise[]>[]
    }
  },
  watch: {
    treatingPhysician_prop: {
      handler(val, oldVal) {
        this.treatingPhysician = val
      },
      deep: true
    }
  },

  async mounted() {
    try {
      this.expertises = await this.$service.role.doctorExpertises()
      if (this.expertises) {
        expertiseSetTitle(this.expertises, this.$i18n)
      }
    } catch (error) {}
  }
})
</script>


