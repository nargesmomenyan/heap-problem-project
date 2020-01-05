<style lang="scss" >
.btn-group {
  display: flex;
  position: relative;
  .v-menu__content {
    box-shadow: 0 0 50px 0 rgba(82, 63, 105, 0.15);
    padding: 10px 0;
    .v-list__item {
      height: 34px;
      font-size: 0.875rem;
      .v-icon {
        font-size: 22px;
      }
    }
  }
  .action-btn {
    position: relative;
    &:after {
      display: block;
      content: ' ';
      border-left: 1px solid #ffffff;
      position: absolute;
      top: 3px;
      right: -1px;
      bottom: 3px;
      opacity: 0.3;
    }
  }

  .v-btn {
    margin: 0;
    border-radius: 0;
  }
  .btn-dropdown {
    padding: 0 8px;
    min-width: auto;
    border-right: 1px solid #fff;
    .v-icon {
      font-size: 0.875rem;
    }
  }
}
</style>

<template>
  <section ref="wrapperGrid">
    <v-card>
      <vr-data-grid
        :headers="headers"
        :withAdd="false"
        :queryService="queryService"
        :title="title"
        :hideActionEdit="true"
        :hideActionDelete="true"
        :dataGrid="dataGrid"
        :filters="filters"
        :defaultFilters="defaultFilters"
        :actions="actions"
      >
        <template v-if="isAuthorized_addMember" #header_add>
          <div class="btn-group">
            <v-menu offset-y attach bottom left min-width="180">
              <template v-slot:activator="{ on }">
                <v-btn class="btn-dropdown action-btn" depressed v-on="on">
                  <v-icon>la-angle-down</v-icon>
                  {{$t('organization.add-user')}}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in userRoles_add"
                  @click="addUser(item.role)"
                  :key="index"
                >
                  <v-icon class="pl-2">{{item.icon}}</v-icon>
                  <v-list-item-title>{{item.title}}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </div>
        </template>
        <template #items="{item}">
          <td>{{ item.Username }}</td>
          <td>{{ item.UserFirstName }}</td>
          <td>{{ item.UserLastName }}</td>
          <td>{{ item.UserMobileNumber }}</td>
          <td>
            <v-layout align-center justify-start row fill-height>
              <template v-for="role in item.Roles">
                <v-btn
                  :key="role.RoleId"
                  depressed
                  text
                  :ripple="false"
                  class="btn-grid"
                  @click="deleteOrganizationRoleUser(item.OrganizationId, role.RoleUserId)"
                  :disabled="!currentUserCanDeleteRoleUser(role.RoleTitle)"
                >
                  <vr-badge :color="colors.role[role.RoleTitle]">
                    <v-icon v-if="currentUserCanDeleteRoleUser(role.RoleTitle)">highlight_off</v-icon>
                    {{ $t(`individualUser.role.${role.RoleTitle}`) }}
                  </vr-badge>
                </v-btn>
              </template>
            </v-layout>
          </td>
          <td v-if="currentUserCanDeleteUser(item)">
            <v-btn class="btn" icon depressed text :ripple="false">
              <v-icon @click="deleteOrganizationUser(item)">la-trash</v-icon>
            </v-btn>
          </td>
        </template>
      </vr-data-grid>
    </v-card>
  </section>
</template>

<script lang="ts">
import colors from '~/colors'
import Vue from 'vue'
import { IOrganizationUser } from '~/models/Organization'
import { VRGridAction, VRDataGrid } from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
import resetPassword from '~/components/users/reset-password.vue'
import { ICurrentUser } from '~/models/ICurrentUser'
import addUser from './add-user.vue'
import VueMeta from 'vue-meta'

interface IUserRole_Add {
  title: string
  icon: string
  role: string
}

export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'Organization/ListUsers'
      )
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  components: { resetPassword },
  data() {
    return {
      isAuthorized_addMember: this.$authorization.check(
        'Organization/AddMember'
      ),
      colors,
      organizationId: this.$route.params.id,
      headers: [
        {
          text: this.$t('individualUser.userName'),
          align: 'right',
          value: 'Username',
          width: '20%'
        },
        {
          text: this.$t('individualUser.firstName'),
          align: 'right',
          value: 'UserFirstName',
          width: '20%'
        },
        {
          text: this.$t('individualUser.lastName'),
          align: 'right',
          value: 'UserLastName',
          width: '20%'
        },
        {
          text: this.$t('individualUser.mobileNumber'),
          align: 'right',
          value: 'UserMobileNumber',
          width: '10%'
        },
        {
          text: this.$t('individualUser.role.title'),
          align: 'right',
          value: 'RoleName',
          width: '90%'
        },
        {
          text: this.$t('organization.delete-user'),
          align: 'right',
          width: '5%'
        }
      ],
      title: {
        text: this.$t('organization.organizationUsers-manage'),
        icon: 'la-users'
      },
      dataGrid: <VRDataGrid>{},
      filters: [
        {
          icon: 'la-search',
          name: 'Username',
          model: 'Username',
          label: this.$t('individualUser.userName')
        },
        {
          icon: 'la-search',
          name: 'FirstName',
          model: 'FirstName',
          label: this.$t('individualUser.firstName')
        },
        {
          icon: 'la-search',
          name: 'LastName',
          model: 'LastName',
          label: this.$t('individualUser.lastName')
        },
        {
          icon: 'la-search',
          type: 'select',
          chips: 'chips',
          multiple: true,
          name: 'Roles',
          model: 'Roles',
          items: this.$enum.role.toSelect.filter(
            x => x.value != 1 && x.value != 2
          ),
          label: this.$t('individualUser.role.title')
        }
      ],
      defaultFilters: {
        OrganizationId: +this.$route.params.id,
        Roles: ['3', '4', '5', '7']
      },
      actions: <VRGridAction[]>[],
      currentUser: this.$store.getters[
        'authentication/currentUserInfo'
      ] as ICurrentUser,
      queryService: this.$service.organization.userList,
      userRoles_add: <IUserRole_Add[]>[]
    }
  },
  mounted() {
    if (this.$authorization.check('User/ResetPassword')) {
      this.actions.push({
        icon: 'vpn_key',
        title: this.$t('users.resetPassword').toString(),
        cb: this.resetPasswordDialog
      })
    }

    if (this.currentUser && this.currentUser.RoleTitle === 'SuperAdmin') {
      this.userRoles_add.push(<IUserRole_Add>{
        icon: 'add',
        role: 'Admin',
        title: this.$t('individualUser.role.Admin')
      })
    }
    this.userRoles_add.push(<IUserRole_Add>{
      icon: 'add',
      role: 'DiagnosticianDoctor',
      title: this.$t('individualUser.role.DiagnosticianDoctor')
    })
    this.userRoles_add.push(<IUserRole_Add>{
      icon: 'add',
      role: 'TreatingPhysician',
      title: this.$t('individualUser.role.TreatingPhysician')
    })
    this.userRoles_add.push(<IUserRole_Add>{
      icon: 'add',
      role: 'Technician',
      title: this.$t('individualUser.role.Technician')
    })
    this.userRoles_add.push(<IUserRole_Add>{
      icon: 'add',
      role: 'Secretary',
      title: this.$t('individualUser.role.Secretary')
    })
    this.userRoles_add.push(<IUserRole_Add>{
      icon: 'add',
      role: 'Patient',
      title: this.$t('individualUser.role.Patient')
    })
  },
  methods: {
    async deleteOrganizationRoleUser(OrganizationId, roleUserId) {
      let loader = this.$loader.show(this.$refs.wrapperGrid)
      try {
        await this.$service.organization.deleteRoleUser(
          OrganizationId,
          roleUserId
        )
        
        this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success').toString(),
                top: true})
        this.dataGrid.refresh()
      } catch (error) {
        this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
      } finally {
        loader.hide()
      }
    },
    resetPasswordDialog($event) {
      this.$dialog.show({
        component: resetPassword,
        props: {
          userId: $event.UserId,
          userDisplayName: $event.UserFirstName + ' ' + $event.UserLastName
        },
        title: this.$t('individualUser.resetPassword').toString(),
        ok_txt: this.$t('msg.UI.success').toString(),
        type: 'info'
      })
    },
    async deleteOrganizationUser($event) {
      this.$dialog
        .confirm({
          title: this.$t('msg.UI.title-delete').toString(),
          message: this.$t('msg.UI.warn-delete').toString()
        })
        .then(() => {
          let loader = this.$loader.show(this.$refs.wrapperGrid)
          this.$service.organization
            .deleteUser($event.OrganizationId, $event.UserId)
            .then(() => {
              this.dataGrid.refresh()
              
              this.$toast.success().show({customClass: 'toast-customClass success', message:'عملیات با موفقیت انجام شد',
                top: true})
            })
            .catch(error => {
              this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
            })
          loader.hide()
        })
    },
    currentUserCanDeleteUser(item) {
      if (!this.$authorization.check('Organization/RemoveUser')) {
        return false
      }
      if (
        this.currentUser.RoleTitle === 'Admin' &&
        item.Roles &&
        item.Roles.find(x => x.RoleTitle === 'Admin')
      ) {
        return false
      } else {
        return true
      }
    },
    currentUserCanDeleteRoleUser(roleTitle) {
      if (!this.$authorization.check('Organization/RemoveMember')) {
        return false
      }

      if (
        this.currentUser &&
        this.currentUser.RoleTitle === 'Admin' &&
        roleTitle === 'Admin'
      ) {
        return false
      } else {
        return true
      }
    },
    addUser(role) {
      this.$dialog
        .show({
          title: this.$t('organization.add-user').toString(),
          component: addUser,
          props: {
            role: role,
            organizationId: Number.parseInt(this.organizationId)
          }
        })
        .then(data => {
          if (data && data == 'success') {
            this.dataGrid.refresh()
          }
        })
        .catch(error => {
          this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
        })
        .finally(() => {
          this.$loader.destroy()
        })
    }
  }
})
</script>