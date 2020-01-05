<style lang="scss">
#wrapper-pass {
  display: flex;
  width: 396px;
  height: 350px;
  flex-direction: column;
  padding: 20px;
  .wrapper-pass-head {
    font-size: 1rem;
    text-align: right;
  }

  .doctor-wrapper {
    margin: 30px 0 5px 0;
  }

  .btn-wrapper {
    text-align: left;
  }
}
</style>
<template>
  <section>
    <div id="wrapper-pass" ref="wrapper">
      <div class="wrapper-pass-head">{{$t('pass.pass-request-title')}}</div>
      <div class="doctor-wrapper">
        <v-select
          :attach="true"
          :items="supervisors"
          item-value="RoleUserId"
          item-text="FullName"
          v-model="pass.DiagnosticianDoctorSupervisorId"
          v-validate="'required'"
          name="supervisorId"
          :data-vv-as="this.$t('reception.assign-supervisor-diagnosticianDoctor')"
          :error-messages="errors.collect('supervisorId')"
          outlined
          :label="$t('reception.assign-supervisor-diagnosticianDoctor')"
        ></v-select>
        <v-textarea
          v-model="pass.Comment"
          rows="4"
          :label="this.$t('reception.description')"
          outlined
        ></v-textarea>
      </div>
      <div class="btn-wrapper">
        <v-btn class="small" @click="passSample">{{$t('actions.final-step')}}</v-btn>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { roleEnum } from '~/enums/role'
import { ISimpleUserRole } from '~/models/UserRole'
import { IPassRequest } from '~/models/reception/IPassRequest'
export default Vue.extend({
  props: {
    sampleId: {
      required: true,
      type: Number
    }
  },
  data() {
    let supervisors: ISimpleUserRole[] = []
    return {
      supervisors: supervisors,
      pass: <IPassRequest>{ SampleId: this.sampleId }
    }
  },
  async mounted() {
    this.supervisors = await this.$service.organization.getMyOrganizationUsersByRole(
      'DiagnosticianDoctorSupervisor'
    )
  },
  methods: {
    async passSample() {
      let valid = await this.$validator.validateAll()
      if (!valid) {
        return
      }

      let loader = this.$loader.show(this.$refs.wrapper)
      this.$service.processingReception
        .samplePassRequest(this.pass)
        .then(result => {
          this.$emit('hide', 'success')
        })
        .catch(error => {
          this.$emit('hide', 'error')
          this.$toast
            .error()
            .show({
              message: error.message || this.$t('msg.UI.fail').toString(),
              top: true,
              customClass: 'toast-customClass error'
            })
        })
        .finally(() => {
          loader.hide()
        })
    }
  }
})
</script>