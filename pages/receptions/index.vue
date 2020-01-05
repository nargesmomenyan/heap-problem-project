<style lang="scss" >
</style>

<template>
  <section>
    <v-card>
      <vr-data-grid
        :headers="headers"
        :title="title"
        :queryService="queryService"
        :deleteService="deleteService"
        :filters="filters"
        :actions="actions"
        :defaultFilters="defaultFilters"
        :withAdd="this.$authorization.check('Reception/Create')"
        :hideActionDelete="!this.$authorization.check('Reception/Delete')"
        :hideActionEdit="!this.$authorization.check('Reception/Edit')"
        :hide_page_size="true"      
        :custom_class_footer_wrapper="'custom_class_footer_wrapper'"
      >
        <template #items="{item}">
          <td>{{ item.ReceptionNumber }}</td>
          <td>{{ item.ReceptionDate|persianDate|persianDigit }}</td>
          <td>{{ item.PatientFullName }}</td>
          <td>{{ item.PatientNationalCode }}</td>
          <td>{{ item.TreatingPhysicianFullName }}</td>
          <td>{{ item.SampleCount }}</td>
          <td>{{ item.Status | enum('receptionStatus') }}</td>
          <td>{{ item.DeliveryDate | persianDate | persianDigit}}</td>
        </template>
      </vr-data-grid>
    </v-card>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { ISecretary } from '~/models/user-roles/ISecretary'
// import { VRGridFilter } from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
import { ICurrentUser } from '~/models/ICurrentUser'
import { roleEnum } from '~/enums/role'
import { IOrganization } from '~/models/Organization'

export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'Reception/List'
      )
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  data() {
    let secretaries: ISecretary[] = this.$store.state.reception.secretaries
    let filters: any[] = [
      {
        icon: 'la-search',
        type: 'textField',
        model: 'receptionNumber',
        size: 2,
        label: this.$t('reception.number').toString()
      },
      {
        icon: 'la-search',
        type: 'textField',
        model: 'patientFullName',
        size: 2,
        label: this.$t('reception.PatientName').toString()
      },
      {
        icon: 'la-search',
        type: 'date',
        model: 'receptionDateFrom',
        size: 2,
        label: this.$t('reception.receptionDateFrom').toString()
      },
      {
        icon: 'la-search',
        type: 'date',
        model: 'receptionDateTo',
        size: 2,
        label: this.$t('reception.receptionDateTo').toString()
      },
      {
        icon: 'la-search',
        type: 'date',
        model: 'deliveryDateFrom',
        size: 2,
        label: this.$t('reception.deliveryDateFrom').toString()
      },
      {
        icon: 'la-search',
        model: 'deliveryDateTo',
        type: 'date',
        size: 2,
        label: this.$t('reception.deliveryDateTo').toString()
      }
    ]
    let currentUser: ICurrentUser = this.$store.getters[
      'authentication/currentUserInfo'
    ]
    let organizations: IOrganization[] = this.$store.state.organizations
    return {
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
          text: this.$t('reception.PatientNationalCode'),
          align: 'right',
          value: 'PatientNationalCode',
          width: '10%'
        },
        {
          text: this.$t('reception.TreatingPhysicianName'),
          align: 'right',
          value: 'TreatingPhysicianFullName',
          width: '10%'
        },
        {
          text: this.$t('reception.SampleCount'),
          align: 'right',
          value: 'SampleCount',
          width: '10%'
        },
        {
          text: this.$t('reception.status'),
          align: 'right',
          value: 'Status',
          width: '10%'
        },
        {
          text: this.$t('reception.DeliveryDate'),
          align: 'right',
          value: 'DeliveryDate',
          width: '10%'
        }
      ],
      title: {
        text: this.$t('reception.reception-manage'),
        icon: 'aspect_ratio'
      },
      filters: filters,
      actions: [],
      queryService: this.$service.reception.receptionList,
      deleteService: this.$service.reception.deleteRception,
      secretaries: secretaries,
      organizations: organizations,
      currentUser: currentUser,
      defaultFilters: []
    }
  },
  async mounted() {
    if (this.currentUser && this.currentUser.RoleId == roleEnum.SuperAdmin) {
      await this.initOrganizationList()

      let filterOrganization = this.filters.find(
        x => x.model == 'organizationId'
      )
      if (filterOrganization) {
        filterOrganization.items = this.organizations
          ? this.organizations.map(item => {
              return {
                text: item.Name,
                value: item.Id
              }
            })
          : []
      }
    }

    await this.initSecretaryList()

    let filterSecretary = this.filters.find(x => x.model == 'secretaryId')
    if (filterSecretary) {
      filterSecretary.items = this.secretaries
    }
  },
  created() {
    
    this.initFilters()
  },
  methods: {
    async initOrganizationList() {
      if (!this.organizations) {
        let list = await this.$service.organization.allOrganizations()
        if (list) {
          this.organizations = list
          this.$store.commit('set_organizations', list)
        }
      }
    },
    async initSecretaryList() {
      if (!this.secretaries || this.secretaries.length === 0) {
        let list = await this.$service.role.getSecretaries()
        if (list) {
          this.$store.commit('reception/set_secretaries', list)
          this.secretaries = list
        }
      }
    },
    initFilters() {
      if (this.currentUser.RoleId == roleEnum.SuperAdmin) {
        this.filters.push({
          icon: 'la-search',
          model: 'organizationId',
          type: 'select',
          items: this.organizations
            ? this.organizations.map(item => {
                return {
                  text: item.Name,
                  value: item.Id
                }
              })
            : [],
          size: 2,
          label: this.$t('reception.organization').toString()
        })
      }

      this.filters.push({
        icon: 'la-search',
        model: 'secretaryId',
        type: 'select',
        items: this.secretaries,
        size: 2,
        label: this.$t('reception.secretary').toString()
      })
    }
  }
})
</script>