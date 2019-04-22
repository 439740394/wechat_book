<template>
  <div>
    <div class="search-bar" :class="{'hide-title': !titleVisible, 'hide-shadow':shadowVisible}">
      <transition name="title">
        <div class="search-bar-title-wrapper" v-show="titleVisible">
          <div class="title-text-wrapper">
            <span class="title-text title">{{$t('home.title')}}</span>
          </div>
          <div class="title-icon-shake-wrapper" @click="showFlapCard">
            <span class="icon-shake icon"></span>
          </div>
        </div>
      </transition>
      <div class="title-icon-back-wrapper"
       :class="{'hide-title': !titleVisible}"
      @click="back">
        <span class="icon-back icon"></span>
      </div>
      <div class="search-bar-input-wrapper" :class="{'hide-title': !titleVisible}">
        <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
        <div class="search-bar-input">
          <span class="icon-search icon"></span>
          <input
            type="text"
            class="input"
            :placeholder="$t('home.hint')"
            v-model="searchText"
            @click="showHotSearchVisible"
            @keyup.13.exact="search">
        </div>
      </div>
    </div>
    <transition name="hot-search">
      <hot-search-list v-show="hotSearchVisible" ref="hotSearchReset"></hot-search-list>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
/* 引入mixin */
import { storeHomeMixin } from '../../utils/mixins'
/* 引入热门搜索组件 */
import HotSearchList from './HotSearchList'

export default {
  name: 'searchBar',
  mixins: [storeHomeMixin],
  components: {
    HotSearchList
  },
  data () {
    return {
      searchText: '',
      titleVisible: true,
      shadowVisible: false,
      hotSearchVisible: false
    }
  },
  methods: {
    search () {
      this.$router.push({
        path: '/store/list',
        query: {
          keyword: this.searchText
        }
      })
    },
    showFlapCard () {
      this.setFlapCardVisible(true)
    },
    back () {
      this.offsetY > 0 ? this.showShadowVisible() : this.hideShadowVisible()
      this.hotSearchVisible ? this.hideHotSearchVisible() : this.$router.push('/store/shelf')
    },
    hideHotSearchVisible () {
      this.offsetY > 0 ? this.hideTitle() : this.showTitle()
      this.hotSearchVisible = false
    },
    showHotSearchVisible () {
      this.hideTitle()
      this.hideShadowVisible()
      this.hotSearchVisible = true
      this.$nextTick(() => {
        this.$refs.hotSearchReset.reset()
      })
    },
    hideShadowVisible () {
      this.shadowVisible = false
    },
    showShadowVisible () {
      this.shadowVisible = true
    },
    hideTitle () {
      this.titleVisible = false
    },
    showTitle () {
      this.titleVisible = true
    }
  },
  watch: {
    offsetY (v) {
      if (v > 0) {
        this.hideTitle()
        this.showShadowVisible()
      } else {
        this.showTitle()
        this.hideShadowVisible()
      }
    },
    hotSearchOffsetY (v) {
      if (v > 0) {
        this.showShadowVisible()
      } else if (v === 0) {
        this.hideShadowVisible()
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/mixin";
  .search-bar {
    position: relative;
    width: 100%;
    height: px2rem(94);
    z-index: 101;
    box-shadow: none;
    &.hide-title {
      height: px2rem(52);
    }
    &.hide-shadow {
      box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    }
    .search-bar-title-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      .title-text-wrapper {
        width: 100%;
        height: 42px;
        @include center;
      }
      .title-icon-shake-wrapper {
        position: absolute;
        right: px2rem(15);
        top: 0;
        height: px2rem(42);
        @include center;
      }
    }
    .title-icon-back-wrapper {
      position: absolute;
      left: px2rem(15);
      top: 0;
      height: px2rem(42);
      z-index: 102;
      @include center;
      transition: height $homeAnimationTime linear;
      &.hide-title {
        height: px2rem(52);
      }
    }
    .search-bar-input-wrapper {
      position: absolute;
      left: 0;
      top: px2rem(42);
      width: 100%;
      height: px2rem(52);
      padding: px2rem(10);
      box-sizing: border-box;
      transition: top $homeAnimationTime linear;
      display: flex;
      &.hide-title {
        top: 0;
      }
      .search-bar-blank {
        flex: 0 0 0 px2rem(0);
        width: px2rem(0);
        transition: all $homeAnimationTime linear;
        pointer-events: none;
        &.hide-title {
          flex: 0 0 0 px2rem(31);
          width: px2rem(31);
        }
      }
      .search-bar-input {
        flex: 1;
        background: #f4f4f4;
        border-radius: px2rem(20);
        padding: px2rem(5) px2rem(15);
        box-sizing: border-box;
        border: px2rem(1) solid #eeeeee;
        @include left;
        .icon-search {
          color: #999999;
        }
        .input {
          width: 100%;
          height: px2rem(22);
          border: none;
          background: transparent;
          margin-left: px2rem(10);
          font-size: px2rem(12);
          color: #666666;
          &:focus {
            outline: none;
          }
          &::placeholder {
            color: #cccccc;
          }
        }
      }
    }
  }
</style>
