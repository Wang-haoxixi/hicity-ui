<template>
  <el-table :data="tableData" stripe border style="width: 100%" header-row-class-name="hc-crud-table-header" :header-cell-style="{backgroundColor: '#FAFAFA', color: '#333333'}" v-loading="tableLoading" :default-expand-all="option.defaultExpand">
    <el-table-column v-if="option.expand" type="expand" width="50px">
      <template v-slot="scope">
        <slot name="expand" :row="scope.row"></slot>
      </template>
    </el-table-column>
    <el-table-column v-if="option.index" width="50px" :label="option.indexLabel || '序号'">
      <template v-slot="scope">
        <div>{{scope.$index + 1 + startIndex}}</div>
      </template>
    </el-table-column>
    <el-table-column v-for="(item, index) in columns" :key="index" :prop="item.prop" :label="item.label"  :width="item.width || ''">
      <template v-if="item.slot || item.type == 'select' || item.formatter" v-slot="scope">
        <slot v-if="item.slot" :name="item.prop" :row="scope.row">
        </slot>
        <div v-else-if="item.type == 'select'">{{getDicValue(item, scope.row[item.prop])}}</div>
        <div v-else>{{getFormatter(item.formatter, scope.row)}}</div>
      </template>
    </el-table-column>
    <el-table-column v-if="option.menu" label="操作" :width="option.menuWidth || ''">
      <template v-slot="scope">
        <template v-for="(item, index) in menuList">
          <template v-if="item.auto">
            <el-button v-if="item.auto" :key="index" type="text" size="mini" @click="handleAutoEvent(item.type, scope.row)">{{handleName(item.type)}}</el-button>
          </template>
          <el-button v-else :key="index" type="text" size="mini" @click="handleEvent(item.fun, scope.row)">{{item.label}}</el-button>
        </template>
        <slot name="menu" :row="scope.row">
        </slot>
      </template>
    </el-table-column>
    <template slot="empty">
      <hc-empty-data></hc-empty-data>
    </template>
  </el-table>
</template>

<script>
import { getDicValue } from "@/util/dic"
import HcEmptyData from "@/views/components/HcEmptyData/index"
export default {
  components: { HcEmptyData },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    tableLoading: {
      type: Boolean,
      default: false,
    },
    option: {
      type: Object,
      required: true
    },
    startIndex: {
      type: Number,
      default: 0,
    }
  },
  data () {
    return {
    }
  },
  computed: {
    columns () {
      let columnList = this.option.columns
      if (columnList && columnList.length > 0) {
        let columns = []
        for (let i = 0; i < columnList.length; i++) {
          if (!columnList[i].hidden) {
            columns.push(columnList[i])
          }
        }
        return columns
      }
      return []
    },
    menuList () {
      let menu = this.option.menu
      if (menu && menu instanceof Array && menu.length > 0) {
        let menuList = []
        for (let i = 0; i < menu.length; i++) {
          let menuItem = menu[i]
          if (menuItem == 'view' || menuItem == 'edit' || menuItem == 'delete') {
            menuList.push({
              auto: true,
              type: menuItem,
            })
          } else if (menuItem instanceof Object && menuItem.fun && menuItem.label) {
            menuList.push({
              label: menuItem.label,
              fun: menuItem.fun
            })
          }
        }
        return menuList
      }
      return []
    }
  },
  methods: {
    getDicValue (item, value) {
      if (item.dicData && item.dicData.length > 0) {
        for (let i = 0; i < item.dicData.length; i++) {
          if (value === item.dicData[i].value) {
            return item.dicData[i].label
          }
        }
      } else {
        return getDicValue(item.dicName, value)
      }
    },
    getFormatter (fun, row) {
      if (fun && typeof fun == 'function') {
        return fun(row)
      } else {
        return ''
      }
    },
    handleName (type) {
      return type == 'view' ? '查看' : type == 'edit' ? '编辑' : type == 'delete' ? '删除' : ''
    },
    handleEvent (fun, row) {
      this.$emit('handle-event', {fun, row})
    },
    handleAutoEvent (type, row) {
      this.$emit('handle-auto-event', {type, row})
    }
  }
}
</script>

<style lang="scss" scoped>
.hc-crud-table-header {
  color: #333333;
}
</style>
