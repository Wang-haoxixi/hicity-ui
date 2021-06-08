<template>
  <div class="editor-container" :class="{'full-screen': screenFull}">
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
      <button class="toolbar-item ql-header" type="button" value="1" title="一级标题">
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
      <button v-show="!screenFull" title="全屏" class="toolbar-item" type="button" @click="fullScreen">
         <svg t="1623137560327" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12176" width="16" height="16"><path class="ql-fill" d="M224.6125037 155.22565689l56.83063467-56.83063467c6.08392533-6.08392533 2.45881363-16.56968533-6.08513896-17.60612504l-207.38503111-24.46677333c-6.60214518-0.77672297-12.29770903 4.79019615-11.52098608 11.5221997l24.46677333 207.38503112c1.03522608 8.54395259 11.52098608 12.16785067 17.60612504 6.08392533l56.57091793-56.57091792 173.07936237 172.949504c4.01347318 4.01347318 10.61561837 4.01347318 14.62909156 0l54.88761363-54.7589689c4.01347318-4.01225955 4.01347318-10.61440475 0-14.62787793L224.6125037 155.22565689z m456.58324385 242.46620919c4.01347318 4.01347318 10.61561837 4.01347318 14.62909156 0L868.90420148 224.74236208l56.57091793 56.57091792c6.08513897 6.08392533 16.57089897 2.46002725 17.60612504-6.08392533l24.46677333-207.25638637c0.77672297-6.60214518-4.79019615-12.29770903-11.52098608-11.52098608l-207.38503111 24.46677333c-8.54395259 1.03522608-12.1690643 11.52098608-6.08513896 17.60612504l56.83063467 56.82942104-173.07936238 172.82085926c-4.01347318 4.01347318-4.01347318 10.61561837 0 14.62909156l54.88761363 54.88761363zM943.08124445 748.77064533c-1.03522608-8.54395259-11.52098608-12.16785067-17.60612504-6.08392533l-56.57091793 56.57091792-173.07936237-172.949504c-4.01347318-4.01347318-10.61561837-4.01347318-14.62909156 0l-54.88761363 54.7589689c-4.01347318 4.01225955-4.01347318 10.61440475 0 14.62787793L799.3874963 868.77434311 742.55686163 925.60497778c-6.08392533 6.08392533-2.45881363 16.56968533 6.08513896 17.60612504l207.38503111 24.46677333c6.60214518 0.77672297 12.29770903-4.79019615 11.52098608-11.5221997l-24.46677333-207.38503112zM342.80425245 626.30813392c-4.01347318-4.01347318-10.61561837-4.01347318-14.62909156 0L155.09579852 799.25763792l-56.57091793-56.57091792c-6.08513897-6.08392533-16.57089897-2.46002725-17.60612504 6.08392533l-24.46677333 207.25638637c-0.77672297 6.60214518 4.79019615 12.29770903 11.52098608 11.52098608l207.38503111-24.46677333c8.54395259-1.03522608 12.1690643-11.52098608 6.08513896-17.60612504l-56.83063467-56.7007763 173.07936238-172.949504c4.01347318-4.01347318 4.01347318-10.61561837 0-14.62909156l-54.88761363-54.88761363z" p-id="12177"></path></svg>
      </button>
      <button v-show="screenFull" title="取消全屏" class="toolbar-item" type="button" @click="fullScreen(false)">
        <svg t="1623137526454" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12030" width="16" height="16"><path class="ql-fill" d="M365.15043555 182.98538667c-0.97052445-8.00995555-10.80092445-11.40849778-16.50460444-5.70481778l-53.03637333 53.03637333L133.34755555 68.17564445c-3.76263111-3.76263111-9.95214222-3.76263111-13.71363555 0l-51.45827555 51.33653333c-3.76263111 3.76263111-3.76263111 9.95214222 0 13.71363555l162.26190222 162.26304-53.27758222 53.27758222c-5.70481778 5.70481778-2.30627555 15.53521778 5.70368 16.50574223L377.28711111 388.20977778c6.18951111 0.72817778 11.52910222-4.49080889 10.80092444-10.80092445l-22.9376-194.42346666z m12.25841778 452.92657778l-194.54520888 22.9376c-8.00995555 0.97052445-11.40849778 10.80092445-5.70368 16.50460444l53.27758222 53.27872L68.17564445 890.65244445c-3.76263111 3.76263111-3.76263111 9.95214222 0 13.71363555l51.45827555 51.33653333c3.76149333 3.76263111 9.95100445 3.76263111 13.71363555 0l162.26190223-162.14016 53.03637333 53.03523556c5.70368 5.70368 15.53408 2.30627555 16.50460444-5.70368l22.9376-194.30286222c0.72817778-6.18951111-4.48967111-11.40736-10.67918222-10.67918222z m269.18229334-247.8239289l194.54520888-22.9376c8.00995555-0.97052445 11.40849778-10.80092445 5.70368-16.50460444l-53.27758222-53.15697778L955.82435555 133.34755555c3.76263111-3.76263111 3.76263111-9.95214222 0-13.71363555l-51.45827555-51.33653333c-3.76149333-3.76263111-9.95100445-3.76263111-13.71363555 0l-162.26190223 162.01955555-53.03637333-53.03637333c-5.70368-5.70368-15.53408-2.30513778-16.50460444 5.70481778L635.91196445 377.28711111c-0.72817778 6.31125333 4.48967111 11.52910222 10.67918222 10.80092444z m146.97130666 340.42311112l53.27758222-53.27758222c5.70481778-5.70481778 2.30627555-15.53521778-5.70368-16.50574223L646.71288889 635.79022222c-6.18951111-0.72817778-11.52910222 4.49080889-10.80092444 10.80092445l22.9376 194.42346666c0.97052445 8.00995555 10.80092445 11.40849778 16.50460444 5.70481778l53.03637333-53.03637333L890.65244445 955.82435555c3.76263111 3.76263111 9.95214222 3.76263111 13.71363555 0l51.45827555-51.33653333c3.76263111-3.76263111 3.76263111-9.95214222 0-13.71363555L793.56245333 728.51114667z" p-id="12031"></path></svg>
      </button>
    </div>
    <div id="editor"></div>
    <input ref="file" type="file" @change="imageSelect" style="height: 0; width: 0;" />
    <el-dialog
      :visible.sync="dialogVisibleLink" append-to-body>
      <el-form label-width="60px" class="link-form">
        <el-form-item label="内容：">
          <el-input v-model="link.label"></el-input>
        </el-form-item>
        <el-form-item label="地址：">
          <el-input v-model="link.url" style="margin-bottom: 0"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="linkCancel">取 消</el-button>
        <el-button type="primary" @click="linkSave">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog
      :visible.sync="dialogVisibleVideo" append-to-body>
      <el-form label-width="100px" class="link-form">
        <el-form-item label="视频链接：">
          <el-input v-model="videoUrl" style="margin-bottom: 0"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="videoCancel">取 消</el-button>
        <el-button type="primary" @click="videoSave">确 定</el-button>
      </div>
    </el-dialog>


  </div>
</template>

<script>
import { v4 as uuidv4 } from 'uuid'
import Quill from 'quill'
import Delta from 'quill-delta'
import 'quill/dist/quill.snow.css'
import { ossUpload } from '@/api/admin/sys-file'
import { uploadImage } from '@/util/file'
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';

const BlockEmbed = Quill.import('blots/block/embed');
class ImageUploading extends BlockEmbed {
  static blotName = 'ImageUploading'
  static tagName = 'div'
  static className = 'quill-image-box'
  static create() {
    let value = `
      <div class="quill-image-innder">
        <img src="/img/quill/quill-uploading.png" />
      </div>
    `
    const node = super.create(value);
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('width', '100%');
    node.innerHTML = this.transformValue(value)
    return node;
  }
  static transformValue(value) {
    let handleArr = value.split('\n')
    handleArr = handleArr.map(e => e.replace(/^[\s]+/, '')
      .replace(/[\s]+$/, ''))
    return handleArr.join('')
  }
  constructor(domNode, data) {
    domNode.setAttribute('uuid', data.uuid)
    super(domNode)
    window.quillVm.updateImage(data.uuid, data.file, data.type)
  }
  static value(domNode) {
    return {
      uuid: domNode.getAttribute('uuid'),
    }
  }
}
Quill.register(ImageUploading);

class image extends BlockEmbed {
  static blotName = 'image'
  static tagName = 'img'
  static className = 'quill-image'

  static create() {
    // let value = `
    //   <div class="quill-image-box">
    //   </div>
    // `
    const node = super.create();
    node.setAttribute('contenteditable', 'false');
    // node.style.width = '500px'
    node.setAttribute('width', '400px');
    // node.innerHTML = this.transformValue(value)
    return node;
  }
  constructor(domNode, data) {
    // let img = document.createElement('img')
    // img.src = data
    // domNode.childNodes[0].appendChild(img)
    domNode.src = data
    super(domNode)
  }
  static transformValue(value) {
    let handleArr = value.split('\n')
    handleArr = handleArr.map(e => e.replace(/^[\s]+/, '')
      .replace(/[\s]+$/, ''))
    return handleArr.join('')
  }
  static value(domNode) {
    return domNode.src
  }
}
Quill.register(image);


class video extends BlockEmbed {
  static blotName = 'video'
  static tagName = 'div'

  static create(url) {
    this.url = url
    let value = `
      <div class="quill-video">
        <div class="quill-video-box">
          <video src="https://vd2.bdstatic.com/mda-mb4qn692fvz9inmr/v1-cae/sc/mda-mb4qn692fvz9inmr.mp4?v_from_s=hkapp-haokan-nanjing&auth_key=1612671948-0-0-937a8fa5bb8bc76c3dc867b573aaeac2&bcevod_channel=searchbox_feed&pd=1&pt=3&abtest=8_2">
          </video>
        </div>
      </div>
    `
    const node = super.create(value);
    node.setAttribute('contenteditable', 'false');
    node.setAttribute('width', '100%');
    node.innerHTML = this.transformValue(value)
    return node;
  }

  static transformValue(value) {
    let handleArr = value.split('\n')
    handleArr = handleArr.map(e => e.replace(/^[\s]+/, '')
      .replace(/[\s]+$/, ''))
    return handleArr.join('')
  }

  // 返回节点自身的value值 用于撤销操作
  static value() {
    return this.url
  }
}
// Quill.register(video);

export default {
  name: 'HcQuill',
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
      dialogVisibleLink: false,
      dialogVisibleVideo: false,
      link: {
        label: '',
        url: ''
      },
      videoUrl: '',
      selection: null,
      screenFull: false
    }
  },
  destroyed () {
    window.quillVm = null
  },
  mounted () {
    window.quillVm = this
    // let that = this
    this.quill = new Quill('#editor', {
      theme: 'snow',
      modules: {
        toolbar: '#editor-toolbar'
      },
    });

    // 自定义图片
    this.quill.getModule('toolbar').addHandler('image', (value) => {
      this.$refs.file.click()
    })

    // 自定义链接
    this.quill.getModule('toolbar').addHandler('link', (value) => {
      let selection = this.quill.getSelection() || {index: 0, length: 0}
      if (!value && selection.length == 0) {
        let pointerIndex = selection.index
        let contents = this.quill.getContents()
        let index= 0
        let end = false
        contents.forEach(op => {
          if (!end) {
            let insert = op.insert
            if (typeof insert == 'string') {
              if (index < pointerIndex && index + insert.length >= pointerIndex) {
                let delta = new Delta()
                  .retain(index)
                  .delete(insert.length)
                  .insert(insert)
                this.quill.updateContents(delta)
                end = true
                return
              }
              index += insert.length
            } else {
              index++
            }
          }
        })
      } else {
        this.selection = selection
        this.link.label = this.quill.getText(this.selection.index, this.selection.length)
        this.dialogVisibleLink = true
      }
    })

     // 自定义视频
    this.quill.getModule('toolbar').addHandler('video', (value) => {
      let selection = this.quill.getSelection() || {index: 0, length: 0}
      if (!value && selection.length == 0) {
        let pointerIndex = selection.index
        let contents = this.quill.getContents()
        let index= 0
        let end = false
        contents.forEach(op => {
          if (!end) {
            let insert = op.insert
            if (typeof insert == 'string') {
              if (index < pointerIndex && index + insert.length >= pointerIndex) {
                let delta = new Delta()
                  .retain(index)
                  .delete(insert.length)
                  .insert(insert)
                this.quill.updateContents(delta)
                end = true
                return
              }
              index += insert.length
            } else {
              index++
            }
          }
        })
      } else {
        this.selection = selection
        this.link.label = this.quill.getText(this.selection.index, this.selection.length)
        this.dialogVisibleVideo = true
      }
    })
    if (this.value.structuredContent) {
      // const converter = new QuillDeltaToHtmlConverter(JSON.parse(this.value.structuredContent || '[]'), {inlineStyles: true, multiLineParagraph: false})
      // const html = converter.convert()
      // this.quill.root.innerHTML = html
      this.quill.setContents(JSON.parse(this.value.structuredContent || '[]'))
    } else if (this.value.content) {
      this.quill.root.innerHTML = this.value.content
    }
    this.quill.on('text-change', (delta, oldDelta, source) => {
      let deltas = new Delta()
      this.quill.getContents().forEach(op => {
        if (!op.ImageUploading) {
          deltas.insert(op.insert, op.attributes)
        }
      })
      const converter = new QuillDeltaToHtmlConverter(deltas.ops, {inlineStyles: true, multiLineParagraph: false})
      const html = converter.convert()
      this.$emit('input', {content: html, structuredContent: JSON.stringify(deltas.ops)})
    });

    // 复制粘贴
    this.quill.clipboard.addMatcher(Node.ELEMENT_NODE, function(node, delta) {
      let deltas = new Delta()
      delta.forEach((op) => {
        if (typeof op.insert === 'string') {
          let attributes = op.attributes
          if (attributes && attributes.link) {
            delete attributes.link
          }
          deltas.insert(op.insert, op.attributes)
        }
        else if (!op.insert.image) {
          deltas.insert(op.insert, op.attributes)
        } else {
          let uuid = uuidv4()
          deltas.insert({
            'ImageUploading': {
              uuid,
              file: op.insert.image,
              type: 2,
            }
          })
        }
      })
      return deltas
    });
  },
  methods: {
    imageSelect (event) {
      let file = event.target.files[0]
      this.insertImage(file)
      event.target.value = ''
    },
    updateImage (uuid, file, type) {
      if (type == 1) {
        // 选择的文件上传
        ossUpload(file).then(({data}) => {
          this.replaceImage(uuid, data.data.data.url)
        }, (error) => {
          this.$message.error('图片上传失败！')
          this.removeImage(uuid)
        }).catch(() => {
          this.$message.error('图片上传失败！')
          this.removeImage(uuid)
        })
      } else {
        // 路径图片上传
        uploadImage(file).then(({data}) => {
          this.replaceImage(uuid, data.data.data.url)
        }, (error) => {
          this.$message.error(error.message)
          this.removeImage(uuid)
        }).catch(() => {
          this.$message.error('图片上传失败！')
          this.removeImage(uuid)
        })
      }
    },
    // 替换上传的图片
    replaceImage (uuid, url) {
      let structuredContent = this.quill.getContents()
      let index = 0
      let insert
      structuredContent.forEach(op => {
        insert = op.insert
        if (typeof insert == 'string') {
          index += insert.length
        } else if (insert.ImageUploading && insert.ImageUploading.uuid == uuid) {
          let delta = new Delta()
          .retain(index)
          .delete(1)
          .insert({
            image: url
          })
          this.quill.updateContents(delta)
        } else {
          index++
        }
      })
    },
    // 移除正在上传的图片
    removeImage (uuid) {
      let structuredContent = this.quill.getContents()
      let index = 0
      let insert
      structuredContent.forEach(op => {
        insert = op.insert
        if (typeof insert == 'string') {
          index += insert.length
        } else if (insert.ImageUploading && insert.ImageUploading.uuid == uuid) {
          let delta = new Delta()
          .retain(index)
          .delete(1)
          this.quill.updateContents(delta)
        } else {
          index++
        }
      })
    },
    // 图片上传
    insertImage (file) {
      let uuid = uuidv4()
      let selection = this.quill.getSelection()
      this.quill.insertEmbed(selection.index || 0, 'ImageUploading', {uuid, file, type: 1});
    },
    linkSave () {
      let selection = this.selection || {index: 0, length: 0}
      let delta = new Delta()
        .retain(selection.index)
        .delete(selection.length)
        .insert(this.link.label, {link: this.link.url})
      this.quill.updateContents(delta)
      this.dialogVisibleLink = false
    },
    videoSave () {
      let selection = this.selection || {index: 0, length: 0}
      let delta = new Delta()
        .retain(selection.index)
        .delete(selection.length)
        .insert({video: this.videoUrl})
      this.quill.updateContents(delta)
      this.dialogVisibleVideo = false
    },
    videoCancel () {
      this.videoUrl = ''
      this.dialogVisibleVideo = false
    },
    linkCancel () {
      this.link = {
        label: '',
        url: ''
      }
      this.dialogVisibleLink = false
    },
    getData () {
      let structuredContent = this.quill.getContents().ops
      let haha = structuredContent.filter(op => {
        return (typeof op.insert === 'string') || !op.insert.ImageUploading
      })
    },
    fullScreen (screenFull = true) {
      this.screenFull = screenFull
    }
  }
}
</script>

<style lang="scss" scoped>
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
    color: #444;

    svg {
      .ql-stroke {
        stroke: #444;
      }
      .ql-fill {
        fill: #444;
      }
    }
    &:hover {
      svg {
        .ql-stroke {
          stroke: #06c;
        }
        .ql-fill {
          fill: #06c;
        }
      }
    }
    &:not(:first-child) {
      margin-left: 30px;
    }
  }
}

.editor-container {
  display: flex;
  flex-direction: column;
  &.full-screen {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    width: 100%;
    z-index: 1500;
  }
  #editor {
    flex: 100px 1 1;
  }
  background-color: #ffffff;
}

/deep/.quill-image {
  display: block;
  margin: 0 auto;
  font-size: 0;
  width: 400px;
}

/deep/.quill-image-box {
  display: block;
  text-align: center;
  font-size: 0;
  width: 100%;
  .quill-image-inner {
    display: inline-block;
    font-size: 0;
    position: relative;
    max-width: 100%;
    width: 200px;
    image {
      width: 100%;
    }
  }
}

.quill-video {
  display: block;
  margin: 20px 0;
  text-align: center;
  font-size: 0;
  .quill-video-box {
    display: inline-block;
    font-size: 0;
    position: relative;
    width: 100%;
    height: 300px;
    video {
      height: 100%;
      width: 100%;
    }
  }
}

.link-form {
  /deep/.el-form-item {
    margin: 0;
    &:not(:first-child) {
      margin-top: 10px;
    }
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
