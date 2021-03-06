<template>
  <transition name="slide-up">
    <div class="setting-wrapper" v-show="menuVisible && settingVisible === 2">
      <div class="setting-progress">
        <div class="read-time-wrapper">
          <span class="read-time-text">{{getReadTimeText()}}</span>
          <span class="icon-forward"></span>
        </div>
        <div class="progress-wrapper">
          <div class="progress-icon-wrapper">
            <span class="icon-back" @click="prevSection()"></span>
          </div>
          <input class="progress" type="range"
                 max="100"
                 min="0"
                 step="1"
                 @input="onProgressInput($event.target.value)"
                 @change="onProgressChange($event.target.value)"
                 :value="progress"
                 :disabled="!bookAvailable"
                 ref="progress">
          <div class="progress-icon-wrapper" @click="nextSection()">
            <span class="icon-forward"></span>
          </div>
        </div>
        <div class="text-wrapper">
          <span class="progress-section-text">{{getSectionName}}</span>
          <span class="progress-text">({{bookAvailable ? progress + '%' : $t('book.loading')}})</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import { ebookMinxins } from '../../utils/mixins'

export default {
  mixins: [ebookMinxins],
  data () {
    return {
      isProgressLoading: false
    }
  },
  methods: {
    updateProgressBackground () {
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    },
    onProgressChange (progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress()
        this.updateProgressBackground()
      })
    },
    onProgressInput (progress) {
      this.setProgress(progress).then(() => {
        this.displayProgress()
        this.updateProgressBackground()
      })
    },
    displayProgress () {
      const cfi = this.currentBook.locations.cfiFromPercentage(this.progress / 100)
      this.currentBook.rendition.display(cfi).then(() => {
        this.refreshLocation()
      })
    },
    displaySection () {
      const sectionInfo = this.currentBook.section(this.section)
      if (sectionInfo && sectionInfo.href) {
        this.currentBook.rendition.display(sectionInfo.href).then(() => {
          this.refreshLocation()
        })
      }
    },
    prevSection () {
      if (this.section > 0 && this.bookAvailable) {
        this.setSection(this.section - 1).then(() => {
          this.displaySection()
        })
      }
    },
    nextSection () {
      if (this.section < (this.currentBook.spine.length - 1) && this.bookAvailable) {
        this.setSection(this.section + 1).then(() => {
          this.displaySection()
        })
      }
    }
  },
  computed: {
    getSectionName () {
      // if (this.section) {
      //   const sectionInfo = this.currentBook.section(this.section)
      //   if (sectionInfo && sectionInfo.href) {
      //     if (this.currentBook.navigation.get(sectionInfo.href)) {
      //       return this.currentBook.navigation.get(sectionInfo.href).label
      //     }
      //   }
      // }
      // return ''
      return this.section ? this.navigation[this.section].label : ''
    }
  },
  updated () {
    this.updateProgressBackground()
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/mixin";

  .setting-wrapper {
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    z-index: 102;
    width: 100%;
    height: px2rem(90);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .read-time-wrapper {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: px2rem(40);
        @include center;
        font-size: px2rem(12);
      }
      .progress-wrapper {
        width: 100%;
        height: 100%;
        @include center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .progress {
          flex: 1;
          width: 100%;
          -webkit-appearance: none;
          height: px2rem(2);
          margin: 0 px2rem(10);
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #ceced0;
            box-shadow: 0 px2rem(4) px2rem(6) 0 rgba(0, 0, 0, .15);
            border: none;
          }
        }
        .progress-icon-wrapper {
          flex: 0 0 px2rem(22);
          font-size: px2rem(22);
          @include center;
        }
      }
      .text-wrapper {
        position: absolute;
        left: 0;
        bottom: px2rem(5);
        width: 100%;
        font-size: px2rem(12);
        text-align: center;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        @include center;
        .progress-section-text {
          line-height: px2rem(15);
          @include ellipsis;
        }
        .progress-text {
          padding-left: px2rem(6)
        }
      }
    }
  }
</style>
