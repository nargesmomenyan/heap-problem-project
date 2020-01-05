<style lang="scss" >
</style>
<template>
  <div class="action">
    <v-btn
      v-if="this.$authorization.check('Reception/Create')"
      @click="$router.push('/secretaries/receptions/create')"
    >{{$t('reception.menu-add-reception')}}</v-btn>
  </div>
</template>