<template>
  <div class="hc-map-search-box">
    <el-input class='search-input' v-model="searchWd" @input="toSearch"></el-input>
    <div v-if="!closeSearch && searchResult && searchResult.length > 0" class="search-result-box">
      <div v-for="(item, index) in searchResult" :key="index" class="result-item" @click="select(item)">
        <span class="result-name">{{item.name}}</span>
        <span class="result-district">{{item.district}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      searchWd: '',
      closeSearch: false,
      searchResult: [],
      autoComplete: new AMap.Autocomplete()
    }
  },
  created () {
    this.searchWd = this.value
    document.addEventListener('click', this.clearResult)
  },
  watch: {
    value (val) {
      this.searchWd = this.value
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this.clearResult)
  },
  methods: {
    clearResult () {
      this.closeSearch = true
      this.searchWd = this.value || ''
      this.searchResult = []
    },
    toSearch (wd) {
      if (wd) {
        this.closeSearch = false
        clearTimeout(this.timer)
        this.timmer = setTimeout(() => {
          this.autoComplete.search(wd, (status, result) => {
            if (status == 'complete' && result.info == 'OK') {
              if (!this.closeSearch) {
                this.searchResult = result.tips
              }
            }
          })
        }, 1500)
      } else {
        this.closeSearch = true
        clearTimeout(this.timer)
      }
    },
    select (data) {
      this.$emit('select', data)
    }
  }
}
</script>

<style lang="scss" scoped>
.hc-map-search-box {
  position: relative;
  z-index: 1000;
  height: 40px;
  .search-result-box {
    position: absolute;
    top: 40px;
    left: 0;
    right: 0;
    background-color: #ffffff;
    border: 1px solid #c0c0c0;
    border-radius: 4px;
    .result-item {
      padding: 4px;
      height: 20px;
      line-height: 20px;
      cursor: pointer;
      &:hover {
        background-color: #cae1ff;
      }
      .result-name {
        color: #333333;
      }
      .result-district {
        padding-left: 5px;
        color: #c1c1c1;
        font-size: 12px;
      }
    }
  }
}
</style>
