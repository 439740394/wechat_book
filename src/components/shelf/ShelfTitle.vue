<template>
  <transition name="fade">
    <div class="shelf-title-wrapper" :class="{'hide-shadow': shadowVisible}" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{$t('shelf.title')}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
        <div class="shelf-title-btn-wrapper shelf-title-left" @click="clearCache"><span class="shelf-title-btn-text">{{$t('shelf.clearCache')}}</span></div>
        <div class="shelf-title-btn-wrapper shelf-title-right" @click="changeEdit"><span class="shelf-title-btn-text">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span></div>
      </div>
    </div>
  </transition>
</template>

<script>
/* 引入混入 */
import { storeShelfMixin } from '../../utils/mixins'
import { clearLocalStorage } from '../../utils/localStorage'
import { clearLocalForage } from '../../utils/localForage'

export default {
  name: 'ShelfTitle',
  mixins: [storeShelfMixin],
  data () {
    return {
      shadowVisible: false
    }
  },
  methods: {
    clearCache () {
      clearLocalStorage()
      clearLocalForage()
      this.setShelfSelected([])
      this.getShelfList()
      this.simpleToast(this.$t('shelf.clearCacheSuccess'))
    },
    changeEdit () {
      if (!this.isEditMode) {
        this.setShelfSelected([])
        this.shelfList.forEach(item => {
          item.selected = false
        })
      }
      this.setIsEditMode(!this.isEditMode)
    }
  },
  computed: {
    selectedText () {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
      return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
    }
  },
  watch: {
    offsetY (v) {
      if (v > 0) {
        this.shadowVisible = true
      } else {
        this.shadowVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/mixin";

  .shelf-title-wrapper {
    position: relative;
    width: 100%;
    height: px2rem(42);
    z-index: 110;
    background: #ffffff;
    box-shadow: none;
    &.hide-shadow {
      box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    }
    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
      .shelf-title-sub-text {
        font-size: px2rem(10);
        color: #333;
      }
    }
    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      height: 100%;
      @include center;
      .shelf-title-btn-text {
        font-size: px2rem(14);
        color: #666;
      }
      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }
      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);
      }
    }
  }
</style>
