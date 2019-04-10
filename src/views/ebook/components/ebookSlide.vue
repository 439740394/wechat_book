<template>
  <transition name="fade">
    <div class="slide-content-wrapper" v-show="menuVisible && settingVisible === 3">
      <transition name="slide-right">
        <div class="content" v-show="settingVisible === 3">
          <div class="content-page-wrapper" v-if="bookAvailable">
            <div class="content-page">
              <component :is="currentTab === 1 ? content : bookmark"></component>
            </div>
            <div class="content-page-tab">
              <div class="content-page-tab-item"
                   :class="{'selected': currentTab === 1}"
                   @click="selectTab(1)">{{$t('book.navigation')}}
              </div>
              <div class="content-page-tab-item"
                   :class="{'selected': currentTab === 2}"
                   @click="selectTab(2)">{{$t('book.bookmark')}}
              </div>
            </div>
          </div>
          <div class="empty" v-else>
            <ebook-loading></ebook-loading>
          </div>
        </div>
      </transition>
      <div class="content-bg" v-if="menuVisible && settingVisible === 3" @click="hide()"></div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { ebookMinxins } from '../../../utils/mixins'
import EbookSlideContent from './ebookSlideContent'
import EbookSlideBookMark from './ebookSlideBookmark'
import EbookLoading from './ebookLoading'

export default {
  mixins: [ebookMinxins],
  components: {
    EbookSlideContent,
    EbookSlideBookMark,
    EbookLoading
  },
  data () {
    return {
      currentTab: 1,
      content: EbookSlideContent,
      bookmark: EbookSlideBookMark
    }
  },
  methods: {
    selectTab (currentTab) {
      this.currentTab = currentTab
    },
    hide () {
      this.setMenuVisible(false)
      this.setSettingVisible(-1)
      this.setFontFamilyVisible(false)
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/mixin";

  .slide-content-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 350;
    display: flex;
    width: 100%;
    height: 100%;
    .content {
      flex: 0 0 85%;
      width: 85%;
      height: 100%;
      .content-page-wrapper {
        display: flex;
        flex-direction: column;
        width: 100%;
        height: 100%;
        .content-page {
          flex: 1;
          width: 100%;
          overflow: hidden;
        }
        .content-page-tab {
          display: flex;
          flex: 0 0 px2rem(48);
          .content-page-tab-item {
            flex: 1;
            font-size: px2rem(12);
            @include center;
          }
        }
      }
      .empty {
        width: 100%;
        height: 100%;
        @include center;
        font-size: px2rem(16);
        color: #333;
      }
    }
    .content-bg {
      flex: 0 0 15%;
      width: 15%;
      height: 100%;
    }
  }
</style>
