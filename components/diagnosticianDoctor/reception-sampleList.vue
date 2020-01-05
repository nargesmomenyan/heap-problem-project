<style lang="scss">
</style>
<style lang="scss" scoped>
.dialog-wrapper-custom {
  border-radius: 8px;
  background: hsl(0, 0%, 100%) 0% 0% no-repeat padding-box;
  border: 1px solid $form-title-color;
}
</style>
<template>
  <div>
    <div class="sample-list" ref="wrapper">
      <div class="sample-head">
        <div class="sample-head-right">
          <div>
          </div>
          <div class="sample-head-right-gap"></div>
          <div class="guide">آزمایش‌های ثبت شده</div>
        </div>
      </div>
    </div>
    <div class="sample-list-view-wrapper">
      <vr-data-grid
        :headers="headers"
        :hideActionDelete="true"
        :hideActionEdit="true"
        :withoutAction="true"
        :actions="actions"
        :withContextMenu="true"
        :title="''"
        :defaultFilters="defaultFilters"
        :disable_pagination="true"
        :serverPagination="false"
        :items="items"
        @row_clicked="row_clicked"
      >
        <template #header>
          <span />
        </template>
        <template #items="{item}">
          <td>{{item.Type | enum('sampleType')}}</td>
          <td>{{item.SamplingDate | persianDate | persianDigit }}</td>
          <td>
            <span
              class="transparent-badge"
              v-if="item.ReceptionType ==0 || item.ReceptionType ==1"
            >{{item.ReceptionType | enum('receptionType')}}</span>
            <vr-badge
              v-else
              :color="colors.receptionType[item.ReceptionType]"
            >{{ item.ReceptionType | enum('receptionType') }}</vr-badge>
          </td>
          <td>{{item.DeliveryDate | persianDate| persianDigit}}</td>

          <td>{{item.SlideCount }}</td>
          <td>{{item.PassCount }}</td>
          <td>{{item.AssigneeFullName }}</td>
          <td>
            <span
              class="sample-status-badge"
              :class="getSampleStatusClass(item.SampleStatus)"
            >{{item.SampleStatus | enum('sampleStatus')}}</span>
            <span v-if="cancelPassIsVisible(item.SampleStatus)">
              <v-btn @click.stop="cancelPassRequest(item)" text class="cancel-pass-request">
                <v-icon>la-close</v-icon>
                {{$t('sample.cancel-pass-request') }}
              </v-btn>
            </span>
          </td>
        </template>
      </vr-data-grid>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISampleDisplayList, ISample } from '~/models/reception/ISample'
import samplePapSmear from '~/components/reception/sample/sample-papSmear-view.vue'
import {
  VRGridAction,
  VRDataGrid
} from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
import colors from '~/colors'
import slideList from '~/components/reception/slide/slide-list.vue'
import assignDiagnosticianDoctor from '~/components/diagnosticianDoctor/assign-diagnostician-doctor.vue'
import { ICurrentUser } from '~/models/ICurrentUser'
import { sampleStatusEnum } from '../../enums/sampleStatus'
import { roleEnum } from '~/enums/role'

export default Vue.extend({
  components: { samplePapSmear },
  props: {
    receptionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      items: <ISampleDisplayList[]>[],
      colors,
      headers: [
        {
          text: this.$t('sample.sampleTypeTitle'),
          align: 'right',
          value: 'Type',
          width: '10%'
        },
        {
          text: this.$t('sample.samplingDate'),
          align: 'right',
          value: 'SamplingDate',
          width: '10%'
        },
        {
          text: this.$t('sample.receptionType'),
          align: 'right',
          value: 'ReceptionType',
          width: '10%'
        },
        {
          text: this.$t('sample.deliveryDate'),
          align: 'right',
          value: 'DeliveryDate ',
          width: '10%'
        },

        {
          text: this.$t('sample.slideCount'),
          align: 'right',
          value: 'SlideCount',
          width: '5%'
        },
        {
          text: this.$t('sample.passCount'),
          align: 'right',
          value: 'PassCount',
          width: '5%'
        },
        {
          text: this.$t('sample.AssigneeFullName'),
          align: 'right',
          value: 'AssigneeFullName',
          width: '10%'
        },
        {
          text: this.$t('sample.status'),
          align: 'right',
          value: 'SampleStatus',
          width: '10%'
        }
      ],
      actions: <any[]>[],
      isSupervisor: false,
      defaultFilters: { receptionId: this.receptionId },
      currentUserInfo: this.$store.getters[
        'authentication/currentUserInfo'
      ] as ICurrentUser
    }
  },
  watch: {
    receptionId: {
      handler() {
        this.defaultFilters = { receptionId: this.receptionId }
        this.getSampleList()
      },
      deep: true
    }
  },
  async mounted() {
    if (this.currentUserInfo.RoleId == roleEnum.DiagnosticianDoctorSupervisor) {
      this.isSupervisor = true
    }

    if (this.isSupervisor) {
      this.actions.push({
        icon: 'check_circle_outline',
        title: this.$t('sample.assign-to-diagnostician-doctor').toString(),
        cb: this.showDialogAssignToDiagnosticianDoctor
      })
    } else {
      this.actions.push({
        icon: 'check_circle_outline',
        title: this.$t(
          'sample.request-assign-to-other-diagnostician-doctor'
        ).toString(),
        cb: this.showDialogRequestAssignToOtherDiagnosticianDoctor
      })
    }
    await this.getSampleList()
  },
  methods: {
    row_clicked(item) {
      if (item.AssigneeId == this.currentUserInfo.UserId) {
        this.$router.push(
          `/diagnosticianDoctors/receptions/${this.receptionId}/${item.Id}?sampleType=${item.Type}`
        )
      } else {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          message: this.$t('sample.msg-not-assignee').toString(),
          top: true
        })
      }
    },
    async getSampleList() {
      if (this.receptionId > 0) {
        this.items = await this.$service.processingReception.getReceptionSamples(
          this.receptionId
        )
        this.$emit('changeSamples', this.items)
      }
    },
    showDialogAssignToDiagnosticianDoctor(item) {
      let assignForPass = false
      if (item.SampleStatus == sampleStatusEnum.WaitForPassAssignment) {
        assignForPass = true
      }
      this.$dialog
        .show({
          component: assignDiagnosticianDoctor,
          props: {
            sampleId: item.Id,
            assignForPass: assignForPass
          },
          dialog_wrapper_custom_class: 'dialog-wrapper-custom'
        })
        .then(() => this.getSampleList())
    },
    async showDialogRequestAssignToOtherDiagnosticianDoctor(item) {
      if (this.currentUserInfo.UserId != item.AssigneeId) {
        this.$toast.error().show({
          message: this.$t('sample.msg-not-assignee').toString(),
          top: true,
          customClass: 'toast-customClass error'
        })
      } else {
        let result = await this.$dialog.confirm({
          message: this.$t(
            'sample.msg-warning-request-assign-to-other-technician'
          ).toString(),
          ok_txt: this.$t('confirm.ok_txt').toString(),
          cancel_txt: this.$t('confirm.cancel_txt').toString(),
          dialog_wrapper_custom_class:
            'dialog-wrapper-confirm-cancel-technician'
        })
        if (result) {
          let loader = this.$loader.show(this.$refs.wrapper)
          try {
            await this.$service.processingReception.requestAssingSampleToOtherTechnician(
              this.currentUserInfo.UserId,
              item.Id
            )
            this.$toast.success().show({
              message: this.$t('msg.UI.success').toString(),
              top: true,
              customClass: 'toast-customClass success'
            })
          } catch (error) {
            this.$toast.error().show({
              message: error || this.$t('msg.UI.fail'),
              top: true,
              customClass: 'toast-customClass error'
            })
          }
          loader.hide()
        }
      }
    },
    getSampleStatusClass(sampleStatus: number) {
      switch (sampleStatus) {
        case sampleStatusEnum.WaitForPassAssignment:
          return 'sample-status-passed'
          break

        case sampleStatusEnum.ProcessFailed:
          return 'sample-status-fail'
          break

        case sampleStatusEnum.Processed:
        case sampleStatusEnum.WaitForPathologistAssignment:
        case sampleStatusEnum.PathologistAssignRequest:
          return 'sample-status-processed'
          break
      }
    },
    cancelPassIsVisible(sampleStatus: number) {
      if (
        sampleStatus == sampleStatusEnum.WaitForPassAssignment &&
        this.$authorization.check('Technician/DeletePassRequest')
      ) {
        return true
      }
      return false
    },
    cancelPassRequest(sample: ISample) {
      if (sample && sample.Id) {
        let loader = this.$loader.show(this.$refs.wrapper)
        this.$service.processingReception
          .sampleCancelPassRequest(sample.Id)
          .then(data => {
            this.getSampleList()
          })
          .catch(error => {
            this.$toast.error().show({
              message: error.message || this.$t('msg.UI.fail'),
              top: true,
              customClass: 'toast-customClass error'
            })
          })
        loader.hide()
      }
    }
  }
})
</script>