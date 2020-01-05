<template>
  <section ref="wrapper">
    <profileComponent :item="item" :formData="formData" :userDisplayName="userDisplayName"></profileComponent>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { IFirmUser } from '~/models/FirmUser'
import { VRFormData } from 'vrwebdesign-nuxt/modules/nuxt-form-generator/types'
import resetPassword from '~/components/users/reset-password.vue'
import profileComponent from '~/components/users/profile.vue'

export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'FirmUser/ViewMe'
      )
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  components: { resetPassword, profileComponent },
  data() {
    let formData = [
      {
        title: this.$t('userProfile.title'),
        rows: [
          {
            label: this.$t('firmUser.name'),
            type: 'textField',
            validation: { required: true },
            model: 'Name',
            disabled: true
          },
          {
            label: this.$t('firmUser.userName'),
            type: 'textField',
            validation: { required: true },
            model: 'Username',
            disabled: true
          },
          {
            label: this.$t('firmUser.economicCode'),
            type: 'textField',
            validation: { required: true },
            model: 'EconomicCode',
            disabled: true
          },
          {
            label: this.$t('firmUser.registrationCode'),
            type: 'textField',
            validation: { required: true },
            model: 'RegistrationCode',
            disabled: true
          },
          {
            label: this.$t('firmUser.registrationDate'),
            type: 'datePicker',
            validation: { required: true },
            model: 'RegistrationDate',
            disabled: true
          },
          {
            label: this.$t('firmUser.address'),
            type: 'textField',
            validation: { required: true },
            model: 'Address',
            disabled: true
          },
          {
            label: this.$t('firmUser.email'),
            type: 'textField',
            validation: { required: true, email: true },
            placeholder: ((this.$t('firmUser.email') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Email'
          },
          {
            label: this.$t('firmUser.phoneNumber'),
            type: 'textField',
            validation: { required: true, phone: true },
            placeholder: ((this.$t('firmUser.phoneNumber') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'PhoneNumber'
          },
          {
            label: this.$t('firmUser.mobileNumber'),
            type: 'textField',
            validation: { required: true, mobile: true },
            placeholder: ((this.$t('firmUser.mobileNumber') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'MobileNumber'
          }
        ]
      }
    ]
    return {
      formData: formData,
      item: <IFirmUser>{},
      userDisplayName: ''
    }
  },
  async mounted() {
    let loader = this.$loader.show(this.$refs.wrapper)
    try {
      this.item = await this.$service.firmUser.profile()
      if (this.item) {
        this.userDisplayName = this.item.Name
      }
    } catch (error) {
      this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
    } finally {
      loader.hide()
    }
  }
})
</script>
