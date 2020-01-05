<style lang="scss">
.sample-count-wrapper {
  display: flex;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  padding: 5px 0;
}
.action-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
<template>
  <div v-if="showInfo()">
    <div class="reception-form">
      <v-row>
        <v-col md="6" xs="12">
          <v-textarea
            outlined
            height="130px"
            v-validate="'required'"
            :label="$t('reception.description')"
            :data-vv-as="$t('reception.description')"
            name="Description"
            :error-messages="errors.collect('Description')"
            autocomplete="off"
            v-model="reception.Description"
            class="outlined-text-area"
          ></v-textarea>
        </v-col>
        <v-col md="3" xs="12">
          <v-select
            :attach="true"
            :items="technicianSupervisors"
            item-value="Id"
            item-text="FullName"
            v-model="technicianSupervisorId"
            v-validate="'required'"
            name="technicianSupervisorId"
            :data-vv-as="this.$t('reception.assign-supervisor-technician')"
            :error-messages="errors.collect('technicianSupervisorId')"
            outlined
            :label="$t('reception.assign-supervisor-technician')"
          ></v-select>
          <vr-date-picker
            :label="$t('reception.DeliveryDate')"
            outlined
            v-model="reception.DeliveryDate"
          ></vr-date-picker>
        </v-col>
        <v-col md="3" xs="12">
          <div class="action-wrapper">
            <fileUpload
              :entity="{receptionId: reception.Id}"
              :saveService="$service.reception.receptionSaveAttachment"
              :getService="$service.reception.receptionGetAttachment"
              :label="'ضمیمه کردن نسخه'"
            />
            <div class="sample-count-wrapper">
              <span class="caption">تعداد آزمایش‌ها: {{reception.SampleCount|persianDigit}}</span>
            </div>
            <div class="action">
              <v-btn class="medium" @click="confirm">{{$t('reception.save')}}</v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IReception } from '~/models/reception/IReception'
import { IIndividualUser } from '~/models/IndividualUser'
import { roleEnum } from '../../enums/role'
import fileUpload from '~/components/common/file-upload.vue'
export default Vue.extend({
  components: { fileUpload },
  props: ['receptionProp', 'deliveryDate'],
  data() {
    let technicianSupervisors: IIndividualUser[] = []
    return {
      reception: this.receptionProp,
      technicianSupervisors: technicianSupervisors,
      technicianSupervisorId: 0
    }
  },
  async mounted() {
    
    this.technicianSupervisors = await this.$service.organization.getMyOrganizationUsersByRole(
      'TechnicianSupervisor'
    )
    if (this.technicianSupervisors && this.technicianSupervisors.length > 0) {
      this.technicianSupervisorId = this.technicianSupervisors[0].Id
    }
  },
  watch: {
    receptionProp: {
      handler(val, oldVal) {
        this.reception = this.receptionProp
        console.log(
          'receptionProp watch:',
          this.reception,
          this.reception.SampleCount
        )
      },
      deep: true
    },
    deliveryDate: {
      handler(val, oldVal) {
        if (!this.reception) {
          this.reception = <IReception>{}
        }

        this.reception.DeliveryDate = this.deliveryDate
        console.log(
          'deliveryDate watch:',
          this.reception,
          this.reception.SampleCount
        )
      },
      deep: true
    }
  },
  methods: {
    showInfo() {
      if (this.reception && this.reception.SampleCount) {
        return true
      } else {
        return false
      }
    },
    async confirm() {
      try {
        let confirmedInfo = await this.$service.reception.confirmReception(
          this.reception,
          this.technicianSupervisorId
        )
        if (confirmedInfo) {
          this.$toast
            .success()
            .timeout(5000)
            .show({
              customClass: 'toast-customClass success',
              top: true,
              message: this.$t(
                'reception.msg.reception-save-success'
              ).toString()
            })
          this.$emit('confirm', confirmedInfo)
        }
      } catch (error) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          top: true,
          message: error.message || this.$t('msg.UI.fail')
        })
      }
    }
  }
})
</script>