<template>
  <div class="user">
    <basic-container>
      <el-tabs v-model="activeName">
        <el-tab-pane label="官方话题" name="official">
          <official-topic></official-topic>
        </el-tab-pane>
        <el-tab-pane label="用户发布" name="user">
          <user-topic></user-topic>
        </el-tab-pane>
      </el-tabs>
    </basic-container>
  </div>
</template>

<script>
import officialTopic from './official/'
import userTopic from './user/index'
export default {
  components: { officialTopic, userTopic },
  data() {
    return {
      activeName: 'official'
    };
  },
};
</script>
<style lang="scss">
</style>

