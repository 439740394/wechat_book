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
      }
      this.setMenuVisible(!this.menuVisible)
    },
    /* 隐藏控制栏 */
    hideTitleAndMenu () {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
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
      this.rendition.display()
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
        ev.stopPropagation()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
