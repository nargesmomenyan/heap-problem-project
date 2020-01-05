<template>
  <v-container grid-list-md text-xs-center>
    <v-layout row wrap align-space-between>
      <v-flex xs6>
        <v-card>
          <v-card-text>
            <div>
              <!-- <vr-chart :option="option1"></vr-chart> -->
              <vr-chart
                :type="option1.type"
                :title="option1.title"
                :subtitle="option1.yTitle"
                :series="option1.dataSeries"
              ></vr-chart>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card>
          <v-card-text>
            <div>
              <vr-chart
                :type="option2.type"
                :title="option2.title"
                :subtitle="option2.yTitle"
                :series="option2.dataSeries"
              ></vr-chart>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex xs6>
        <v-card>
          <v-card-text>
            <div>
              <vr-chart
                :type="option3.type"
                :title="option3.title"
                :subtitle="option3.yTitle"
                :series="option3.dataSeries"
              ></vr-chart>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>

      <v-flex xs6>
        <v-card>
          <v-card-text>
            <div>
              <vr-chart
                :type="option4.type"
                :title="option4.title"
                :subtitle="option4.yTitle"
                :series="option4.dataSeries"
              ></vr-chart>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      option1: <any>{},
      option2: <any>{},
      option3: <any>{},
      option4: <any>{}
    }
  },
  mounted() {
    this.option1 = {
      type: 'spline',
      title: 'تعداد تماس ها در سه ماه اخیر',
      xAxisCategories: ['فروردین', 'اردیبهشت', 'خرداد'],
      yTitle: 'تعداد تماس',
      dataSeries: [
        {
          name: 'موفق',
          data: [504, 258, 200]
        },
        {
          name: 'ناموفق',
          data: [100, 20, 110]
        }
      ]
    }

    this.option2 = {
      type: 'bar',
      title: 'آمار ثبت پزشکان و بیماران جدید در سال جاری',
      xAxisCategories: ['فروردین', 'اردیبهشت', 'خرداد'],
      yTitle: 'تعداد ثبت',
      dataSeries: [
        {
          name: 'پزشک ',
          data: [100, 208, 550]
        },
        {
          name: 'بیمار',
          data: [900, 700, 890]
        }
      ]
    }

    this.option3 = {
      type: 'areaspline',
      title: 'میزان هزینه و درآمد سال جاری از تماس‌ها',
      subTitle: '<a href="https://resaa.net">https://resaa.net</a>',
      xAxisCategories: [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور'
      ],
      yTitle: 'میزان هزینه/درآمد - میلیون تومان',
      dataSeries: [
        {
          name: 'هزینه ',
          data: [10, 20, 15, 19, 29, 35]
        },
        {
          name: 'درآمد',
          data: [15, 21, 22, 30, 37, 45]
        }
      ]
    }

    this.option4 = {
      type: 'pie',
      title: 'آمار تماس‌ها بر اساس تخصص پزشک در 3 ماه اخیر',
      dataSeries: [
        {
          name: 'Brands',
          colorByPoint: true,
          data: [
            {
              name: 'Chrome',
              y: 61.41,
              sliced: true,
              selected: true
            },
            {
              name: 'Internet Explorer',
              y: 11.84
            },
            {
              name: 'Firefox',
              y: 10.85
            },
            {
              name: 'Edge',
              y: 4.67
            },
            {
              name: 'Safari',
              y: 4.18
            },
            {
              name: 'Sogou Explorer',
              y: 1.64
            },
            {
              name: 'Opera',
              y: 1.6
            },
            {
              name: 'QQ',
              y: 1.2
            },
            {
              name: 'Other',
              y: 2.61
            }
          ]
        }
      ]
    }
  }
})
</script>

