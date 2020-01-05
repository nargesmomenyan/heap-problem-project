<style lang="scss" >

.line {
  display: flex;
  justify-content: space-between;
}
.reception-status-wrapper {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<template>
  <div ref="wrapper" class="wrapper-reception">
    <div class="body-reception-gap" />
    <div class="reception-status-wrapper">
      <div class="reception-status">وضعیت</div>
    </div>
    <div class="body-reception-gap" />

    <div class="line">
      <div class="reception-briefInfo-wrapper">
        <div class="reception-briefInfo">
          <div class="info-caption">تاریخ ثبت آزمایش</div>
          <div class="info-text">{{'1398/10/10'}}</div>
        </div>
        <div class="reception-briefInfo">
          <div class="info-caption">تاریخ دریافت جواب</div>
          <div class="info-text">{{'1398/10/10'}}</div>
        </div>
      </div>

      <div class="action">
        <v-btn class="btn-text" text @click="print">
          <v-icon>la-print</v-icon>چاپ اطلاعات
        </v-btn>
        <v-btn class="reverse medium" @click="goToMainPage()">بازگشت به صفحه اصلی</v-btn>
      </div>
    </div>

    <div class="body-reception">
      <div>
        <sampleList :receptionId="reception.Id" :step="'reception'" />
      </div>

      <v-row>
        <v-col md="6" sm="12">
          <patientComponent :patient_prop="reception.Patient" />
        </v-col>
        <v-col md="6" sm="12">
          <treatingPhysicianComponent :treatingPhysician_prop="reception.TreatingPhysician" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import patientComponent from '~/components/reception/patient-view.vue'
import treatingPhysicianComponent from '~/components/reception/treatingPhysician-view.vue'
import { IIndividualUser } from '~/models/IndividualUser'
import { IReception } from '~/models/reception/IReception'
import sampleList from '~/components/reception/sample/sample-list-view.vue'

export default Vue.extend({
  beforeRouteEnter(to, from, next) {
    next(vm => {
      let result = false
      if (isNaN(+to.params.id)) {
        result = vm.$store.getters['authorization/isAuthorized'](
          'Reception/Create'
        )
      } else {
        result = vm.$store.getters['authorization/isAuthorized'](
          'Reception/Edit'
        )
      }
      if (result) {
        next()
      } else {
        vm.$router.push({ path: '/error?code=authorization' })
      }
    })
  },
  components: {
    patientComponent,
    treatingPhysicianComponent,
    sampleList
  },
  data() {
    let reception = <IReception>{
      Id: 0,
      Patient: {},
      TreatingPhysician: {},
      SampleCount: 0
    }
    return {
      reception: reception,
      step: 1,
      completedStep: 1
    }
  },
  computed: {},
  async mounted() {
    let loader = this.$loader.show(this.$refs.wrapper)
    await this.getReception(+this.$route.params.id)
    loader.hide()
  },
  created() {},
  watch: {
    $route(to, from) {
      
      if (to.query.msg && to.query.msg == 'receptionConfirmed') {
        
      }
    }
  },
  methods: {
    print() {
      console.log('print')
      this.$toast.success().show({
        message: 'پذیرش با موفقیت ثبت شد.',
        top: true,
        customClass: 'toast-customClass success'
      })
    },
    goToMainPage() {
      this.$router.push('/secretaries/samples')
    },
    async getReception(receptionId: number) {
      if (receptionId <= 0) {
        return
      }

      try {
        this.reception = await this.$service.reception.getReception(receptionId)
      } catch (error) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          top: true,
          message: error.message || this.$t('msg.UI.fail')
        })
      }
    }
  }
})
</script>