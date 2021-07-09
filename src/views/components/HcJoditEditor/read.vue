<template>
  <div class="jodit_wysiwyg-wrapper" v-html="value" />
  <!-- <jodit-vue class="jodit_wysiwyg-wrapper" :value="value" :config="config" /> -->
</template>

<script>
// import JoditVue from "./JoditVue";

export default {
  name: "IepJoditRead",

  // components: { JoditVue },
  props: {
    value: {
      type: String,
      required: false,
    },
  },
  // data() {
  //   return {
  //     config: {
  //       readonly: true,
  //       preset: "inline",
  //     },
  //   };
  // },
};
</script>
<style lang="scss" scoped>
.jodit_wysiwyg-wrapper {
  font-size: 14px;
  line-height: 32px;
  text-align: justify;
  // color: $--color-text-regular;
}
.jodit_wysiwyg-wrapper ::v-deep table {
  margin-top: 10px;
  // border: 1px solid $--border-color;
}
.jodit_wysiwyg-wrapper ::v-deep table td {
  padding: 5px;
  text-align: center;
  // border-bottom: 1px solid $--border-color;
}
.jodit_wysiwyg-wrapper ::v-deep table tr:last-child td {
  border-bottom: 0;
}
.jodit_wysiwyg-wrapper ::v-deep img {
  max-width: 100% !important;
}
</style>
