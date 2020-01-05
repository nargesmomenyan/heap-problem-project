<style lang="scss">
.form-answer-section {
  direction: ltr;

  .form-group {
    .v-text-field--outlined fieldset {
      padding-left: 8px !important;
    }

    .v-text-field .v-label {
      transform-origin: top left;
      top: 10px;
    }
    .v-text-field--outlined legend {
      text-align: left !important;
      font-size: 10px !important;
    }
    .v-input {
      font-size: 13px;
      height: 48px !important;
      &.v-input--is-focused {
        .v-input__slot {
          border-color: $primary-color !important;
        }
      }

      .v-label {
        left: 0 !important;
        right: auto !important;
        text-align: left;
        width: 350px;
      }

      .v-input__slot {
        min-height: 48px !important;
        border-width: 1px !important;
        border-color: #e2e5ec !important;
        align-items: center;
      }
      .v-input__prepend-inner {
        margin-top: 6px;
      }
      .v-input__append-inner {
        margin-top: 6px;
      }

      input {
        margin-top: 0;
      }
    }
    .v-input--selection-controls {
      margin-top: 0;
      padding-top: 0;
    }
    .v-messages {
      min-height: 18px;
    }
    .v-text-field__suffix {
      background: #f5f5f5;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: -12px;
      min-width: 40px;
      border-radius: 4px 0 0 4px;
    }
    .v-text-field--outlined fieldset {
      border-color: #e2e5ec !important;
    }

    .inner-element {
      padding-left: 20px;
    }
  }

  .nav-answer-btn {
    width: 74px !important;
    height: 32px !important;
    font-size: 14px !important;
  }
  .swiper-pagination-bullet-custom {
    width: 12px;
    height: 12px;

    color: #000;
    opacity: 1;
    background: rgba(0, 0, 0, 0.2);
  }
  .swiper-pagination-bullet-custom.swiper-pagination-bullet-active {
    color: #fff;
    background: $primary-color;
  }
}
</style>

<template>
  <section>
    <div class="form-answer-section">
      <!-- <div v-for="(groupElement, sectionIndex) in propertyGroupList" :key="sectionIndex">
        <propertyGroupComponent :propertyGroup="groupElement" />
      </div>-->

      <swiper :options="swiperOption" ref="mySwiper" @someSwiperEvent="callback">
        <!-- slides -->
        <swiper-slide v-for="(groupElement, sectionIndex) in propertyGroupList" :key="sectionIndex">
          <propertyGroupComponent :propertyGroup="groupElement" />
        </swiper-slide>
        <!-- Optional controls -->

        <div slot="button-prev">
          <v-btn class="nav-answer-btn">{{$t('diagnosis.previous-answer')}}</v-btn>
        </div>
        <div class="swiper-pagination swiper-pagination-bullets" slot="pagination"></div>
        <div slot="button-next">
          <v-btn class="nav-answer-btn">{{$t('diagnosis.next-answer')}}</v-btn>
        </div>
        <div class="swiper-scrollbar" slot="scrollbar"></div>
      </swiper>
      
    </div>
  </section>
</template>
<script>
import FormControlls from './form-controlls/index'
import propertyGroupComponent from './property-group-component.vue'
import propertyComponent from './property-component.vue'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'

export default {
  inject: ['$validator'],
  components: {
    FormControlls,
    propertyGroupComponent,
    propertyComponent,
    swiper,
    swiperSlide
  },
  props: {
    form: {
      default: () => {
        return {}
      }
    },
    // value: {
    //   require: true
    // },

    propertyGroupList: {
      required: true
    }
  },
  data() {
    return {
      item: this.value,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          renderBullet(index, className) {
            return `<span class="${className} swiper-pagination-bullet-custom"></span>`
          }
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    }
  },

  watch: {
    value: {
      handler: function(value, oldValue) {
        if (JSON.stringify(value) == JSON.stringify(oldValue)) {
          return
        }
        this.item = { ...value }
      },
      deep: true
    },
    item: {
      handler: function() {
        this.$emit('input', this.item)
      },
      deep: true
    }
  },
  created() {
    this.form.moveToFirstError = this.moveToFirstError
    this.form.validate = this.validate
    this.form.resetError = this.resetError
  },
  methods: {
    callback($event) {},
    moveToFirstError() {
      const field = this.$validator.fields.find({
        id: this.errors.items[0].id
      })
      if (field) {
        this.$scrollTo(field.el, 1000, { offset: -150 })
      }
    },
    validate() {
      return new Promise((resolve, reject) => {
        this.$validator.validateAll().then(async valid => {
          resolve(valid)
          if (!valid) {
            this.form.moveToFirstError()
          }
        })
      })
    },
    resetError() {
      this.errors.clear()
    },
    change_field(field) {
      if (field.onChange) {
        field.onChange(this.item[field.model])
      }
    }
  }
}
</script>