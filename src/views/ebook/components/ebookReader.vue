<template>
  <div class="ebook-reader">
    <div id="read"></div>
    <div class="ebook-reader-mask" @click="handleMaskClick" @touchmove="handleMaskMove" @touchend="handleMaskEnd"></div>
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
    handleMaskMove (e) {
      let offsetY = 0
      if (this.firstOffsetY) {
        offsetY = e.changedTouches[0].clientY - this.firstOffsetY
        this.setOffsetY(offsetY)
      } else {
        this.firstOffsetY = e.changedTouches[0].clientY
      }
      e.preventDefault()
      e.stopPropagation()
    },
    handleMaskEnd () {
      this.setOffsetY(0)
      this.firstOffsetY = null
    },
    /* 蒙版点击事件 */
    handleMaskClick (e) {
      const offsetX = e.offsetX
      const screenW = window.innerWidth
      if (offsetX > 0 && offsetX < screenW * 0.3) {
        this.prevPage()
      } else if (offsetX > screenW * 0.7) {
        this.nextPage()
      } else {
        this.toggleTitleAndMenu()
      }
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
