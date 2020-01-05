<style lang="scss" scoped>
.container {
  background: #fff;
}
.btn-action {
  float: left;
}
</style>

<template>
  <div ref="wrapper">
    <v-container grid-list-mdclass="form-section">
      <v-layout row wrap>
        <v-flex xs1></v-flex>
        <v-flex xs10>
          <v-card>
            <v-card-title>
              <h3>{{$t('individualUser.individualUser-Roles')}} {{title}}</h3>
            </v-card-title>
            <v-card-text>
              <v-layout row class="form-group">
                <v-flex xs2>
                  <v-checkbox
                    v-model="item.IsSuperAdmin"
                    :label="$t('individualUser.role.SuperAdmin')"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs2>
                  <v-checkbox v-model="item.IsAdmin" :label="$t('individualUser.role.Admin')"></v-checkbox>
                </v-flex>
                <v-flex xs2>
                  <v-checkbox
                    v-model="item.IsTechnician"
                    :label="$t('individualUser.role.Technician')"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs2>
                  <v-checkbox
                    v-model="item.IsSecretary"
                    :label="$t('individualUser.role.Secretary')"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs2>
                  <v-checkbox
                    v-model="item.IsShareholder"
                    :label="$t('individualUser.role.Shareholder')"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs2>
                  <v-checkbox v-model="item.IsPatient" :label="$t('individualUser.role.Patient')"></v-checkbox>
                </v-flex>
              </v-layout>
              <v-layout row class="form-group">
                <v-flex xs2>
                  <v-checkbox
                    v-model="item.IsDiagnosticianDoctor"
                    :label="$t('individualUser.role.DiagnosticianDoctor')"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs2>
                  <v-checkbox
                    v-model="item.IsTreatingPhysician"
                    :label="$t('individualUser.role.TreatingPhysician')"
                  ></v-checkbox>
                </v-flex>
                <v-flex xs1>
                  <div class="caption-label">
                    <label>{{$t('individualUser.role.doctorInfo.medicalSystemCode')}}</label>
                  </div>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    outlined
                    :disabled="!item.IsDiagnosticianDoctor && !item.IsTreatingPhysician"
                    single-line
                    :placeholder="$t('individualUser.role.doctorInfo.medicalSystemCode')"
                    name="medicalSystemCode"
                    v-model="medicalSystemCode"
                    :data-vv-as="this.$t('individualUser.role.doctorInfo.medicalSystemCode')"
                    :error-messages="errors.collect('individualUser.role.doctorInfo.medicalSystemCode')"
                  ></v-text-field>
                </v-flex>
                <v-flex xs1>
                  <div class="caption-label">
                    <label>{{$t('individualUser.role.doctorInfo.expertise')}}</label>
                  </div>
                </v-flex>
                <v-flex xs2>
                  <div v-if="!item.IsDiagnosticianDoctor">
                    <v-select
                    :attach="true"
                      outlined
                      single-line
                      :disabled="!item.IsDiagnosticianDoctor && !item.IsTreatingPhysician"
                      :placeholder="$t('individualUser.role.doctorInfo.expertise')"
                      :items="expertises"
                      v-model="expertiseId"
                      item-text="Title"
                      item-value="Id"
                      v-validate="'required'"
                      name="expertise"
                      :data-vv-as="this.$t('individualUser.role.doctorInfo.expertise')"
                      :error-messages="errors.collect('individualUser.role.doctorInfo.expertise')"
                    ></v-select>
                  </div>
                </v-flex>
                <v-flex xs2 />
              </v-layout>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn class="btn-action" @click="save">ذخیره</v-btn>
            </v-card-actions>
          </v-card>
          <!-- <v-form-generator v-model="item" :formData="formData" ref="form" :onChange="onChange"></v-form-generator> -->
          <div></div>
        </v-flex>
        <v-flex xs1></v-flex>
      </v-layout>
    </v-container>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { IUserRoles } from '~/models/UserRole'
import { VRFormData } from 'vrwebdesign-nuxt/modules/nuxt-form-generator/types'
import { IExpertise } from '~/models/IExpertise'
import expertiseSetTitle from '~/util/expertise'
export default Vue.extend({
  data() {
    return {
      item: <IUserRoles>{
        RoleDiagnosticianDoctorInfo: {},
        RoleTreatingPhysicianInfo: {},
        RolePatient: {}
      },
      expertises: <IExpertise[]>[],
      expertiseId: 0,
      medicalSystemCode: '',
      title: ''
    }
  },
  async mounted() {
    let loader = this.$loader.show(this.$refs.wrapper)

    this.item = await this.$service.role.userRoles(+this.$route.params.id)
    this.title = this.item.DisplayName || ''

    this.expertises = await this.$service.role.doctorExpertises()
    if (this.expertises) {
      expertiseSetTitle(this.expertises, this.$i18n)
    }
    loader.hide()
  },
  methods: {
    async save() {
      let valid = await this.$validator.validateAll()
      if (valid) {
        let loader = this.$loader.show(this.$refs.wrapper)
        if (this.item.IsDiagnosticianDoctor) {
          this.item.RoleDiagnosticianDoctorInfo = {
            Expertise: this.expertiseId,
            MedicalSystemCode: this.medicalSystemCode
          }
        }

        if (this.item.IsTreatingPhysician) {
          this.item.RoleTreatingPhysicianInfo = {
            Expertise: this.expertiseId,
            MedicalSystemCode: this.medicalSystemCode
          }
        }
        try {
          await this.$service.role.saveUserRoles(this.item)          
          this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success').toString(),
                top: true})
        } catch (error) {
          this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
        } finally {
          loader.hide()
        }
      }
    }
  }
})
</script>
