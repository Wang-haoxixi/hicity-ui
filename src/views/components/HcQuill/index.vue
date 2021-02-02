<template>
  <div>
    <div id="editor-toolbar">
      <button class="toolbar-item ql-image" type="button" title="图片">
        <svg viewBox="0 0 18 18">
          <rect class="ql-stroke" height="14" width="16" x="1" y="2"></rect>
          <circle class="ql-fill" cx="6" cy="7" r="1"></circle>
          <polyline class="ql-even ql-fill" points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"></polyline>
        </svg>
      </button>
      <button class="toolbar-item ql-video" type="button" title="视频">
        <svg viewBox="0 0 18 18">
          <rect class="ql-stroke" height="12" width="12" x="3" y="3"></rect>
          <rect class="ql-fill" height="12" width="1" x="5" y="3"></rect>
          <rect class="ql-fill" height="12" width="1" x="12" y="3"></rect>
          <rect class="ql-fill" height="2" width="8" x="5" y="8"></rect>
          <rect class="ql-fill" height="1" width="3" x="3" y="5"></rect>
          <rect class="ql-fill" height="1" width="3" x="3" y="7"></rect>
          <rect class="ql-fill" height="1" width="3" x="3" y="10"></rect>
          <rect class="ql-fill" height="1" width="3" x="3" y="12"></rect>
          <rect class="ql-fill" height="1" width="3" x="12" y="5"></rect>
          <rect class="ql-fill" height="1" width="3" x="12" y="7"></rect>
          <rect class="ql-fill" height="1" width="3" x="12" y="10"></rect>
          <rect class="ql-fill" height="1" width="3" x="12" y="12"></rect>
        </svg>
      </button>
      <button class="toolbar-item ql-link" type="button" title="链接">
        <svg viewBox="0 0 18 18"> <line class="ql-stroke" x1="7" x2="11" y1="7" y2="11"></line> <path class="ql-even ql-stroke" d="M8.9,4.577a3.476,3.476,0,0,1,.36,4.679A3.476,3.476,0,0,1,4.577,8.9C3.185,7.5,2.035,6.4,4.217,4.217S7.5,3.185,8.9,4.577Z"></path> <path class="ql-even ql-stroke" d="M13.423,9.1a3.476,3.476,0,0,0-4.679-.36,3.476,3.476,0,0,0,.36,4.679c1.392,1.392,2.5,2.542,4.679.36S14.815,10.5,13.423,9.1Z"></path> </svg>
      </button>

      <button class="toolbar-item ql-bold" type="button" title="粗体">
        <svg viewBox="0 0 18 18">
          <path class="ql-stroke" d="M5,4H9.5A2.5,2.5,0,0,1,12,6.5v0A2.5,2.5,0,0,1,9.5,9H5A0,0,0,0,1,5,9V4A0,0,0,0,1,5,4Z"></path>
          <path class="ql-stroke" d="M5,9h5.5A2.5,2.5,0,0,1,13,11.5v0A2.5,2.5,0,0,1,10.5,14H5a0,0,0,0,1,0,0V9A0,0,0,0,1,5,9Z"></path>
        </svg>
      </button>
      <button class="toolbar-item ql-italic" type="button" title="斜体">
        <svg viewBox="0 0 18 18">
          <line class="ql-stroke" x1="7" x2="13" y1="4" y2="4"></line>
          <line class="ql-stroke" x1="5" x2="11" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="8" x2="10" y1="14" y2="4"></line>
        </svg>
      </button>
      <button class="toolbar-item ql-header" type="button" value="1" title="二级标题">
        <svg viewBox="0 0 18 18">
          <path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"></path>
        </svg>
      </button>
      <button class="toolbar-item ql-header" type="button" value="2" title="二级标题">
        <svg viewBox="0 0 18 18">
          <path class="ql-fill" d="M16.73975,13.81445v.43945a.54085.54085,0,0,1-.605.60547H11.855a.58392.58392,0,0,1-.64893-.60547V14.0127c0-2.90527,3.39941-3.42187,3.39941-4.55469a.77675.77675,0,0,0-.84717-.78125,1.17684,1.17684,0,0,0-.83594.38477c-.2749.26367-.561.374-.85791.13184l-.4292-.34082c-.30811-.24219-.38525-.51758-.1543-.81445a2.97155,2.97155,0,0,1,2.45361-1.17676,2.45393,2.45393,0,0,1,2.68408,2.40918c0,2.45312-3.1792,2.92676-3.27832,3.93848h2.79443A.54085.54085,0,0,1,16.73975,13.81445ZM9,3A.99974.99974,0,0,0,8,4V8H3V4A1,1,0,0,0,1,4V14a1,1,0,0,0,2,0V10H8v4a1,1,0,0,0,2,0V4A.99974.99974,0,0,0,9,3Z"></path>
        </svg>
      </button>
      <button title="左对齐" class="toolbar-item ql-align" type="button" value="">
        <svg viewBox="0 0 18 18">
          <line class="ql-stroke" x1="3" x2="15" y1="9" y2="9"></line>
          <line class="ql-stroke" x1="3" x2="13" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="3" x2="9" y1="4" y2="4"></line>
        </svg>
      </button>
      <button title="居中" class="toolbar-item ql-align" type="button" value="center">
        <svg viewBox="0 0 18 18">
          <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
          <line class="ql-stroke" x1="14" x2="4" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="12" x2="6" y1="4" y2="4"></line>
        </svg>
      </button>
      <button title="右对齐" class="toolbar-item ql-align" type="button" value="right">
        <svg viewBox="0 0 18 18">
          <line class="ql-stroke" x1="15" x2="3" y1="9" y2="9"></line>
          <line class="ql-stroke" x1="15" x2="5" y1="14" y2="14"></line>
          <line class="ql-stroke" x1="15" x2="9" y1="4" y2="4"></line>
        </svg>
      </button>
    </div>
    <div id="editor"></div>
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      width="width">
      <div>
        <el-input v-model="link.label"></el-input>
        <el-input v-model="link.url"></el-input>
      </div>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Quill from 'quill'
import Delta from 'quill-delta'
import 'quill/dist/quill.snow.css'
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          content: '',
          structuredContent: '',
        }
      }
    }
  },
  data () {
    return {
      quill: null,
      dialogVisible: false,
      link: {}
    }
  },
  mounted () {
    this.quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: '#editor-toolbar'
      },
    });

    this.quill.root.innerHTML = this.value.content

    this.quill.on('text-change', (delta, oldDelta, source) => {
      this.$emit('input', {content: this.quill.root.innerHTML, structuredContent: JSON.stringify(this.quill.getContents().ops)})
    });

    this.quill.clipboard.addMatcher(Node.ELEMENT_NODE, function(node, delta) {
      let deltas = new Delta()
      let opsList = []
      delta.forEach((op) => {
        if (typeof op.insert === 'string') {
          let attributes = op.attributes
          if (attributes && attributes.link) {
            delete attributes.link
          }
          opsList.push({
            type: 'insert',
            arguments: [op.insert]
          })
          deltas.insert(op.insert)
        } else if (!op.insert.image) {
          opsList.push({
            type: 'insert',
            arguments: [op.insert, op.attributes]
          })
          deltas.insert(op.insert, op.attributes)
        } else {
          opsList.push({
            type: 'upload',
            arguments: [op.insert.image]
          })
        }
      })

      return deltas
    });
  },
}
</script>

<style lang="scss">
#editor-toolbar {
  display: flex;
  justify-content: flex-start;
  box-align: center;
  align-items: center;
  height: 50px;
  padding: 0 30px;
  background-color: #fcfcfc;
  .toolbar-item {
    margin: 0;
    padding: 0;
    height: 20px;
    width: 20px;
    line-height: 20px;
    color: #b2b2b2;
    
    svg {
      .ql-stroke {
        stroke: #b2b2b2;
      }
      .ql-fill {
        fill: #b2b2b2
      }
    }
    &.ql-active {
      svg {
        .ql-stroke {
          stroke: #4cc3ff;
        }
        .ql-fill {
          fill: #4cc3ff;
        }
      }
    }
    &:not(:first-child) {
      margin-left: 30px;
    }
  }
}

.quill-image {
  display: block;
  margin: 20px 0;
  text-align: center;
  font-size: 0;
  .quill-image-box {
    display: inline-block;
    font-size: 0;
    position: relative;
    max-width: 100%;
  }
}


#editor {
  line-height: normal !important;
  height: 500px;
}
.ql-snow .ql-tooltip[data-mode="link"]::before {
  content: "请输入链接地址:";
}
.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: "保存";
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode="video"]::before {
  content: "请输入视频地址:";
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  vertical-align: top;
  content: "14px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="small"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="small"]::before {
  content: "10px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="large"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="large"]::before {
  vertical-align: top;
  content: "18px";
}
.ql-snow .ql-picker.ql-size .ql-picker-label[data-value="huge"]::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value="huge"]::before {
  vertical-align: top;
  content: "32px";
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  vertical-align: top;
  content: "文本";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="1"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="1"]::before {
  vertical-align: top;
  content: "标题1";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="2"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="2"]::before {
  vertical-align: top;
  content: "标题2";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="3"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="3"]::before {
  content: "标题3";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="4"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="4"]::before {
  vertical-align: top;
  content: "标题4";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="5"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="5"]::before {
  vertical-align: top;
  content: "标题5";
}
.ql-snow .ql-picker.ql-header .ql-picker-label[data-value="6"]::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value="6"]::before {
  vertical-align: top;
  content: "标题6";
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  vertical-align: top;
  content: "标准字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="serif"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="serif"]::before {
  vertical-align: top;
  content: "衬线字体";
}
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value="monospace"]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value="monospace"]::before {
  vertical-align: top;
  content: "等宽字体";
}
</style>
