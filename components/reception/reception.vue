<style lang="scss" >

</style>
<template>
  <div ref="wrapper" class="wrapper-reception">
    <div class="head-reception">
      <div
        class="guide-reception"
      >لطفا برای ثبت پذیرش جدید، اطلاعات زیر را به ترتیب از راست به چپ وارد کنید.</div>
      <div tabindex="-1">
        <v-btn
          class="cancel-reception"
          tabindex="-1"
          text
          @click="cancel"
        >{{$t('reception.cancel')}}</v-btn>
      </div>
    </div>
    <div class="body-reception">
      <div class="reception-form">
        <v-row>
          <v-col md="3" xs="12">
            <v-text-field
              outlined
              :label="$t('reception.number')"
              v-model="reception.ReceptionNumber"
              name="receptionNumber"
              :data-vv-as="$t('reception.number')"
              v-validate="'required'"
              autocomplete="off"
              :error-messages="errors.collect('receptionNumber')"
            ></v-text-field>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <v-col md="6" sm="12">
          <patientComponent
            :patient_prop="reception.Patient"
            @selectedPatient="selectedPatient"
            @submitPatientInfo="submitPatientInfo"
            :isViewMode="step>1"
            :focus="step==1"
          />
        </v-col>
        <v-col md="6" sm="12">
          <div v-if="step==1" class="img-treatingPhysician-large">
          </div>
          <treatingPhysicianComponent
            v-else
            :treatingPhysician_prop="reception.TreatingPhysician"
            @selectedTreatingPhysician="selectedTreatingPhysician"
            @submitTreatingPhysicianInfo="submitTreatingPhysicianInfo"
            :isViewMode="step>2"
            :focus="step==2"
          />
        </v-col>
      </v-row>
      <div class="body-reception-gap"></div>
      <div v-if="step >= 3">
        <sampleList
          ref="sampleList"
          :receptionId="reception.Id"
          @changeSamples="changeSamples"
          :step="'reception'"
        />
      </div>
      <div class="body-reception-gap"></div>
      <div v-if="step >= 4">
        <confirmInfo
          ref="confirmInfo"
          :receptionProp="reception"
          :deliveryDate="reception.DeliveryDate"
          @confirm="confirm"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import patientComponent from '~/components/reception/patient.vue'
import treatingPhysicianComponent from '~/components/reception/treatingPhysician.vue'
import { IIndividualUser } from '~/models/IndividualUser'
import { IReception } from '~/models/reception/IReception'
import sampleList from '~/components/reception/sample/sample-list.vue'
import confirmInfo from '~/components/reception/confirm-info.vue'
import { receptionStatusEnum } from '~/enums/receptionStatus'
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
    sampleList,
    confirmInfo
  },
  data() {
    let reception = <IReception>{
      Id: 0,
      ReceptionNumber: '',
      Patient: {},
      TreatingPhysician: {},
      SampleCount: 0
    }
    return {
      previousRefer: { count: 2, date: new Date() },
      reception: reception,
      step: 1
    }
  },
  computed: {},
  async mounted() {
    let loader = this.$loader.show(this.$refs.wrapper)
    let receptionId = +this.$route.params.id

    if (isNaN(receptionId)) {
      await this.loadTempReception()
    } else {
      await this.getReception(receptionId)
    }
    this.setReceptionStep()
    if (
      this.step == 1 &&
      (!this.reception.ReceptionNumber || this.reception.ReceptionNumber == '')
    ) {
      this.getRandomReceptionNumber()
    }
    loader.hide()
  },
  fetch() {},
  async created() {},
  watch: {
    reception: {
      handler() {
        this.setReceptionStep()
      }
    }
  },
  methods: {
    cancel() {
      this.$dialog
        .confirm({
          title: ' ',
          message: this.$t('reception.msg.warn-cancel').toString(),
          ok_txt: this.$t('actions.confirm-cancel').toString(),
          cancel_txt: this.$t('actions.cancel').toString(),
          dialog_wrapper_custom_class: 'dialog_wrapper_confirm-cancel-secretary'
        })
        .then(() => {
          this.clearInfo()
          this.$router.push({ path: '/secretaries/samples' })
        })
    },
    selectedTreatingPhysician($event) {
      this.reception.TreatingPhysician = $event
      this.setStore()
    },
    selectedPatient($event) {
      this.reception.Patient = $event
      this.setStore()
    },
    submitPatientInfo($event) {
      this.reception.Patient = $event
      // this.completedStep = 2
      this.step = 2
      this.setStore()
    },
    async submitTreatingPhysicianInfo($event) {
      this.reception.TreatingPhysician = $event

      const result = await this.saveReception()
      if (result) {
        // this.completedStep = 3
        this.step = 3
      }
      this.setStore()
    },
    async saveReception() {
      let loader = this.$loader.show(this.$refs.wrapper)
      try {
        let result = await this.$service.reception.saveReception(this.reception)
        if (result) {
          this.reception.Id = result.Id
          this.reception.ReceptionNumber = result.ReceptionNumber
        }
        loader.hide()
        return true
      } catch (error) {
        this.$toast.error().show({
          customClass: 'toast-customClass error',
          top: true,
          message: error.message || this.$t('reception.msg.reception-save-fail')
        })
        loader.hide()
        return false
      }
    },
    setStore() {
      localStorage.setItem(
        'inProgressReception',
        JSON.stringify(this.reception)
      )
    },
    changeSamples(sampleList) {
      if (sampleList) {
        this.reception.SampleCount = sampleList.length

        let dates = sampleList.map(x => {
          return x.DeliveryDate
        })

        this.reception.DeliveryDate = dates.reduce(
          (a, b) => (a > b ? a : b),
          new Date()
        )

        if (this.reception.SampleCount > 0) {
          this.step = 4
        } else {
          if (this.step > 3) {
            this.step = 3
          }
        }
      }
    },
    confirm($event) {
      if (this.$route.params.id && +this.$route.params.id > 0) {
        //  window.location.reload(true)
        this.$router.push(
          `/secretaries/receptions/${this.reception.Id}?msg=receptionConfirmed`
        )
      } else {
        this.$router.push(
          `/secretaries/receptions/${this.reception.Id}?msg=receptionConfirmed`
        )
      }
      localStorage.removeItem('inProgressReception')
    },
    clearInfo() {
      localStorage.removeItem('inProgressReception')

      this.reception = <IReception>{
        Id: 0,
        Patient: {},
        TreatingPhysician: {},
        SampleCount: 0
      }
      this.step = 1
    },
    async loadTempReception() {
      let temp = localStorage.getItem('inProgressReception')
      if (!temp) {
        return
      }

      let tempReception = JSON.parse(temp)
      if (tempReception.Id) {
        try {
          tempReception = await this.$service.reception.getReception(
            tempReception.Id
          )
        } catch (error) {
          tempReception = {}
        }
      }

      if (
        tempReception &&
        tempReception.Patient &&
        +tempReception.Patient.Id > 0
      ) {
        this.$dialog
          .confirm({
            title: 'ثبت پذیرش',
            message:
              'یک پذیرش ناتمام در حال ثبت بوده است. آیا مایل به مشاهده اطلاعات هستید؟ ',
            ok_txt: this.$t('actions.yes').toString(),
            cancel_txt: this.$t('actions.no').toString(),
            dialog_wrapper_custom_class:
              'dialog-wrapper-confirm-cancel-technician'
          })
          .then(() => {
            this.reception = tempReception
          })
          .catch(() => {
            this.clearInfo()
          })
      }
    },
    async getReception(receptionId: number) {
      if (receptionId <= 0) {
        return
      }

      try {
        let tempReception = await this.$service.reception.getReception(
          receptionId
        )
        if (
          tempReception &&
          tempReception.Status == receptionStatusEnum.InProgress
        ) {
          this.reception = tempReception
        }
      } catch (error) {
        this.clearInfo()
      }
    },
    setReceptionStep() {
      if (this.reception) {
        if (this.reception.SampleCount > 0) {
          ;(<any>this).$scrollTo(this.$refs.confirmInfo, 1000)
          this.step = 4
        } else if (this.reception.Id) {
          ;(<any>this).$scrollTo(this.$refs.sampleList, 1000)
          this.step = 3
        } else if (
          this.reception.TreatingPhysician &&
          this.reception.TreatingPhysician.RoleUserId
        ) {
          this.step = 3
        } else if (
          this.reception.Patient &&
          this.reception.Patient.RoleUserId
        ) {
          this.step = 2
        } else {
          this.step = 1
        }
      } else {
        this.step = 1
      }
    },
    async getRandomReceptionNumber() {
      try {
        this.reception.ReceptionNumber = await this.$service.reception.getRandomReceptionNumber()
      } catch (error) {}
    }
  }
})
</script>