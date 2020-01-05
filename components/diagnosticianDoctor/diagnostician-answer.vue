<style lang="scss">
#diagnosis-answer-wrapper {
  display: flex;
  flex-direction: column;

  .diagnosis-answer-head {
    height: 52px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
  .diagnosis-answer-head-caption {
    height: 22px;
    font-weight: bold;
    color: $form-info-color;
  }
  .diagnosis-answer-cancel {
    font-size: 16px;
    color: $form-clear-color !important;
    margin: 0 !important;
    padding: 0 !important;
    .v-icon {
      color: $form-clear-color !important;
      padding: 0 4px;
    }
  }
  .diagnosis-answer-form-wrapper {
    padding: 0 20px 0 30px;
  }
}
</style>
<template>
  <div id="diagnosis-answer-wrapper">
    <div class="diagnosis-answer-head">
      <span class="diagnosis-answer-head-caption">{{$t('diagnosis.add')}}</span>
      <v-btn class="diagnosis-answer-cancel" text>
        {{$t('actions.cancel')}}
        <v-icon>la-close</v-icon>
      </v-btn>
    </div>
    <div></div>
    <answer-form-generator
      class="diagnosis-answer-form-wrapper"
      :propertyGroupList="propertyGroupList"
    ></answer-form-generator>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {
  IAnswerDisplayPropertyGroup,
  IAnswerDisplayProperty
} from '~/modules/mobayyen-form-answer-generator/types/index'
export default Vue.extend({
  props: {
    sampleId: {
      type: Number,
      required: true
    }
  },
  watch: {
    sampleId: {
      handler() {
        this.getAnswerTemplate()
      },
      deep: true
    }
  },
  data() {
    return {
      propertyGroupList: <IAnswerDisplayPropertyGroup[]>[]
    }
  },
  mounted() {
    this.getAnswerTemplate()
  },
  methods: {
    getAnswerTemplate() {
      
      this.$service.answerTemplate.getAnswerTemplate().then(data => {
        this.propertyGroupList = data
        
      })
    }
  }
})
</script>