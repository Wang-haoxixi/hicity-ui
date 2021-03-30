<template>
  <file-select :accept="accept" ref="fileSelect" @file-change="fileChange">
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
    limit: {
      type: Number,
      default: 9
    },
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
  },
  data () {
    return {
    }
  },
  methods: {
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
    fileChange (files) {
      if (files.length <= this.limit) {
        for (let i = 0; i < files.length; i++) {
          let file = files[i]
          if (this.beforeUpload) {
            let beforeUploadValidator = this.beforeUpload(file)
            if (beforeUploadValidator instanceof Promise) {
              beforeUploadValidator.then(() => {
                this.uploadFile(file)
              }, () => {
              })
            } else if (beforeUploadValidator) {
              this.uploadFile(file)
            }
          } else {
            this.uploadFile(file)
          }
        }
        
      } else {
        console.error('文件个数超出限制！')
      }

      // if (!this.beforeUpload || this.beforeUpload(files)) {
      //   if (files.length <= this.limit) {
      //     for (let i = 0; i < files.length; i++) {
      //       let file = files[i]
      //       let uuid = uuidv4()
      //       this.$emit('file-add', {
      //         uuid,
      //         name: file.name,
      //         file
      //       })
      //       if (this.uploadFun) {
      //         this.uploadFun(file).then(({name, webFile}) => {
      //           this.$emit('upload-success', {
      //             uuid,
      //             name,
      //             file: webFile
      //           })
      //         }, () => {
      //           this.$emit('upload-error', uuid)
      //         }).catch(() => {
      //           this.$emit('upload-error', uuid)
      //         })
      //       } else {
      //         ossUpload(file).then(({data}) => {
      //           if (data.code == 0) {
      //             this.$emit('upload-success', {
      //               uuid,
      //               name: file.name,
      //               file: data.data.data
      //             })
      //           } else {
      //             this.$emit('upload-error', uuid)
      //           }
      //         }, () => {
      //           this.$emit('upload-error', uuid)
      //         }).catch(() => {
      //           this.$emit('upload-error', uuid)
      //         })
      //       }
      //     }
      //   } else {
      //     console.error('文件个数超出限制！')
      //   }
      // }
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
    changeFile (uuid) {
      this.$refs.fileSelect.selectFile().then(files => {
        let file = files[0]
        if (this.beforeUpload) {
          let beforeUploadValidator = this.beforeUpload(file)
          if (beforeUploadValidator instanceof Promise) {
            beforeUploadValidator.then(() => {
              this.changeFileUpload(uuid, file)
            }, () => {
            })
          } else if (beforeUploadValidator) {
            this.changeFileUpload(uuid, file)
          }
        } else {
          this.changeFileUpload(uuid, file)
        }
      })
    }
  }
}
</script>

<style lang="" scoped>
</style>
