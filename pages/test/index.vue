<template>
  <v-stepper vertical v-model="step">
    <v-stepper-step
      :edit-icon="'check'"
      :complete-icon="'edit'"
      step="1"
      :editable="completedStep>0"
    >{{$t('reception.patient-info')}}</v-stepper-step>
    <v-stepper-content step="1">
      <div>
        <vr-form-generator :item="item" :formData="formData"></vr-form-generator>
      </div>
    </v-stepper-content>

    <v-stepper-step
      :edit-icon="'check'"
      :complete-icon="'edit'"
      step="2"
      :editable="completedStep>1"
    >پزشک معالج</v-stepper-step>
    <v-stepper-content step="2">hi 2</v-stepper-content>

    <v-stepper-step
      :edit-icon="'check'"
      :complete-icon="'edit'"
      step="3"
      :editable="completedStep>2"
    >{{$t('sample.sample-info')}}</v-stepper-step>

    <v-stepper-content step="3">hi 3</v-stepper-content>

    <v-stepper-step step="4">{{$t('actions.confirm')}}</v-stepper-step>
    <v-stepper-content step="4">hi 4</v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
  data() {
    return {
      formData: [],
      step: 3,
      completedStep: 1,
      item: {
        state: 'Tehran',
        city: 'Tehran'
      },
      TehranCities: [{ text: 'Tehran', value: 'Tehran' }],
      IsfahanCities: [{ text: 'Isfahan', value: 'Isfahan' }],
      citites: []
    }
  },
  mounted() {
    this.citites = this.TehranCities
    this.formData = [
      {
        title: 'test',
        rows: [
          {
            type: 'select',
            model: 'state',
            items: [
              { text: 'Tehran', value: 'Tehran' },
              { text: 'Isfahan', value: 'Isfahan' }
            ],
            onChange: this.checked
          },
          {
            type: 'select',
            model: 'city',
            items: this.citites
          }
        ]
      }
    ]
  },
  methods: {
    checked($event) {
      if ($event == 'Tehran') {
        this.formData[0].rows[1].items = this.TehranCities
        this.item.city = 'Tehran'
      } else {
        this.formData[0].rows[1].items = this.IsfahanCities
        this.item.city = 'Isfahan'
      }
    }
  }
}
</script>