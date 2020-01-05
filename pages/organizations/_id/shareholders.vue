<style lang="scss" >
.btn {
  font-size: 1.5rem;
  padding: 0.4rem;
  color: #a7abc3;

  .v-icon {
    font-size: 1.3rem;
    padding: 0.5rem;
    color: #93a2dd !important;
    font-size: 1.475rem;
  }
}

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
        :dataGrid="dataGrid"
        :hideActionEdit="true"
        :hideActionDelete="true"
        :filters="filters"
        :defaultFilters="defaultFilters"
      >
        <template v-if="this.$authorization.check('Organization/AddShareholderMember')" #header_add>
          <div class="btn-group">
            <v-menu offset-y attach bottom left min-width="180">
              <template v-slot:activator="{ on }">
                <v-btn class="btn-dropdown action-btn" depressed v-on="on">
                  <v-icon>la-angle-down</v-icon>
                  {{$t('organization.add-shareholder')}}
                </v-btn>
              </template>
              <v-list>
                <v-list-item
                  v-for="(item, index) in userShareholder_add"
                  @click="addShareholderToOrganization(item.type)"
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
          <td>{{ item.UserType | enum('userType') }}</td>
          <td>{{ item.DisplayName }}</td>
          <td>{{ item.PhoneNumber }}</td>
          <td>{{ item.ShareValue }}</td>
          <td v-if="this.$authorization.check('User/ResetPassword')">
            <v-btn class="btn-grid" icon depressed text :ripple="false">
              <v-icon @click="resetPasswordDialog(item)">vpn_key</v-icon>
            </v-btn>
          </td>
          <td v-if="this.$authorization.check('Organization/EditShareholderMember')">
            <v-btn class="btn-grid" icon depressed text :ripple="false">
              <v-icon @click="editShareholder(item)">la-edit</v-icon>
            </v-btn>
          </td>
          <td v-if="this.$authorization.check('Organization/RemoveMember')">
            <v-btn class="btn-grid" icon depressed text :ripple="false">
              <v-icon @click="deleteShareholder(item)">la-trash</v-icon>
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
import { IOrganizationShareholder } from '~/models/IOrganizationShareholder'
import { VRGridAction, VRDataGrid } from 'vrwebdesign-nuxt/modules/nuxt-data-grid/types'
import resetPassword from '~/components/users/reset-password.vue'
import { ICurrentUser } from '~/models/ICurrentUser'
import addShareholder from './add-shareholder.vue'
import editShareholder from './edit-shareholder.vue'
import { userTypeEnum } from '~/enums/userType'

interface IShareholder_Add {
  title: string
  icon: string
  type: string
}

export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = vm.$store.getters['authorization/isAuthorized'](
        'Organization/ViewShareholders'
      )
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  data() {
    return {
      colors,
      organizationId: this.$route.params.id,
      headers: [
        {
          text: this.$t('shareholder.username'),
          align: 'right',
          value: 'Username',
          width: '10%'
        },
        {
          text: this.$t('usertype'),
          align: 'right',
          value: 'UserType',
          width: '10%'
        },
        {
          text: this.$t('shareholder.displayName'),
          align: 'right',
          value: 'DisplayName',
          width: '20%'
        },
        {
          text: this.$t('shareholder.phoneNumber'),
          align: 'right',
          value: 'PhoneNumber',
          width: '20%'
        },
        {
          text: this.$t('shareholder.sharevalue'),
          align: 'right',
          value: 'Sharevalue',
          width: '10%'
        },
        {
          text: this.$t('individualUser.resetPassword'),
          align: 'right',
          width: '10%'
        },
        {
          text: ' ',
          align: 'right',
          width: '10%'
        }
      ],
      title: {
        text: this.$t('organization.organizationShareholders-manage'),
        icon: 'supervised_user_circle'
      },
      dataGrid: <VRDataGrid>{},
      filters: [
        {
          icon: 'la-search',
          name: 'username',
          model: 'username',
          label: this.$t('shareholder.username')
        },
        {
          icon: 'la-search',
          name: 'name',
          model: 'name',
          label: this.$t('shareholder.displayName')
        },
        {
          icon: 'la-search',
          type: 'select',
          name: 'type',
          model: 'type',
          items: [
            {
              text: '',
              value: userTypeEnum.Unknown
            },
            {
              text: this.$t('shareholder.type.firm'),
              value: userTypeEnum.Firm
            },
            {
              text: this.$t('shareholder.type.individual'),
              value: userTypeEnum.Individual
            }
          ],
          label: this.$t('shareholder.type.title')
        }
      ],
      defaultFilters: {
        OrganizationId: +this.$route.params.id
      },
      currentUser: this.$store.getters['auth/currentUserInfo'] as ICurrentUser,
      queryService: this.$service.organization.shareholderList,
      userShareholder_add: <IShareholder_Add[]>[]
    }
  },
  mounted() {
    this.userShareholder_add.push(<IShareholder_Add>{
      icon: 'add',
      type: 'individual',
      title: this.$t('shareholder.type.individual')
    })
    this.userShareholder_add.push(<IShareholder_Add>{
      icon: 'add',
      type: 'firm',
      title: this.$t('shareholder.type.firm')
    })
  },
  methods: {
    resetPasswordDialog(item: IOrganizationShareholder) {
      this.$dialog.show({
        component: resetPassword,
        props: {
          userId: item.UserId,
          userDisplayName: item.DisplayName
        }
      })
    },
    addShareholderToOrganization(type) {
      this.$dialog
        .show({
          title: this.$t('organization.add-shareholder').toString(),
          component: addShareholder,
          props: {
            userType: type,
            organizationId: Number.parseInt(this.organizationId)
          }
        })
        .then(data => {
          if (data) {
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
    },
    editShareholder(item: IOrganizationShareholder) {
      this.$dialog
        .show({
          component: editShareholder,
          props: {
            organizationShareholder: Object.assign({}, item)
          }
        })
        .then(data => {
          this.dataGrid.refresh()
        })
    },
    deleteShareholder(item: IOrganizationShareholder) {
      this.$dialog
        .confirm({
          title: this.$t('organization.delete-shareholder').toString(),
          message: this.$t('msg.UI.warn-delete').toString()
        })
        .then(() => {
          let loader = this.$loader.show(this.$refs.wrapperGrid)
          this.$service.organization
            .deleteRoleUser(item.OrganizationId, item.RoleUserId)
            .then(() => {
              this.dataGrid.refresh()              
                this.$toast.success().show({customClass: 'toast-customClass success', message:this.$t('msg.UI.success-delete').toString(),
                top: true})
            })
            .catch(error =>
              this.$toast.error().show({customClass: 'toast-customClass error', message:error.message || this.$t('msg.UI.fail'),
                top: true})
            )
            .finally(() => {
              loader.hide()
            })
        })
    }
  }
})
</script>