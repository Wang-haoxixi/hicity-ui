<template>
  <file-select ref="fileSelect" :accept="accept" :multiple="multiple" @file-change="fileSelect">
    <slot name="trigger"></slot>
  </file-select>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import { ossUpload } from "@/api/admin/sys-file"
import FileSelect from "../FileSelect/index"
export default {
  components: { FileSelect },
  props: {
    beforeUpload: {
      type: Function,
      default: null
    },
    uploadFun: {
      type: Function,
      default: null
    },
    accept: {
      type: String,
      default: ''
    },
    multiple: {
      type: Boolean,
      default: false
    },
  },
  data () {
    return {
    }
  },
  methods: {
    fileSelect (files) {
      if (this.beforeUpload) {
        let beforeUploadValidator = this.beforeUpload(files)
        if (beforeUploadValidator instanceof Promise) {
          beforeUploadValidator.then((fileList) => {
            console.log(123321, fileList)
            for (let i = 0; i < fileList.length; i++) {
              this.uploadFile(fileList[i])
            }
          }, () => {
          })
        } else if (beforeUploadValidator) {
          for (let i = 0; i < files.length; i++) {
            this.uploadFile(files[i])
          }
        } 
      } else {
        for (let i = 0; i < files.length; i++) {
          this.uploadFile(files[i])
        }
      }
      // if (files.length <= this.limit) {
      //   for (let i = 0; i < files.length; i++) {
      //     let file = files[i]
      //     if (this.beforeUpload) {
      //       let beforeUploadValidator = this.beforeUpload(file)
      //       if (beforeUploadValidator instanceof Promise) {
      //         beforeUploadValidator.then(() => {
      //           this.uploadFile(file)
      //         }, () => {
      //         })
      //       } else if (beforeUploadValidator) {
      //         this.uploadFile(file)
      //       }
      //     } else {
      //       this.uploadFile(file)
      //     }
      //   }
      // } else {
      //   this.$emit('exceed', files.length)
      //   console.error('文件个数超出限制！')
      // }
    },
    uploadFile (file) {
      let uuid = uuidv4()
      this.$emit('file-add', {
        uuid,
        name: file.name,
        file
      })
      if (this.uploadFun) {
        this.uploadFun(file).then(({name, webFile}) => {
          this.$emit('upload-success', {
            uuid,
            name,
            file: webFile
          })
        }, () => {
          this.$emit('upload-error', uuid)
        }).catch(() => {
          this.$emit('upload-error', uuid)
        })
      } else {
        ossUpload(file).then(({data}) => {
          if (data.code == 0) {
            this.$emit('upload-success', {
              uuid,
              name: file.name,
              file: data.data.data
            })
          } else {
            this.$emit('upload-error', uuid)
          }
        }, () => {
          this.$emit('upload-error', uuid)
        }).catch(() => {
          this.$emit('upload-error', uuid)
        })
      }
    },
    changeFile (uuid) {
      this.$refs.fileSelect.selectFile().then(files => {
        if (this.beforeUpload) {
          let beforeUploadValidator = this.beforeUpload(files, true)
          if (beforeUploadValidator instanceof Promise) {
            beforeUploadValidator.then((fileList) => {
              if (fileList.length > 0) {
                this.changeFileUpload(uuid, fileList[0])
              } else {
                this.$emit('change-error', uuid)
              }
            }, () => {
              this.$emit('change-error', uuid)
            }).catch(() => {
              this.$emit('change-error', uuid)
            })
          } else if (beforeUploadValidator) {
            this.changeFileUpload(uuid, files[0])
          } else {
            this.$emit('change-error', uuid)
          }
          
          // let beforeUploadValidator = this.beforeUpload(file)
          // if (beforeUploadValidator instanceof Promise) {
          //   beforeUploadValidator.then(() => {
          //     this.changeFileUpload(uuid, file)
          //   }, () => {
          //   })
          // } else if (beforeUploadValidator) {
          //   this.changeFileUpload(uuid, file)
          // }
        } else {
          this.changeFileUpload(uuid, files[i])
        }
      })
    },
    changeFileUpload (uuid, file) {
      this.$emit('file-change', {
        uuid,
        name: file.name,
        file
      })
      if (this.uploadFun) {
        this.uploadFun(file).then(({name, webFile}) => {
          this.$emit('change-success', {
            uuid,
            name,
            file: webFile
          })
        }, () => {
          this.$emit('change-error', uuid)
        }).catch(() => {
          this.$emit('change-error', uuid)
        })
      } else {
        ossUpload(file).then(({data}) => {
          if (data.code == 0) {
            this.$emit('change-success', {
              uuid,
              name: file.name,
              file: data.data.data
            })
          } else {
            this.$emit('change-error', uuid)
          }
        }, () => {
          this.$emit('change-error', uuid)
        }).catch(() => {
          this.$emit('change-error', uuid)
        })
      }
    },
  }
}
</script>

<style lang="" scoped>
</style>
