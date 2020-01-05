<style lang="scss">
#pass-info-wrapper {
  height: 143px;
  border-radius: 4px;
  border: solid 1px #a5a5a5;
  width: 100%;
  display: flex;
  padding: 15px;
  padding-bottom: 0;
  flex-direction: column;
  position: relative;

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
  .all-description {
    width: 100%;
    text-align: center;
    bottom: 0;
    position: absolute;
  }
}
</style>
<template>
  <div id="pass-info-wrapper" ref="passWrapper">
    <div class="pass-head">{{$t('pass.description')}}</div>
    <div class="pass-description">{{description}}</div>
    <div class="all-description">
      <v-btn @click="showDialogAllPassDescription" text>{{$t('pass.show-all-description')}}</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IPass } from '~/models/reception/IPass'
import passDescription from '~/components/technician/pass-description.vue'
export default Vue.extend({
  props: {
    sampleId: {
      required: true,
      type: Number
    }
  },
  data() {
    return {
      description: ''
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
        if (passes) {
          this.description = passes.map(x => x.Report).join('\n')
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
    showDialogAllPassDescription() {
      if (this.description) {
        this.$dialog.show({
          component: passDescription || '',
          props: { description: this.description }
        })
      } else {
        this.$toast.error().show({
          message: 'پاس دارای توضیحات نیست',
          top: true,
          customClass: 'toast-customClass error'
        })
      }
    }
  }
})
</script>