<template>
  <file-select ref="fileSelect" @file-change="fileChange">
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
    }
  },
  data () {
    return {
    }
  },
  methods: {
    fileChange (files) {
      if (!this.beforeUpload || this.beforeUpload(files)) {
        if (files.length <= this.limit) {
          for (let i = 0; i < files.length; i++) {
            let file = files[i]
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
          }
        } else {
          console.error('文件个数超出限制！')
        }
      }
    },
    changeFile (uuid) {
      this.$refs.fileSelect.selectFile().then(files => {
        let file = files[0]
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
      })
      return

      return new Promise((resolve, reject) => {
        this.$refs.fileSelect.selectFile().then(files => {
          console.log(123312, files)
          let file = files[0]
          resolve({
            data: {
              uuid,
              name: file.name,
              file: file
            }, 
            next: new Promise((resolve, reject) => {
              if (this.uploadFun) {
                this.uploadFun(file).then(({name, webFile}) => {
                  resolve({
                    uuid,
                    name,
                    file: webFile
                  })
                }, () => {
                  reject(uuid)
                }).catch(() => {
                  reject(uuid)
                })
              } else {
                ossUpload(file).then(({data}) => {
                  if (data.code == 0) {
                    resolve({
                      uuid,
                      name: file.name,
                      file: data.data.data
                    })
                  } else {
                  reject(uuid)
                  }
                }, () => {
                  reject(uuid)
                }).catch(() => {
                  reject(uuid)
                })
              }
            })
          })
        })
      })
      return
      this.$emit('file-change', {
        uuid,
        name: file.name,
        file: file
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
     
    }
  }
}
</script>

<style lang="" scoped>
</style>
