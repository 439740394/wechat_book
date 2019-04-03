<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
/* 引入混入minxins */
import { ebookMinxins } from '../../../utils/mixins'
/* 引入EPUBJS */
import Epub from 'epubjs'
/* 引入本地存储 */
import { getFontFamily, saveFontFamily, getFontSize, saveFontSize, getTheme, saveTheme } from '../../../utils/localStorage'

export default {
  name: 'ebookReader',
  mixins: [ebookMinxins],
  mounted () {
    this.$store.dispatch('setFileName', this.$route.params.fileName.split('|').join('/')).then(() => {
      this._initEpub()
    })
  },
  methods: {
    /* 电子书上一页翻页 */
    prevPage () {
      if (this.rendition) {
        this.rendition.prev()
        this.hideTitleAndMenu()
      }
    },
    /* 电子书下一页翻页 */
    nextPage () {
      if (this.rendition) {
        this.rendition.next()
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
    /* 初始化主题 */
    _initTheme () {
      let defaultTheme = getTheme(this.fileName)
      if (!defaultTheme) {
        defaultTheme = this.themeList[0].name
      }
      this.setDefaultTheme(defaultTheme)
      saveTheme(this.fileName, defaultTheme)
      this.themeList.forEach(theme => {
        this.rendition.themes.register(theme.name, theme.style)
      })
      console.log(this.defaultTheme)
      this.rendition.themes.select(this.defaultTheme)
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
    _initFontSize () {
      let fontSize = getFontSize(this.fileName)
      if (!fontSize) {
        saveFontSize(this.fileName, this.defaultFontSize)
      } else {
        this.rendition.themes.fontSize(fontSize)
        this.setDefaultFontSize(fontSize)
      }
    },
    /* 初始化电子书 */
    _initEpub () {
      const bookUrl = 'http://192.168.20.96:8082/epub/' + this.$route.params.fileName.split('|').join('/') + '.epub'
      /* 解析电子书 */
      this.book = new Epub(bookUrl)
      /* 电子书对象传入到vuex */
      this.setCurrentBook(this.book)
      /* 通过book对象的renderTO方法渲染电子书 */
      this.rendition = this.book.renderTo('read', {
        width: innerWidth,
        height: innerHeight,
        method: 'default'
      })
      /* 通过rendition的displayf方法渲染到页面中 */
      this.rendition.display().then(() => {
        this._initTheme()
        this._initFontFamily()
        this._initFontSize()
      })
      /* 引用在线字体 */
      this.rendition.hooks.content.register(contents => {
        Promise.all([
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
          contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`)
        ]).then(() => {
          console.log(1)
        })
      })
      /* 通过rendtion的on方法绑定时间到iframe里面 */
      this.rendition.on('touchstart', (ev) => {
        if (ev.changedTouches.length > 1) {
          return false
        }
        this.touchStartX = ev.changedTouches[0].pageX
        this.touchStartTime = ev.timeStamp
        ev.preventDefault()
      })
      this.rendition.on('touchmove', (ev) => {
        if (ev.changedTouches.length > 1) {
          return false
        }
        ev.preventDefault()
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
        ev.preventDefault()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
