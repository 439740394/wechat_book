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
export default {
  name: 'index.vue',
  components: {
    EbookReader,
    EbookTitle,
    EbookMenu
  }
}
</script>

<style lang="scss" scoped>
</style>
