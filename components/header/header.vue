<style lang="scss" >
.nav-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 25px;
  padding-top: 16px;
  background: $bg-color;
}

.nav-drawer {
  display: none;
  @include respond-to(md) {
    display: block;
  }
}

.app-bar-wrapper {
  header {
    height: 110px !important;
    border: 0 !important;
  }

  .app-bar {
    padding: 0;
    margin: 0;

    .v-toolbar {
      border: 0 !important;
      height: 110px !important;
    }
    .v-toolbar__content {
      padding: 0 !important;
      height: 110px !important;
      display: flex;
      flex-direction: column;
      justify-content: stretch;
    }

    .app-bar-info {
      color: white;
      background: #015274 0% 0% no-repeat padding-box !important;
      width: 100%;
      margin-left: 0;
      top: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 46px;
      padding: 0;
      .app-bar-right {
        padding-right: 20px;
        display: flex;
        align-items: center;
        .v-app-bar__nav-icon {
          display: none;
          @include respond-to(md) {
            height: 24px !important;
            width: 24px !important;
            color: white !important;
            display: block;
          }
        }
      }
      .v-toolbar__title {
        font-size: 1rem;
      }

      .user-profile-info {
        display: flex;
        align-items: center;
        margin: 0;
        .avatar {
          width: 32px !important;
          min-width: 32px !important;
          height: 32px !important;
          background-color: #168ed0;
          margin-right: 10px;
          margin-left: 10px;
        }

        .user-title {
          font-size: 0.625rem;
          line-height: 15px;
        }

        .v-btn.v-btn--icon {
          width: 16px;
          height: 16px;
        }

        .user-profile-info-options {
          .v-btn__content {
            width: 16px;
            height: 16px;
            text-align: center;
            .v-icon {
              padding: 0;
              font-size: 1rem;
              width: 16px;
              height: 16px;
            }
          }
          .v-icon {
            color: white !important;
          }
        }

        .v-list {
          padding: 0;
        }
      }
    }

    .tool-bar {
      height: 64px;
      width: 100%;
      background-color: white;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-right: 20px;
      padding-left: 20px;

      .tool-bar-right {
        display: flex;
        align-items: center;
        height: 100%;

        .lab-title-wrapper {
          width: 320px;
          height: 40px;
          border: 1px solid rgb(21, 142, 207, 0.5);
          -webkit-background-clip: padding-box; /* for Safari */
          background-clip: padding-box; /* for IE9+, Firefox 4+, Opera, Chrome */
          text-align: center;

          .lab-title {
            font-family: BNarm;
            width: 300px;
            font-size: 20px;
            letter-spacing: 0;
            color: $primary-color;
            padding-right: 10px;
            padding-left: 10px;
          }
        }

        .tab-wrapper {
          margin-bottom: 0;
          align-self: flex-end;
          margin-right: 20px;
          @include respond-to(md) {
            display: none;
          }
        }
      }

      .extra-menu {
        @include respond-to(md) {
          display: none;
        }
      }
    }
  }
}
</style>

<template>
  <div ref="wrapper">
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      right
      fixed
      app
      class="nav-drawer"
    >
      <div class="nav-top">
        <div v-show="!miniVariant" class="logo">
          <img src="~assets/img/logo.png" alt />
        </div>
      </div>
      <appNavigation :mini-variant="miniVariant"></appNavigation>
    </v-navigation-drawer>
    <section class="app-bar-wrapper">
      <v-app-bar prominent fixed class="app-bar">
        <div class="app-bar-info" dark>
          <div class="app-bar-right">
            <div class="app-bar-nav-button">
              <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            </div>
            <v-toolbar-title>{{$t('app.title')}}</v-toolbar-title>
          </div>
          <div class="user-profile-info">
            <v-menu offset-y attach bottom right>
              <template v-slot:activator="{ on }">
                <v-btn text icon v-on="on" class="user-profile-info-options">
                  <v-icon md-24>arrow_drop_down</v-icon>
                </v-btn>
              </template>
              <user-options @roleChanged="showUserTitle()" />
              <!-- <v-list>
                <v-list-item v-if="changeableOrganizationalRole" @click="changeOrganizationalRole">
                  <v-icon class="pl-2">transform</v-icon>
                  <v-list-item-title>{{$t('actions.changeOrganizationalRole')}}</v-list-item-title>
                </v-list-item>
                <v-list-item @click="logout">
                  <v-icon class="pl-2">exit_to_app</v-icon>
                  <v-list-item-title>{{$t('actions.logout')}}</v-list-item-title>
                </v-list-item>
              </v-list>-->
            </v-menu>
            <span class="user-title">{{userTitle}}</span>
            <v-avatar class="avatar">
              <v-icon dark>account_circle</v-icon>
            </v-avatar>
          </div>
        </div>
        <div class="tool-bar">
          <div class="tool-bar-right">
            <div class="lab-title-wrapper">
              <div class="lab-title">{{$t('app.lab-title')}}</div>
            </div>
            <div class="tab-wrapper">
              <appNavigation :mini-variant="miniVariant"></appNavigation>
            </div>
          </div>
          <div class="extra-menu">
            <div class="action" v-if="extraMenu">
              <v-btn :class="extraMenu.class" @click="extraMenu.func">{{extraMenu.title}}</v-btn>
            </div>
          </div>
        </div>
      </v-app-bar>
    </section>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import appNavigation from './navigation.vue'
import { IOrganizationalRole } from '../../models/IOrganizationalRole'
import userOptions from '~/components/auth/user-options.vue'
import role from '~/enums/role'
import { ICurrentUser } from '~/models/ICurrentUser'

export default Vue.extend({
  components: {
    appNavigation,
    userOptions
  },
  data() {
    return {
      drawer: false,
      fixed: false,
      miniVariant: false,
      userTitle: ''
    }
  },
  computed: {
    organizationalRoleTitle() {},
    changeableOrganizationalRole() {
      const list = this.$store.getters['authentication/organizationalRoles']
      if (list && list.length > 1) {
        return true
      } else {
        return false
      }
    },
    extraMenu() {
      return this.$store.state.navigation.extraMenu
    }
  },
  async mounted() {
    let list = this.$store.getters['authentication/organizationalRoles']
    if (!list) {
      let items = await this.$service.user.myOrganizationalRoles()
      this.$store.commit('authentication/set_organizationalRoles', items)
    }
    this.showUserTitle()
  },
  methods: {
    showUserTitle() {
      const userInfo = this.$store.getters[
        'authentication/currentUserInfo'
      ] as ICurrentUser
      if (userInfo) {
        this.userTitle = userInfo.DisplayName
        this.userTitle +=
          ' ' + userInfo.OrganizationTitle + '/' + role[userInfo.RoleId]
      }
    }
  }
})
</script>
