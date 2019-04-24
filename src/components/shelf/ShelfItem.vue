<template>
  <div
    class="shelf-item"
    :class="{shadow: data.type === 1 || data.type === 2}"
    @click="bookItemClick">
    <component
      :is="item"
      :data="data"
      class="shelf-item-comp"
      :class="{'is-edit': isEditMode && data.type === 2}"></component>
    <div class="icon-selected" :class="{'is-selected': data.selected}" v-show="isEditMode && data.type === 1"></div>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixins'
import { gotoStoreHome } from '../../utils/store'
import shelfBook from './ShelfItemBook'
import shelfItemCategory from './ShelfItemCategory'
import shelfItemAdd from './ShelfItemAdd'
export default {
  name: 'ShelfItem',
  mixins: [storeShelfMixin],
  props: {
    data: Object
  },
  data () {
    return {
      book: shelfBook,
      category: shelfItemCategory,
      add: shelfItemAdd
    }
  },
  methods: {
    bookItemClick () {
      if (this.isEditMode) {
        this.data.selected = !this.data.selected
        if (this.data.selected) {
          this.shelfSelected.pushWithoutItem(this.data)
        } else {
          const data = this.shelfSelected.filter(item => item.id !== this.data.id)
          this.setShelfSelected(data)
        }
      } else {
        if (this.data.type === 1) {
          this.showBookDetail(this.data)
        } else if (this.data.type === 2) {
          this.$router.push({
            path: '/store/category',
            query: {
              title: this.data.title
            }
          })
        } else {
          gotoStoreHome(this)
        }
      }
    }
  },
  computed: {
    item () {
      return this.data.type === 1 ? this.book : (this.data.type === 2 ? this.category : this.add)
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/home";
  .shelf-item {
    position: relative;
    width: 100%;
    &.shadow {
      box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
    }
    .shelf-item-comp {
      opacity: 1;
      &.is-edit {
        opacity: .5;
      }
    }
    .icon-selected {
      position: absolute;
      bottom: px2rem(2);
      right: px2rem(2);
      font-size: px2rem(18);
      color: rgba(0, 0, 0, .5);
      &.is-selected {
        color: $color-blue;
      }
    }
  }
</style>
