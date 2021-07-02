const url = "http://183.131.134.242:10167"; // 测试站
// const url = "http://192.168.0.107:9999"; // 郑旭
// const url = 'http://192.168.0.116:9999'// 张云生
//  const url = "http://192.168.0.181:9999"; // 司泉鑫
//  const url = "http://192.168.0.154:9999"; // 杜友
//  const url = "http://192.168.0.153:9999"; // 辜鹏
module.exports = {
  lintOnSave: true,
  productionSourceMap: false,
  chainWebpack: config => {
    // 忽略的打包文件
    config.externals({
      axios: "axios"
    });
    const entry = config.entry("app");
    entry.add("babel-polyfill").end();
    entry.add("classlist-polyfill").end();
  },
  // 配置转发代理
  devServer: {
    disableHostCheck: true,
    port: 8080,
    proxy: {
      "/api": {
        target: url,
        ws: true,
        pathRewrite: {
          // "^/api": ""
        }
      },
      // '/admin': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/admin': '/admin'
      //   }
      // },
      "/code": {
        target: url,
        ws: true,
        pathRewrite: {
          "^/code": "/code"
        }
      }
      // '/gen': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/gen': '/gen'
      //   }
      // },
      // '/actuator': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/actuator': '/actuator'
      //   }
      // },
      // '/monitor': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/monitor': '/monitor'
      //   }
      // },
      // '/mp': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/mp': '/mp'
      //   }
      // },
      // '/daemon': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/daemon': '/daemon'
      //   }
      // },
      // '/job': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/job': '/job'
      //   }
      // },
      // '/tx': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/tx': '/tx'
      //   }
      // },
      // '/pay': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/pay': '/pay'
      //   }
      // },
      // '/act': {
      //   target: url,
      //   ws: true,
      //   pathRewrite: {
      //     '^/act': '/act'
      //   }
      // }
    }
  }
};
