<template>
  <div class="type-item">
    <div class="type-item-name">
      <span v-if="!isEdit">{{itemData.positionLableType}}</span>
      <el-input v-else ref="input" v-model="editText" size="small" maxlength="20" style="max-width: 300px;" @keyup.enter.native="updateTagType" @blur="blur"></el-input>
    </div>
    <div class="type-item-options">
      <i v-show="!isEdit" class="el-icon-edit" @click="toEdit"></i>
      <i v-show="isEdit" class="el-icon-check" @click="updateTagType"></i>
      <i class="el-icon-delete" style="margin-left: 10px;" @click="deleteTagType"></i>
    </div>
  </div>
</template>

<script>
import { updateTagType, deleteTagType } from "@/api/recruit/positionTag"
export default {
  props: {
    itemData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      isEdit: false,
      editText: '',
      isUpdate: false,
    }
  },
  methods: {
    toEdit () {
      this.isEdit = true
      this.editText = this.itemData.positionLableType
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    updateTagType () {
      if (this.editText.trim()) {
        this.isUpdate = true
        this.$emit('loading', true)
        updateTagType({
          positionLableTypeId: this.itemData.positionLableTypeId,
          positionLableType: this.editText,
        }).then(({data}) => {
          this.$message.success('修改成功')
          this.itemData.positionLableType = this.editText
          this.isEdit = false
          this.$emit('loading', false)
        }).finally(() => {
          this.isUpdate = false
        })
      }
    },
    deleteTagType () {
      this.$emit('delete-item')
    },
    blur () {
      setTimeout(() => {
        if (!this.isUpdata) {
          this.isEdit = false
        }
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
.type-item {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  .type-item-name {
    flex: 100px 1 1;
    overflow: hidden;
    white-space: nowrap;
  }
  .type-item-options {
    height: 30px;
    line-height: 30px;
    i {
      cursor: pointer;
    }
  }
}
</style>
