<template>
  <span id="time">{{timeDuration|persianDigit}}</span>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    duration: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      state: 'started',
      interval: null, // new NodeJS.Timeout(),
      timeDuration: '',
      timeElapsed: 0
    }
  },
  watch: {
    duration: {
      handler() {
        this.reset()
      },
      deep: true
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      this.state = 'started'
      this.timeElapsed = 0
      this.timeDuration = ''
      this.interval = <any>setInterval(this.clockRunning, 1000)
    },
    clockRunning() {
      if (this.timeElapsed > this.duration) {
        this.$emit('done')
        clearInterval(<any>this.interval)        
      }

      let tempTimeElapsed = new Date(this.timeElapsed)
      this.timeElapsed += 1000
    
      let hrs = tempTimeElapsed.getUTCHours()
      let min = tempTimeElapsed.getUTCMinutes()
      let sec = tempTimeElapsed.getUTCSeconds()

      this.timeDuration = hrs
        ? hrs.toString().padStart(2, '0') + ':'
        : '' +
          min.toString().padStart(2, '0') +
          ':' +
          sec.toString().padStart(2, '0')
    },
    resume() {
      this.state = 'started'
      ;(<any>this).interval = setInterval(this.clockRunning, 1000)
    },
    pause() {
      clearInterval(<any>this.interval)
      this.state = 'paused'
    }
  }
})
</script>