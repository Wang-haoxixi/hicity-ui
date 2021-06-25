<template>
  <div class="search-section">
    <div class="search-menu">
      <el-button
        v-if="refresh"
        icon="el-icon-refresh"
        circle
        size="mini"
        @click="handleRefresh"
      ></el-button>
      <el-input
        clearable
        v-model="searchVal"
        @keyup.native.enter="handleSearch()"
        :placeholder="'请输入' + placeholder"
        class="basic-search-input"
      >
        <el-select
          slot="prepend"
          placeholder="请选择"
          v-model="select"
          v-if="prepend"
        >
          <el-option label="姓名" value="name"></el-option>
          <el-option label="手机号" value="phone"></el-option>
          <el-option label="单位" value="company"></el-option>
        </el-select>
        <i
          slot="suffix"
          class="el-input__icon el-icon-search"
          @click="handleSearch"
        ></i>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    //刷新按钮显隐
    refresh: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    prepend: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchVal: "",
      select: "",
    };
  },
  methods: {
    // 重置
    handleReset(){
        this.searchVal = "";
        this.select = ""
    },
    // 刷新
    handleRefresh() {
      this.searchVal = "";
      this.$emit("searchShare");
    },
    // 搜索
    handleSearch() {
      if (this.prepend) {
        this.$emit("searchApplyInfo", this.searchVal, this.select);
        return;
      }
      this.$emit("searchShare", this.searchVal);
    },
  },
};
</script>

<style lang="scss" scoped>
.search-section {
  padding-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  .search-menu {
    display: flex;
    align-items: center;
    .basic-search-input {
      padding-left: 10px;
    }
  }
}
::v-deep .el-select .el-input {
  width: 100px;
}
::v-deep .basic-search-input .el-input-group__prepend {
  background-color: #fff;
}
</style>