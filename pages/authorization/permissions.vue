<style lang="scss" scoped>
.grantedPermission {
  color: green;
}
.notGrantedPermission {
  color: indianred;
}
</style>

<template>
  <section>
    <v-card>
      <vr-data-grid
        :headers="headers"
        :title="title"
        :queryService="queryService"
        :filters="filters"
        :withAdd="false"
        :hideActionEdit="true"
        :hideActionDelete="true"
      >
        <template #items="{item}">
          <td>{{ item.ControllerName }}</td>
          <td>{{ item.ActionName }}</td>
          <td>
            <v-icon class="grantedPermission" v-if="item.SuperAdminGranted">done</v-icon>
            <v-icon class="notGrantedPermission" v-else>highlight_off</v-icon>
          </td>
          <td>
            <v-icon class="grantedPermission" v-if="item.AdminGranted">done</v-icon>
            <v-icon class="notGrantedPermission" v-else>highlight_off</v-icon>
          </td>
          <td>
            <v-icon class="grantedPermission" v-if="item.TechnicianGranted">done</v-icon>
            <v-icon class="notGrantedPermission" v-else>highlight_off</v-icon>
          </td>
          <td>
            <v-icon class="grantedPermission" v-if="item.SecretaryGranted">done</v-icon>
            <v-icon class="notGrantedPermission" v-else>highlight_off</v-icon>
          </td>
          <td>
            <v-icon class="grantedPermission" v-if="item.DiagnosticianDoctorGranted">done</v-icon>
            <v-icon class="notGrantedPermission" v-else>highlight_off</v-icon>
          </td>
          <td>
            <v-icon class="grantedPermission" v-if="item.TreatingDoctorGranted">done</v-icon>
            <v-icon class="notGrantedPermission" v-else>highlight_off</v-icon>
          </td>
          <td>
            <v-icon class="grantedPermission" v-if="item.PatientGranted">done</v-icon>
            <v-icon class="notGrantedPermission" v-else>highlight_off</v-icon>
          </td>
          <td>
            <v-icon class="grantedPermission" v-if="item.ShareholderGranted">done</v-icon>
            <v-icon class="notGrantedPermission" v-else>highlight_off</v-icon>
          </td>
        </template>
      </vr-data-grid>
    </v-card>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { Permission } from '~/models/Permission'
export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'Permission/List'
      )
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  data() {
    return {
      headers: [
        {
          text: this.$t('permissions.controllerName'),
          align: 'right',
          value: 'ControllerName',
          width: '10%'
        },
        {
          text: this.$t('permissions.actionName'),
          align: 'right',
          value: 'ActionName',
          width: '10%'
        },
        {
          text: this.$t('permissions.SuperAdminGranted'),
          align: 'right',
          value: 'SuperAdminGranted',
          width: '10%'
        },
        {
          text: this.$t('permissions.AdminGranted'),
          align: 'right',
          value: 'AdminGranted',
          width: '10%'
        },
        {
          text: this.$t('permissions.TechnicianGranted'),
          align: 'right',
          value: 'TechnicianGranted',
          width: '10%'
        },
        {
          text: this.$t('permissions.SecretaryGranted'),
          align: 'right',
          value: 'SecretaryGranted',
          width: '10%'
        },
        {
          text: this.$t('permissions.DiagnosticianDoctorGranted'),
          align: 'right',
          value: 'DiagnosticianDoctorGranted',
          width: '10%'
        },
        {
          text: this.$t('permissions.TreatingDoctorGranted'),
          align: 'right',
          value: 'TreatingDoctorGranted',
          width: '10%'
        },
        {
          text: this.$t('permissions.PatientGranted'),
          align: 'right',
          value: 'PatientGranted',
          width: '10%'
        },
        {
          text: this.$t('permissions.ShareholderGranted'),
          align: 'right',
          value: 'ShareholderGranted',
          width: '10%'
        }
      ],
      title: {
        text: this.$t('permissions.title'),
        icon: 'call_split'
      },
      filters: [
        {
          icon: 'la-search',
          name: 'controllerName',
          model: 'controllerName',
          label: this.$t('permissions.controllerName')
        },
        {
          icon: 'la-search',
          name: 'actionName',
          model: 'actionName',
          label: this.$t('permissions.actionName')
        }
      ],
      queryService: this.$service.authorization.permissions
    }
  }
})
</script>