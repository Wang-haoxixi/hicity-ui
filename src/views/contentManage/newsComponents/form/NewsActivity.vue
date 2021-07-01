<template>
  <div>
    <el-button icon="el-icon-plus" size="mini" type="primary" @click="toAdd">选择</el-button>
    <el-table :data="value" border style="margin-top: 10px;">
      <el-table-column label="活动名称" prop="activityName"></el-table-column>
      <el-table-column label="操作" width="100px" >
        <template slot-scope="scope">
          <el-button type="text" @click="removeActivity(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="关联活动"
      :visible.sync="dialogVisible"
      width="70%"
      append-to-body>
      <el-tag v-for="activity in activityList"
        :key="activity.activityId"
        class="activity-item"
        closable
        @close="removeChoice(activity)">
        {{activity.activityName}}
      </el-tag>
      <hc-crud v-if="dialogVisible" ref="hcCrud" :option="option" :fetchListFun="fetchListFun">
        <template v-slot:poster="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.poster"
            fit="contain"
          ></el-image>
        </template>
        <template v-slot:info="scope">
          <div>{{ scope.row.name }}</div>
          <div>
            <i class="el-icon-time" style="margin-right: 5px"></i
            >{{ scope.row.startTime }} 至 {{ scope.row.endTime }}
          </div>
          <div>
            <i class="el-icon-location-outline" style="margin-right: 5px"></i
            >{{ scope.row.city }} {{ scope.row.field }}
          </div>
        </template>
        <template v-slot:status="scope">
          <el-tag v-if="scope.row.statusFlag == '0'">草稿</el-tag>
          <el-tag v-if="scope.row.statusFlag == '1'" type="success"
            >进行中</el-tag
          >
          <el-tag v-if="scope.row.statusFlag == '2'" type="info">已结束</el-tag>
          <el-tag v-if="scope.row.statusFlag == '3'" type="warning"
            >被下架</el-tag
          >
        </template>
        <template v-slot:menu="scope">
          <el-button type="text" :disabled="itemDisabled(scope.row)" @click="choice(scope.row)">选择</el-button>
        </template>
      </hc-crud>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  activitiesList,
} from "@/api/activity/activity";
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  create () {

  },
  data () {
    return {
      activityList: [],
      dialogVisible: false,
      option: {
        index: false,
        menu: true,
        menuWidth: 80,
        columns: [
          {
            label: '活动名称',
            prop: 'name',
            search: 'basic',
            maxlength: 50,
            hidden: true
          },
          {
            label: '活动封面',
            prop: 'poster',
            slot: true,
            width: '150px'
          },
          {
            label: '活动信息',
            prop: 'info',
            slot: true
          },
          {
            label: '活动状态',
            prop: 'status',
            slot: true,
            width: '90px'
          },
          {
            label: '报名人数',
            prop: 'joinNumber',
            width: '90px'
          }
        ]
      }
    }
  },
  methods: {
    fetchListFun (params) {
      return new Promise((resolve, reject) => {
        activitiesList({
          statusFlag: 1,
          ...params,
        }).then((res) => {
          if (res.data.code === 0) {
            resolve({
              records: res.data.data.data.records,
              page: {
                total: res.data.data.data.total,
              },
            });
          } else {
            this.$message.error("获取活动数据失败！");
          }
        });
      });
    },
    itemDisabled (activity) {
      for (let i = 0; i < this.activityList.length; i++) {
        if (this.activityList[i].activityId == activity.id) {
          return true
        }
      }
      return false
    },
    choice (activity) {
      if (this.activityList.length < 3) {
        this.activityList.push({
          activityId: activity.id,
          activityName: activity.name
        })
      } else {
        this.$message.warning('最多关联3个活动')
      }
    },
    removeChoice (activity) {
      for (let i = 0; i < this.activityList.length; i++) {
        if (this.activityList[i].activityId == activity.activityId) {
          this.activityList.splice(i, 1)
        }
      }
    },
    removeActivity (activity) {
      let activityList = [...this.value]
      for (let i = 0; i < activityList.length; i++) {
        if (activityList[i].activityId == activity.activityId) {
          activityList.splice(i, 1)
          this.$emit('input', activityList)
          return
        }
      }
    },
    toAdd () {
      this.activityList = [...this.value]
      this.dialogVisible = true
    },
    save () {
      this.$emit('input', [...this.activityList])
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.activity-item {
  margin: 0 5px 5px;
}
</style>
