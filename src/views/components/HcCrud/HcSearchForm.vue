<template>
  <div class="hc-search-form-contaner">
    <div v-if="basicSearch || (searchShow === true || searchShow == 'basic')" class="basic-search">
      <slot name="basicSearch" :searchFun="toBsiciSearch">
        <el-input v-if="basicSearch" class="basic-search-input" v-model="searchFormBasic[basicSearch.prop]" clearable :placeholder="'请输入' + basicSearch.label" :maxlength="basicSearch.maxlength" @keyup.native.enter="toBsiciSearch(searchFormBasic)">
          <i slot="suffix" class="el-icon-search" @click="toBsiciSearch(searchFormBasic)"></i>
        </el-input>
      </slot>
    </div>
    <div v-if="seniorSearchs && seniorSearchs.length > 0 || (searchShow === true || searchShow == 'senior')" class="senior-search">
      <hc-search-popover ref="seniorSearch">
        <el-button slot="reference" size="mini" class="senior-search-down" icon="hc-icon icon-gengduo1"></el-button>
        <slot name="seniorSearch" :searchFun="toSeniorSearch">
          <div style="overflow: auto;">
            <div class="senior-search-list">
              <slot name="searchItems" :searchForm="searchFormSenior">
                <template v-if="seniorSearchs && seniorSearchs.length > 0">
                  <div v-for="(search, index) in seniorSearchs" :key="index" class="senior-search-item">
                    <div class="senior-search-item-title">{{search.label}}：</div>
                    <div class="senior-search-item-content">
                      <slot :name="search.prop + 'SearchItem'" :searchForm="searchFormSenior" :prop="search.prop">
                        <hc-form-item v-model="searchFormSenior[search.prop]" style="width: 100%" :option="search"></hc-form-item>
                      </slot>
                    </div>
                  </div>
                </template>
              </slot>
            </div>
            <div class="search-button-list">
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="toSeniorSearch(searchFormSenior)"
                >搜 索</el-button
              >
              <el-button
                icon="el-icon-refresh"
                @click="resetSearch()"
                >重 置</el-button
              >
            </div>
          </div>
        </slot>
      </hc-search-popover>
    </div>
  </div>
</template>

<script>
import HcFormItem from "./HcFormItem";
import HcSearchPopover from "./HcSearchPopover.vue"
export default {
  components: { HcFormItem, HcSearchPopover },
  props: {
    searchs: {
      type: Array,
      default: () => []
    },
    searchShow: {
      type: [String, Boolean],
      default: false
    }
  },
  data () {
    return {
      seniorVisible: false,
      searchFormBasic: {},
      searchFormSenior: {}
    }
  },
  computed: {
    basicSearch () {
      if (this.searchs && this.searchs.length > 0) {
        for (let i = 0; i < this.searchs.length; i++) {
          if (this.searchs[i].search && (this.searchs[i].search === true || this.searchs[i].search === 'basic')) {
            return this.searchs[i]
          }
        }
      }
    },
    seniorSearchs () {
      let searchs = []
      if (this.searchs && this.searchs.length > 0) {
        for (let i = 0; i < this.searchs.length; i++) {
          if (this.searchs[i].search && (this.searchs[i].search === true || this.searchs[i].search === 'senior')) {
            searchs.push(this.searchs[i])
          }
        }
      }
      return searchs
    }
  },
  methods: {
    toBsiciSearch (searchForm =  this.searchFormBasic) {
      this.$emit('search', searchForm)
    },
    toSeniorSearch (searchFormSenior) {
      this.seniorVisible = false
      this.$emit('search', searchFormSenior)
      this.resetSearch('senior')
      this.$refs.seniorSearch.close()
    },
    resetSearch (type = 'senior') {
      if (type == 'senior' || type == 'all') {
        let searchForm = this.searchFormSenior
        for (var key in searchForm) {
          searchForm[key] = undefined
        }
      }
      if (type == 'basic' || type == 'all') {
        let searchForm = this.searchFormBasic
        for (var key in searchForm) {
          searchForm[key] = undefined
        }
      }
      this.$emit('reset-search', type)
    },
    resetSearchItems (items = [], type = 'senior') {
      if (type == 'senior' || type == 'all') {
        let searchForm = this.searchFormSenior
        for (var key in searchForm) {
          if (items.includes(key)) {
            searchForm[key] = undefined
          }
        }
      }
      if (type == 'senior' || type == 'all') {
        let searchForm = this.searchFormBasic
        for (var key in searchForm) {
          if (items.includes(key)) {
            searchForm[key] = undefined
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.basic-search-input {
  height: 32px;
  /deep/ .el-input__inner {
    width: 200px;
    height: 32px;
    line-height: 32px;
    padding-right: 50px;
  }
  /deep/ .el-icon-search {
    height: 32px;
    width: 25px;
    line-height: 32px;
    font-size: 16px;
    cursor: pointer;
  }
  /deep/ .el-input__clear {
    height: 32px;
    width: 25px;
    line-height: 32px;
    font-size: 16px;
    cursor: pointer;
  }
  /deep/ .el-input__suffix-inner {
    display: inline-flex;
    flex-direction: row-reverse;
  }
}
.hc-search-form-contaner {
  display: flex;
  align-items: center;
  justify-content: flex-end;

}
.senior-search {
  margin-left: 8px;
}
.senior-search-list {
  width: 350px;
  .senior-search-item {
    margin-bottom: 20px;
    .senior-search-item-title {
      height: 20px;
      line-height: 20px;
      padding-bottom: 10px;
    }
  }
}
.senior-search-down {
  height: 32px;
  width: 32px;
  line-height: 32px;
  padding: 0;
  font-size: 16px;
  border-radius: 4px;
}

.search-button-list {
  padding-top: 20px;
  text-align: center;
}
</style>
