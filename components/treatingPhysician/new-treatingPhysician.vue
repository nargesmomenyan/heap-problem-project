<style lang="scss">
.wrapperUser {
  width: 450px;
  padding: 20px;
}
.v-btn-save {
  float: left;
}
</style>

<template>
  <section ref="wrapperUser" class="wrapperUser">
    <v-layout row wrap>
      <v-flex xs12>
        <v-form-generator v-model="item" :formData="formData" :minimal="true"></v-form-generator>
        <div>
          <v-btn class="v-btn-save" @click="save">ذخیره</v-btn>
        </div>
      </v-flex>
    </v-layout>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { ITreatingPhysician } from '~/models/user-roles/ITreatingPhysician'
import { VRFormData } from 'vrwebdesign-nuxt/modules/nuxt-form-generator/types/index'
import expertiseSetTitle from '~/util/expertise'
import { IExpertise } from '~/models/IExpertise'

export default Vue.extend({
  data() {
    return {
      title: '',
      formData: <VRFormData>[],
      item: <ITreatingPhysician>{},
      expertises: <IExpertise[]>[]
    }
  },
  async mounted() {
    let loader = this.$loader.show(this.$refs.wrapperUser)
    try {
      this.expertises = await this.$service.role.doctorExpertises()
      if (this.expertises) {
        expertiseSetTitle(this.expertises, this.$i18n)
      }
    } catch (error) {
    } finally {
      loader.hide()
    }

    this.formData = [
      {
        title: this.$t(
          'individualUser.role.treatingPhysicianInfo.title'
        ).toString(),

        rows: [
          {
            label: this.$t('individualUser.firstName').toString(),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('individualUser.firstName') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'FirstName'
          },
          {
            label: this.$t('individualUser.lastName').toString(),
            type: 'textField',
            validation: { required: true },
            placeholder: ((this.$t('individualUser.lastName') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'LastName'
          },
          {
            label: this.$t('individualUser.gender').toString(),
            type: 'select',
            validation: { required: true },
            placeholder: ((this.$t('individualUser.gender') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Gender',
            items: this.$enum.gender.toSelect
          },
          {
            label: this.$t('individualUser.phoneNumber').toString(),
            type: 'textField',
            validation: { phone: true },
            placeholder: ((this.$t('individualUser.phoneNumber') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'PhoneNumber'
          },
          {
            label: this.$t('individualUser.mobileNumber').toString(),
            type: 'textField',
            validation: { mobile: true },
            placeholder: ((this.$t('individualUser.mobileNumber') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'MobileNumber'
          },
          {
            label: this.$t('individualUser.address').toString(),
            type: 'textField',
            placeholder: ((this.$t('individualUser.address') as string) +
              this.$t('placeholder.enter')) as string,
            model: 'Address'
          },
          {
            label: this.$t(
              'individualUser.role.doctorInfo.medicalSystemCode'
            ).toString(),
            type: 'textField',
            placeholder: ((this.$t(
              'individualUser.role.doctorInfo.medicalSystemCode'
            ) as string) + this.$t('placeholder.enter')) as string,
            model: 'MedicalSystemCode'
          },
          {
            label: this.$t(
              'individualUser.role.doctorInfo.expertise'
            ).toString(),
            type: 'select',
            validation: { required: true },
            placeholder: ((this.$t(
              'individualUser.role.doctorInfo.expertise'
            ) as string) + this.$t('placeholder.enter')) as string,
            model: 'Expertise',
            items: this.expertises,
            select_text: 'Title',
            select_value: 'Id'
          }
        ]
      }
    ]
  },
  methods: {
    async save() {
      this.$validator.validateAll().then(async valid => {
        if (valid) {
          let loader = this.$loader.show(this.$refs.wrapperUser)

          this.$service.treatingPhysician
            .saveIndividualUserWithRoleTreatingPhysician(this.item)
            .then(data => {              
                this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success').toString(),
                top: true})
              loader.hide()

              let treatingPhysician: ITreatingPhysician = data
              if (this.expertises) {
                let expertise = this.expertises.find(
                  x => x.Id === treatingPhysician.Expertise
                )
                if (expertise) {
                  treatingPhysician.ExpertiseTitle = expertise.Title
                }
              }
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
