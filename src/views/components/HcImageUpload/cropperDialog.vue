<template>
  <el-dialog
    title="图片裁剪"
    :visible.sync="dialogVisible"
    append-to-body
    :width="`${width+240}px`">
    <div class="cropper-content" :style="{height: `${height + 200}px`, width: `${width + 200}px`}">
      <vue-cropper
          ref="cropper"
          :img="image"
          :info="true"
          :autoCrop="optionsC.autoCrop"
          :autoCropWidth="optionsC.autoCropWidth"
          :autoCropHeight="optionsC.autoCropHeight"
          :canMoveBox="optionsC.canMoveBox"
          :fixedNumber="optionsC.fixedNumber"
          :fixed="optionsC.fixed"
          :fixedBox="optionsC.fixedBox"
          @realTime="realTime"
          outputType="png"
        ></vue-cropper>
    </div>
    <div slot="footer">
      <el-button @click="dialogVisible = false">返 回</el-button>
      <el-button type="primary" @click="finish">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { VueCropper } from "vue-cropper";
export default {
  components: { VueCropper },
  props: {
    size: {
      type: Number,
      default: 2
    },
    width: {
      type: Number,
      default: 144
    },
    height: {
      type: Number,
      default: 144
    },
    options: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      dialogVisible: false,
      image: '',
      previews: '',
      finishResolve: null,
      optionsInit: {
        autoCrop: true,
        fixedBox: true,
        canMoveBox: false,
        autoCropWidth: this.width,
        autoCropHeight: this.height,
        fixed: false,
        isScale: false,
      }
    }
  },
  computed: {
    optionsC () {
      return {
        ...this.optionsInit,
        ...this.options
      }
    }
  },
  methods: {
    toCropper (img) {
      return new Promise((resolve, reject) => {
        this.finishResolve = resolve
        this.dialogVisible = true
        this.image = img
      })
    },
    realTime (data) {
      this.previews = data
    },
    finish () {
      this.$refs.cropper.getCropBlob(data => {
        this.loadingUpload = false;
        if (data.size / 1024 / 1024 > this.size) {
          this.$message.warning("图片过大，请裁剪或返回更换图片");
        } else {
          this.finishResolve(data)
          this.dialogVisible = false
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
