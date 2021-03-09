<template>
  <basic-container>
    <hc-table-form title="话题库管理">
      <el-tabs v-model="activeName">
        <el-tab-pane label="官方话题" name="official">
          <official-topic v-if="activeName == 'official'"></official-topic>
        </el-tab-pane>
        <el-tab-pane v-if="userType == 1" label="用户发布" name="user">
          <user-topic v-if="activeName == 'user'"></user-topic>
        </el-tab-pane>
      </el-tabs>
    </hc-table-form>
  </basic-container>
</template>

<script>
import officialTopic from './official/'
import userTopic from './user/index'
import { mapGetters } from 'vuex'
export default {
  components: { officialTopic, userTopic },
  data() {
    return {
      activeName: 'official'
    };
  },
  computed: {
    ...mapGetters(['userType'])
  }
};
</script>
<style lang="scss">
</style>

