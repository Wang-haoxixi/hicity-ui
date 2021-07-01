<template>
  <basic-container>
    <hc-table-form title="投诉管理">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" @toView="toView">
        <template v-slot:basicSearch="scope">
          <div class="search-item">
            <div class="search-item-title">投诉板块：</div>
            <div class="search-item-content">
              <el-select v-model="prosecuteType" @change="scope.searchFun()">
                <el-option v-for="(item, index) in dicList['PROSECUTE_TYPE']" :key="index" :label="item.label" :value="item.value">{{item.label}}</el-option>
              </el-select>
            </div>
          </div>
        </template>
      </hc-crud>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProsecutePage } from '@/api/cms/prosecute'
export default {
  data () {
    return {
      prosecuteType: 'travel',
      tableOption: {
        menu: [{
          label: '详情',
          fun: 'toView'
        }],
        menuWidth: '60',
        search: true,
        columns: [
          {
            label: '投诉编号',
            prop: 'prosecuteNum',
            search: true,
            width: 115
          },
          {
            label: '投诉板块',
            prop: 'prosecuteType',
            type: 'select',
            dicName: 'PROSECUTE_TYPE',
            width: 80
          },
          {
            label: '投诉时间',
            prop: 'createTime',
            width: 150
          },
          {
            label: '投诉人',
            prop: 'prosecuteUserName',
            width: 100
          },
          {
            label: '投诉对象',
            prop: 'prosecuteContentName',
          },
          {
            label: '投诉类型',
            prop: 'prosecuteReason',
            search: true,
            type: 'select',
            dicName: 'PROSECUTE_REASON',
            width: 80
          },
          {
            label: '投诉原因',
            prop: 'prosecuteReasonDesc',
            width: 100
          },
          {
            label: '处理状态',
            prop: 'prosecuteStatus',
            search: true,
            type: 'select',
            dicData: [
              {
                label: '未处理',
                value: 0
              },
              {
                label: '已处理',
                value: 1
              }
            ],
            width: 80
          },
          {
            label: '最后处理时间',
            prop: 'handleTime',
            width: 150
          },
        ]
      }
    }
  },
  computed: {
    ...mapGetters(['dicList'])
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        getProsecutePage({...params, prosecuteType: this.prosecuteType}).then(({data}) => {
          resolve({
            records: data.data.data.records,
            page: {
              total: data.data.data.total
            }
          })
        })
      })
    },
    toView (row) {
      console.log(row)
    }
  }
}
</script>

<style lang="scss" scoped>
.search-item {
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .search-item-title {
    height: 20px;
    line-height: 20px;
  }
}
</style>
