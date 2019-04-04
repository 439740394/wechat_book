<template>
  <div class="ebook">
    <ebook-reader></ebook-reader>
    <ebook-title></ebook-title>
    <ebook-menu></ebook-menu>
  </div>
</template>

<script>
/* 引入电子书组件 */
import EbookReader from './components/ebookReader'
/* 引入电子书头部组件 */
import EbookTitle from './components/ebookTitle'
/* 引入下方menu组件 */
import EbookMenu from './components/ebookMenu'
import { getReadTime, saveReadTime } from '../../utils/localStorage'
import { ebookMinxins } from '../../utils/mixins'

export default {
  name: 'index.vue',
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  },
  mixins: [ebookMinxins],
  mounted () {
    this.startLoopReadTime()
  },
  methods: {
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
  beforeDestroy () {
    if (this.task) {
      clearInterval(this.task)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
