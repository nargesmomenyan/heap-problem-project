<style lang="scss" >
@import './loginStyle.scss';
</style>
<template>
  <section id="login">
    <div class="login-form">
      <div class="content-wrapper">
        <div class="logo">
          <img src="~assets/img/logo-big.png" alt />
        </div>
        <transition
          mode="out-in"
          enter-active-class="animated flipInX"
          leave-active-class="animated fadeOut leave"
        >
          <div key="login" v-if="view_mode == 'login'">
            <Login logedInService @changeView="changeView" />
          </div>
          <div v-else-if="view_mode=='login-to-organization'">
            <LoginToOrganization />
          </div>
          <div key="register" v-else-if="view_mode == 'register'">
            <Register @changeView="changeView" />
          </div>
          <div key="forget_password" v-else-if="view_mode == 'forget_password'">
            <ForgetPassword @changeView="changeView" />
          </div>
        </transition>
      </div>
    </div>

    <div class="login-extra">
      <div>
        <h3></h3>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import Login from './login.vue'
import Register from './register.vue'
import ForgetPassword from './forget_password.vue'
import LoginToOrganization from './login-to-organization.vue'

export default Vue.extend({
  components: {
    Login,
    Register,
    ForgetPassword,
    LoginToOrganization
  },
  data() {
    return {
      view_mode: 'login'
    }
  },
  beforeMount() {
    const queryParam = this.$route.query.view_mode
    if (queryParam) {
      this.view_mode = queryParam.toString()
    }
    this.$loader.destroy()
    this.$dialog.destroy()
  },
  methods: {
    changeView(view) {
      this.view_mode = view
    }
  }
})
</script>
