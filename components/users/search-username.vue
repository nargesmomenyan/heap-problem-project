<style lang="scss" scoped>
.form-section {
  width: 100%;
}
</style>
<template>
  <div class="form-section" ref="wrapperSearch">
    <div class="head-title">
      <h4 v-if="title">{{title}}</h4>
    </div>
    <br/>
    <div class="form-group">
      <v-text-field
        filled
        ref="username"
        type="text"
        :label="$t('individualUser.userName')"
        placeholder="نام کاربری را کامل وارد کنید"
        v-bind="$attrs"
        v-model="username"
        append-icon="search"
        @click:append="search"
        :append-outer-icon="withAdd===true?'add':''"
        @click:append-outer="addNewUser"
      >
      </v-text-field>
    </div>    
    <div class="form-group">
      <v-chip>
        <v-icon>account_circle</v-icon>
        {{user.DisplayName||'--------- ----------'}}
      </v-chip>
   
      <v-chip>
        <span>{{caption}}</span>
        <span>{{user.NationalCode_RegistrationCode||'-----------'}}</span>
      </v-chip>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { UserBriefInfo } from '~/models/User'
import newEditIndividualUser from './new-edit-individual-user.vue'
import newEditFirmUser from './new-edit-firm-user.vue'
import { IIndividualUser } from '../../models/IndividualUser'
import { IFirmUser } from '../../models/FirmUser'

export default Vue.extend({
  props: {
    title: { type: String, default: 'جستجوی کاربر' },
    withAdd: { type: Boolean, default: true },
    userTypeAdd: { type: String, default: 'individual' }
  },
  data() {
    return {
      username: '',
      user: <UserBriefInfo>{},
      caption: ' کدملی/ کدثبت '
    }
  },
  mounted() {
    (<any>this).$refs.username.focus()
  },
  methods: {
    async search() {
      if (!this.username) return

      let loader = this.$loader.show(this.$refs.wrapperSearch)
      this.$service.user
        .search_userName(this.username)
        .then(res => {
          this.user = res
          this.$emit('userSelected', this.user)
        })
        .catch(error => {
          this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})

          this.user = <UserBriefInfo>{}
        })
      loader.hide()
    },
    addNewUser() {
      if (this.userTypeAdd === 'individual') {
        this.newIndividualUser()
      } else {
        this.newFirmUser()
      }
    },
    newIndividualUser() {
      this.$dialog
        .show({
          title: '',
          component: newEditIndividualUser,
          props: {
            dialogMode: true
          }
        })
        .then(data => {
          if (data && <IIndividualUser>data) {
            const individualUser = <IIndividualUser>data
            this.user = {
              Username: individualUser.Username || '',
              Id: individualUser.Id,
              NationalCode_RegistrationCode: individualUser.NationalCode,
              DisplayName:
                individualUser.FirstName + ' ' + individualUser.LastName
            }
            this.username = individualUser.Username || ''
            this.$emit('userSelected', this.user)
          }
        })
        .catch(error=>{
          console.log(error)
        })
    },
    newFirmUser() {
      this.$dialog
        .show({
          title: '',
          component: newEditFirmUser,
          props: {
            dialogMode: true
          }
        })
        .then(data => {
          if (data && <IFirmUser>data) {
            const firmUser = <IFirmUser>data
            this.user = {
              Username: firmUser.Username||'',
              Id: firmUser.Id,
              NationalCode_RegistrationCode: firmUser.RegistrationCode,
              DisplayName: firmUser.Name
            }
            this.username = firmUser.Username||''
            this.$emit('userSelected', this.user)
          }
        })
    }
  }
})
</script>


