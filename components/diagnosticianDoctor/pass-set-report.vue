<style lang="scss">
#pass-set-report-wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  .pass-head {
    text-align: right;
    font-size: 14px;
    color: $form-info-color;
    padding: 5px 0;
  }
  .pass-description {
    color: $form-info-color;
    padding: 5px 0;
  }
  .pass-report-action {
    width: 100%;
    text-align: left;
  }
  .pass-report {
    width: 100%;
  }
}
</style>
<template>
  <div id="pass-set-report-wrapper" ref="passWrapper">
    <v-textarea
      class="pass-report"
      outlined
      rows="4"
      :label="$t('pass.description')"
      autocomplete="off"
      v-model="pass.Report"
      :data-vv-as="$t('pass.description')"
      v-validate="'required'"
      name="description"
      :error-messages="errors.collect('description')"
    />

    <div class="pass-report-action">
      <v-btn @click="setPassReport">{{$t('pass.set-pass-description')}}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IPass } from '~/models/reception/IPass'
import expandableTextarea from '~/components/common/expandable-textarea.vue'
export default Vue.extend({
  props: {
    sampleId: {
      required: true,
      type: Number
    }
  },
  components: { expandableTextarea },
  data() {
    return {
      pass: <IPass>{ SampleId: this.sampleId}
    }
  },
  mounted() {
    this.getPasses()
  },
  methods: {
    async getPasses() {
      let loader = this.$loader.show(this.$refs.passWrapper)
      try {
        let passes = await this.$service.sample.sampleGetPasses(this.sampleId)
        
        if (passes && passes.length > 0) {
          this.pass = passes.pop() || <IPass>{}
        }
      } catch (error) {
        this.$toast.error().show({
          message: error.message || this.$t('msg.UI.fail'),
          top: true,
          customClass: 'toast-customClass error'
        })
      }
      loader.hide()
    },
    async setPassReport() {
      let valid = await this.$validator.validateAll()
      if (!valid) {
        return
      }
      let loader = this.$loader.show(this.$refs.passWrapper)
      this.$service.processingReception
        .samplePassSetReport(this.pass)
        .then(() => {
          this.$toast.success().show({
            message: this.$t('msg.UI.success').toString(),
            top: true,
            customClass: 'toast-customClass success'
          })
        })
        .catch(error => {
          this.$toast.error().show({
            message: this.$t('msg.UI.fail').toString(),
            top: true,
            customClass: 'toast-customClass error'
          })
        })
      loader.hide()
    }
  }
})
</script>