<style lang="scss">
#audio-recorder-wrapper {
  width: 314px;
  height: 288px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  .audio-recorder-head {
    color: $form-title-color;
    font-size: 16px;
    text-align: right;
    font-weight: 500;
    padding: 5px 0;
    position: relative;
  }
  .audio-recorder-guide {
    font-size: 14px;
    font-weight: 300;
    text-align: right;
    padding: 5px 0;
  }
  .audio-recordingState {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 150px;
    .audio-bar {
      width: 262px;
      height: 39px;
      canvas {
        width: 262px;
        height: 39px;
      }
      // background-color: #eaf7ff;
    }
    .audio-action {
      display: flex;
      align-items: center;
      width: 262px;
      padding: 10px 0;
      &.recording {
        justify-content: flex-end;
      }
      &.recorded {
        justify-content: space-between;
      }
      .v-btn {
        margin: 0 !important;
        padding: 0 !important;
        height: 32px;
        width: 32px;
        min-width: 32px;
      }
      .audio-action-left {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
      .time-record {
        padding: 0 10px;
      }
    }
  }
  .audio-recorder-icon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 150px;
    .v-btn {
      height: 64px;
      width: 64px;
    }
  }
  .audio-recorder-action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;

    .audio-recorder-action-cancel {
      color: $form-info-color !important;
      font-size: 14px;
      font-weight: 500;
      margin: 0 !important;
    }
  }
}
</style>
<template>
  <section id="audio-recorder-wrapper">
    <div class="audio-recorder-head">{{$t('audio.send-audio')}}</div>
    <div v-if="recordingState=='none'" class="audio-recorder-guide">{{$t('audio.guide')}}</div>
    <div v-if="recordingState=='none'" class="audio-recorder-icon">
      <v-btn @click="startRecording" text>
      </v-btn>
    </div>
    <div v-else-if="recordingState=='recording'" class="audio-recordingState">
      <div class="audio-bar">
        <canvas ref="recordingVisualizer"></canvas>
      </div>
      <div class="audio-action recording">
        <stopWatch class="time-record" :startTime="startTime" ref="stopWatch" />
        <v-btn text @click="stopRecording">
        </v-btn>
      </div>
    </div>

    <div v-else-if="recordingState=='recorded'" class="audio-recordingState">
      <div class="audio-bar">
        <canvas ref="palyingVisualizer"></canvas>
      </div>
      <div class="audio-action recorded">
        <v-btn @click="deleteRecording" text>
        </v-btn>
        <div v-if="playing" class="audio-action-left">
          <timer class="time-record" :duration="recordedTime" ref="timer" @done="timerFinished" />
          <v-btn text @click="pauseRecording">
          </v-btn>
        </div>
        <div v-else class="audio-action-left">
          <span class="time-record">{{recordedTimeDisplay}}</span>
          <v-btn text @click="playRecording">
          </v-btn>
        </div>
      </div>
    </div>

    <div class="audio-recorder-action">
      <v-btn @click="cancel" class="audio-recorder-action-cancel" text>{{$t('actions.cancel')}}</v-btn>
      <v-btn
        class="small"
        :disabled="disableRecording"
        @click="saveAudio"
      >{{$t('audio.save-audio')}}</v-btn>
    </div>
  </section>
</template>
<script lang="ts">
import Vue from 'vue'
import stopWatch from '~/components/common/stop-watch.vue'
import timer from '~/components/common/timer.vue'
import { IFile } from '../../models/base/IFile'

export default Vue.extend({
  components: { stopWatch, timer },
  props: {
    sampleId: {
      type: Number,
      required: true
    }
  },
  data() {
    let mediaRecorder: any
    let audioTrack: any
    return {
      recordingState: 'none',
      playing: false,
      mediaRecorder: mediaRecorder,
      audioTrack: audioTrack,
      audioChunks: [],
      recordedTime: <number>0,
      startTime: 0,
      stopTime: 0,
      disableRecording: false,
      streamRecorded: null
    }
  },
  computed: {
    recordedTimeDisplay() {
      if (!this.recordedTime) {
        return '00:00'
      }

      let temp = new Date((<any>this).recordedTime)
      let hrs = temp.getUTCHours()
      let min = temp.getUTCMinutes()
      let sec = temp.getUTCSeconds()

      return hrs
        ? hrs.toString().padStart(2, '0') + ':'
        : '' +
            min.toString().padStart(2, '0') +
            ':' +
            sec.toString().padStart(2, '0')
    }
  },
  mounted() {
    if (navigator.mediaDevices.getUserMedia) {
      let that = this
      const constraints = { audio: true }
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          ;(<any>this).handleSuccess(stream)
        })
        .catch(error => {
          ;(<any>this).handleError(error)
          ;(<any>that).disableRecording = true
        })
    } else {
      ;(<any>this).$toast.error().show({
        message: (<any>this).$t('audio.error-browser-notSupported').toString(),
        top: true,
        customClass: 'toast-customClass error'
      })
      ;(<any>this).disableRecording = true
    }
  },
  methods: {
    callback(data) {
      console.debug(data)
    },
    saveAudio() {
      this.$service.processingReception.passSaveAudioReport(
        <IFile>{
          Extension: 'audio/ogg',
          FileName: `sample-pass-audio-report`,
          Type: 2,
          Body: (<any>this).audioTrack
        },
        (<any>this).sampleId
      )
    },
    cancel() {
      ;(<any>this).deleteRecording()
      this.$emit('hide')
    },
    startRecording() {
      if (
        (<any>this).mediaRecorder &&
        (<any>this).mediaRecorder.state == 'inactive'
      ) {
        ;(<any>this).mediaRecorder.start()
        ;(<any>this).startTime = new Date().getTime()
        ;(<any>this).recordingState = 'recording'
      }
    },
    stopRecording() {
      if (
        (<any>this).mediaRecorder &&
        (<any>this).mediaRecorder.state == 'recording'
      ) {
        let canvas: HTMLCanvasElement = this.$refs[
          'recordingVisualizer'
        ] as HTMLCanvasElement
        ;(<any>this).streamRecorded = (<any>canvas).captureStream(25)
        ;(<any>this).recordedTime = (<any>this).$refs.stopWatch.pause()
        ;(<any>this).mediaRecorder.stop()
        ;(<any>this).recordingState = 'recorded'
        ;(<any>this).playing = false
      }
    },
    handleError(error) {
      let errorMsg = this.$t('msg.UI.fail').toString()

      if (error.name == 'NotFoundError') {
        errorMsg = this.$t('audio.error-microphone-notfound').toString()
      }
      this.$toast.error().show({
        message: errorMsg,
        top: true,
        customClass: 'toast-customClass error'
      })
      console.log(
        'navigator.MediaDevices.getUserMedia error: ',
        error.message,
        error.name
      )
    },
    handleSuccess(stream) {
      ;(<any>this).mediaRecorder = new MediaRecorder(stream)

      let that = this
      ;(<any>this).mediaRecorder.ondataavailable = function(e) {
        ;(<any>that).audioChunks.push(e.data)
      }
      ;(<any>this).mediaRecorder.onstart = function() {
        ;(<any>that).visualize(stream, 'recordingVisualizer')
      }
      ;(<any>this).mediaRecorder.addEventListener('stop', () => {
        const audioBlob = new Blob((<any>that).audioChunks, {
          type: 'audio/ogg; codecs=opus'
        })
        ;(<any>that).audioTrack = window.URL.createObjectURL(audioBlob)
        // const audioUrl = URL.createObjectURL(audioBlob)
        // const audio = new Audio(audioUrl)
        // audio.play()
      })
    },
    deleteRecording() {
      if (!(<any>this).mediaRecorder) {
        return
      }
      if ((<any>this).mediaRecorder.state == 'recording') {
        ;(<any>this).mediaRecorder.stop()
      }
      ;(<any>this).audioChunks = []
      ;(<any>this).recordingState = 'none'
      ;(<any>this).audioTrack = null
    },
    playRecording() {
      try {
        ;(<any>this).playing = true
        ;(<any>this).visualize((<any>this).streamRecorded, 'palyingVisualizer')
      } catch (error) {}
      // let stream = new MediaStream([(<any>this).audioTrack])
    },
    pauseRecording() {
      ;(<any>this).playing = false
      let timer = this.$refs.timer
      if (timer) {
        ;(<any>timer).pause()
      }
    },
    timerFinished() {
      ;(<any>this).recordingState = 'recorded'
      ;(<any>this).playing = false
    },
    visualize(stream, canvasRef) {
      let audioCtx

      let canvas: HTMLCanvasElement = this.$refs[canvasRef] as HTMLCanvasElement
      const canvasCtx = canvas.getContext('2d')

      if (!audioCtx) {
        audioCtx = new AudioContext()
      }

      const source = audioCtx.createMediaStreamSource(stream)

      const analyser = audioCtx.createAnalyser()
      analyser.fftSize = 32 //2048
      const bufferLength = analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)

      source.connect(analyser)

      draw()

      function draw() {
        let WIDTH: number = 0
        let HEIGHT: number = 0

        WIDTH = canvas.width
        HEIGHT = canvas.height

        requestAnimationFrame(draw)

        analyser.getByteTimeDomainData(dataArray)

        if (!canvasCtx) {
          console.log('canvasCtx is null')
          return
        }
        canvasCtx.fillStyle = '#eaf7ff'
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

        canvasCtx.lineWidth = 2
        canvasCtx.strokeStyle = '#168fd0'

        canvasCtx.beginPath()

        let sliceWidth = (WIDTH * 1.0) / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          let v = dataArray[i] / 128.0
          let y = (v * HEIGHT) / 2

          if (i === 0) {
            canvasCtx.moveTo(x, y)
          } else {
            canvasCtx.lineTo(x, y)
          }

          x += sliceWidth
        }

        canvasCtx.lineTo(WIDTH, HEIGHT / 2)
        canvasCtx.stroke()
      }
    }
  }
})
</script>