const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/template/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  productionSourceMap: true,
  /* 服务配置 */
  devServer: {
    port: 8080,
    host: '0.0.0.0'
  },
  chainWebpack: (config) => {
    /* 修改文件引入自定义路径 */
    config
      .resolve.alias
      .set('@', resolve('src'))
    config
      .entry('index')
      .add('babel-polyfill')
  }
}
