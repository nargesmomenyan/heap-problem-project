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
        :watchFilters="false"
        :withAdd="this.$authorization.check('IndividualUser/Create')"
        :hideActionEdit="!this.$authorization.check('IndividualUser/Edit')"
        :hideActionDelete="!this.$authorization.check('IndividualUser/Delete')"
        :custom_class_pagination="'custom_class_pagination'"
        :hide_page_size="true"
       
        :custom_class_footer_wrapper="'custom_class_footer_wrapper'"
      >
        <template #items="{item}">
          <td>{{ item.FirstName }}</td>
          <td>{{ item.LastName }}</td>
          <td>{{ item.NationalCode }}</td>
          <td>{{ item.Username }}</td>
          <td>{{ item.Email }}</td>
          <td>{{ item.Gender| enum('gender') }}</td>
          <td>{{ item.PhoneNumber || '-' }}</td>
          <td>{{ item.MobileNumber }}</td>
          <td>{{ item.BirthDate | persianDate | persianDigit}}</td>
        </template>
      </vr-data-grid>
    </v-card>
  </section>
</template>

<script>
import resetPassword from '~/components/users/reset-password.vue'
export default {
  components: { resetPassword },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'IndividualUser/List'
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
          text: this.$t('individualUser.firstName'),
          align: 'right',
          value: 'FirstName',
          width: '20%'
        },
        {
          text: this.$t('individualUser.lastName'),
          align: 'right',
          value: 'LastName',
          width: '20%'
        },
        {
          text: this.$t('individualUser.nationalCode'),
          align: 'right',
          value: 'NationalCode',
          width: '10%'
        },
        {
          text: this.$t('individualUser.userName'),
          align: 'right',
          value: 'Username',
          width: '10%'
        },
        {
          text: this.$t('individualUser.email'),
          align: 'right',
          value: 'Email',
          width: '10%'
        },
        {
          text: this.$t('individualUser.gender'),
          align: 'right',
          value: 'Gender',
          width: '10%'
        },
        {
          text: this.$t('individualUser.phoneNumber'),
          align: 'right',
          value: 'PhoneNumber',
          width: '10%'
        },
        {
          text: this.$t('individualUser.mobileNumber'),
          align: 'right',
          value: 'MobileNumber',
          width: '30%'
        },
        {
          text: this.$t('individualUser.birthDate'),
          align: 'right',
          value: 'BirthDate',
          width: '20%'
        }
      ],
      title: {
        text: this.$t('individualUser.individualUser-manage'),
        icon: 'perm_identity'
      },
      filters: [
        {
          icon: 'la-search',
          name: 'firstName',
          model: 'firstName',
          size: 2,
          label: this.$t('individualUser.firstName')
        },
        {
          icon: 'la-search',
          name: 'lastName',
          model: 'lastName',
          size: 2,
          label: this.$t('individualUser.lastName')
        },
        {
          icon: 'la-search',
          name: 'nationalCode',
          model: 'nationalCode',
          size: 2,
          label: this.$t('individualUser.nationalCode')
        },
        {
          icon: 'la-search',
          name: 'birthDateFrom',
          model: 'birthDateFrom',
          size: 2,
          type: 'date',
          label: this.$t('individualUser.birthDateFrom')
        },
        {
          icon: 'la-search',
          name: 'birthDateTo',
          model: 'birthDateTo',
          size: 2,
          type: 'date',
          label: this.$t('individualUser.birthDateTo')
        }
      ],
      actions: [
        {
          icon: 'check_circle_outline',
          title: 'مدیریت نقش کاربر',
          cb: this.manageUserRole
        }
      ],
      service: this.$service.individualUser
    }
  },
  mounted() {
    if (this.$authorization.check('User/ResetPassword')) {
      this.actions.push({
        icon: 'vpn_key',
        title: this.$t('users.resetPassword'),
        cb: this.resetPassword
      })
    }
  },
  methods: {
    manageUserRole($event) {
      this.$router.push(`/individualUsers/manageUserRoles/${$event.Id}`)
    },
    resetPassword($event) {
      this.$dialog.show({
        component: resetPassword,
        props: {
          userId: $event.Id,
          userDisplayName: $event.FirstName + ' ' + $event.LastName
        },
        title: this.$t('individualUser.resetPassword').toString(),
        ok_txt: this.$t('msg.UI.success').toString(),
        type: 'info'
      })
    }
  }
}
</script>