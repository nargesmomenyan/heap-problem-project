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
        <searchUsername :title="''" @userSelected="userSelected" :userTypeAdd="userType"></searchUsername>
      </div>
      <br />
      <div class="form-group">
        <v-text-field
          :label="$t('shareholder.sharevalue')"
          :placeholder="$t('shareholder.sharevalue')+$t('placeholder.enter')"
          name="ShaveValue"
          v-model="shareValue"
          :data-vv-as="this.$t('shareholder.sharevalue')"
          :error-messages="errors.collect('shareholder.sharevalue')"
        ></v-text-field>
        <span>{{ errors.first('ShaveValue') }}</span>
      </div>
      <div>
        <v-btn class="v-btn" @click="save">ذخیره</v-btn>
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
import { IOrganizationShareholder } from '~/models/IOrganizationShareholder'
export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'Organization/AddShareholderMember'
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
    userType: {
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
      title: this.$t('organization.add-shareholder'),
      shareValue: 0
    }
  },
  async mounted() {
    if (this.userType == 'firm')
      this.title = this.$t('organization.add-shareholder-firm').toString()
    else
      this.title = this.$t('organization.add-shareholder-individual').toString()
  },
  methods: {
    userSelected(user) {
      if (user && <UserBriefInfo>user) {
        this.userInfo = user
      }
    },
    async save() {
      if (!this.userInfo) {        
        this.$toast.error().show({customClass: 'toast-customClass error', message:'لطفا کاربر را انتخاب کنید',
                top: true})
        return
      }

      let loader = this.$loader.show(this.$refs.wrapperRole)
      try {
        let userRoles = await this.$service.role.userRoles(this.userInfo.Id)
        if (!userRoles || !userRoles.IsShareholder) {
          let userRolesTemp = Object.assign(userRoles, {})
          userRolesTemp.UserId = this.userInfo.Id
          userRolesTemp.IsShareholder = true
          let result = await this.$service.role.saveUserRoleShareholder(
            userRolesTemp
          )

          userRoles.RoleShareholderId = result.RoleShareholderId
        }

        const shareholder = {
          OrganizationId: this.organizationId,
          RoleUserId: userRoles.RoleShareholderId,
          ShareValue: this.shareValue
        } as IOrganizationShareholder
        let response = await this.$service.organization.addShareholder(
          shareholder
        )

        loader.hide()
          this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success-save').toString(),
                top: true})

        this.$emit('hide', response)
      } catch (error) {
        loader.hide()     
        this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
      }
    }
  }
})
</script>