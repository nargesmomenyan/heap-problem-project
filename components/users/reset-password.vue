<style lang="scss" scoped>
#password {
  text-align: center;
  margin: 0 auto;
  width: 50%;
}
</style>

<template>
  <section ref="wrapChangePassword">
    <v-card>
      <v-card-title>دریافت رمز عبور جدید</v-card-title>
      <v-card-text>
        <v-container fluid>
          <v-layout align-space-around justify-end column fill-height>
            <v-flex xs12>
              <v-chip>
                 <v-icon>account_circle</v-icon>
                <span>کاربر: {{userDisplayName}}</span>
              </v-chip>
            </v-flex>
            <v-flex xs12>
              <v-btn @click="resetPassword" style="width:100%">دریافت رمز</v-btn>
            </v-flex>
            <v-flex xs12>
              <div id="password">
                <v-text-field
                  v-if="password"
                  v-model="password"
                  :disabled="true"
                  placeholder="رمز جدید"
                  prepend-inner-icon="vpn_key"
                ></v-text-field>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    userId: {
      type: Number,
      required: true
    },
    currentUser: {
      type: Boolean,
      default: false
    },
    userDisplayName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      password: ''
    }
  },
  methods: {
    resetPassword() {
      
      let loader = this.$loader.show(this.$refs.wrapChangePassword)
      let service = this.currentUser
        ? this.$service.user.resetMyPassword()
        : this.$service.user.resetPassword(this.userId)
      service
        .then(res => {
          this.password = res
        })
        .catch(err => {
          this.$toast.error().show({customClass: 'toast-customClass error', message:err.message || this.$t('msg.UI.fail'),
                top: true})
        })
      loader.hide()
    }
  }
})
</script>

