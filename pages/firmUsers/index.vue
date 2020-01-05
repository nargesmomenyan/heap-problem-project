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
        :actions="actions"
        :withAdd="this.$authorization.check('FirmUser/Create')"
        :hideActionEdit="!this.$authorization.check('FirmUser/Edit')"
        :hideActionDelete="!this.$authorization.check('FirmUser/Delete')"
        :hide_page_size="true"
        :custom_class_footer_wrapper="'custom_class_footer_wrapper'"
      >
        <template #items="{item}">
          <td>{{ item.Name }}</td>
          <td>{{ item.Username }}</td>
          <td>{{ item.EconomicCode }}</td>
          <td>{{ item.Email }}</td>
          <td>{{ item.PhoneNumber || '-' }}</td>
          <td>{{ item.MobileNumber }}</td>
          <td>{{ item.RegistrationCode || '-' }}</td>
          <td>{{ item.RegistrationDate | persianDate | persianDigit}}</td>
        </template>
      </vr-data-grid>
    </v-card>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import resetPassword from '~/components/users/reset-password.vue'
import { VRGridAction } from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'FirmUser/List'
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
          text: this.$t('firmUser.name'),
          align: 'right',
          value: 'Name',
          width: '20%'
        },
        {
          text: this.$t('firmUser.userName'),
          align: 'right',
          value: 'Username',
          width: '10%'
        },
        {
          text: this.$t('firmUser.economicCode'),
          align: 'right',
          value: 'EconomicCode',
          width: '10%'
        },
        {
          text: this.$t('firmUser.email'),
          align: 'right',
          value: 'Email',
          width: '10%'
        },
        {
          text: this.$t('firmUser.phoneNumber'),
          align: 'right',
          value: 'PhoneNumber',
          width: '10%'
        },
        {
          text: this.$t('firmUser.mobileNumber'),
          align: 'right',
          value: 'MobileNumber',
          width: '30%'
        },
        {
          text: this.$t('firmUser.registrationCode'),
          align: 'right',
          value: 'RegistrationCode',
          width: '10%'
        },
        {
          text: this.$t('firmUser.registrationDate'),
          align: 'right',
          value: 'RegistrationDate',
          width: '20%'
        }
      ],
      title: {
        text: this.$t('firmUser.firmUser-manage'),
        icon: 'call_split'
      },
      filters: [
        {
          icon: 'la-search',
          name: 'nameSubstring',
          model: 'nameSubstring',
          label: this.$t('firmUser.name')
        },
        {
          icon: 'la-search',
          name: 'userName',
          model: 'userName',
          label: this.$t('firmUser.userName')
        },
        {
          icon: 'la-search',
          name: 'email',
          model: 'email',
          label: this.$t('firmUser.email')
        },
        {
          icon: 'la-search',
          name: 'phoneNumber',
          model: 'phoneNumber',
          label: this.$t('firmUser.phoneNumber')
        }
      ],
      actions: <VRGridAction[]>[],
      service: this.$service.firmUser
    }
  },
  mounted() {
    if (this.$authorization.check('User/ResetPassword')) {
      this.actions.push({
        icon: 'vpn_key',
        title: this.$t('users.resetPassword').toString(),
        cb: this.resetPassword
      })
    }
  },
  methods: {
    resetPassword($event) {
      this.$dialog.show({
        component: resetPassword,
        props: {
          userId: $event.Id,
          userDisplayName: $event.Name
        }
      })
    }
  }
})
</script>