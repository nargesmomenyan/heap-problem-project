<style lang="scss">
#mapid {
  height: 300px;
  width: 100%;
}
</style>
<template>
  <div>
    <div id="mapid" ref="mapid"></div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { IFileCredential } from '~/models/base/IFileCredential'
import AWS_S3_Util from '~/services/base/AWS_S3_Util'
export default Vue.extend({
  name: 'LeafletMap',
  data() {
    return {
      map: null,
      zoom: 0,
      attribution: 'contributors',
      fileCredential: <IFileCredential>{}
    }
  },
  async mounted() {
    try {
      this.fileCredential = await this.$service.sample.slideScannedLayerGetToken()

      let AWS_S3 = new AWS_S3_Util(this.fileCredential)

      this.map = L.map('mapid').setView([0, 0], 1)
      let that = this

      L.TileLayer.Kitten = L.TileLayer.extend({
        getTileUrl: function(coords) {
          debugger

          let tempFileCredential = Object.assign({}, that.fileCredential)
          tempFileCredential.Key = `${coords.y}.jpg`
          tempFileCredential.Bucket =
            tempFileCredential.Bucket + `/${coords.z}/${coords.x}`

          let signedUrl = AWS_S3.getSignedUrlOfObject(tempFileCredential)
          return signedUrl

          //  theese commented codes are for test and will be removed later on

          //  return that.fileCredential.EndPoint +'/'+ that.fileCredential.Bucket +'/0/0/1.jpg'
          // return that.$service.processingReception.slideScanAreaGetFile(
          //   that.fileCredential,
          //   coords
          // )
          debugger
          // var i = Math.ceil(Math.random() * 4)
          // return 'https://placekitten.com/256/256?image=' + i
          // return 'http://localhost:3000/img/1.jpg'
          // return '/img/1.jpg'
        },
        getAttribution: function() {
          return ''
        }
      })

      L.tileLayer.kitten = function() {
        return new L.TileLayer.Kitten()
      }

      L.tileLayer.kitten().addTo((<any>this).map)
    } catch (error) {
      debugger
    }
  },
  beforeDestroy() {
    if ((<any>this).map) {
      ;(<any>this).map.remove()
    }
  }
})
</script>