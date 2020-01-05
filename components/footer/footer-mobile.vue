<style lang="scss" scoped>
.v-footer {
  height: 56px;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.3);
  background-color: #ffffff !important;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.foooter-mobile-btn {
  color: $primary-color;
}
</style>
<template>
  <section>
    <v-footer :fixed="fixed" app>
      <v-btn text icon class="foooter-mobile-btn">
        <v-icon dark>la-home</v-icon>
      </v-btn>

      <v-btn text icon class="footer-alarm">
        <v-icon dark>la-bell</v-icon>
      </v-btn>

      <div>
        <v-menu offset-y attach top right>
          <template v-slot:activator="{ on }">
            <v-btn class="foooter-mobile-btn" text icon v-on="on">
              <v-icon>account_circle</v-icon>
            </v-btn>
          </template>
          <user-options />
        </v-menu>
      </div>
    </v-footer>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { ICurrentUser } from '~/models/ICurrentUser'
import userOptions from '~/components/auth/user-options.vue'
export default Vue.extend({
  components: {
    userOptions
  },
  data() {
    return {
      fixed: false,
      userInfo: <ICurrentUser>(
        this.$store.getters['authentication/currentUserInfo']
      )
    }
  },
  mounted() {}
})
</script>
