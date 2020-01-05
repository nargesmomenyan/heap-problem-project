<template>
  <section ref="wrapper">
    <profileComponent :item="item" :formData="formData" :userDisplayName="userDisplayName"></profileComponent>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { IIndividualUser } from '~/models/IndividualUser'
import { VRFormData } from 'vrwebdesign-nuxt/modules/nuxt-form-generator/types'
import resetPassword from '~/components/users/reset-password.vue'
import profileComponent from '~/components/users/profile.vue'

export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'IndividualUser/ViewMe'
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
            label: this.$t('individualUser.firstName'),
            type: 'textField',
            model: 'FirstName',
            disabled: true
          },
          {
            label: this.$t('individualUser.lastName'),
            type: 'textField',
            model: 'LastName',
            disabled: true
          },
          {
            label: this.$t('individualUser.nationalCode'),
            type: 'textField',
            model: 'NationalCode',
            disabled: true
          },
          {
            label: this.$t('individualUser.gender'),
            type: 'select',
            model: 'Gender',
            items: this.$enum.gender.toSelect,
            disabled: true
          },
          {
            label: this.$t('individualUser.birthDate'),
            type: 'datePicker',
            model: 'BirthDate',
            disabled: true
          },
          {
            label: this.$t('individualUser.userName'),
            type: 'textField',
            model: 'Username',
            disabled: true
          },
          {
            label: this.$t('individualUser.address'),
            type: 'textField',
            model: 'Address',
            disabled: true
          },
          {
            label: this.$t('individualUser.email'),
            type: 'textField',
            validation: { required: true, email: true },
            placeholder: ((this.$t('individualUser.email') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Email'
          },
          {
            label: this.$t('individualUser.phoneNumber'),
            type: 'textField',
            validation: { required: true, phone: true },
            placeholder: ((this.$t('individualUser.phoneNumber') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'PhoneNumber'
          },
          {
            label: this.$t('individualUser.mobileNumber'),
            type: 'textField',
            validation: { required: true, mobile: true },
            placeholder: ((this.$t('individualUser.mobileNumber') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'MobileNumber'
          }
        ]
      }
    ]
    return {
      title: '',
      formData: formData,
      item: <IIndividualUser>{},
      userDisplayName: ''
    }
  },
  async mounted() {
    let loader = this.$loader.show(this.$refs.wrapper)
    try {
      this.item = await this.$service.individualUser.profile()
      if (this.item) {
        this.userDisplayName = this.item.FirstName + ' ' + this.item.LastName
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
