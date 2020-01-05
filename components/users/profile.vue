<style lang="scss" scoped>
.container {
  background: #fff;

  .v-btn {
    float: left;
  }
}
</style>

<template>
  <section>
    <v-layout row wrap class="container">
      <v-flex xs1></v-flex>
      <v-flex xs10>
        <div ref="wrapperInfo">
          <v-form-generator v-model="user" :formData="formData"></v-form-generator>
          <div v-if="this.$authorization.check('User/ResetMyPassword')">
            <v-btn class="v-btn" @click="resetPassword">دریافت رمز عبور جدید</v-btn>
          </div>
          <div>
            <v-btn class="v-btn" @click="save">{{this.$t('actions.save')}}</v-btn>
          </div>
        </div>
        <br />
        <br />
        <br />
        <div class="form-section" ref="setting">
          <div class="head-title">
            <h3>{{$t('userProfile.login-setting')}}</h3>
          </div>
          <form v-on:submit.prevent data-vv-scope="setting">
            <div class="form-group">
              <label>{{this.$t('userProfile.login-default-organizationalRole')}}</label>
              <v-select
              :attach="true"
                outlined
                v-model="selectedId"
                :items="organizationalRoles"
                item-text="Title"
                item-value="Id"
                single-line
                v-validate="'required'"
                name="organizationalRole"
                :data-vv-as="this.$t('userProfile.login-default-organizationalRole')"
                :error-messages="errors.collect('organizationalRole')"
              ></v-select>
            </div>
            <v-btn @click="saveLoginSetting" {{this.$t('actions.save')}}</v-btn>
          </form>
        </div>
      </v-flex>
      <v-flex xs1></v-flex>
    </v-layout>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { IFirmUser } from '../../models/FirmUser'
import { VRFormData } from 'vrwebdesign-nuxt/modules/nuxt-form-generator/types'
import resetPassword from '~/components/users/reset-password.vue'
import { IOrganizationalRole } from '~/models/IOrganizationalRole'
import { ICurrentUser } from '../../models/ICurrentUser'
import { IUser } from '~/models/User'
import { IIndividualUser } from '../../models/IndividualUser'

export default Vue.extend({
  props: {
    formData: {},
    item: { type: Object as () => IUser },
    userDisplayName: {
      default: '',
      type: String
    }
  },
  components: { resetPassword },
  data() {
    let organizationalRoles: IOrganizationalRole[] = []
    return {
      user: this.item,
      rememberRole: false,
      organizationalRoles: organizationalRoles,
      selectedId: 0,
      currentUser: this.$store.getters[
        'authentication/currentUserInfo'
      ] as ICurrentUser
    }
  },
  async mounted() {
    this.organizationalRoles = this.$store.getters[
      'authentication/organizationalRoles'
    ]
    if (!this.organizationalRoles) {
      this.organizationalRoles = await this.$service.user.myOrganizationalRoles()
      this.$store.commit(
        'authentication/set_organizationalRoles',
        this.organizationalRoles
      )
    }

    let defaultOrganizationalRole
    if (this.currentUser) {
      defaultOrganizationalRole = await this.$service.user.getSetting(
        this.currentUser.UserId
      )
    }

    if (this.organizationalRoles && defaultOrganizationalRole) {
      this.setOrganizationalRolesTitle()
      this.setSelectedId(defaultOrganizationalRole)
    } else {      
      this.$toast.error().show({customClass: 'toast-customClass error', message: this.$t('msg.UI.fail-get-info').toString(),
                top: true})
    }
  },
  watch: {
    item: {
      handler() {
        this.user = this.item
      },
      deep: true
    }
  },
  methods: {
    setOrganizationalRolesTitle() {
      if (this.organizationalRoles && this.organizationalRoles.length > 0) {
        this.organizationalRoles.forEach(x => {
          x.Title =
            x.OrganizationName +
            '/' +
            this.$t(`individualUser.role.${x.RoleTitle}`)
        })
      }
    },
    setSelectedId(defaultOrganizationalRole: IOrganizationalRole) {
      if (this.organizationalRoles.length > 0) {
        let temp = this.organizationalRoles.find(
          x =>
            x.RoleId === defaultOrganizationalRole.RoleId &&
            x.OrganizationId === defaultOrganizationalRole.OrganizationId
        )
        if (temp) {
          this.selectedId = temp.Id
        }
      }
    },
    save() {
      let loader = this.$loader.show(this.$refs.wrapperInfo)
      this.$validator.validateAll().then(valid => {
        if (valid) {
          this.$service.user
            .editProfile(this.user)
            .then(() =>              
                this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success').toString(),
                top: true})
            )
            .catch(err => {
              this.$toast.error().show({customClass: 'toast-customClass error', message:err.message || this.$t('msg.UI.fail'),
                top: true})
            })
        }
      })
      loader.hide()
    },
    saveLoginSetting() {
      let loader = this.$loader.show(this.$refs.setting)
      this.$validator.validateAll('setting').then(valid => {
        if (valid) {
          const selectedItem = this.organizationalRoles.find(
            x => x.Id == this.selectedId
          )
          if (selectedItem) {
            this.$service.user
              .editSetting(this.currentUser.UserId, selectedItem)
              .then(() =>                
                  this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success').toString(),
                top: true})
              )
              .catch(error => {
                this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
              })
            loader.hide()
          }
        }
      })
    },
    resetPassword() {
      if (!this.user) return
      this.$dialog.show({
        component: resetPassword,
        props: {
          userId: 0,
          currentUser: true,
          userDisplayName: this.userDisplayName
        }
      })
    }
  }
})
</script>