<template>
  <section ref="wrapper">
    <component :is="component" />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Reception from '~/components/reception/reception.vue'
import ReceptionView from '~/components/reception/reception-view.vue'
import { receptionStatusEnum } from '~/enums/receptionStatus'
export default Vue.extend({
  components: { Reception, ReceptionView },
  data() {
    return {
      receptionId: +this.$route.params.id,
      component: ''
    }
  },
  mounted() {
    this.initInfo()
  },
  watch: {
    $route(to, from) {
      
      if (to.query.msg && to.query.msg == 'receptionConfirmed') {
        this.component = 'ReceptionView'
      }
    }
  },
  methods: {
    async initInfo() {
      if (!this.receptionId) {
        this.component = 'Reception'
        return
      }

      let loader = this.$loader.show(this.$refs.wrapper)
      try {
        let reception = await this.$service.reception.getReception(
          this.receptionId
        )
        if (reception && reception.Status == receptionStatusEnum.Done) {
          this.component = 'ReceptionView'
        }
      } catch (error) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          message: error.message || this.$t('reception.msg.reception-get-fail'),
          top: true
        })
      } finally {
        if (this.component == '') {
          this.component = 'Reception'
        }
        loader.hide()
      }
    }
  }
})
</script>