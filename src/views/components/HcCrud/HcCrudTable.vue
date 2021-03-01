<template>
  <el-table :data="tableData" border style="width: 100%" header-row-class-name="hc-crud-table-header" :header-cell-style="{backgroundColor: '#FAFAFA', color: '#333333'}" v-loading="tableLoading">
    <el-table-column v-for="(item, index) in (option.columns || [])" :key="index" :prop="item.prop" :label="item.label"  :width="item.width || ''">
      <template v-if="item.slot || item.type == 'select' || item.formatter" v-slot="scope">
        <slot v-if="item.slot" :name="item.prop" :row="scope.row">
        </slot>
        <div v-else-if="item.type == 'select'">{{getDicValue(item.dicName, scope.row[item.prop])}}</div>
        <div v-else>{{getFormatter(item.formatter, scope.row)}}</div>
      </template>
    </el-table-column>
    <el-table-column v-if="option.menu" label="操作" :width="option.menuWidth || ''">
      <template v-slot="scope">
        <slot name="menu" :row="scope.row">
          <el-button v-for="(item, index) in menuList" :key="index" type="text" size="mini" @click="handleEvent(item.fun, scope.row)">{{item.label}}</el-button>
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
  },
  data () {
    return {
    }
  },
  computed: {
    menuList () {
      let menu = this.option.menu
      if (menu && menu instanceof Array && menu.length > 0) {
        return menu
      }
      return []
    }
  },
  methods: {
    getDicValue,
    getFormatter (fun, row) {
      if (fun && typeof fun == 'function') {
        return fun(row)
      } else {
        return ''
      }
    },
    handleEvent (fun, row) {
      this.$emit('handle-event', {fun, row})
    }
  }
}
</script>

<style lang="scss" scoped>
.hc-crud-table-header {
  color: #333333;
}
</style>
