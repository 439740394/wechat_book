<template>
  <div class="ebook" ref="ebook">
    <ebook-header></ebook-header>
    <ebook-footer></ebook-footer>
    <ebook-reader></ebook-reader>
    <ebook-title></ebook-title>
    <ebook-menu></ebook-menu>
    <ebook-book-mark></ebook-book-mark>
  </div>
</template>

<script>
/* 引入电子书组件 */
import EbookReader from '../../components/ebook/ebookReader'
/* 引入电子书头部组件 */
import EbookTitle from '../../components/ebook/ebookTitle'
/* 引入下方menu组件 */
import EbookMenu from '../../components/ebook/ebookMenu'
/* 引入下方书签组件 */
import EbookBookMark from '../../components/ebook/ebookBookMark'
/* 引入页眉 */
import EbookHeader from '../../components/ebook/ebookHeader'
/* 引入页脚 */
import EbookFooter from '../../components/ebook/ebookFooter'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMinxins } from '../../utils/mixins'

export default {
  name: 'index.vue',
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu,
    EbookBookMark,
    EbookHeader,
    EbookFooter
  },
  mixins: [ebookMinxins],
  mounted () {
    this.startLoopReadTime()
  },
  methods: {
    restore () {
      this.$refs.ebook.style.top = 0 + 'px'
      this.$refs.ebook.style.transition = 'all .2s linear'
    },
    /* 书签的移动 */
    move (v) {
      this.$refs.ebook.style.transition = 'none'
      this.$refs.ebook.style.top = v + 'px'
    },
    startLoopReadTime () {
      let readTime = getReadTime(this.fileName)
      if (!readTime) {
        readTime = 0
      }
      this.task = setInterval(() => {
        readTime++
        if (readTime % 30 === 0) {
          saveReadTime(this.fileName, readTime)
        }
      }, 1000)
    }
  },
  watch: {
    offsetY (v) {
      if (!this.menuVisible && this.bookAvailable) {
        if (v > 0) {
          this.move(v)
        } else if (v === 0) {
          this.restore()
        }
      }
    }
  },
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang="scss" scoped>
  .ebook {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
</style>
