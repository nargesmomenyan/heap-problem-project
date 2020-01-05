<style lang="scss">
#file-upload-wrapper {
  margin: 0;
  padding: 0;
  height: 65px;
  display: flex;
  border: 1px solid red;
  align-items: flex-start;
  justify-content: center;

  .image-list-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: 20px;
    .uploaded-image {
      position: relative;
      margin: 0 5px;
      height: 32px;
      width: 32px;
      .image-delete-button {
        position: absolute;
        top: -7px;
        left: 21px;
        margin: 0 !important;
        padding: 0 !important;
        height: 15px;
        width: 15px;
        min-width: 15px;
        color: white;
        img {
          height: 15px;
          width: 15px;
        }
      }
      img {
        height: 32px;
        width: 32px;
      }
    }
  }

  &.has-error {
    border-color: #ff5252;
  }
  .filepond--wrapper {
    width: 32px !important;
    height: 32px !important;
    border-radius: 4px;
  }

  .filepond--drop-label {
    min-height: 32px;
    height: 32px;
    width: 32px;
    font-size: 12px;
    cursor: pointer;
    color: $primary-color;
    label {
      position: absolute;
      top: 32px;
      width: 120px;
    }
  }

  .filepond--browser {
    // visibility: hidden;
  }

  .filepond--root {
    margin: 0;
    min-height: 32px;
    height: 32px;
    width: 32px;
  }
  .filepond--hopper {
    min-height: 32px;
    height: 32px;
    width: 32px;
  }

  .filepond--panel-root {
    background-color: white;
  }
  .filepond--panel {
    height: 32px;
    width: 32px;
  }
  .filepond--file {
    border: 1px dashed $primary-color;
    padding: 0;
    margin: 0;
    height: 32px;
    width: 32px;
    background-color: white;
  }
  .filepond--file-info {
    display: none;
  }
  .filepond--file-wrapper {
    background-color: white;
    width: 32px;
    height: 32px;
    legend {
      // visibility: hidden;
    }
  }

  .filepond--action-remove-item {
    top: -5px;
    left: 75%;
    color: white;
    background-color: $form-clear-color;
    height: 15px;
    width: 15px;
    display: flex;
  }
  .filepond--action-process-item {
    height: 20px;
    width: 20px;
    background-color: $form-info-selected-color;
    display: flex;
  }
  .filepond--action-abort-item-processing {
    height: 20px;
    width: 20px;
    background-color: $form-info-selected-color;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .filepond--file-status {
    // visibility: hidden;
  }

  .filepond--list-scroller {
    overflow-x: scroll;
    overflow-y: hidden;
    // height: 40px;
    margin: 0;
    padding: 0;
    position: relative;
  }

  .filepond--action-revert-item-processing {
    border: 1px solid black;
    top: 0;
    left: 75%;
    color: white;
    background-color: $form-clear-color;
    height: 15px;
    width: 15px;
    display: flex;
  }

  .filepond--item {
    margin: 0;
  }

  .filepond--list {
    border: 1px solid orange;
    height: 32px;
    width: 32px;
    margin: 0;
    padding: 0;
  }
  .images {
    display: flex;
    flex-wrap: wrap;
    border: 1px solid red;
    > div {
      flex: 0 0 100%;
      padding: 8px;
      @include respond-to(lg) {
        flex: 0 0 30%;
      }
    }

    .image-wrapper {
      margin: 8px;
      width: 150px;
      height: 150px;
      flex: 0 0 150px;
      position: relative;
      i {
        position: absolute;
        left: 8px;
        top: 8px;
        &.la-check-circle {
          bottom: 25px;
          top: auto;
          left: 0;
          right: 0;
          margin: auto;
          text-align: center;
        }
      }
      .v-btn {
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        font-size: 0.775rem;
        left: 0;
        right: 0;
        width: 130px;
      }

      img {
        max-width: 100%;
        border-radius: 12px;
        width: 150px;
        height: 150px;
        border: solid 1px blue;
      }
    }

    .button-wrapper {
      margin: 0 8px;
      .set-default {
        position: relative;
        top: 0;
        bottom: 0;
        margin: auto;
        font-size: 0.775rem;
        left: 0;
        right: 0;
      }
    }
  }
}
</style>

<template >
  <div id="file-upload-wrapper">
    <div class="image-list-wrapper">
      <div v-for="(imageItem, index) in images" :key="index">
        <div class="uploaded-image">
          <v-btn @click="deleteImage(imageItem.fileKey)" text class="image-delete-button">
          </v-btn>
          <img :src="imageItem.imageSrc" />
        </div>
      </div>
    </div>
    <div ref="fileUploadWrapper">
      <file-pond
        :server="server"
        name="file"
        :allow-multiple="multiple"
        :labelIdle="label"
        :imageCropAspectRatio="imageCropAspectRatio"
        :labelFileProcessingError="labelErrorUploading"
        :labelFileLoadError="'خطا در بارگذاری'"
        :labelFileLoading="''"
        :labelFileProcessing="''"
        :labelTapToCancel="''"
        :labelTapToRetry="''"
        :labelTapToUndo="''"
        :labelButtonRemoveItem="''"
        :labelButtonAbortItemLoad="''"
        :labelButtonRetryItemLoad="''"
        :labelFileProcessingComplete="''"
        :labelFileProcessingAborted="''"
        :labelInvalidField="''"
        :labelFileWaitingForSize="''"
        :labelFileSizeNotAvailable="''"
      ></file-pond>
    </div>
  </div>
</template>
<script >
export default {
  props: {
    value: {},
    multiple: {
      default: false
    },
    set_default: {
      default: false
    },
    label: {
      default: 'افزودن فایل'
    },
    imageCropAspectRatio: {
      default: '1:1'
    },
    entity: {},
    saveService: {
      type: Function
    },
    getService: {
      type: Function
    }
  },
  data() {
    return {
      labelErrorUploading: '',
      server: {},
      images: [],
      files: [],
      src: ''
    }
  },
  mounted() {
    this.server = {
      process: this.processfile,
      fetch: this.fetchFile,
      revert: null,
      load: this.loadFile
    }
  },
  methods: {
    async processfile(fieldName, file, metadata, load, error, progress, abort) {
      let loader = this.$loader.show(this.$refs.fileUploadWrapper)
      try {
        let fileKey = await this.saveService(
          {
            Type: file.type,
            Extension: file.name.split('.').pop(),
            FileName: file.name,
            Body: file
          },
          this.entity
        )
        
        this.images.push({
          fileKey: fileKey,
          imageSrc: await this.fetchFile(fileKey)
        })
        loader.hide()
        load(fileKey)
        progress(true, 100, 1024)
      } catch (err) {
        this.labelErrorUploading = this.$t('upload.error-uloading')
        this.files = []
        console.log(err)
        this.$toast.error().show({
          message: this.$t('msg.UI.fail-upload'),
          top: true,
          customClass: 'toast-customClass error'
        })
        loader.hide()
        abort()
      }

      if (error) {
        return
      }
    },
    async load(source, load, error, progress, abort, headers) {
      let file = await this.getService(source, this.entity)
      progress(true, 100, 1024)
      load(file)
    },
    async fetchFile(url, load, error, progress, abort, headers) {
      let srcTemp = await this.getService(url, this.entity)
      return srcTemp
    },
    deleteImage(fileKey) {},
    remove_image(index) {
      if (this.multiple) {
        this.images.splice(index, 1)
        this.$emit('input', this.images || [])
      } else {
        this.images = []
        this.$emit('input', null)
      }
      this.$refs.pond.removeFile(index)
    }
  },
  computed: {}
}
</script>