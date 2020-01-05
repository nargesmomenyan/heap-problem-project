<style lang="scss" scoped>
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
          <v-layout row wrap>
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
import { IIndividualUser } from '../../models/IndividualUser'
export default Vue.extend({
  props: {
    dialogMode: { type: Boolean, default: false }
  },
  data() {
    let formData = [
      {
        title: this.$t('individualUser.individualUser-info'),
        rows: [
          {
            label: this.$t('individualUser.firstName'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('individualUser.firstName') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'FirstName'
          },
          {
            label: this.$t('individualUser.lastName'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('individualUser.lastName') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'LastName'
          },
          {
            label: this.$t('individualUser.nationalCode'),
            type: 'textField',
            validation: { required: true, nationalCode: true },
            placeholder: ((this.$t('individualUser.nationalCode') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'NationalCode'
          },
          {
            label: this.$t('individualUser.gender'),
            type: 'select',
            validation: { required: true },
            placeholder: ((this.$t('individualUser.gender') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Gender',
            items: this.$enum.gender.toSelect
          },
          {
            label: this.$t('individualUser.birthDate'),
            type: 'datePicker',
            validation: { required: true },
            placeholder: ((this.$t('individualUser.birthDate') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'BirthDate'
          },
          {
            label: this.$t('individualUser.userName'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('individualUser.userName') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Username'
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
          },
          {
            label: this.$t('individualUser.address'),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('individualUser.address') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Address'
          }
        ]
      }
    ]
    return {
      title: '',
      service: this.$service.individualUser,
      formData: formData,
      item: <IIndividualUser>{},
      loading: false
    }
  },
  async mounted() {
    if (!this.dialogMode) {
      if (this.$route.params.id !== 'create') {
        let loader = this.$loader.show(this.$refs.wrapperUser)
        this.item = await this.service.$get(+this.$route.params.id)
        if (this.item)
          this.title = `${this.$t('individualUser.individualUser-edit')} 
                      ${this.item.FirstName} ${this.item.LastName}`
        loader.hide()
      } else {
        this.title = this.$t('individualUser.individualUser-create') as string
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
