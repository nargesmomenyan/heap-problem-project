<style lang="scss" >
</style>

<template>
  <section>
    <v-card>
      <vr-data-grid
        :headers="headers"
        :title="title"
        :service="service"
        :filters="filters"
        :withAdd="this.$authorization.check('Organization/Create')"
        :hideActionEdit="!this.$authorization.check('Organization/Edit')"
        :hideActionDelete="!this.$authorization.check('Organization/Delete')"
        :hide_page_size="true"
    
        :custom_class_footer_wrapper="'custom_class_footer_wrapper'"
      >
        <template #items="{item}">
          <td>{{ item.Name }}</td>
          <td>{{ item.Domain }}</td>
          <td>{{ item.Email }}</td>
          <td>{{ item.PhoneNumber || '-' }}</td>
          <td>{{ item.Address }}</td>
          <td>{{ item.RegistrationCode || '-' }}</td>
          <td>{{ item.RegistrationDate | persianDate | persianDigit}}</td>
        </template>
      </vr-data-grid>
    </v-card>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'Organization/List'
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
          text: this.$t('organization.name'),
          align: 'right',
          value: 'Name',
          width: '20%'
        },
        {
          text: this.$t('organization.domain'),
          align: 'right',
          value: 'Domain',
          width: '10%'
        },
        {
          text: this.$t('organization.email'),
          align: 'right',
          value: 'Email',
          width: '10%'
        },
        {
          text: this.$t('organization.phoneNumber'),
          align: 'right',
          value: 'PhoneNumber',
          width: '10%'
        },
        {
          text: this.$t('organization.address'),
          align: 'right',
          value: 'Address',
          width: '30%'
        },
        {
          text: this.$t('organization.registrationCode'),
          align: 'right',
          value: 'RegistrationCode',
          width: '10%'
        },
        {
          text: this.$t('organization.registrationDate'),
          align: 'right',
          value: 'RegistrationDate',
          width: '20%'
        }
      ],
      title: {
        text: this.$t('organization.organization-manage'),
        icon: 'call_split'
      },
      filters: [
        {
          icon: 'la-search',
          name: 'name',
          model: 'name',
          label: this.$t('organization.name')
        },
        {
          icon: 'la-search',
          name: 'address',
          model: 'address',
          label: this.$t('organization.address')
        },
        {
          icon: 'la-search',
          name: 'phoneNumber',
          model: 'phoneNumber',
          label: this.$t('organization.phoneNumber')
        },
        {
          icon: 'la-search',
          name: 'registrationCode',
          model: 'registrationCode',
          label: this.$t('organization.registrationCode')
        }
      ],
      service: this.$service.organization
    }
  }
})
</script>