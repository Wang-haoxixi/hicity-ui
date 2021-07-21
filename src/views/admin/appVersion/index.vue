<template>
  <basic-container>
    <hc-crud :option="option" :fetchListFun="fetchListFun" :addFun="saveVersion">
      <template v-slot:url="scope">
        <a :href="scope.row.url">安装包</a>
      </template>
      <template v-slot:urlForm="scope">
        <hc-file-upload ref="fileUploadRef" v-model="scope.formData.url" single>
          <template v-slot:trigger>
            <el-button type="primary" size="mini">选择文件</el-button>
          </template>
        </hc-file-upload>
      </template>
    </hc-crud>
  </basic-container>
</template>

<script>
import { getVersionPage, saveVersion } from '@/api/admin/app-version'
import HcFileUpload from '@/views/components/HcFileUpload/index'
export default {
  components: { HcFileUpload },
  data () {
    return {
      option: {
        addBtn: true,
        labelWidth: '100px',
        columns: [
          {
            label: '系统',
            prop: 'system',
            type: 'select',
            dicData: [
              {
                label: 'IOS',
                value: 1
              },
              {
                label: '安卓',
                value: 2
              }
            ]
          },
          {
            label: '版本号',
            prop: 'versionNo',
          },
          {
            label: '安装包',
            prop: 'url',
            slot: true,
            formSlot: true
          },
          {
            label: '版本描述',
            prop: 'remarks',
            type: 'textarea'
          }
        ]
      }
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getVersionPage(params).then(({data}) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        })
      })
    },
    saveVersion (data, next, done) {
      saveVersion(data).then(({data}) => {
        next()
      }, () => {
        done()
      }).catch(() => {
        done()
      })
    }
  }
}
</script>

<style lang="" scoped>
</style>
