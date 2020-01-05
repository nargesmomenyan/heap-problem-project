<style lang="scss" scoped>
.fileInput {
  height: 32px;
  width: 32px;
  font-size: 12px;
  cursor: pointer;
}
</style>
<template>
  <div>
    <v-file-input class="fileInput" :multiple="false" @change="filesChange($event.target.files)"></v-file-input>
    <label>{{'افزودن فایل'}}</label>

    <ul class="list-unstyled">
      <li v-for="(item, index) in uploadedFiles" :key="index">
        <img :src="item.url" class="img-responsive img-thumbnail" :alt="item.originalName" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      uploadedFiles: []
    }
  },
  methods: {
    filesChange(fileList) {
      // handle file changes
      const formData = new FormData()

      if (!fileList.length) return

      // append the files to FormData
      Array.from(Array(fileList.length).keys()).map(x => {
        
        this.save(fileList[x]) //formData.append(fileList[x], fileList[x].name)
      })
    },
    async save(file) {
      try {
        // let response = await this.$service.processingReception.saveFile({
        //   Type: file.type,
        //   Extension: file.name.split('.').pop(),
        //   FileName: file.name,
        //   Body: file
        // })
      } catch (err) {
        console.log(err)
        this.$toast.error().show({
          message: this.$t('msg.UI.fail-upload').toString(),
          top: true,
          customClass: 'toast-customClass error'
        })
      }
    }
  }
})
</script>