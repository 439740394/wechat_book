<template>
  <div class="shelf-search-wrapper" :class="{'search-top': inputClicked, 'hide-shadow': shadowVisible && inputClicked}">
    <div class="shelf-search" :class="{'search-top': inputClicked}">
      <div class="search-wrapper">
        <div class="icon-search-wrapper">
          <span class="icon-search icon"></span>
        </div>
        <div class="search-input-wrapper">
          <input
            type="text"
            class="search-input"
            :placeholder="$t('shelf.search')"
            @click="searchClick"
            v-model="searchText">
        </div>
        <div class="icon-clear-wrapper" v-show="searchText.length > 0" @click="clearSearchText">
          <span class="icon-close-circle-fill"></span>
        </div>
      </div>
      <div class="icon-locale-wrapper" v-if="!inputClicked" @click="changeLocale">
        <span class="icon-cn icon" v-if="lang === 'cn'"></span>
        <span class="icon-en icon" v-else></span>
      </div>
      <div class="cancel-btn-wrapper" @click="cancelClick" v-else>
        <span class="cancel-text">{{$t('shelf.cancel')}}</span>
      </div>
    </div>
    <transition name="shelf-tab-slide-up">
      <div class="shelf-search-tab-wrapper" v-if="inputClicked">
        <div class="shelf-search-tab-item" v-for="item in tabs" :key="item.id" @click="tabClick(item.id)">
          <span class="shelf-search-tab-text" :class="{'is-selected': item.id === selectedTab}">{{item.text}}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
/* 引入混入 */
import { storeShelfMixin } from '../../utils/mixins'
import { setLocalStorage } from '../../utils/localStorage'

export default {
  name: 'ShelfSearch',
  mixins: [storeShelfMixin],
  data () {
    return {
      searchText: '',
      inputClicked: false,
      selectedTab: 1,
      shadowVisible: false
    }
  },
  methods: {
    tabClick (v) {
      this.selectedTab = v
    },
    clearSearchText () {
      this.searchText = ''
    },
    changeLocale () {
      this.lang === 'en' ? this.$i18n.locale = 'cn' : this.$i18n.locale = 'en'
      setLocalStorage('locale', this.$i18n.locale)
    },
    searchClick () {
      this.inputClicked = true
      this.setShelfTitleVisible(false)
    },
    cancelClick () {
      this.inputClicked = false
      this.setShelfTitleVisible(true)
    }
  },
  computed: {
    tabs () {
      return [
        {
          id: 1,
          text: this.$t('shelf.default')
        },
        {
          id: 2,
          text: this.$t('shelf.progress')
        },
        {
          id: 3,
          text: this.$t('shelf.purchase')
        }
      ]
    },
    lang () {
      return this.$i18n.locale
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
  @import "../../assets/styles/home";
  .shelf-search-wrapper {
    position: relative;
    z-index: 102;
    width: 100%;
    height: px2rem(94);
    background: #ffffff;
    box-shadow: none;
    &.hide-shadow {
      box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    }
    &.search-top {
      position: fixed;
    }
    .shelf-search {
      display: flex;
      position: absolute;
      top: px2rem(42);
      left: 0;
      width: 100%;
      height: px2rem(52);
      z-index: 103;
      transition: top $homeAnimationTime linear;
      &.search-top {
        top: 0;
      }
      .search-wrapper {
        flex: 1;
        margin: px2rem(8) 0 px2rem(8) px2rem(10);
        border: px2rem(1) solid #ccc;
        border-radius: px2rem(3);
        @include center;
        .icon-search-wrapper {
          flex: 0 0 px2rem(22);
          @include right;
          .icon-search {
            font-size: px2rem(12);
          }
        }
        .search-input-wrapper {
          flex: 1;
          padding: 0 px2rem(10);
          box-sizing: border-box;
          @include center;
          .search-input {
            width: 100%;
            font-size: px2rem(14);
            border: none;
            color: #333;
            &:focus {
              outline: none;
            }
            &::placeholder {
              color: #ccc;
              font-size: px2rem(14);
            }
          }
        }
        .icon-clear-wrapper {
          flex: 0 0 px2rem(24);
          @include left;
          .icon-close-circle-fill {
            font-size: px2rem(14);
            color: #ccc;
          }
        }
      }
      .icon-locale-wrapper {
        flex: 0 0 px2rem(55);
        @include center;
        .icon-cn, .icon-en {
          font-size: px2rem(22);
          color: #666;
        }
      }
      .cancel-btn-wrapper {
        flex: 0 0 px2rem(55);
        text-align: center;
        .cancel-text {
          font-size: px2rem(14);
          color: $color-blue;
        }
      }
    }
    .shelf-search-tab-wrapper {
      position: absolute;
      top: px2rem(52);
      left: 0;
      z-index: 103;
      display: flex;
      width: 100%;
      height: px2rem(42);
      .shelf-search-tab-item {
        flex: 1;
        @include center;
        .shelf-search-tab-text {
          font-size: px2rem(12);
          color: #999;
          &.is-selected {
            color: $color-blue;
          }
        }
      }
    }
  }
</style>
