<template>
  <div class="ebook-menu">
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hide-box-shadow': settingVisible >= 0 || !menuVisible}"
           v-show="menuVisible">
        <div class="icon-wrapper" :class="{'selected': settingVisible === 3}">
          <span class="icon-menu" @click="showSetting(3)"></span>
        </div>
        <div class="icon-wrapper" :class="{'selected': settingVisible === 2}">
          <span class="icon-progress" @click="showSetting(2)"></span>
        </div>
        <div class="icon-wrapper" :class="{'selected': settingVisible === 1}">
          <span class="icon-bright" @click="showSetting(1)"></span>
        </div>
        <div class="icon-wrapper" :class="{'selected': settingVisible === 0}">
          <span class="icon-A" @click="showSetting(0)"></span>
        </div>
      </div>
    </transition>
    <ebook-setting-font></ebook-setting-font>
    <ebook-setting-font-popup></ebook-setting-font-popup>
    <ebook-setting-theme></ebook-setting-theme>
  </div>
</template>

<script type="text/ecmascript-6">
/* 引入混入minxins */
import { ebookMinxins } from '../../../utils/mixins'
import EbookSettingFont from './ebookSettingFont'
import EbookSettingFontPopup from './ebookSettingFontPopup'
import EbookSettingTheme from './ebookSettingTheme'
export default {
  name: 'ebookMenu',
  components: {
    EbookSettingFont,
    EbookSettingFontPopup,
    EbookSettingTheme
  },
  mixins: [ebookMinxins],
  methods: {
    showSetting (num) {
      if (this.settingVisible === num) {
        this.setSettingVisible(-1)
      } else {
        this.setSettingVisible(num)
      }
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/mixin";
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 120;
    display: flex;
    width: 100%;
    height: px2rem(48);
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    font-size: px2rem(22);
    background: #ffffff;
    &.hide-box-shadow {
      box-shadow: none;
    }
    .icon-wrapper {
      flex: 1;
      @include center;
      .icon-progress {
        font-size: px2rem(24);
      }
      .icon-A {
        font-size: px2rem(20);
      }
    }
  }
</style>
