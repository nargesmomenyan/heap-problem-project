<style lang="scss" scoped>
.subheader {
  display: flex;
  padding: 20px 0px;
  justify-content: space-between;
  align-items: center;
  &_main {
    display: flex;
  }
  &_back {
    margin: 0;
  }
  .separator {
    display: block;
    width: 12px;
    height: 4px;
    border-radius: 2px;
    background: #dbdce7;
    margin: 0 1rem 0 1rem;
    &-v {
      width: 1px;
      height: 22px;
    }
  }
}

.content {
  background: #fff;
  padding: 24px;
}
</style>
<template>
  <section ref="wrap">
    <div>
      <div class="subheader">
        <div class="subheader_main">
          <h3>ثبت/ ویرایش سازمان</h3>
        </div>
        <div>
          <v-btn
            class="subheader_back"
            active-class="active"
            text
            to="/organizations"
            color="accent"
          >
            <span>بازگشت</span>
            <v-icon class="pr-2">la-long-arrow-left</v-icon>
          </v-btn>
        </div>
      </div>
      <vr-navbar :items="items"></vr-navbar>
      <div class="content">
        <nuxt-child></nuxt-child>
      </div>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import { IOrganization } from '~/models/Organization'
export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = false
      if (isNaN(+to.params.id)) {
        result = vm.$store.getters['authorization/isAuthorized'](
          'Organization/Create'
        )
      } else {
        result = vm.$store.getters['authorization/isAuthorized'](
          'Organization/Edit'
        )
      }
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  data() {
    return {
      items: [
        {
          icon: 'info',
          title: 'اطلاعات سازمان',
          base: `/organizations/${this.$route.params.id}/`,
          to: '',
          exact: true
        }
      ]
    }
  },
  async mounted() {
    if (this.$route.params.id && this.$route.params.id != 'create') {
      this.items.push({
        icon: 'la-users',
        title: 'کاربران سازمان',
        base: `/organizations/${this.$route.params.id}/`,
        to: 'users',
        exact: true
      })
      this.items.push({
        icon: 'supervised_user_circle',
        title: 'ذینفعان',
        base: `/organizations/${this.$route.params.id}/`,
        to: 'shareholders',
        exact: true
      })
    }
  }
})
</script>

