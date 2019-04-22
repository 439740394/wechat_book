const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}

function mock (app, url, params) {
  app.get(url, (request, response) => {
    response.json(params)
  })
}

const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/template/' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  indexPath: 'index.html',
  productionSourceMap: true,
  /* 服务配置 */
  devServer: {
    before (app) {
      mock(app, '/book/home', homeData)
      mock(app, '/book/shelf', shelfData)
      mock(app, '/book/list', listData)
      mock(app, '/book/flat-list', flatListData)
    },
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
