<style lang="scss">
</style>
<style lang="scss" scoped>
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
        :title="''"
        :queryService="queryService"
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
            <span class="transparent-badge"
              v-if="item.ReceptionType ==0 || item.ReceptionType ==1"
            >{{item.ReceptionType | enum('receptionType')}}</span>
            <vr-badge
              v-else
              :color="colors.receptionType[item.ReceptionType]"
            >{{item.ReceptionType | enum('receptionType')}}</vr-badge>
          </td>
          <td>{{item.DeliveryDate | persianDate| persianDigit}}</td>
          <td>{{item.SampleStatus | enum('sampleStatus')}}</td>
          <td>{{item.ContainerExists ? 'بله': 'خیر'}}</td>
        </template>
      </vr-data-grid>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ISample } from '~/models/reception/ISample'
import samplePapSmear from '~/components/reception/sample/sample-papSmear-view.vue'
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
          text: this.$t('sample.ContainerExists'),
          align: 'right',
          value: 'ContainerExists',
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
    row_clicked(item) {
      this.$dialog.show({
        dialog_wrapper_custom_class: 'dialog-wrapper-custom',
        component: samplePapSmear,
        props: {
          receptionId: this.receptionId,
          sampleId: item.Id
        }
      })
    },
    async getSampleList() {
      if (this.receptionId > 0) {
        this.items = await this.$service.reception.receptionSampleList(
          this.receptionId
        )
        this.$emit('changeSamples', this.items)
      }
    },
    slideManagement(item) {
      this.$dialog.show({
        component: slideList,
        props: {
          sampleId: item.Id,
          receptionId: this.receptionId
        },
        persistent: true
      })
    }
  }
})
</script>