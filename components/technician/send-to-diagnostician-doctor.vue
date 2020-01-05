<style lang="scss">
#wrapper-request {
  display: flex;
  width: 100%;
  flex-direction: column;
  .wrapper-request-head {
    font-size: 0.875rem;
    text-align: right;
    color: $form-caption-color;
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
    <div id="wrapper-request" ref="wrapper">
      <div class="wrapper-request-head">{{$t('sample.sendToDiagnosticianDoctor-title')}}</div>
      <div class="doctor-wrapper">
        <v-select
          :attach="true"
          :items="supervisors"
          item-value="RoleUserId"
          item-text="FullName"
          v-model="request.DiagnosticianDoctorSupervisorId"
          v-validate="'required'"
          name="supervisorId"
          :data-vv-as="this.$t('reception.assign-supervisor-diagnosticianDoctor')"
          :error-messages="errors.collect('supervisorId')"
          outlined
          :label="$t('reception.assign-supervisor-diagnosticianDoctor')"
        ></v-select>
        <v-textarea
          v-model="request.Comment"
          rows="1"
          :label="this.$t('reception.description')"
          outlined
        ></v-textarea>
      </div>
      <div class="btn-wrapper">
        <v-btn class="small" @click="sendRequest">{{$t('sample.sendToDiagnosticianDoctor-action')}}</v-btn>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { roleEnum } from '~/enums/role'
import { ISimpleUserRole } from '~/models/UserRole'
import { ISendToDiagnosticianDoctor } from '../../models/reception/ISendToDiagnosticianDoctor'
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
      request: <ISendToDiagnosticianDoctor>{ SampleId: this.sampleId }
    }
  },
  async mounted() {
    this.supervisors = await this.$service.organization.getMyOrganizationUsersByRole(
      'DiagnosticianDoctorSupervisor'
    )
  },
  methods: {
    async sendRequest() {
      let valid = await this.$validator.validateAll()
      if (!valid) {
        return
      }

      let loader = this.$loader.show(this.$refs.wrapper)
      this.$service.processingReception
        .sampleSendToDiagnosticianDoctor(this.request)
        .then(result => {
          loader.hide()
          this.$emit('infoSent', 'success')
        })
        .catch(error => {
          loader.hide()
          this.$toast.error().show({
            message: error.message || this.$t('msg.UI.fail').toString(),
            top: true,
            customClass: 'toast-customClass error'
          })
        })
    }
  }
})
</script>