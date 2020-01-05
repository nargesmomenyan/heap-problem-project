<style lang="scss">
</style>

<template>
  <section>
    <newEditIndividualUser  
    :dialogMode="false"     
    ></newEditIndividualUser>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import newEditIndividualUser from '~/components/users/new-edit-individual-user.vue'

export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = false
      if (isNaN(+to.params.id)) {
        result = vm.$store.getters['authorization/isAuthorized'](
          'IndividualUser/Create'
        )
      } else {
        result = vm.$store.getters['authorization/isAuthorized'](
          'IndividualUser/Edit'
        )
      }
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  components:{newEditIndividualUser}
})
</script>
