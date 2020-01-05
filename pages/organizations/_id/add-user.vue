<style lang="scss" scoped>
.wrapperRole {
  padding: 40px;
}
</style>
<template>
  <section ref="wrapperRole" class="wrapperRole">
    <div class="form-section">
      <div class="head-title">
        <h4>{{title}}</h4>
      </div>
      <div class="form-group">
        <searchUsername :title="''" @userSelected="userSelected"></searchUsername>
      </div>
      <br />
      <div class="form-group" v-if="role==='TreatingPhysician' || role === 'DiagnosticianDoctor'">
        <div class="form-group">
          <v-text-field
            single-line
            :label="$t('individualUser.role.doctorInfo.medicalSystemCode')"
            name="medicalSystemCode"
            v-model="medicalSystemCode"
            :data-vv-as="this.$t('individualUser.role.doctorInfo.medicalSystemCode')"
            :error-messages="errors.collect('individualUser.role.doctorInfo.medicalSystemCode')"
          ></v-text-field>
          <span>{{ errors.first('medicalSystemCode') }}</span>
        </div>
        <v-select
        :attach="true"
          single-line
          :label="$t('individualUser.role.doctorInfo.expertise')"
          :items="expertises"
          v-model="expertiseId"
          item-text="Title"
          item-value="Id"
          v-validate="'required'"
          name="expertise"
          :data-vv-as="this.$t('individualUser.role.doctorInfo.expertise')"
          :error-messages="errors.collect('individualUser.role.doctorInfo.expertise')"
        ></v-select>
        <span>{{ errors.first('expertise') }}</span>
      </div>
      <div class="form-group" v-if="role==='Patient'">
        <div class="form-group">
          <v-text-field
            :label="$t('individualUser.role.patientInfo.insuranceNo')"
            :placeholder="$t('individualUser.role.patientInfo.insuranceNo')"
            name="insuranceNo"
            v-model="insuranceNo"
            :data-vv-as="this.$t('individualUser.role.patientInfo.insuranceNo')"
            :error-messages="errors.collect('individualUser.role.patientInfo.insuranceNo')"
          ></v-text-field>
          <span>{{ errors.first('insuranceNo') }}</span>
        </div>
        <div class="form-group">
          <v-text-field
            :label="$t('individualUser.role.patientInfo.insuranceType')"
            :placeholder="$t('individualUser.role.patientInfo.insuranceType')"
            name="insuranceType"
            v-model="insuranceType"
            :data-vv-as="this.$t('individualUser.role.patientInfo.insuranceType')"
            :error-messages="errors.collect('individualUser.role.patientInfo.insuranceType')"
          ></v-text-field>
          <span>{{ errors.first('insuranceType') }}</span>
        </div>
        <div class="form-group">
          <v-text-field
            :label="$t('individualUser.role.patientInfo.credit')"
            :placeholder="$t('individualUser.role.patientInfo.credit')"
            name="credit"
            v-model="Expiration"
            :data-vv-as="this.$t('individualUser.role.patientInfo.credit')"
            :error-messages="errors.collect('individualUser.role.patientInfo.credit')"
          ></v-text-field>
          <span>{{ errors.first('credit') }}</span>
        </div>
      </div>
      <div>
        <v-btn class="form-group v-btn" @click="save">ذخیره</v-btn>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import searchUsername from '~/components/users/search-username.vue'
import { UserBriefInfo } from '~/models/User'
import { IExpertise } from '~/models/IExpertise'
import { IUserRoles } from '~/models/UserRole'
import expertiseSetTitle from '~/util/expertise'
export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'Organization/AddMember'
      )
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  components: { searchUsername },
  props: {
    role: {
      type: String,
      required: true
    },
    organizationId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      userInfo: <UserBriefInfo>{},
      expertises: <IExpertise[]>[],
      userRoles: <IUserRoles>{},
      title: this.$t('organization.add-user'),
      expertiseId: 0,
      medicalSystemCode: '',
      insuranceNo: '',
      insuranceType: '',
      Expiration: undefined
    }
  },
  async mounted() {
    this.title = this.$t('organization.add-user-param')
      .toString()
      .replace('{role}', this.$t(`individualUser.role.${this.role}`).toString())

    if (
      this.role === 'TreatingPhysician' ||
      this.role === 'DiagnosticianDoctor'
    ) {
      this.expertises = await this.$service.role.doctorExpertises()
      if (this.expertises) {
        expertiseSetTitle(this.expertises, this.$i18n)
      }
    }
  },
  methods: {
    userSelected(user) {
      if (user && <UserBriefInfo>user) {
        this.userInfo = user
        this.getUserRoles()
      }
    },
    async getUserRoles() {
      let loader = this.$loader.show(this.$refs.wrapperRole)
      try {
        this.userRoles = await this.$service.role.userRoles(this.userInfo.Id)
        if (this.userRoles) {
          if (
            this.role === 'TreatingPhysician' &&
            this.userRoles.IsTreatingPhysician &&
            this.userRoles.RoleTreatingPhysicianInfo
          ) {
            this.medicalSystemCode =
              this.userRoles.RoleTreatingPhysicianInfo.MedicalSystemCode || ''
            this.expertiseId =
              this.userRoles.RoleTreatingPhysicianInfo.Expertise || 0
          } else if (
            this.role === 'DiagnosticianDoctor' &&
            this.userRoles.IsDiagnosticianDoctor &&
            this.userRoles.RoleDiagnosticianDoctorInfo
          ) {
            this.medicalSystemCode =
              this.userRoles.RoleDiagnosticianDoctorInfo.MedicalSystemCode || ''
            this.expertiseId =
              this.userRoles.RoleDiagnosticianDoctorInfo.Expertise || 0
          } else if (
            this.role === 'Patient' &&
            this.userRoles.IsPatient &&
            this.userRoles.RolePatient
          ) {
          }
        }
      } catch (error) {}
      loader.hide()
    },
    async save() {
      let valid = await this.$validator.validateAll()
      if (valid) {
        let loader = this.$loader.show(this.$refs.wrapperRole)
        try {
          switch (this.role) {
            case 'Admin':
              await this.addAdminToOrganization()
              break

            case 'Secretary':
              await this.addSecretaryToOrganization()
              break

            case 'Technician':
              await this.addTechnicianToOrganization()
              break

            case 'DiagnosticianDoctor':
              await this.addDiagnosticianDoctorToOrganization()
              break

            case 'TreatingPhysician':
              await this.addTreatingPhysicianToOrganization()
              break

            case 'Patient':
              await this.addPatientToOrganization()
              break
          }
          loader.hide()
            this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success-save').toString(),
                top: true})
          
          this.$emit('hide', 'success')
        } catch (error) {
          loader.hide()
          this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
        }
      }
    },
    async addAdminToOrganization() {
      if (!this.userRoles || !this.userRoles.IsAdmin) {
        let userRolesTemp = Object.assign(this.userRoles, {})
        userRolesTemp.UserId = this.userInfo.Id
        userRolesTemp.IsAdmin = true
        let result = await this.$service.role.saveUserRoleAdmin(userRolesTemp)
        this.userRoles.RoleAdminId = result.RoleAdminId
      }
      if (this.userRoles.RoleAdminId) {
        await this.$service.organization.addUser(
          this.organizationId,
          this.userRoles.RoleAdminId
        )
      }
    },
    async addTechnicianToOrganization() {
      if (!this.userRoles || !this.userRoles.IsTechnician) {
        let userRolesTemp = Object.assign(this.userRoles, {})
        userRolesTemp.UserId = this.userInfo.Id
        userRolesTemp.IsTechnician = true
        let result = await this.$service.role.saveUserRoleTechnician(
          userRolesTemp
        )
        this.userRoles.RoleTechnicianId = result.RoleTechnicianId
      }

      if (this.userRoles.RoleTechnicianId) {
        await this.$service.organization.addUser(
          this.organizationId,
          this.userRoles.RoleTechnicianId
        )
      }
    },
    async addSecretaryToOrganization() {
      if (!this.userRoles || !this.userRoles.IsTechnician) {
        let userRolesTemp = Object.assign(this.userRoles, {})
        userRolesTemp.UserId = this.userInfo.Id
        userRolesTemp.IsSecretary = true

        let result = await this.$service.role.saveUserRoleSecretary(
          userRolesTemp
        )
        this.userRoles.RoleSecretaryId = result.RoleSecretaryId
      }

      if (this.userRoles.RoleSecretaryId) {
        await this.$service.organization.addUser(
          this.organizationId,
          this.userRoles.RoleSecretaryId
        )
      }
    },
    async addDiagnosticianDoctorToOrganization() {
      if (!this.userRoles || !this.userRoles.IsDiagnosticianDoctor) {
        let userRolesTemp = Object.assign(this.userRoles, {})
        userRolesTemp.UserId = this.userInfo.Id
        userRolesTemp.IsDiagnosticianDoctor = true
        userRolesTemp.RoleDiagnosticianDoctorInfo = {
          MedicalSystemCode: this.medicalSystemCode,
          Expertise: this.expertiseId
        }

        let result = await this.$service.role.saveUserRoleDiagnosticianDoctor(
          userRolesTemp
        )
        this.userRoles.RoleDiagnosticianDoctorId =
          result.RoleDiagnosticianDoctorId
      }

      if (this.userRoles.RoleDiagnosticianDoctorId) {
        await this.$service.organization.addUser(
          this.organizationId,
          this.userRoles.RoleDiagnosticianDoctorId
        )
      }
    },
    async addTreatingPhysicianToOrganization() {
      if (!this.userRoles || !this.userRoles.IsTreatingPhysician) {
        let userRolesTemp = Object.assign(this.userRoles, {})
        userRolesTemp.UserId = this.userInfo.Id
        userRolesTemp.IsTreatingPhysician = true
        userRolesTemp.RoleTreatingPhysicianInfo = {
          MedicalSystemCode: this.medicalSystemCode,
          Expertise: this.expertiseId
        }

        let result = await this.$service.role.saveUserRoleTreatingPhysician(
          userRolesTemp
        )
        this.userRoles.RoleTreatingPhysicianId = result.RoleTreatingPhysicianId
      }

      if (this.userRoles.RoleTreatingPhysicianId) {
        await this.$service.organization.addUser(
          this.organizationId,
          this.userRoles.RoleTreatingPhysicianId
        )
      }
    },
    async addPatientToOrganization() {
      if (!this.userRoles || !this.userRoles.IsPatient) {
        let userRolesTemp = Object.assign(this.userRoles, {})
        userRolesTemp.UserId = this.userInfo.Id
        userRolesTemp.IsPatient = true
        userRolesTemp.RolePatient = {
          InsuranceNo: this.insuranceNo,
          InsuranceType: this.insuranceType,
          Expiration: this.Expiration
        }

        let result = await this.$service.role.saveUserRolePatient(userRolesTemp)
        this.userRoles.RolePatientId = result.RolePatientId
      }

      if (this.userRoles.RolePatientId) {
        await this.$service.organization.addUser(
          this.organizationId,
          this.userRoles.RolePatientId
        )
      }
    }
  }
})
</script>