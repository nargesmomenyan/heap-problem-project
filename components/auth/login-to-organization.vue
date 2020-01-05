<style lang="scss" scoped>
@import './loginStyle.scss';
.role-wrapper {
  padding: 30px;
  display: flex;
  flex-direction: column;

  .role-head {
    margin-bottom: 30px;
  }
  .role-default-check{
    padding: 0;
    margin: 0;
  }
}
</style>
<template>
  <section ref="wrapRole" class="role-wrapper">
    <div class="role-head">
      <label>انتخاب سازمان/نقش</label>
    </div>
    <v-select
      :attach="true"
      :label="$t('login.organizationalRole')"
      outlined
      v-model="selectedId"
      :items="organizationalRoles"
      item-text="Title"
      item-value="Id"
      v-validate="'required'"
      name="organizationalRole"
      :data-vv-as="this.$t('login.organizationalRole')"
      :error-messages="errors.collect('organizationalRole')"
    ></v-select>
    <v-checkbox :label="this.$t('login.rememberOrganizationalRole')" v-model="rememberRole" class="role-default-check"></v-checkbox>
    <v-btn @click="login" rounded>{{this.$t('actions.login')}}</v-btn>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { ILoginOrganization } from '~/models/Login'
import { IOrganizationalRole } from '~/models/IOrganizationalRole'
import { ICurrentUser } from '~/models/ICurrentUser'

export default Vue.extend({
  props: {},
  data() {
    let organizationalRoles: IOrganizationalRole[] = []
    return {
      selectedId: 0,
      organizationalRoles: organizationalRoles,
      rememberRole: false,
      userInfo: <ICurrentUser>{}
    }
  },
  async mounted() {
    this.organizationalRoles = this.$store.getters[
      'authentication/organizationalRoles'
    ]
    if (!this.organizationalRoles) {
      let items = await this.$service.user.myOrganizationalRoles()
      this.$store.commit('authentication/set_organizationalRoles', items)
    }

    this.userInfo = this.$store.getters[
      'authentication/currentUserInfo'
    ] as ICurrentUser

    this.setOrganizationalRolesTitle()
    this.setSelectedId()
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
    setSelectedId() {
      if (this.organizationalRoles && this.organizationalRoles.length > 0) {
        if (this.organizationalRoles && this.organizationalRoles.length > 0) {
          if (this.userInfo) {
            let temp = this.organizationalRoles.find(
              x =>
                x.RoleId === this.userInfo.RoleId &&
                x.OrganizationId === this.userInfo.OrganizationId
            )
            if (temp) {
              this.selectedId = temp.Id
            }
          }

          if (!this.selectedId || this.selectedId === 0) {
            this.selectedId = this.organizationalRoles[0].Id
          }
        }
      }
    },
    async login() {
      let loader = this.$loader.show(this.$refs.wrapRole)
      let selectedItem = this.organizationalRoles.find(
        x => x.Id === this.selectedId
      )
      if (!selectedItem) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          top: true,
          message: 'لطفا سازمان/ نقش مورد نظر را انتخاب کنید'
        })
        return
      }
      try {
        let loginOrganization: ILoginOrganization = {
          OrganizationId: selectedItem.OrganizationId,
          RoleId: selectedItem.RoleId,
          RememberRole: this.rememberRole
        }

        let token = await this.$service.user.loginToOrganization(
          loginOrganization
        )
        this.$store.commit('authentication/set_token', token)

        const actionResponse = await this.$service.user.ListMyActions()
        this.$store.dispatch(
          'authorization/setPermissions',
          actionResponse.Result
        )

        this.$toast.success().show({
          customClass: 'toast-customClass success',
          top: true,
          message: 'نقش با موفقیت انتخاب شد'
        })
      } catch (error) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          top: true,
          message: error.message || this.$t('msg.UI.fail')
        })
      } finally {
        loader.hide()
        this.$emit('hide')
      }
    }
  }
})
</script>

