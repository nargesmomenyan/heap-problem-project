<style lang="scss">
.container {
  background: #fff;

  .v-btn {
    float: left;
  }
}
</style>

<template>
  <section ref="wrapperOrganization">
    <v-layout row wrap class="container">
      <v-flex xs2></v-flex>
      <v-flex xs8>
        <v-form-generator v-model="item" :formData="formData"></v-form-generator>
        <div>
          <v-btn @click="save">ذخیره</v-btn>
        </div>
      </v-flex>
      <v-flex xs2></v-flex>
    </v-layout>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { IOrganization } from '~/models/Organization'
import { AxiosResponse } from 'axios'
export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = false
      if (isNaN(+to.params.id)) {
        result = vm.$store.getters['authorization/isAuthorized'](
          'Organization/Create'
        )
      } else {
        result = vm.$store.getters['authorization/isAuthorized'](
          'Organization/Edit'
        )
      }
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  data() {
    let formData = [
      {
        title: this.$t('organization.organization-info'),
        rows: [
          {
            label: this.$t('organization.name'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('organization.name') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Name'
          },
          {
            label: this.$t('organization.domain'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('organization.domain') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Domain'
          },
          {
            label: this.$t('organization.email'),
            type: 'textField',
            validation: { required: true, email: true },
            placeholder: ((this.$t('organization.email') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Email'
          },
          {
            label: this.$t('organization.address'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('organization.address') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Address'
          },
          {
            label: this.$t('organization.phoneNumber'),
            type: 'textField',
            validation: { required: true, phone: true },
            placeholder: ((this.$t('organization.phoneNumber') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'PhoneNumber'
          },
          {
            label: this.$t('organization.website'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('organization.website') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Website'
          },
          {
            label: this.$t('organization.registrationCode'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('organization.registrationCode') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'RegistrationCode'
          },
          {
            label: this.$t('organization.economicCode'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('organization.economicCode') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'EconomicCode'
          },
          {
            label: this.$t('organization.nationalCode') as string,
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('organization.nationalCode') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'NationalCode'
          },
          {
            label: this.$t('organization.registrationDate'),
            type: 'datePicker',
            validation: { required: true },
            placeholder: ((this.$t('organization.registrationDate') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'RegistrationDate'
          }
        ]
      }
    ]
    return {
      formData: formData,
      item: <IOrganization>{}
    }
  },
  async mounted() {
    if (this.$route.params.id && this.$route.params.id != 'create') {
      const loader = this.$loader.show(this.$refs.wrapperOrganization)
      this.item = await this.$service.organization.$get(+this.$route.params.id)
      loader.hide()
    }
  },
  methods: {
    save() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          let result: Promise<AxiosResponse<IOrganization>>
          if (this.item.id) {
            result = this.$service.organization.update(this.item.id, this.item)
          } else {
            result = this.$service.organization.save(this.item)
          }
          result
            .then(() =>              
                this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('با موفقیت ذخیره شد').toString(),
                top: true})
            )
            .catch(error => {
              this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
            })
        }
      })
    }
  }
})
</script>
