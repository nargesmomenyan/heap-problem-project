<style lang="scss">
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

                <div class="form-title">اطلاعات پزشک معالج</div>
              </div>
              <div>
                <div>
                  <v-btn text class="clear-form" @click="clearForm">پاک کردن اطلاعات فرم</v-btn>
                </div>
                <div>
                  <autocomplete
                    :disabled="disabled"
                    :async="true"
                    placeholder="جستجوی اطلاعات پزشک"
                    :queryService="this.$service.treatingPhysician.search"
                    @selectedItem="selectedPhysician"
                    ref="searchControl"
                  >
                    <template #selectedData="{item}">
                      <div class="autoComplete-data">
                        <div>{{item.FirstName + ' ' + item.LastName}}</div>
                      </div>
                    </template>
                    <template #data="{item}">
                      <div class="autoComplete-data">
                        <div>{{ item.FirstName + ' ' + item.LastName}}</div>
                        <div>{{ expertiseGetTitle(item.Expertise)}}</div>
                        <div>{{ (item.MedicalSystemCode||'-')|persianDigit }}</div>
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
              :disabled="disabled"
              :label="$t('individualUser.firstName')"
              v-validate="'required'"
              v-model="treatingPhysician.FirstName"
              outlined
              name="FirstName"
              :error-messages="errors.collect('FirstName')"
              :data-vv-as="$t('individualUser.firstName')"
              @focus="focus==true"
              autocomplete="off"
              ref="firstCtrl"
            ></v-text-field>
          </v-col>
          <v-col xs="12" md="6">
            <v-text-field
              :disabled="disabled"
              outlined
              v-validate="'required'"
              :label="$t('individualUser.lastName')"
              v-model="treatingPhysician.LastName"
              name="LastName"
              :error-messages="errors.collect('LastName')"
              :data-vv-as="$t('individualUser.lastName')"
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
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
              v-model="treatingPhysician.Gender"
              autocomplete="off"
            ></v-select>
          </v-col>
          <v-col xs="12" md="6" />
        </v-row>
        <v-row>
          <v-col xs="12" md="6">
            <v-text-field
              :disabled="disabled"
              outlined
              v-validate="'phone'"
              :label="$t('individualUser.phoneNumber')"
              v-model="treatingPhysician.PhoneNumber"
              name="PhoneNumber"
              :error-messages="errors.collect('PhoneNumber')"
              :data-vv-as="$t('individualUser.phoneNumber')"
              autocomplete="off"
            ></v-text-field>
          </v-col>
          <v-col xs="12" md="6">
            <v-text-field
              :disabled="disabled"
              outlined
              v-validate="'mobile'"
              :label="$t('individualUser.mobileNumber')"
              v-model="treatingPhysician.MobileNumber"
              name="MobileNumber"
              :error-messages="errors.collect('MobileNumber')"
              :data-vv-as="$t('individualUser.mobileNumber')"
              autocomplete="off"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" md="6">
            <v-text-field
              :disabled="disabled"
              :label="$t('individualUser.role.doctorInfo.medicalSystemCode')"
              v-model="treatingPhysician.MedicalSystemCode"
              name="MedicalSystemCode"
              outlined
              v-validate="'required'"
              :error-messages="errors.collect('MedicalSystemCode')"
              autocomplete="off"
              :data-vv-as="$t('individualUser.role.doctorInfo.medicalSystemCode')"
            ></v-text-field>
          </v-col>
          <v-col xs="12" md="6">
            <v-select
            :attach="true"
              :disabled="disabled"
              :items="expertises"
              :label="$t('individualUser.role.doctorInfo.expertise')"
              v-model="treatingPhysician.Expertise"
              name="expertise"
              item-text="Title"
              item-value="Id"
              outlined
              v-validate="'required'"
              :error-messages="errors.collect('expertise')"
              :data-vv-as="$t('individualUser.role.doctorInfo.expertise')"
              autocomplete="off"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12" md12>
            <v-textarea
              :disabled="disabled"
              outlined
              :label="$t('individualUser.address')"
              rows="1"
              v-model="treatingPhysician.Address"
              class="outlined-text-area"
              autocomplete="off"
              @keypress.enter="setTreatingPhysician"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row>
          <v-col xs="12">
            <div class="action">
              <v-btn class="btn-text medium" v-if="state == 3 " text @click="enterEditMode">
                <v-icon>la-pencil</v-icon>
                {{$t('actions.edit')}}
              </v-btn>
              <v-btn
                v-else
                class="ex-large"
                @click="setTreatingPhysician"
              >{{$t('actions.next-step')}}</v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { ITreatingPhysician } from '~/models/user-roles/ITreatingPhysician'
import autocomplete from '~/components/common/autocomplete.vue'
import { IExpertise } from '~/models/IExpertise'
import expertiseSetTitle from '~/util/expertise'
import { IComponentState } from '~/models/base/IComponentState'

export default Vue.extend({
  components: { autocomplete },
  props: {
    treatingPhysician_prop: {
      default: <ITreatingPhysician>{}
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
    let stateInit: number = IComponentState.new
    return {
      treatingPhysician: this.treatingPhysician_prop,
      expertises: <IExpertise[]>[],
      state: stateInit
    }
  },
  watch: {
    treatingPhysician_prop: {
      handler(val, oldVal) {
        this.treatingPhysician = val
        this.initTreatingPhysician()
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
  created() {
    this.initTreatingPhysician()
  },
  async mounted() {
    this.expertises = await this.$service.role.doctorExpertises()
    if (this.expertises) {
      expertiseSetTitle(this.expertises, this.$i18n)
    }
  },
  computed: {
    disabled() {
      let result = false
      switch (this.state) {
        case IComponentState.view:
        case IComponentState.edit:
          result = true
          break

        case IComponentState.new:
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
    initTreatingPhysician() {
      if (this.treatingPhysician.Id) {
        if (this.isViewMode) {
          this.state = IComponentState.view
        } else {
          this.state = IComponentState.edit
        }
      }
    },
    selectedPhysician($event) {
      if ($event) {
        this.treatingPhysician = $event
        this.state = IComponentState.edit
        this.$emit('selectedTreatingPhysician', this.treatingPhysician)
      } else {
        this.clearForm()
      }
    },
    async setTreatingPhysician() {
      let loader = this.$loader.show(this.$refs.wrapper)
      try {
        let result = false
        if (this.treatingPhysician.Id) {
          result = true
        } else {
          let valid = await this.$validator.validateAll()
          if (valid) {
            result = await this.saveUserWithRole()
          }
        }

        if (result) {
          this.$emit('submitTreatingPhysicianInfo', this.treatingPhysician)
          this.state = IComponentState.view
        } else {
          this.$toast.error().show({
            customClass: 'toast-customClass error',
            message: this.$t(
              'reception.msg.treatingPhysician-save-failmsg.UI.fail'
            ).toString(),
            top: true
          })
        }
      } catch (error) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          message: error.message || this.$t('msg.UI.fail'),
          top: true
        })
      } finally {
        loader.hide()
      }
    },
    async saveUserWithRole() {
      let result = await this.$service.treatingPhysician.saveIndividualUserWithRoleTreatingPhysician(
        this.treatingPhysician
      )

      if (result && result.RoleUserId) {
        this.treatingPhysician.Id = result.Id
        this.treatingPhysician.RoleUserId = result.RoleUserId
        return true
      } else {
        return false
      }
    },
    expertiseGetTitle(expertiseId) {
      let expertiseTitle = expertiseId
      if (this.expertises) {
        let expertise = this.expertises.find(x => x.Id == expertiseId)
        if (expertise) {
          expertiseTitle = expertise.Title
        }
      }
      return expertiseTitle
    },
    clearForm() {
      this.treatingPhysician = <ITreatingPhysician>{}
      ;(<any>this).$refs.searchControl.clearInfo()
      this.state = IComponentState.new
      this.$emit('selectedTreatingPhysician', this.treatingPhysician)
    }
  }
})
</script>


