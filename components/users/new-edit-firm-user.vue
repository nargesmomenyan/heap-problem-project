<style lang="scss">
.wrapper {
  width: 500px;
  height: 850px;
  padding: 20px;
}
.v-btn-save {
  float: left;
}
</style>

<template>
<component :is="dialogMode?'vr-scroll-bar':'div'">
  <div :class="dialogMode?'wrapper':''">
  <section ref="wrapperUser">
    <div v-if="dialogMode">
      <v-layout row wrap ref="containerScrollBar">
        <v-flex xs12>
          <v-form-generator v-model="item" :formData="formData" :minimal="dialogMode"></v-form-generator>
          <div>
            <v-btn class="v-btn-save" @click="save">{{$t('actions.save')}}</v-btn>
          </div>
        </v-flex>
      </v-layout>
    </div>
    <div v-else>
      <vr-form-generator
        :title="title"
        :loading="loading"
        :item="item"
        :formData="formData"
        :service="service"
      ></vr-form-generator>
    </div>
  </section>
  </div>
</component>
</template>
<script lang="ts">
import Vue from 'vue'
import { IFirmUser } from '../../models/FirmUser'
export default Vue.extend({
  props: {
    dialogMode: { type: Boolean, default: false }
  },
  data() {
    let formData = [
      {
        title: this.$t('firmUser.firmUser-info'),
        rows: [
          {
            label: this.$t('firmUser.name'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('firmUser.name') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Name'
          },
          {
            label: this.$t('firmUser.userName'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('firmUser.userName') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Username'
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
            label: this.$t('firmUser.economicCode'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('firmUser.economicCode') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'EconomicCode'
          },
          {
            label: this.$t('firmUser.registrationCode'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('firmUser.registrationCode') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'RegistrationCode'
          },
          {
            label: this.$t('firmUser.registrationDate'),
            type: 'datePicker',
            validation: { required: true },
            placeholder: ((this.$t('firmUser.registrationDate') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'RegistrationDate'
          },
          {
            label: this.$t('firmUser.address'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('firmUser.address') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Address'
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
      date: null,
      title: '',
      service: this.$service.firmUser,
      loading: this.$route.params.id ? false : true,
      formData: formData,
      item: <IFirmUser>{}
    }
  },
  async mounted() {
    if (!this.dialogMode) {
      if (this.$route.params.id !== 'create') {
        this.loading = true
        this.item = await this.service.$get(+this.$route.params.id)
        if (this.item && this.item.Name)
          this.title = `${this.$t('firmUser.firmUser-edit')} ${this.item.Name}`
        this.loading = false
      } else {
        this.title = this.$t('firmUser.firmUser-create') as string
      }
    }
  },
   methods: {
    async save() {
      this.$validator.validateAll().then(async valid => {
        if (valid) {
          let loader = this.$loader.show(this.$refs.wrapperUser)

          this.service
            .$save(this.item)
            .then(data => {
              this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success').toString(),
                top: true})
              loader.hide()
              this.$emit('hide', data)
            })
            .catch(error => {
              loader.hide()
              this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
            })
        }
      })
    }
  }
})
</script>
