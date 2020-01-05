<template>
  <section>
    <h3>{{$t('forgot-password.title')}}</h3>
    <h6>{{$t('forgot-password.subtitle')}}</h6>
    <v-form autocomplete="off">
      <div>
        <v-text-field
          v-validate="'required|email'"
          :error-messages="errors.collect('email')"
          prepend-inner-icon="email"
          name="email"
          type="email"
          v-model="forget_password_email"
          :label="$t('forgot-password.email')"
          id="id"
        ></v-text-field>
      </div>
      <v-btn @click="forget_password" rounded >{{$t('actions.send-request')}}</v-btn>
      <v-btn @click="$emit('changeView','login')" rounded color="accent">{{$t('actions.cancel')}}</v-btn>
    </v-form>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      forget_password_email: null
    }
  },
  methods: {
    forget_password() {
      console.log('object')
    }
  }
})
</script>
