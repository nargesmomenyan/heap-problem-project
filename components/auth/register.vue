<template>
  <section>
    <h3>ثبت نام</h3>
    <h6>برای ثبت نام لازم است اطلاعات خود را وارد نمایید</h6>
    <v-form autocomplete="off">
      <div>
        <v-text-field
          v-validate="'required'"
          :error-messages="errors.collect('username')"
          prepend-inner-icon="account_circle"
          name="username"
          v-model="new_user.username"
          label="نام کاربری"
          id="id"
        ></v-text-field>
        <v-text-field
          v-validate="'required|email'"
          :error-messages="errors.collect('email')"
          prepend-inner-icon="email"
          name="email"
          v-model="new_user.email"
          label="ایمیل"
          id="id"
        ></v-text-field>
        <v-text-field
          v-validate="'required'"
          :error-messages="errors.collect('password')"
          type="password"
          prepend-inner-icon="lock"
          name="password"
          v-model="new_user.password"
          label="رمز عبور"
          id="id"
        ></v-text-field>
        <v-text-field
          v-validate="'required'"
          :error-messages="errors.collect('passwordConfirm')"
          type="passwordConfirm"
          prepend-inner-icon="lock"
          name="passwordConfirm"
          v-model="new_user.passwordConfirm"
          label="تکرار رمز عبور"
          id="id"
        ></v-text-field>
      </div>
      <div class="remember-me">
        <v-checkbox
          v-validate="'required'"
          :error-messages="errors.collect('condition')"
          name="condition"
          label="قبول شرایط سایت"
          v-model="new_user.accept_condition"
        ></v-checkbox>
      </div>
      <v-btn @click="register" rounded >ثبت نام</v-btn>
      <v-btn @click="$emit('changeView','login')" rounded color="accent">انصراف</v-btn>
    </v-form>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      new_user: {}
    }
  },
  methods: {
    register() {
      this.$validator.validateAll().then(valid => {
        if (valid) {
          // this.$store.commit('loading/show')
          this.$axios
            .$post('authentication/register', this.new_user)
            .then(product => {})
            .catch(() => {
              //   this.$store.commit('notify/show', {
              //     text: 'خطایی رخ داده است لطفا دوباره امتحان کنید',
              //     color: 'error'
              //   })
            })
            .finally(() => {
              // this.$store.commit('loading/hide')
            })
        }
      })
    }
  }
})
</script>

