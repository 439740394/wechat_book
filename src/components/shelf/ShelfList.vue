<template>
  <div class="shelf-list">
    <div class="item-wrapper" v-for="item in shelfList" :key="item.id">
      <shelf-item :data="item" :style="{height: itemHeight}"></shelf-item>
      <div class="title"><span class="title-text title-small">{{item.title}}</span></div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixins'
import ShelfItem from './ShelfItem'
import { realPx } from '../../utils/utils'

export default {
  name: 'ShelfList',
  mixins: [storeShelfMixin],
  components: { ShelfItem },
  computed: {
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
    top: px2rem(94);
    left: 0;
    width: 100%;
    z-index: 100;
    display: flex;
    flex-wrap: wrap;
    box-sizing: border-box;
    padding: 0 px2rem(15);
    .item-wrapper {
      flex: 0 0 33.33333%;
      width: 33.33333%;
      padding: px2rem(15);
      box-sizing: border-box;
      .title {
        margin-top: px2rem(10);
      }
    }
  }
</style>
