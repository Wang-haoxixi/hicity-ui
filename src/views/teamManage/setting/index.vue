<template>
  <basic-container>
    <hc-table-form title="团队管理">
      <el-tabs v-if="userType == 1 || userType == 2" v-model="activeName">
        <el-tab-pane label="合伙人" name="partner">
          <partner v-if="activeName == 'partner'"></partner>
        </el-tab-pane>
        <el-tab-pane label="管理员" name="manager">
          <manager v-if="activeName == 'manager'"></manager>
        </el-tab-pane>
      </el-tabs>
      <manager v-else-if="userType == 3"></manager>
    </hc-table-form>
  </basic-container>
</template>

<script>
import partner from './partner/index'
import manager from './manager/index'
import { mapGetters } from 'vuex'
export default {
  components: { partner, manager },
  data() {
    return {
      activeName: 'partner'
    };
  },
  computed: {
    ...mapGetters(['userType'])
  }
};
</script>
<style lang="scss">
</style>

