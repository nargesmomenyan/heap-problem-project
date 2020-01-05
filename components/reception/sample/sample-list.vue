<style lang="scss">
.dialog-wrapper-class {
  min-width: 50vw;
  padding: 20px;
}
</style>
<template>
  <div class="sample-list" ref="wrapper">
    <div class="sample-head">
      <div class="sample-head-right">
        <div>
        </div>
        <div class="sample-head-right-gap"></div>
        <div class="guide">آزمایش‌های مورد نیاز را اضافه کنید.</div>
      </div>
      <div v-if="items && items.length>0" class="action">
        <v-btn class="ex-small reverse" @click="addSample">{{$t('reception.add-sample')}}</v-btn>
      </div>
    </div>

    <v-card v-if="items && items.length>0">
      <vr-data-grid
        :headers="headers"
        :hideActionDelete="true"
        :hideActionEdit="true"
        :withoutAction="true"
        :title="''"
        :queryService="queryService"
        :defaultFilters="defaultFilters"
        :disable_pagination="true"
        :serverPagination="false"
        :items="items"
        @row_clicked="editSample"
      >
        <template #header>
          <span />
        </template>
        <template #items="{item}">
          <td>
            <v-btn @click.stop="deleteSample(item)" text icon class="reception-grid-delete-btn">
              <v-icon>la-times-circle</v-icon>
            </v-btn>
          </td>
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
            >{{item.ReceptionType | enum('receptionType')}}</vr-badge>
          </td>
          <td>{{item.DeliveryDate | persianDate| persianDigit}}</td>
          <td>{{item.SampleStatus | enum('sampleStatus')}}</td>
          <td>
            <span v-if="item.ContainerExists">{{$t('sample.ContainerExists')}}</span>
            <v-btn
              v-else
              rounded
              :ripple="false"
              text
              class="btn-text medium"
              @click.stop="slideManagement(item)"
            >{{$t('sample.slide-management')}}</v-btn>
          </td>
        </template>
      </vr-data-grid>
    </v-card>
    <v-card v-else outlined>
      <div class="sample-no-data">
        <div class="sample-no-data-text">در حال حاضر آزمایشی ثبت نشده است.</div>
        <div class="action">
          <v-btn class="ex-large" @click="addSample">{{$t('reception.add-sample')}}</v-btn>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISample } from '~/models/reception/ISample'
import samplePapSmear from './sample-papSmear.vue'
import {
  VRGridAction,
  VRDataGrid
} from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
import colors from '~/colors'
import slideList from '~/components/reception/slide/slide-list.vue'

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
      items: <ISample[]>[],
      queryService: this.$service.reception.receptionSampleListForGrid,
      colors,
      headers: [
        {
          text: '',
          align: 'right',
          value: '',
          width: '5%'
        },
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
          text: this.$t('sample.status'),
          align: 'right',
          value: 'SampleStatus',
          width: '10%'
        },
        {
          text: '',
          align: 'right',
          value: 'SampleStatus',
          width: '5%'
        }
      ],
      defaultFilters: { receptionId: this.receptionId }
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
    await this.getSampleList()
  },
  methods: {
    async getSampleList() {
      if (this.receptionId > 0) {
        let loader = this.$loader.show(this.$refs.wrapper)
        this.items = await this.$service.reception.receptionSampleList(
          this.receptionId
        )
        this.$emit('changeSamples', this.items)
        loader.hide()
      }
    },
    async addSample() {
      let result = await this.$dialog.show({
        component: samplePapSmear,
        props: {
          receptionId: this.receptionId,
        },
        persistent: true
      })

      if (result && result == 'success') {
        await this.getSampleList()
      }
    },
    deleteSample(item) {
      this.$dialog
        .confirm({
          title: ' ',
          message: this.$t('msg.UI.warn-delete').toString(),
          ok_txt: this.$t('actions.confirm-cancel').toString(),
          cancel_txt: this.$t('actions.cancel').toString(),
          dialog_wrapper_custom_class: 'dialog_wrapper_confirm-cancel-secretary'
        })
        .then(() => {
          let loader = this.$loader.show(this.$refs.wrapper)
          this.$service.reception
            .deleteSample(item)
            .then(() => {
              this.getSampleList()
            })
            .catch(error =>
              this.$toast.error().show({
                customClass: 'toast-customClass error',
                top: true,
                message: error.message || this.$t('msg.UI.fail')
              })
            )
            .finally(() => {
              loader.hide()
            })
        })
    },
    editSample(item) {
      this.$dialog
        .show({
          component: samplePapSmear,
          props: {
            receptionId: this.receptionId,
            sampleId: item.Id,
            sampleType: item.Type
          },
          persistent: true
        })
        .then(data => {
          if (data && data == 'success') {
            this.getSampleList()
          }
        })
    },
    slideManagement(item) {
      this.$dialog.show({
        component: slideList,
        props: {
          sampleId: item.Id,
          receptionId: this.receptionId
        },
        dialog_wrapper_custom_class: 'dialog-wrapper-class',
        persistent: false
      })
    }
  }
})
</script>