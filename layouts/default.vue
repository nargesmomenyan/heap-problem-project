<style lang="scss">
.custom-content {
  padding: 110px 0px 0px !important;
}
</style>
<template>
  <v-app>
    <Header v-if="1==1" />
    <HeaderMobile v-else />
    <v-content class="custom-content">
      <div></div>
      <v-container fluid full-height>
        <nuxt />
      </v-container>
    </v-content>
    <footer-mobile v-if="1!=1" />
  </v-app>
</template>

<script>
import Header from '@/components/header/header.vue'
import HeaderMobile from '@/components/header/header-mobile.vue'
import FooterMobile from '@/components/footer/footer-mobile.vue'
export default {
  middleware: ['authentication', 'authorization'],
  components: { Header, HeaderMobile, FooterMobile },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Vuetify.js'
    }
  },
  mounted() {
    this.setExtraMenu()
  },
  computed: {
    errorMessage() {
      let val = this.$store.state.errorMessage
      if (val && val != '') {
        this.showErrorMessage(val)
      }
      this.$store.commit('set_errorMessage', '')
      return val
    }
  },
  methods: {
    showErrorMessage(val) {
      this.$toast
        .error()
        .show({
          customClass: 'toast-customClass error',
          message: val,
          top: true
        })
    },
    setExtraMenu() {
      if (this.$authorization.check('Reception/Create')) {
        this.$store.dispatch('navigation/set_extraMenu', {
          title: this.$t('reception.menu-add-reception'),
          class: '',
          func: this.navigateToReceptionPage
        })
      } else {
        this.$store.dispatch('navigation/set_extraMenu', null)
      }
    },
    navigateToReceptionPage() {
      this.$router.push('/secretaries/receptions/create')
    }
  }
}
</script>
