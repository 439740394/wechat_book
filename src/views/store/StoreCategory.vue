<template>
  <div class="store-shelf-category">
    <shelf-title
      :title="shelfCategory.title"></shelf-title>
    <scroll
      class="store-shelf-scroll-wrapper"
      :top="0"
      :bottom="bottom"
      @onScroll="onScroll"
      ref="scroll"
      v-if="listVisible">
      <shelf-list :top="42" :data="shelfCategory.itemList"></shelf-list>
      <shelf-footer></shelf-footer>
    </scroll>
    <div class="store-empty" v-else>
      {{$t('shelf.groupNone')}}
    </div>
  </div>
</template>

<script>
/* 引入混入 */
import { storeShelfMixin } from '../../utils/mixins'
import ShelfTitle from '../../components/shelf/ShelfTitle'
import Scroll from '../../components/common/scroll'
import ShelfList from '../../components/shelf/ShelfList'
import ShelfFooter from '../../components/shelf/ShelfFooter'
export default {
  name: 'StoreShelf',
  mixins: [storeShelfMixin],
  props: {
    top: {
      type: Number,
      default: 94
    }
  },
  components: {
    ShelfFooter,
    ShelfList,
    Scroll,
    ShelfTitle
  },
  data () {
    return {
      bottom: 0
    }
  },
  mounted () {
    this.getCategoryList(this.$route.query.title)
    this.setCurrentType(2)
  },
  methods: {
    onScroll (v) {
      this.setOffsetY(v)
    }
  },
  computed: {
    listVisible () {
      return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
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
  @import "../../assets/styles/mixin";
  .store-shelf-category {
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
    .store-empty {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      font-size: px2rem(14);
      color: #333;
      @include center;
    }
  }
</style>
