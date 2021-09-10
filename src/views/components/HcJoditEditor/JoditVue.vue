<template>
  <div></div>
</template>

<script>
import { Jodit } from "jodit";
import store from "@/store";
import "jodit/build/jodit.min.css";

export default {
  name: "JoditVue",

  props: {
    value: { type: String, required: true },
    limitChars: { type: Number, default: 100000 },
    config: { type: Object, default: () => ({}) },
  },

  computed: {
    defaultConfig() {
      return {
        limitChars: this.limitChars,
        disablePlugins: "media,symbols,sticky",
        language: "zh_cn",
        toolbarAdaptive: false,
        crossOrigin: false,
        buttons:
          "source,|,undo,redo,bold,strikethrough,underline,italic,|,align,outdent,indent,|,font,fontsize,brush,paragraph,\n,image,table,link,cut,hr,eraser,copyformat,fullsize",
        uploader: {
          url: "/api/admin/sys_file/oss/upload",
          headers: {
            Authorization: "Bearer " + store.getters.access_token,
          },
          prepareData: function (formdata) {
            formdata.append('file', formdata.getAll('files[0]')[0])
            formdata.delete('path')
            formdata.delete('source')
            return formdata;
          },
          isSuccess(resp) {
            return !resp.code;
          },
          process(resp) {
            return {
              baseurl: "",
              code: 220,
              files: [resp.data.data.url],
              path: "",
              isImages: [true],
              messages: [],
            }
            // baseurl: "https://xdsoft.net/jodit/files/"
            // code: 220
            // files: ["EcQrXoTU8AA0yu3.jpg"]
            // isImages: [true]
            // messages: []
            const { data } = resp;
            const images = [
              "PNG",
              "png",
              "JPG",
              "jpg",
              "JPEG",
              "jpeg",
              "WEBP",
              "webp",
              "GIF",
              "gif",
            ];
            const isImages = data.map(m => {
              return images.includes(m.split(".").pop());
            });
            const obj = {
              baseurl: "",
              code: 220,
              files: data || [],
              path: "",
              isImages: isImages,
              messages: [],
            };
            return obj;
          },
        },
        imageDefaultWidth: "",
        ...this.config,
      };
    },
  },

  watch: {
    value: {
      handler: function(newValue) {
        if (this.editor.value !== newValue) {
          this.initEditor(newValue);
        }
      },
    },
  },

  mounted() {
    this.editor = new Jodit(this.$el, this.defaultConfig);
    this.editor.events.on("change", newValue => this.$emit("input", newValue));
    this.initEditor(this.value);
  },

  beforeDestroy() {
    this.editor.destruct();
  },
  methods: {
    initEditor(newValue) {
      this.$nextTick(() => {
        this.$set(this.editor, "value", newValue);
      });
    },
  },
};
</script>
