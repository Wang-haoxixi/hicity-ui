<template>
  <div class="hc-search-form-contaner">
    <div v-if="basicSearch" class="basic-search">
      <slot name="basicSearch" :searchFun="toBsiciSearch">
        <el-input class="basic-search-input" v-model="searchFormBasic[basicSearch.prop]" clearable :placeholder="'请输入' + basicSearch.label" @keyup.native.enter="toBsiciSearch(searchFormBasic)">
          <i slot="suffix" class="el-icon-search" @click="toBsiciSearch(searchFormBasic)"></i>
        </el-input>
      </slot>
    </div>
    <div v-if="seniorSearchs && seniorSearchs.length > 0" class="senior-search">
      <el-popover
        placement="bottom-end"
        width="350"
        v-model="seniorVisible"
        trigger="manual">
        <el-button slot="reference" size="mini" class="senior-search-down" icon="hc-icon icon-gengduo1" @click="seniorVisible = !seniorVisible"></el-button>
        <slot name="seniorSearch" :searchFun="toSeniorSearch">
          <div class="senior-search-list">
            <div v-for="(search, index) in seniorSearchs" :key="index" class="senior-search-item">
              <div class="senior-search-item-title">{{search.label}}：</div>
              <div class="senior-search-item-content">
                <slot :name="search.prop + 'SeniorSearch'" :searchForm="searchFormSenior" :prop="search.prop">
                  <hc-form-item v-model="searchFormSenior[search.prop]" style="width: 100%" :option="search"></hc-form-item>
                </slot>
              </div>
            </div>
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
        </slot>
      </el-popover>
    </div>
  </div>
</template>

<script>
import HcFormItem from "./HcFormItem";
export default {
  components: { HcFormItem },
  props: {
    searchs: {
      type: Array,
      default: () => []
    },
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
    .senior-search-item-content {

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
