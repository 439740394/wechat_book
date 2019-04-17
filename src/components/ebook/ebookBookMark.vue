<template>
  <div class="ebook-bookmark" ref="ebookBookmark">
    <div class="ebook-bookmark-text-wrapper">
      <div class="ebook-bookmark-down-wrapper" ref="iconDown">
        <span class="icon-down"></span>
      </div>
      <div class="ebook-bookmark-text">
        {{text}}
      </div>
    </div>
    <div class="ebook-bookmark-icon-wrapper" :style="isFixed ? fixedStyle : {}">
      <book-mark :color="color" :width="15" :height="35"></book-mark>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { ebookMinxins } from '../../utils/mixins'
/*  引入书签组件 */
import BookMark from '../bookMark'
import { realPx } from '../../utils/utils'
import { getBookmark, saveBookmark } from '../../utils/localStorage'

const BLUE = '#346cbc'
const WHITE = '#ffffff'
export default {
  mixins: [ebookMinxins],
  components: {
    BookMark
  },
  data () {
    return {
      text: '',
      color: WHITE,
      isFixed: false
    }
  },
  methods: {
    /* 添加书签方法 */
    addBookMark () {
      this.bookmark = getBookmark(this.fileName)
      if (!this.bookmark) {
        this.bookmark = []
      }
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfibase = currentLocation.start.cfi.replace(/!.*/, '')
      const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
      const cfiend = currentLocation.end.cfi.replace(/.*!/, '')
      const cfirange = `${cfibase}!,${cfistart},${cfiend}`
      this.currentBook.getRange(cfirange).then(range => {
        const text = range.toString().replace(/\s\s/g, '')
        this.bookmark.push({
          cfi: currentLocation.start.cfi,
          text
        })
        saveBookmark(this.fileName, this.bookmark)
      })
    },
    /* 删除书签方法 */
    removeBookMark () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      const cfi = currentLocation.start.cfi
      this.bookmark = getBookmark(this.fileName)
      if (this.bookmark) {
        this.bookmark = this.bookmark.filter(item => item.cfi !== cfi)
        saveBookmark(this.fileName, this.bookmark)
        this.setIsBookMark(false)
      }
    },
    restore () {
      setTimeout(() => {
        this.$refs.ebookBookmark.style.top = `${-this.height}px`
        this.$refs.iconDown.style.transform = 'rotate(0deg)'
      }, 200)
      if (this.isFixed) {
        this.setIsBookMark(true)
        this.addBookMark()
      } else {
        this.setIsBookMark(false)
        this.removeBookMark()
      }
    },
    beforeThreshold (v) {
      this.$refs.ebookBookmark.style.top = `${-v}px`
      this.beforeHeight()
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === 'rotate(180deg)') {
        iconDown.style.transform = 'rotate(0deg)'
      }
    },
    afterThreshold (v) {
      this.$refs.ebookBookmark.style.top = `${-v}px`
      if (this.isBookMark) {
        this.text = this.$t('book.releaseDeleteMark')
        this.color = WHITE
        this.isFixed = false
      } else {
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
        this.isFixed = true
      }
      const iconDown = this.$refs.iconDown
      if (iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
        iconDown.style.transform = 'rotate(180deg)'
      }
    },
    beforeHeight () {
      if (this.isBookMark) {
        this.text = this.$t('book.pulldownDeleteMark')
        this.color = BLUE
        this.isFixed = true
      } else {
        this.text = this.$t('book.pulldownAddMark')
        this.color = WHITE
        this.isFixed = false
      }
    }
  },
  computed: {
    height () {
      return realPx(35)
    },
    threshold () {
      return realPx(55)
    },
    fixedStyle () {
      return {
        position: 'fixed',
        top: 0,
        right: `${(window.innerWidth - this.$refs.ebookBookmark.clientWidth) / 2}px`
      }
    }
  },
  watch: {
    offsetY (v) {
      if (!this.bookAvailable || this.menuVisible || this.settingVisible >= 0) {
        return
      }
      if (v > 0 && v < this.height) {
        this.beforeHeight()
      } else if (v >= this.height && v < this.threshold) {
        this.beforeThreshold(v)
      } else if (v >= this.threshold) {
        this.afterThreshold(v)
      } else if (v === 0) {
        this.restore()
      }
    },
    isBookMark (v) {
      this.isFixed = v
      if (v) {
        this.color = BLUE
      } else {
        this.color = WHITE
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/mixin";

  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 100;
    width: 100%;
    height: px2rem(35);
    .ebook-bookmark-text-wrapper {
      position: absolute;
      right: px2rem(45);
      bottom: 0;
      display: flex;
      .ebook-bookmark-down-wrapper {
        font-size: px2rem(14);
        color: white;
        transition: all .2s linear;
        @include center;
      }
      .ebook-bookmark-text {
        font-size: px2rem(14);
        color: white;
      }
    }
    .ebook-bookmark-icon-wrapper {
      position: absolute;
      right: 0;
      bottom: 0;
      margin-right: px2rem(15);
    }
  }
</style>
