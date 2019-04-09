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
    <div class="ebook-bookmark-icon-wrapper">
      <book-mark :color="color" :width="15" :height="35"></book-mark>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { ebookMinxins } from '../../../utils/mixins'
/*  引入书签组件 */
import BookMark from '../../../components/bookMark'
import { realPx } from '../../../utils/utils'
const BLUE = '#346cbc'
const WHITE = '#ffffff'
export default {
  mixins: [ebookMinxins],
  components: {
    BookMark
  },
  data () {
    return {
      text: this.$t('book.pulldownAddMark'),
      color: WHITE
    }
  },
  methods: {},
  computed: {
    height () {
      return realPx(35)
    },
    threshold () {
      return realPx(55)
    }
  },
  watch: {
    offsetY (v) {
      console.log(v)
      if (v >= this.height && v < this.threshold) {
        this.$refs.ebookBookmark.style.top = `${-v}px`
        this.text = this.$t('book.pulldownAddMark')
      } else if (v >= this.threshold) {
        this.$refs.ebookBookmark.style.top = `${-v}px`
        this.text = this.$t('book.releaseAddMark')
        this.color = BLUE
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/mixin";

  .ebook-bookmark {
    position: absolute;
    top: px2rem(-35);
    left: 0;
    z-index: 200;
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
