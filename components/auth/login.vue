<template>
  <section ref="wrap">
    <h3>{{$t('login.title')}}</h3>
    <form autocomplete="off" v-on:submit.prevent>
      <div class="login-container">
        <label>{{$t('login.username')}}</label>
        <v-text-field
          autocomplete="off"
          v-validate="'required'"
          prepend-inner-icon="account_circle"
          v-model="user.Username"
          id="id"
          name="username"
          :data-vv-as="$t('login.username')"
          :error-messages="errors.collect('username')"
        ></v-text-field>
        <label>{{$t('login.password')}}</label>
        <v-text-field
          autocomplete="off"
          v-validate="'required'"
          type="password"
          prepend-inner-icon="lock"
          v-model="user.Password"
          id="id"
          name="password"
          :data-vv-as="$t('login.password')"
          :error-messages="errors.collect('password')"
        ></v-text-field>
      </div>
      <div class="remember-me">
        <v-checkbox :label="$t('login.rememberMe')" v-model="rememberMe"></v-checkbox>
        <v-spacer />
        <a @click="$emit('changeView','forget_password')">{{$t('login.forgotPassword')}}</a>
      </div>
      <div class="remember-me">
        <v-checkbox :label="$t('login.loginAsADifferentRole')" v-model="user.LoginAsADifferentRole"></v-checkbox>
      </div>
      <v-btn @click="login" rounded>{{$t('actions.login')}}</v-btn>
    </form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { ILoginServiceRequest, ILoginServiceResponse } from '~/models/Login'
import { ICurrentUser } from '~/models/ICurrentUser'
import loginToOrganization from '~/components/auth/login-to-organization.vue'
import { setTimeout } from 'timers'
import { returnStatement } from '@babel/types'

export default Vue.extend({
  components: {
    loginToOrganization
  },
  data() {
    return {
      user: <ILoginServiceRequest>{ LoginAsADifferentRole: false },
      rememberMe: false
    }
  },
  mounted() {
    this.$store.commit('authentication/logout')
    this.rememberMe = false
    let storedRememberMe = this.$store.getters['authentication/rememberMe']
    if (storedRememberMe == true) {
      this.rememberMe = true
    } else {
      this.rememberMe = false
    }
  },
  methods: {
    async login() {
      let valid = await this.$validator.validateAll()
      if (!valid) {
        return
      }

      let loader = this.$loader.show(this.$refs.wrap)
      try {
        let response = await this.$service.user.loginToService(this.user)

        this.$store.commit('authentication/set_rememberMe', this.rememberMe)
        loader.hide()
        this.$store.commit('authentication/set_token', response.Token)

        let items = await this.$service.user.myOrganizationalRoles()
        this.$store.commit('authentication/set_organizationalRoles', items)
        if (response.SecondStepLoginIsNeeded) {
          let result = await this.checkOrganizationalRole()
          if (!result) {
            return
          }
        } else {
          const actionResponse = await this.$service.user.ListMyActions()
          this.$store.dispatch(
            'authorization/setPermissions',
            actionResponse.Result
          )
        }
        this.$router.push('/')
      } catch (error) {
        this.$toast.error().show({customClass: 'toast-customClass error',
                top: true, message:error.message || this.$t('msg.UI.fail')})
      } finally {
        this.$loader.destroy()
        this.$dialog.destroy()
      }
    },
    async checkOrganizationalRole(): Promise<boolean> {
      let result: boolean = false
      result = await this.$dialog
        .show({
          component: loginToOrganization
        })
        .then(data => {
          return true
        })
        .catch(err => {
          return false
        })
      return result
    }
  }
})
</script>

