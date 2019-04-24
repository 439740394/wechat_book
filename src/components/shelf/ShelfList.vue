<template>
  <div class="shelf-list" :style="{top: shelfTop}">
    <transition-group
      name="list"
      tag="ul"
      class="shelf-list-item-wrapper">
      <li class="item-wrapper" v-for="item in data" :key="item.id">
        <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
        <div class="title"><span class="title-text title-small">{{item.title}}</span></div>
      </li>
    </transition-group>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixins'
import ShelfItem from './ShelfItem'
import { realPx, px2rem } from '../../utils/utils'

export default {
  name: 'ShelfList',
  mixins: [storeShelfMixin],
  props: {
    top: {
      type: Number,
      default: 94
    },
    data: {
      type: Array,
      default () {
        return []
      }
    }
  },
  components: { ShelfItem },
  computed: {
    shelfTop () {
      return px2rem(this.top) + 'rem'
    },
    itemHeight () {
      return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/home";
  .shelf-list {
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 100;
    .shelf-list-item-wrapper {
      width: 100%;
      display: flex;
      flex-flow: row wrap;
      box-sizing: border-box;
      padding: 0 px2rem(15);
      .item-wrapper {
        flex: 0 0 33.33333%;
        width: 33.33333%;
        padding: px2rem(15);
        box-sizing: border-box;
        &.list-leave-active {
          display: none;
        }
        &.list-move {
          transition: transform .5s;
        }
        .title {
          margin-top: px2rem(10);
        }
      }
    }
  }
</style>
