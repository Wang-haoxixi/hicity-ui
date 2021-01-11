<template>
  <div>
    <div id="editor" style="height: 200px;width: 200px"></div>
  </div>
</template>

<script>
import Quill from 'quill'
import devPage from '@/views/devPage/index'
export default {
  components: {
    devPage
  },
  data () {
    return {
    }
  },
  mounted () {
    var options = {
      debug: 'info',
      modules: {
        toolbar: '#toolbar'
      },
      placeholder: 'Compose an epic...',
      readOnly: true,
      theme: 'snow'
    };
    var editor = new Quill('#editor');
  }
}
</script>

<style lang="" scoped>
</style>
