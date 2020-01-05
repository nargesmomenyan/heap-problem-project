<style lang="scss">
#secretary-sample-report {
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
  background: #ffffff 0% 0% no-repeat padding-box;
  width: 100%;
  padding-top: 60px;
  .search-box-wrapper {
    width: 80%;
    height: 80px;
    box-shadow: 0px 2px 32px #178fd14d;
    display: flex;
    flex-direction: row;
    align-items: center;
    @include respond-to(md) {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      width: 32rem;
       height: 160px;
    }

    .caption {
      background: #ffffff 0% 0% no-repeat padding-box;
      width: 60%;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      @include respond-to(md) {
        width: 100%;
      }
      span {
        font-size: 1rem;
        line-height: 1.375rem;
        color: #4a4a4a;
        padding: 0;
      }
    }
    .search-text-wrapper {
      background: #eaf7ff 0% 0% no-repeat padding-box;
      width: 40%;
      height: 80px;
      padding-right: 20px;
      padding-left: 20px;
      @include respond-to(md) {
        width: 100%;
      }

      .v-text-field > .v-input__control > .v-input__slot:before,
      .v-text-field > .v-input__control > .v-input__slot:after {
        width: 0%;
      }
      .v-input {
        align-items: center !important;
      }
      .v-text-field {
        background: #eaf7ff 0% 0% no-repeat padding-box !important;
        font-size: 0.875rem !important;
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;

        .v-input__slot {
          border-color: #eaf7ff !important;
          background: #eaf7ff 0% 0% no-repeat padding-box !important;

          input {
            color: #4dbfff;
          }
        }

        input {
          font-size: 14px !important;
        }
      }
    }
  }

  .filter-grid-wrapper {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    width: 100%;
    .reception-grid {
      width: 100%;
    }

    .filter-wrapper {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      font-size: 0.75rem !important;
      color: #5a5a5a;
      font-weight: 500;
      align-items: center;
      width: 100%;

      .filter-wrapper-right {
        display: flex;
        flex-direction: row;
      }
      .v-text-field input {
        font-size: 0.75rem !important;
      }
      .v-input {
        .v-input__slot {
          min-height: 33px !important;
          width: 110px;
          padding-left: 0;
        }
        .v-input__append-inner {
          margin-top: 5px !important;
          margin-left: 5px;
        }
      }

      .caption-group {
        padding-left: 8px;
      }
      .caption {
        padding-left: 8px;
        padding-right: 14px;
      }

      .filter-group {
        display: flex;
        flex-direction: row;
        align-items: center;

        .v-btn {
          color: #a5a5a5;
        }

        a {
          padding: 10px 15px;
          color: #a5a5a5;
          cursor: pointer;
        }

        .a-active {
          border-bottom: solid 4px $primary-color;
          color: $primary-color;
        }
      }
      .gap {
        width: 60px;
      }

      .reception-types {
        display: flex;
        flex-direction: row;
      }
    }

    .gap {
      flex: 1 1 15px;
    }
  }

  .gap-wide {
    flex: 1 1 35px;
  }
}
</style>

<template>
  <v-row>
    <v-col md="1"></v-col>
    <v-col md="10">
      <div ref="samplesWrapper" id="secretary-sample-report">
        <div class="search-box-wrapper">
          <div class="caption">
            <span>جستجوی آزمایش‌ها بر اساس نام و نام‌ خانوادگی، کد ملی یا شماره آزمایش</span>
          </div>
          <div class="search-text-wrapper">
            <v-text-field class="search-text" v-model="searchPhrase" hide-details>
              <template v-slot:append>
                <v-btn icon text @click="search">

                </v-btn>
              </template>
            </v-text-field>
          </div>
        </div>
        <div class="gap-wide" />

        <div class="filter-grid-wrapper">
          <div v-if="searchIsDone" class="filter-wrapper">
            <div class="filter-wrapper-right">
              <div class="filter-group">
                <span class="caption-group">تاریخ پذیرش:</span>
                <span class="caption">از</span>
                <vr-date-picker
                  autocomplete="off"
                  hide-details
                  single-line
                  outlined
                  v-model="receptionDateFrom"
                ></vr-date-picker>
                <span class="caption">تا</span>
                <vr-date-picker hide-details single-line outlined v-model="receptionDateTo"></vr-date-picker>
              </div>
              <div class="gap"></div>
              <div class="filter-group">
                <span class="caption-group">تاریخ جواب:</span>
                <span class="caption">از</span>
                <vr-date-picker
                  autocomplete="off"
                  hide-details
                  single-line
                  outlined
                  v-model="sampleDeliveryDateFrom"
                ></vr-date-picker>
                <span class="caption">تا</span>
                <vr-date-picker hide-details single-line outlined v-model="sampleDeliveryDateTo"></vr-date-picker>
              </div>
            </div>

            <div class="filter-group">
              <span class="caption-group">نمایش:</span>

              <a @click="filterReceptionType(0)" :class="receptionType==0?'a-active':''">همه</a>

              <template v-for="(item, index) in $enum.receptionType.toSelect">
                <a
                  :key="index"
                  @click="filterReceptionType(item.value)"
                  :class="receptionType==item.value?'a-active':''"
                >{{item.text}}</a>
              </template>
            </div>
          </div>
          <div class="gap" />
          <div class="reception-grid" v-if="searchIsDone">
            <vr-data-grid
              :headers="headers"
              :title="''"
              :withAdd="false"
              :hideActionDelete="true"
              :hideActionEdit="true"
              :items="items"
              :serverPagination="false"
              :hide_page_size="true"
              :custom_class_grid_wrapper="'grid-data-wrapper'"
              :custom_class_footer_wrapper="'custom_class_footer_wrapper'"
              :dataGrid="dataGrid"
              @row_clicked="row_clicked"
            >
              <template #header>
                <span />
              </template>
              <template #items="{item}">
                <td>{{ item.ReceptionNumber }}</td>
                <td>{{ item.ReceptionDate|persianDate|persianDigit }}</td>
                <td>{{ item.Type | enum('sampleType') }}</td>
                <td>{{ item.PatientFullName }}</td>
                <td>{{ item.PatientNationalCode }}</td>
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
                <td>{{ item.DeliveryDate | persianDate | persianDigit}}</td>
              </template>
            </vr-data-grid>
          </div>
        </div>
      </div>
    </v-col>
    <v-col md="1"></v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from 'vue'
import { VRDataGrid } from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
import { ISampleFilter } from '~/models/reception/ISample'
import colors from '~/colors'
import { receptionTypeEnum } from '../../../enums/receptionType'
export default Vue.extend({
  data() {
    return {
      searchIsDone: false,
      receptionType: 0,
      receptionDateFrom: null,
      receptionDateTo: null,
      sampleDeliveryDateFrom: null,
      sampleDeliveryDateTo: null,
      searchPhrase: null,
      dataGrid: <VRDataGrid>{
        refresh: () => {},
        items: [],
        total_items: 0,
        lastPage: 0
      },
      colors,
      items: [],

      headers: [
        {
          text: this.$t('reception.number'),
          align: 'right',
          value: 'ReceptionNumber',
          width: '15%'
        },
        {
          text: this.$t('reception.ReceptionDate'),
          align: 'right',
          value: 'ReceptionDate',
          width: '10%'
        },
        {
          text: this.$t('sample.sampleTypeTitle'),
          align: 'right',
          value: 'Type',
          width: '10%'
        },
        {
          text: this.$t('reception.PatientName'),
          align: 'right',
          value: 'PatientFullName',
          width: '10%'
        },
        {
          text: this.$t('reception.PatientNationalCode'),
          align: 'right',
          value: 'PatientNationalCode',
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
          value: 'DeliveryDate',
          width: '15%'
        }
      ]
    }
  },
  watch: {
    receptionType: {
      handler() {
        this.search()
      }
    },
    searchPhrase: {
      handler() {
        this.search()
      }
    },
    receptionDateFrom: {
      handler() {
        this.search()
      }
    },
    receptionDateTo: {
      handler() {
        this.search()
      }
    },
    sampleDeliveryDateFrom: {
      handler() {
        this.search()
      }
    },
    sampleDeliveryDateTo: {
      handler() {
        this.search()
      }
    }
  },
  methods: {
    row_clicked(item) {
      this.$router.push(`/secretaries/receptions/${item.ReceptionId}`)
    },
    async search() {
      let filter = <ISampleFilter>{
        receptionType: this.receptionType > 0 ? this.receptionType : null,
        receptionDateFrom: this.receptionDateFrom,
        receptionDateTo: this.receptionDateTo,
        sampleDeliveryDateFrom: this.sampleDeliveryDateFrom,
        sampleDeliveryDateTo: this.sampleDeliveryDateTo
      }

      let loader = this.$loader.show(this.$refs.samplesWrapper)
      try {
        let result = await this.$service.reception.SampleReport(filter)
        this.dataGrid.items = result.data
        this.dataGrid.total_items = result.total
        this.dataGrid.lastPage = result.lastPage
      } catch (error) {
      } finally {
        loader.hide()
        this.searchIsDone = true
      }
    },
    filterReceptionType(receptionType) {
      if (this.receptionType != receptionType) {
        this.receptionType = receptionType
        this.search()
      }
    }
  }
})
</script>
