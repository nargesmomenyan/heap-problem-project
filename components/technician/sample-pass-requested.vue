<style lang="scss">
#sample-pass-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;

  .header-img-passed-wrapper {
    padding-bottom: 60px;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    .header-img-passed {
      width: 140px;
      height: 140px;
    }
  }
  .msg-passed {
    width: 100%;
    height: 45px;
    border-radius: 4px;
    border: solid 1px $primary-color;
    background-color: #eaf7ff;
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.79;
    letter-spacing: normal;
    text-align: right;
    color: $primary-color;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }

  .cancel-pass-request-wrapper {
    text-align: left;
    padding: 30px 0;
  }
  .cancel-pass-request {
    width: 137.4px;
    height: 40px;
    border-radius: 20px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
    border: solid 1px #f06a6a;
    background-image: linear-gradient(to right, #f7b6b6, #f06a6a);
    font-size: 14px;
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.36;
    letter-spacing: normal;
    text-align: center;
    color: #ffffff !important;
  }
}
</style>
<template>
  <div id="sample-pass-wrapper">
    <div class="header-img-passed-wrapper">
      <div class="header-img-passed"></div>
    </div>
    <div class="msg-passed">{{$t('sample.passed-msg')}}</div>
    <div v-if="cancelPassIsVisible()" class="cancel-pass-request-wrapper">
      <v-btn
        class="cancel-pass-request"
        @click="cancelPassRequest"
      >{{$t('sample.cancel-pass-request')}}</v-btn>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { sampleStatusEnum } from '~/enums/sampleStatus'
import { ISample } from '~/models/reception/ISample'
export default Vue.extend({
  props: {
    sample: {
      required: true,
      type: Object as () => ISample
    }
  },
  methods: {
    cancelPassRequest() {
      if (this.sample && this.sample.Id) {
        this.$service.processingReception
          .sampleCancelPassRequest(this.sample.Id)
          .then(data => {
            this.$emit('action', 'passRequestWasCanceled')
          })
          .catch(error => {
            this.$toast.error().show({
              message: error.message || this.$t('msg.UI.fail'),
              top: true,
              customClass: 'toast-customClass error'
            })
          })
      }
    },
    cancelPassIsVisible() {
      if (
        this.sample.SampleStatus == sampleStatusEnum.WaitForPassAssignment &&
        this.$authorization.check('Technician/DeletePassRequest')
      ) {
        return true
      }
      return false
    }
  }
})
</script>