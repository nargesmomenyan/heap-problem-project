<style lang="scss">
#tech-wrapper {
  display: flex;
  width: 396px;
  height: 300px;
  flex-direction: column;
  padding: 20px;

  .wrapper-head {
    font-size: 1rem;
    text-align: right;
  }

  .user-wrapper {
    margin: 30px 0 5px 0;
  }

  .btn-wrapper {
    text-align: left;
  }
}
</style>
<template>
  <section>
    <div ref="wrapper" id="tech-wrapper">
      <div
        class="wrapper-head"
      >{{assignForPass? $t('sample.choose-diagnostician-doctor-for-pass') : $t('sample.choose-diagnostician-doctor')}}</div>
      <div class="user-wrapper">
        <v-select
          :attach="true"
          :items="list"
          item-value="RoleUserId"
          item-text="FullName"
          v-model="assign.RoleUserId"
          v-validate="'required'"
          name="userId"
          :data-vv-as="this.$t('reception.assign-diagnosticianDoctor')"
          :error-messages="errors.collect('userId')"
          outlined
          :label="$t('reception.assign-diagnosticianDoctor')"
        ></v-select>
        <v-textarea
          v-model="assign.Comment"
          rows="1"
          :label="this.$t('reception.description')"
          outlined
        ></v-textarea>
      </div>
      <div class="btn-wrapper">
        <v-btn class="small" @click="assignSample">{{$t('actions.final-step')}}</v-btn>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { roleEnum } from '~/enums/role'
import { ISimpleUserRole } from '~/models/UserRole'
import { IAssignSample } from '~/models/reception/IAssignSample'
export default Vue.extend({
  props: {
    sampleId: {
      required: true,
      type: Number
    },
    assignForPass: {
      required: true,
      type: Boolean
    }
  },
  data() {
    let list: ISimpleUserRole[] = []
    return {
      list: list,
      assign: <IAssignSample>{ SampleId: this.sampleId }
    }
  },
  async mounted() {
    this.list = await this.$service.organization.getMyOrganizationUsersByRole(
      'DiagnosticianDoctor'
    )
  },
  methods: {
    async assignSample() {
      let valid = await this.$validator.validateAll()
      if (!valid) {
        return
      }

      let loader = this.$loader.show(this.$refs.wrapper)
      let service = this.assignForPass
        ? this.$service.processingReception.sampleAssignToDiagnosticianDoctorForPass(
            this.assign
          )
        : this.$service.diagnostication.assignSampleToDiagnosticationDoctor(
            this.assign
          )

      service
        .then(result => {
          this.$emit('hide', 'success')
          this.$toast.success().show({
            customClass: 'toast-customClass success',
            message: this.$t('msg.UI.success').toString(),
            top: true
          })
        })
        .catch(error => {
          this.$emit('hide', 'fail')
          this.$toast.error().show({
            customClass: 'toast-customClass error',
            message: error.message || this.$t('msg.UI.fail'),
            top: true
          })
        })
        .finally(() => {
          loader.hide()
        })
    }
  }
})
</script>