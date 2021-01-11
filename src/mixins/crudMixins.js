export default {
  data () {
    return {
      page: {
        size: 10,
        current: 1
      },
      tableLoading: false,
    }
  },
  methods: {
    searchChange(form) {
      this.searchForm = form
      this.getList(this.page, form)
    },
  }
}