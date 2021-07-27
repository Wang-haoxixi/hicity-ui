<template>

  <el-select
    v-model="value"
    @change="change"
    :placeholder="placeholder"
    :multiple="multiple"
    :disabled="disabled"
    v-el-select-loadmore="loadMore"
  >
    <el-option
      v-for="(option, index) in options"
      :key="index"
      :label="option[labelKey] + ' 及以上'"
      :value="option[valueKey]"
    >{{option[labelKey] + ' 及以上'}}</el-option>
  </el-select>
</template>

<script>
export default {
  name: 'hc-select-more',
  props: {
    params: {
      type: Object,
      default: () => ({})
    },
    labelKey: {
      type: String,
      default: 'versionNo'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    remoteFun: {
      type: Function,
      default: null
    },
    disabled: {
      type: Boolean,
      detault: false
    }
  },
  directives: {
    "el-select-loadmore": {
      bind(el, binding) {
        // 获取element-ui定义好的scroll盒子
        const SELECTWRAP_DOM = el.querySelector(
          ".el-select-dropdown .el-select-dropdown__wrap"
        );
        SELECTWRAP_DOM.addEventListener("scroll", function () {
          /**
           * scrollHeight 获取元素内容高度(只读)
           * scrollTop 获取或者设置元素的偏移值,常用于, 计算滚动条的位置, 当一个元素的容器没有产生垂直方向的滚动条, 那它的scrollTop的值默认为0.
           * clientHeight 读取元素的可见高度(只读)
           * 如果元素滚动到底, 下面等式返回true, 没有则返回false:
           * ele.scrollHeight - ele.scrollTop === ele.clientHeight;
           */
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      },
    },
  },
  data() {
    return {
      tempData: null,
      value: '',
      options: [],
      loading: false,
      hasMore: false,
      formData: {
        current: 1,
        size: 10,
      },
    };
  },
  created() {
    this.initOptions();
  },
  methods: {
    setData (data = null) {
      this.tempData = data
      if (data) {
        this.value = data[this.labelKey]
      } else {
        this.value = ''
      }
      this.compareValue()
    },
    loadMore () {
      let symbol = this.symbol = Symbol()
      this.loadOptions(symbol)
    },
    loadOptions(symbol) {
      if (this.hasMore && !this.loading) {
        this.loading = true
        this.remoteFun({...this.formData, ...this.params}).then(data => {
          if (symbol === this.symbol) {
            this.options = [...this.options, ...data.list]
            this.compareValue()
            this.hasMore = data.hasMore
            this.formData.current++;
          }
        }).finally(() => {
          this.loading = false
        })
      }
    },
    compareValue () {
      if (this.tempData) {
        let options = this.options
        for (let i = 0; i < options.length; i++) {
          if (options[i][this.valueKey] == this.tempData[this.valueKey]) {
            this.$nextTick(() => {
              this.value = options[i][this.valueKey]
            })
            this.tempData = null
            break
          }
        }
      }
    },
    initOptions() {
      let symbol = this.symbol = Symbol()
      this.formData.current = 1
      this.hasMore = true
      this.options = []
      this.loadOptions(symbol)
    },
    change (val) {
      this.$emit('input', val)
    }
  },
};
</script>

