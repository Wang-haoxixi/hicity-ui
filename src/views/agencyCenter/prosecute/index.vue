<template>
  <basic-container>
    <hc-table-form
      :title="title"
      :formVisible="detailView"
      @go-back="goBack">
      <hc-crud ref="hcCrud" :option="tableOption" :fetchListFun="fetchListFun" @toView="toView">
        <template v-slot:basicSearch="scope">
          <div class="search-item">
            <div class="search-item-title">投诉板块：</div>
            <div class="search-item-content">
              <el-select v-model="prosecuteType" @change="scope.searchFun()">
                <el-option v-for="(item, index) in prosecuteTypes" :key="index" :label="item.label" :value="item.value">{{item.label}}</el-option>
              </el-select>
            </div>
          </div>
        </template>
      </hc-crud>
      <template v-slot:form>
        <prosecute-detail :detail="prosecuteDetail" @save="detailSave"></prosecute-detail>
      </template>
    </hc-table-form>
  </basic-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { getProsecutePage, getProsecuteDetail } from '@/api/cms/prosecute'
import ProsecuteDetail from './detail/index'
const prosecuteTypes = [
  {
    value: 'heatedDebate',
    label: '热议'
  },
  {
    value: 'officialNews',
    label: '资讯'
  },
  {
    value: 'travel',
    label: '游记'
  },
  {
    value: 'user',
    label: '用户'
  },
  {
    value: 'circle',
    label: '圈子'
  },
  {
    value: 'comment',
    label: '评论'
  }
]
export default {
  components: { ProsecuteDetail },
  data () {
    return {
      prosecuteType: 'heatedDebate',
      prosecuteTypes,
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
            prop: 'module',
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
      },
      detailView: false,
      prosecuteDetail: {}
    }
  },
  computed: {
    ...mapGetters(['dicList']),
    title () {
      return this.detailView ? '投诉详情' : '投诉管理'
    }
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
    toView ({prosecuteId}) {
      getProsecuteDetail({prosecuteId}).then(({data}) => {
        this.detailView = true
        this.prosecuteDetail = {
          ...data.data.data,
          prosecuteId
        }
      })
    },
    detailSave () {
      this.$refs.hcCrud.refresh()
      this.detailView = false
    },
    goBack () {
      this.detailView = false
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
