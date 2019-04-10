<template>
  <div class="ebook-slide-bookmark">
    <div class="slide-bookmark-title">{{$t('book.bookmark')}} · {{bookmark ? bookmark.length : 0}}</div>
    <scroll class="slide-bookmark-list" :top="48" :bottom="48">
      <div class="slide-bookmark-item" v-for="(item, index) in bookmark" :key="index" @click="displayBookMark(item.cfi)">
        <div class="slide-bookmark-item-icon">
          <div class="icon-bookmark"></div>
        </div>
        <div class="slide-bookmark-item-text">{{item.text}}</div>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import Scroll from '../../../components/scroll'
import { ebookMinxins } from '../../../utils/mixins'
import { getBookmark } from '../../../utils/localStorage'

export default {
  mixins: [ebookMinxins],
  components: {
    Scroll
  },
  data () {
    return {
      bookmark: null
    }
  },
  mounted () {
    this.bookmark = getBookmark(this.fileName)
  },
  methods: {
    displayBookMark (cfi) {
      this.currentBook.rendition.display(cfi).then(() => {
        this.refreshLocation()
        this.setMenuVisible(false)
        this.setSettingVisible(-1)
        this.setFontFamilyVisible(false)
      })
    }
  },
  watch: {
    isBookMark (v) {
      setTimeout(() => {
        this.bookmark = getBookmark(this.fileName)
      }, 0)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/mixin";

  .ebook-slide-bookmark {
    width: 100%;
    .slide-bookmark-title {
      width: 100%;
      height: px2rem(48);
      font-size: px2rem(14);
      font-weight: bold;
      padding: 0 px2rem(15);
      box-sizing: border-box;
      @include left;
    }
    .slide-bookmark-list {
      padding: 0 px2rem(15);
      box-sizing: border-box;
      .slide-bookmark-item {
        display: flex;
        padding: px2rem(15) 0;
        box-sizing: border-box;
        .slide-bookmark-item-icon {
          flex: 0 0 px2rem(29);
          @include left;
          .icon-bookmark {
            width: px2rem(20);
            height: px2rem(20);
            font-size: px2rem(12);
            border-radius: 50%;
            background: #bbb;
            @include center;
          }
        }
        .slide-bookmark-item-text {
          font-size: px2rem(14);
          line-height: px2rem(15);
          max-height: px2rem(45);
          @include ellipsis2(3);
        }
      }
    }
  }
</style>
