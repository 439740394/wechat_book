<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" @touchstart="handleMaskStart" @touchmove="handleMaskMove" @touchend="handleMaskEnd"></div>
  </div>
</template>

<script>
/* 引入混入minxins */
import { ebookMinxins } from '../../../utils/mixins'
/* 引入EPUBJS */
import Epub from 'epubjs'
/* 引入本地存储 */
import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme, getLocation } from '../../../utils/localStorage'
import { resortNavigation } from '../../../utils/utils'

export default {
  name: 'ebookReader',
  mixins: [ebookMinxins],
  mounted () {
    const url = this.$route.params.fileName.split('|').join('/')
    this.setFileName(url).then(() => {
      this._initEpub()
    })
  },
  methods: {
    /* 蒙版touch事件 */
    handleMaskStart (e) {
      this.startPoint = {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY
      }
      this.startTime = e.timeStamp
    },
    handleMaskMove (e) {
      let offsetY = 0
      this.movePoint = {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY
      }
      let btn = null
      if ((Math.abs(this.movePoint.y - this.startPoint.y) - 3 * Math.abs(this.movePoint.x - this.startPoint.x)) >= 0) {
        btn = true
      } else {
        btn = false
      }
      if (this.startPoint && btn) {
        offsetY = this.movePoint.y - this.startPoint.y
        this.setOffsetY(offsetY)
      }
    },
    handleMaskEnd (e) {
      this.endPoint = {
        x: e.changedTouches[0].pageX,
        y: e.changedTouches[0].pageY
      }
      this.endTime = e.timeStamp
      if (this.startPoint.x < window.innerWidth * 0.3 && Math.abs(this.endPoint.x - this.startPoint.x) <= 2 && Math.abs(this.endPoint.y - this.startPoint.y) <= 6 && this.endTime - this.startTime < 500) {
        this.prevPage()
      } else if (window.innerWidth * 0.7 < this.startPoint.x && this.startPoint.x < window.innerWidth && Math.abs(this.endPoint.x - this.startPoint.x) <= 6 && Math.abs(this.endPoint.y - this.startPoint.y) <= 2 && this.endTime - this.startTime < 500) {
        this.nextPage()
      } else if (window.innerWidth * 0.3 < this.startPoint.x && this.startPoint.x < window.innerWidth * 0.7 && Math.abs(this.endPoint.x - this.startPoint.x) <= 6 && Math.abs(this.endPoint.y - this.startPoint.y) <= 2 && this.endTime - this.startTime < 500) {
        this.toggleTitleAndMenu()
      }
      this.setOffsetY(0)
      this.startPoint = null
      this.startTime = null
    },
    /* 电子书上一页翻页 */
    prevPage () {
      if (this.rendition) {
        this.rendition.prev().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    /* 电子书下一页翻页 */
    nextPage () {
      if (this.rendition) {
        this.rendition.next().then(() => {
          this.refreshLocation()
        })
        this.hideTitleAndMenu()
      }
    },
    /* 控制栏选项 */
    toggleTitleAndMenu () {
      if (this.menuVisible) {
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      }
      this.setMenuVisible(!this.menuVisible)
    },
    /* 隐藏控制栏 */
    hideTitleAndMenu () {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    },
    /* 获取封面 名称作者 目录 */
    _initParseBook () {
      this.book.loaded.cover.then(cover => {
        this.book.archive.createUrl(cover).then(url => {
          this.setCover(url)
        })
      })
      this.book.loaded.metadata.then(data => {
        this.setMetadata(data)
      })
      this.book.loaded.navigation.then(nav => {
        let navItem = resortNavigation(nav.toc)
        navItem.forEach(item => {
          item.level = find(item)
        })
        function find (item, level = 0) {
          return !item.parent ? level : find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
        }
        this.setNavigation(navItem)
      })
    },
    /* 初始化主题 */
    _initTheme () {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
        saveTheme(this.fileName, defaultTheme)
      }
      this.setDefaultTheme(defaultTheme)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      this.rendition.themes.select(defaultTheme)
    },
    /* 初始化字体 */
    _initFontFamily () {
      let fontFamily = getFontFamily(this.fileName)
      if (!fontFamily) {
        saveFontFamily(this.fileName, this.defaultFontFamily)
      } else {
        this.rendition.themes.font(fontFamily)
        this.setDefaultFontFamily(fontFamily)
      }
    },
    /* 初始化字号 */
    _initFontSize () {
      let fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize + 'px')
        this.setDefaultFontSize(fontSize)
      }
    },
    /* 初始化电子书 */
    _initEpub () {
      const bookUrl = `${process.env.VUE_APP_RES_URL}/epub/${this.fileName}.epub`
      /* 解析电子书 */
      this.book = new Epub(bookUrl)
      /* 电子书对象传入到vuex */
      this.setCurrentBook(this.book)
      /* 通过book对象的renderTO方法渲染电子书 */
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight
        // method: 'default'
      })
      /* 引用在线字体 */
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {
        })
      })
      /* 通过rendition的displayf方法渲染到页面中 */
      const location = getLocation(this.fileName)
      if (this.rendition && location) {
        this.rendition.display(location).then(() => {
          this._initTheme()
          this._initGlobalTheme()
          this._initFontFamily()
          this._initFontSize()
          this.refreshLocation()
        })
      } else if (this.rendition && !location) {
        this.rendition.display().then(() => {
          this._initTheme()
          this._initGlobalTheme()
          this._initFontFamily()
          this._initFontSize()
          this.refreshLocation()
        })
      }
      this._initParseBook()
      /* 加载完电子书后进行分页 */
      this.book.ready.then(() => {
        return this.book.locations.generate()/* 可以加参数分多少页 */
      }).then(locations => {
        this.refreshLocation()
        this.setBookAvailable(true)
      })
      /* 通过rendtion的on方法绑定时间到iframe里面 */
      this.rendition.on('touchstart', (ev) => {
        if (ev.changedTouches.length > 1) {
          return false
        }
        this.touchStartX = ev.changedTouches[0].pageX
        this.touchStartTime = ev.timeStamp
      }, { passive: false })
      this.rendition.on('touchmove', (ev) => {
        if (ev.changedTouches.length > 1) {
          return false
        }
      })
      this.rendition.on('touchend', (ev) => {
        if (ev.changedTouches.length > 1) {
          return false
        }
        this.touchEndX = ev.changedTouches[0].pageX
        this.touchEndTime = ev.timeStamp
        const _offset = this.touchEndX - this.touchStartX
        const _time = this.touchEndTime - this.touchStartTime
        if (_time < 500 && _offset > 40) {
          this.prevPage()
        } else if (_time < 500 && _offset < -40) {
          this.nextPage()
        } else {
          this.toggleTitleAndMenu()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .ebook-reader {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .ebook-reader-mask {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
</style>
