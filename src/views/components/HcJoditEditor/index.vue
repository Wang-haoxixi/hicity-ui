<template>
  <jodit-vue v-model="froalaContent" :config="config" :limitChars="limitChars" />
</template>

<script>
import JoditVue from "./JoditVue";

export default {
  name: "IepJoditEditor",

  components: { JoditVue },
  props: {
    value: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: "请填写内容",
    },
    height: {
      type: Number,
      default: 300,
    },
    limitChars: {
      type: Number,
      default: 100000,
    },
  },
  data() {
    return {
      config: {
        height: this.height,
        placeholder: this.placeholder,
      },
    };
  },
  computed: {
    froalaContent: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
        this.$emit("handle-editor-confirm");
      },
    },
  },
};
</script>
