<style lang="scss">
</style>

<template>
  <section>
    <newEditFirmUser :dialogMode="false"></newEditFirmUser>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import newEditFirmUser from '~/components/users/new-edit-firm-user.vue'

export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = false
      if (isNaN(+to.params.id)) {
        result = vm.$store.getters['authorization/isAuthorized'](
          'FirmUser/Create'
        )
      } else {
        result = vm.$store.getters['authorization/isAuthorized'](
          'FirmUser/Edit'
        )
      }
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  components: { newEditFirmUser }
})
</script>
