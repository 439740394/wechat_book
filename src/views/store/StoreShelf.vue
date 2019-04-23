<template>
  <div class="store-shelf">
    <shelf-title></shelf-title>
    <scroll class="store-shelf-scroll-wrapper" :top="0" :bottom="bottom" @onScroll="onScroll" ref="scroll">
      <shelf-search></shelf-search>
      <shelf-list></shelf-list>
      <shelf-footer></shelf-footer>
    </scroll>
  </div>
</template>

<script>
/* 引入混入 */
import { storeShelfMixin } from '../../utils/mixins'
import ShelfTitle from '../../components/shelf/ShelfTitle'
import Scroll from '../../components/common/scroll'
import ShelfSearch from '../../components/shelf/ShelfSearch'
import ShelfList from '../../components/shelf/ShelfList'
import ShelfFooter from '../../components/shelf/ShelfFooter'
export default {
  name: 'StoreShelf',
  mixins: [storeShelfMixin],
  components: {
    ShelfFooter,
    ShelfList,
    ShelfSearch,
    Scroll,
    ShelfTitle
  },
  data () {
    return {
      bottom: 0
    }
  },
  created () {
    this.getShelfList()
  },
  methods: {
    onScroll (v) {
      this.setOffsetY(v)
    }
  },
  watch: {
    isEditMode (v) {
      this.bottom = v ? 48 : 0
      this.$nextTick(() => {
        this.$refs.scroll.refresh()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .store-shelf {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 100;
    overflow: hidden;
    .store-shelf-scroll-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 101;
    }
  }
</style>
