<template>
  <v-list>
    <v-list-item v-if="changeableOrganizationalRole" @click="changeOrganizationalRole">
      <v-icon class="pl-2">transform</v-icon>
      <v-list-item-title>{{$t('actions.changeOrganizationalRole')}}</v-list-item-title>
    </v-list-item>
    <v-list-item @click="logout">
      <v-icon class="pl-2">exit_to_app</v-icon>
      <v-list-item-title>{{$t('actions.logout')}}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>
<script lang="ts">
import Vue from 'vue'
import loginToOrganization from '~/components/auth/login-to-organization.vue'
import { ICurrentUser } from '~/models/ICurrentUser'
export default Vue.extend({
  components: { loginToOrganization },
  data() {
    return {
      fixed: false,
      userInfo: <ICurrentUser>(
        this.$store.getters['authentication/currentUserInfo']
      )
    }
  },
  computed: {
    changeableOrganizationalRole() {
      const list = this.$store.getters['authentication/organizationalRoles']
      if (list && list.length > 1) {
        return true
      } else {
        return false
      }
    }
  },
  methods: {
    logout() {
      let token = this.$store.getters['authentication/token']
      this.$service.user
        .logout(token)
        .then(response => {})
        .catch(error => {
          this.$toast.error().show({
            customClass: 'toast-customClass error',
            top: true,
            message: error.message || this.$t('msg.UI.fail')
          })
        })
        .finally(() => {
          this.$store.commit('authentication/logout')
          this.$router.push('/auth')
        })
    },
    changeOrganizationalRole() {
      this.$dialog
        .show({
          component: loginToOrganization
        })
        .then(() => {
          this.$emit('roleChanged')
          this.$store.dispatch('navigation/set_navItems')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
})
</script>