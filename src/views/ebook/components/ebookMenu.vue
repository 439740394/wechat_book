<template>
  <transition name="slide-up">
    <div class="menu-wrapper"
         v-show="menuVisible">
      <div class="icon-wrapper">
        <span class="icon-menu"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-progress"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-bright"></span>
      </div>
      <div class="icon-wrapper">
        <span class="icon-A"></span>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
/* 引入混入minxins */
import { ebookMinxins } from '../../../utils/mixins'
export default {
  name: 'ebookMenu',
  mixins: [ebookMinxins]
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../../assets/styles/mixin";
  .menu-wrapper {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 102;
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
