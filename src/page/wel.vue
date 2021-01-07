<template>
  <div>
    <basic-container>
      <div class="banner-text">
        <span>
			<b>欢迎访问GDS底层框架!</b>
			<br/>
			<img src="https://ioa.govmade.com/uploads/2/image/public/201909/20190926122143_rf43ij4468.gif">
        </span>
        <br>
        <span>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="完整的微服务架构" name="1">
              <div>确保你的IDE或STS 已经安装lombok</div>
              <div>建议使用 IDEA 2018+ 启动效果会更好</div>
              <div>内存较小开发机 每个微服务建议设置 -Xms128m -Xmx256m</div>
            </el-collapse-item>
            <el-collapse-item title="基础环境说明" name="2">
              <div>jdk 1.8</div>
              <div>mysql 5.7</div>
			  <div>redis 3.2+</div>
			  <div>node 8.0+</div>
			  <div>npm 6.0+</div>
            </el-collapse-item>
          </el-collapse>
        </span>
      </div>

    </basic-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Wel',
  data() {
    return {
      activeNames: ['1', '2', '3', '4'],
      DATA: [],
      text: '',
      actor: '',
      count: 0,
      isText: false
    }
  },
  computed: {
    ...mapGetters(['website'])
  },
  methods: {
    getData() {
      if (this.count < this.DATA.length - 1) {
        this.count++
      } else {
        this.count = 0
      }
      this.isText = true
      this.actor = this.DATA[this.count]
    },
    setData() {
      let num = 0
      let count = 0
      let active = false
      const timeoutstart = 5000
      const timeoutend = 1000
      const timespeed = 10
      setInterval(() => {
        if (this.isText) {
          if (count == this.actor.length) {
            active = true
          } else {
            active = false
          }
          if (active) {
            num--
            this.text = this.actor.substr(0, num)
            if (num == 0) {
              this.isText = false
              setTimeout(() => {
                count = 0
                this.getData()
              }, timeoutend)
            }
          } else {
            num++
            this.text = this.actor.substr(0, num)
            if (num == this.actor.length) {
              this.isText = false
              setTimeout(() => {
                this.isText = true
                count = this.actor.length
              }, timeoutstart)
            }
          }
        }
      }, timespeed)
    }
  }
}
</script>

<style scoped="scoped" lang="scss">
  .wel-contailer {
    position: relative;
  }

  .banner-text {
    position: relative;
    padding: 0 20px;
    font-size: 20px;
    text-align: center;
    color: #333;
  }

  .banner-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.8;
    display: none;
  }

  .actor {
    height: 250px;
    overflow: hidden;
    font-size: 18px;
    color: #333;
  }

  .actor:after {
    content: '';
    width: 3px;
    height: 25px;
    vertical-align: -5px;
    margin-left: 5px;
    background-color: #333;
    display: inline-block;
    animation: blink 0.4s infinite alternate;
  }

  .typeing:after {
    animation: none;
  }

  @keyframes blink {
    to {
      opacity: 0;
    }
  }
</style>
