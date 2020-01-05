<style lang="scss" >
.autoComplete-data {
  padding-left: 15px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
<template>
  <div ref="wrapper">
    <v-card class="card_info">
      <div class="reception-form">
        <v-row>
          <v-col xs="12" md="12">
            <div class="form-first-row">
              <div>
                <div class="form-img">
                </div>

                <div class="form-title">{{$t('reception.patient-info')}}</div>
              </div>
              <div>
                <div>
                  <v-btn text class="clear-form" @click="clearForm">پاک کردن اطلاعات فرم</v-btn>
                </div>
                <div>
                  <autocomplete
                    :disabled="disabled"
                    :async="true"
                    placeholder="جستجوی اطلاعات بیمار"
                    :queryService="this.$service.role.searchPatient"
                    @selectedItem="selectedPatient"
                    ref="patientSearchControl"
                  >
                    <template #selectedData="{item}">
                      <div class="autoComplete-data">
                        <div>{{item.FirstName + ' ' + item.LastName}}</div>
                        <div>{{ item.NationalCode | persianDigit }}</div>
                      </div>
                    </template>
                    <template #data="{item}">
                      <div class="autoComplete-data">
                        <div>{{ item.FirstName + ' ' + item.LastName}}</div>
                        <div>{{ item.NationalCode | persianDigit }}</div>
                      </div>
                    </template>
                  </autocomplete>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" md="6">
            <v-text-field
              :label="$t('individualUser.firstName')"
              outlined
              v-validate="'required'"
              :disabled="disabled"
              v-model="patient.FirstName"
              name="FirstName"
              :error-messages="errors.collect('FirstName')"
              :data-vv-as="$t('individualUser.firstName')"
              autocomplete="off"
              @focus="focus==true"
              ref="firstCtrl"
            ></v-text-field>
          </v-col>

          <v-col xs="12" md="6">
            <v-text-field
              :label="$t('individualUser.lastName')"
              :disabled="disabled"
              outlined
              v-validate="'required'"
              v-model="patient.LastName"
              name="LastName"
              :error-messages="errors.collect('LastName')"
              :data-vv-as="$t('individualUser.lastName')"
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" md="6">
            <v-text-field
              :disabled="disabled"
              :label="$t('individualUser.nationalCode')"
              v-model="patient.NationalCode"
              name="NationalCode"
              outlined
              v-validate="'required'"
              :error-messages="errors.collect('NationalCode')"
              :data-vv-as="$t('individualUser.nationalCode')"
              autocomplete="off"
            ></v-text-field>
          </v-col>

          <v-col xs="12" md="6">
            <v-select
              :attach="true"
              :disabled="disabled"
              outlined
              v-validate="'required'"
              :label="$t('individualUser.gender')"
              :data-vv-as="$t('individualUser.gender')"
              name="Gender"
              :error-messages="errors.collect('Gender')"
              :items="this.$enum.gender.toSelect"
              v-model="patient.Gender"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="8" md="4">
            <vr-date-picker
              :disabled="disabled"
              autocomplete="off"
              :label="$t('individualUser.birthDate')"
              outlined
              v-validate="'required'"
              :data-vv-as="$t('individualUser.birthDate')"
              name="BirthDate"
              :error-messages="errors.collect('BirthDate')"
              v-model="patient.BirthDate"
            ></vr-date-picker>
          </v-col>

          <v-col xs="12" md="8" />
        </v-row>
        <v-row>
          <v-col xs="12" md="6">
            <v-text-field
              outlined
              :disabled="disabled_contactInfo"
              v-validate="'required|phone'"
              :label="$t('individualUser.phoneNumber')"
              v-model="patient.PhoneNumber"
              name="PhoneNumber"
              :error-messages="errors.collect('PhoneNumber')"
              :data-vv-as="$t('individualUser.phoneNumber')"
              autocomplete="off"
            ></v-text-field>
          </v-col>

          <v-col xs="12" md="6">
            <v-text-field
              outlined
              :disabled="disabled_contactInfo"
              v-validate="'required|mobile'"
              :label="$t('individualUser.mobileNumber')"
              v-model="patient.MobileNumber"
              name="MobileNumber"
              :error-messages="errors.collect('MobileNumber')"
              :data-vv-as="$t('individualUser.mobileNumber')"
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" md="12">
            <v-textarea
              outlined
              :disabled="disabled_contactInfo"
              rows="1"
              v-validate="'required'"
              :label="$t('individualUser.address')"
              :data-vv-as="$t('individualUser.address')"
              name="Address"
              :error-messages="errors.collect('Address')"
              autocomplete="off"
              v-model="patient.Address"
              class="outlined-text-area"
              @keypress.enter="setPatient"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12">
            <div class="action">
              <v-btn class="btn-text medium" v-if="state == 3" text @click="enterEditMode">
                <v-icon>la-pencil</v-icon>
                {{$t('actions.edit')}}
              </v-btn>
              <v-btn class="ex-large" v-else @click="setPatient">{{$t('actions.next-step')}}</v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>


<script lang="ts">
import Vue from 'vue'
import { IIndividualUser } from '~/models/IndividualUser'
import autocomplete from '~/components/common/autocomplete.vue'
import { IPatient } from '~/models/user-roles/IPatient'
import { IComponentState } from '~/models/base/IComponentState'

export default Vue.extend({
  components: {
    autocomplete
  },
  props: {
    patient_prop: {
      type: Object as () => IPatient,
      default: <IPatient>{ Id: 0 }
    },
    focus: {
      type: Boolean,
      default: false
    },
    isViewMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let state: number = IComponentState.new
    return {
      patient: this.patient_prop,
      state: state
    }
  },
  created() {
    this.initPatient()
  },
  watch: {
    patient_prop: {
      handler(val, oldVal) {
        this.patient = val
        this.initPatient()
      },
      deep: true
    },
    focus: {
      handler(val) {
        if (val) {
          ;(<any>this).$refs.firstCtrl.focus()
        }
      },
      deep: true
    },
    isViewMode: {
      handler() {
        if (this.isViewMode) {
          this.state = IComponentState.view
        }
      }
    }
  },
  computed: {
    disabled() {
      let result = false
      switch (this.state) {
        case IComponentState.view:
          result = true
          break

        case IComponentState.new:
          result = false
          break

        case IComponentState.edit:
          if (this.patient && this.patient.Id) {
            result = true
          } else {
            result = false
          }
          break
      }
      return result
    },
    disabled_contactInfo() {
      let result = false
      switch (this.state) {
        case IComponentState.view:
          result = true
          break

        case IComponentState.new:
        case IComponentState.edit:
          result = false
          break
      }
      return result
    }
  },
  methods: {
    enterEditMode() {
      this.state = IComponentState.edit
    },
    initPatient() {
      if (this.patient.Id) {
        if (!this.isViewMode) {
          this.state = IComponentState.edit
        }
      }
    },
    selectedPatient($event) {
      
      if ($event) {
        this.patient = $event
        this.state = IComponentState.edit
      } else {
        this.patient = <IPatient>{ Id: 0 }
        this.state = IComponentState.new
      }
      this.$emit('selectedPatient', this.patient)
    },
    async edit_contactInfo() {
      let result = true

      let loader = this.$loader.show(this.$refs.wrapper)
      try {
        let result = await this.$service.user.editContactInfo(this.patient)
        if (!result) {
          throw result
        }
      } catch (error) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          top: true,
          message: error.message || this.$t('msg.UI.fail')
        })
        result = false
      } finally {
        loader.hide()
      }

      return result
    },
    async setPatient() {
      let valid = await this.$validator.validateAll()
      if (valid) {
        let loader = this.$loader.show(this.$refs.wrapper)
        try {
          let result = false

          if (!this.patient.Id || !this.patient.RoleUserId)
            result = await this.saveUserWithRole()
          else if (this.patient.Id) {
            result = await this.edit_contactInfo()
          }
          if (result) {
            this.state = IComponentState.view
            this.$emit('submitPatientInfo', this.patient)
            this.state = IComponentState.view
          } else {
            this.$toast.error().show({
              customClass: 'toast-customClass error',
              top: true,
              message: this.$t('reception.msg.patient-save-fail').toString()
            })
          }
        } catch (error) {
          this.$toast.error().show({
            customClass: 'toast-customClass error',
            top: true,
            message: error.message || this.$t('msg.UI.fail')
          })
        } finally {
          loader.hide()
        }
      }
    },
    async saveUserWithRole() {
      let savedPatient = await this.$service.role.saveIndividualUserWithRolePatient(
        this.patient,
        {}
      )
      if (savedPatient && savedPatient.RoleUserId) {
        this.patient.Id = savedPatient.Id
        this.patient.RoleUserId = savedPatient.RoleUserId
        return true
      } else {
        return false
      }
    },
    clearForm() {
      this.patient = <IPatient>{ Id: 0 }
      ;(<any>this).$refs.patientSearchControl.clearInfo()
      this.state = IComponentState.new
      this.$emit('selectedPatient', this.patient)
    }
  }
})
</script>