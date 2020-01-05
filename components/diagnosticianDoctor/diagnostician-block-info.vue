<style lang="scss">
#diagnosis-block-slide-wrapper {

  .block-wrapper {
    width: 100%;
    height: 103px;
    border-radius: 4px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.3);
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    padding: 20px 5px;

    .block-info {
      width: 80%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;

      .block-info-detail {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        height: 60px;
        padding: 0 10px;

        .block-info-caption {
          color: $form-info-color;
          font-size: 0.875rem;
          height: 40px;
        }
        .block-info-text {
          color: $form-info-color;
          font-size: 0.75rem;
          height: 20px;
          text-align: center;
        }
      }
    }

    .block-action {
      display: flex;
      height: 100%;
      width: 20%;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>

<template>
  <div id="diagnosis-block-slide-wrapper" ref="blockInfoWrapper">
    <div class="block-wrapper" >
      <div class="block-info">
       
        <div class="block-info-detail">
          <span class="block-info-caption">{{$t('block.number')}}</span>
          <span class="block-info-text">{{1}}</span>
        </div>
        <div class="block-info-detail">
          <span class="block-info-caption">{{$t('block.detail')}}</span>
          <span class="block-info-text">{{block.Detail}}</span>
        </div>
      </div>
   
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { IBlock } from '~/models/reception/IBlock'
export default Vue.extend({
  components: {  },
  props: {
    blockProp: {
      type: Object as () => IBlock,
      required: false
    },
  
  },
  watch: {
    blockProp: {
      handler() {
        this.block = this.blockProp
      },
      deep: true
    }
  },
  data() {
    return {
      block: this.blockProp || <IBlock>{ Detail: ' جزئیات بلاک ', Id: 0 }
    }
  },
  methods: {

  }
})
</script>