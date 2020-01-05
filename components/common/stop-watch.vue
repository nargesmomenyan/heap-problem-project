<template>
  <span id="time">{{timeDuration|persianDigit}}</span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    startTime: {
      type: Number,
      default: 0
    }
  },
  watch: {
    startTime: {
      handler() {
        if (this.startTime) {
          this.reset()
        }
      },
      deep: true
    }
  },
  data() {
    return {
      state: 'started',
      interval: null,
      timeDuration: ''
    }
  },
  mounted() {
    this.reset()
  },
  methods: {
    reset() {
      this.state = 'started'
      this.interval = <any>setInterval(this.clockRunning, 1000)
    },
    pause() {
      let elapsed = new Date(new Date().getTime() - this.startTime)
      clearInterval(<any>this.interval)
      this.state = 'paused'
      return elapsed.getTime()
    },
    resume() {
      this.state = 'started'
    },
    clockRunning() {
      let currentTime = new Date()
      let timeElapsed = new Date(currentTime.getTime() - this.startTime)
      let hrs = timeElapsed.getUTCHours()
      let min = timeElapsed.getUTCMinutes()
      let sec = timeElapsed.getUTCSeconds()

      this.timeDuration = hrs
        ? hrs.toString().padStart(2, '0') + ':'
        : '' +
          min.toString().padStart(2, '0') +
          ':' +
          sec.toString().padStart(2, '0')
    }
  }
})
</script>