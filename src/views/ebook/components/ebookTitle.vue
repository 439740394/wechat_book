<template>
  <transition name="slide-down">
    <div class="title-wrapper" v-show="menuVisible">
      <div class="left" @click="back">
        <span class="icon-back"></span>
      </div>
      <div class="right">
        <div class="icon-wrapper">
          <span class="icon-shelf"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-cart"></span>
        </div>
        <div class="icon-wrapper">
          <span class="icon-more"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/* 引入混入minxins */
import { ebookMinxins } from '../../../utils/mixins'
export default {
  name: 'ebookTitle',
  mixins: [ebookMinxins],
  methods: {
    back () {
      console.log(1)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../assets/styles/mixin";

  .title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 101;
    display: flex;
    width: 100%;
    height: px2rem(48);
    box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, .15);
    font-size: px2rem(22);
    background: #ffffff;
    .left {
      flex: 0 0 px2rem(40);
      @include center;
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      .icon-wrapper {
        flex: 0 0 px2rem(40);
        @include center;
        .icon-shelf {
          font-size: px2rem(22);
        }
        .icon-cart {
          font-size: px2rem(22);
        }
      }
    }
  }
</style>
