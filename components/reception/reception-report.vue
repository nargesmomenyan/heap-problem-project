<style lang="scss">
#reception-report {
  display: flex;
  flex-direction: row;
  text-align: center;
  align-items: flex-start;
  background: #ffffff 0% 0% no-repeat padding-box;
  height: 100%;

  .reception-report-col {
    padding-top: 0;
    padding-bottom: 0;
    height: 100%;
  }
  .base-filter-wrapper {
    display: flex;
    flex-direction: column;
    box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
    width: 100%;
    height: 100%;
    justify-items: center;
    justify-content: flex-start;
    padding: 70px 10px 0 10px;
    text-align: right;
    .base-filter-header {
      margin-bottom: 25px;
      font-size: 16px;
      color: $form-info-color;
    }
    .base-filter-body {
      font-size: 14px;
      width: 100%;
      cursor: pointer;

      .bottom-zone-category {
        margin-top: 40px;
      }

      a {
        color: $form-info-color;
        line-height: 45px;
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
      }

      a div {
        display: flex;
        align-items: center;
        margin: 8px;
        background-color: #ffffff;
        text-align: center;
        cursor: pointer;
        img {
          width: 24px;
          height: 24px;
          object-fit: contain;
        }
      }

      .base-filter-a-active {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        border: solid 1px $form-info-selected-color;
        background-color: #eaf7ff;
        color: $form-info-selected-color;
      }
    }
  }

  .body-wrapper {
    width: 100%;
    .filter-grid-wrapper {
      display: flex;
      flex-direction: column;
      text-align: center;
      align-items: center;
      padding: 70px 20px 0 20px;

      width: 100%;

      .filter-grid-header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 48px;
        margin-bottom: 30px;
        .header-text {
          font-size: 16px;
        }
      }
      .reception-grid {
        width: 100%;
      }

      .reception-grid-empty {
        width: 100%;
        height: 363px;
        border-radius: 4px;
        border: solid 1px $form-inactive-info-color;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .reception-grid-empty-text {
          font-size: 14px;
          color: $form-title-color;
          padding: 20px 0;
        }
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
        margin-bottom: 10px;

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
      }
    }
  }
}
</style>

<template>
  <v-row ref="wrapper" id="reception-report">
    <v-col class="reception-report-col" md="2">
      <div class="base-filter-wrapper">
        <div class="base-filter-header">
          <span>فیلترها</span>
        </div>
        <div class="base-filter-body">
          <div v-for="(item, index) in receptionCategories" :key="index">
            <a
              v-if="!item.bottomZone"
              @click="filterReceptionStatus(item.id)"
              :class="(item.id == activeCategoryId)? ' base-filter-a-active ':''"
            >
              <div>
                <img :src="getImageUrl(item)" />
              </div>
              <span>{{item.text}}</span>
              <span v-if="item.count">&nbsp; ({{item.count}})</span>
            </a>
          </div>
          <div class="bottom-zone-category">
            <div v-for="(item, index) in receptionCategories" :key="index">
              <a
                v-if="item.bottomZone"
                @click="filterReceptionStatus(item.id)"
                :class="(item.id == activeCategoryId)? ' base-filter-a-active ':''"
              >
                <div>
                  <img :src="getImageUrl(item)" />
                </div>
                <span>{{item.text}}</span>
                <span v-if="item.count">&nbsp; ({{item.count}})</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </v-col>
    <v-col class="reception-report-col" md="10">
      <div class="body-wrapper">
        <v-row>
          <v-col class="reception-report-col" md="12">
            <div class="filter-grid-wrapper">
              <div class="filter-grid-header">
                <div class="header-text">پذیرش‌ها</div>
                <div class="search-text-wrapper">
                  <v-text-field
                    class="search-text"
                    v-model="filter.searchPhrase"
                    solo
                    hide-details
                    placeholder="جستجوی پذیرش"
                  >
                    <template v-slot:append>
                      <v-btn icon text @click="search">
                      </v-btn>
                    </template>
                  </v-text-field>
                </div>
              </div>

              <div class="filter-wrapper">
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
                      v-model="deliveryDateFrom"
                    ></vr-date-picker>
                    <span class="caption">تا</span>
                    <vr-date-picker hide-details single-line outlined v-model="deliveryDateTo"></vr-date-picker>
                  </div>
                </div>
              </div>

              <div v-if="dataGrid.items && dataGrid.items.length>0" class="reception-grid">
                <vr-data-grid
                  :headers="headers"
                  :title="''"
                  :withAdd="false"
                  :hideActionDelete="true"
                  :hideActionEdit="true"
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
                    <td>{{ item.PatientFullName }}</td>
                    <td>{{ item.TreatingPhysicianFullName }}</td>
                    <td>{{ item.NearstDeliveryDate | persianDate | persianDigit}}</td>
                    <td>{{ item.SampleCount }}</td>
                  </template>
                </vr-data-grid>
              </div>
              <div v-else class="reception-grid-empty">
                <div class="reception-grid-empty-text">{{$t('reception.reception-list-empty-text')}}</div>
              </div>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from 'vue'
import { VRDataGrid } from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
import { IProcessingReceptionFilter } from '~/models/reception/IProcessingReception'
import colors from '~/colors'
import { ICurrentUser } from '~/models/ICurrentUser'
import { roleEnum } from '~/enums/role'
import { ICategory } from '~/models/base/ICategory'
export default Vue.extend({
  props: {
    receptionCategories: {
      type: Array as () => ICategory[],
      required: true
    },
    activeCategoryIdProp: {
      type: Number,
      default: 0
    },
    queryReport: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      searchIsDone: false,
      filter: <IProcessingReceptionFilter>{},
      receptionDateFrom: null,
      receptionDateTo: null,
      deliveryDateFrom: null,
      deliveryDateTo: null,
      dataGrid: <VRDataGrid>{
        refresh: () => {},
        items: [],
        total_items: 0,
        lastPage: 0
      },
      colors,
      headers: [
        {
          text: this.$t('reception.number'),
          align: 'right',
          value: 'ReceptionNumber',
          width: '10%'
        },
        {
          text: this.$t('reception.ReceptionDate'),
          align: 'right',
          value: 'ReceptionDate',
          width: '10%'
        },
        {
          text: this.$t('reception.PatientName'),
          align: 'right',
          value: 'PatientFullName',
          width: '15%'
        },
        {
          text: this.$t('reception.treatingPhysician'),
          align: 'right',
          value: 'TreatingPhysicianFullName',
          width: '10%'
        },
        {
          text: this.$t('reception.DeliveryDate'),
          align: 'right',
          value: 'NearstDeliveryDate',
          width: '15%'
        },
        {
          text: this.$t('reception.SampleCount'),
          align: 'right',
          value: 'SampleCount',
          width: '10%'
        }
      ],
      activeCategoryId: this.activeCategoryIdProp
    }
  },
  async mounted() {
    this.search()
  },
  watch: {
    receptionCategories: {
      handler() {
        this.search()
      },
      deep: true
    },
    activeCategoryId: {
      handler() {
        this.search()
      },
      deep: true
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
    deliveryDateFrom: {
      handler() {
        this.search()
      }
    },
    deliveryDateTo: {
      handler() {
        this.search()
      }
    }
  },
  methods: {
    getImageUrl(item) {
      return require(`~/assets/img/reception/${
        item.id == this.activeCategoryId ? item.iconActive : item.icon
      }`)
    },
    async search() {
      let selectedCategoryObject = this.receptionCategories.find(
        x => x.id == this.activeCategoryId
      )
      if (selectedCategoryObject) {
        this.filter.category = selectedCategoryObject.key
        this.filter.receptionDateFrom = this.receptionDateFrom
        this.filter.receptionDateTo = this.receptionDateTo
        this.filter.deliveryDateFrom = this.deliveryDateFrom
        this.filter.deliveryDateTo = this.deliveryDateTo
        let loader = this.$loader.show(this.$refs.wrapper)
        try {
          this.searchIsDone = true

          let result = await this.queryReport(this.filter)

          this.dataGrid.items = result.data
          this.dataGrid.total_items = result.total
          this.dataGrid.lastPage = result.lastPage
        } catch (error) {
        } finally {
          loader.hide()
        }
      }
    },
    filterReceptionStatus(categoryId) {
      this.activeCategoryId = categoryId
      this.search()
    },
    row_clicked(item) {
      this.$emit('receptionSelected', item)
    }
  }
})
</script>
