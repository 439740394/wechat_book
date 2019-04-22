<template>
  <div class="shelf-list-category">
    <div class="shelf-list-category-list">
      <div class="shelf-list-category-item" v-for="(item, index) of data.itemList" :key="index">
        <img class="cover" :src="item.cover" alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShelfItemCategory',
  props: {
    data: Object
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/mixin";
  .shelf-list-category {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .shelf-list-category-list {
      display: flex;
      flex-flow: row wrap;
      width: 100%;
      height: 100%;
      padding-top: px2rem(5);
      box-sizing: border-box;
      .shelf-list-category-item {
        flex: 0 0 33.33333%;
        width: 33.33333%;
        height: 33.33333%;
        box-sizing: border-box;
        &:nth-child(3n+1) {
          padding: 0 px2rem(3) px2rem(6) px2rem(6);
        }
        &:nth-child(3n+2) {
          padding: 0 px2rem(3) px2rem(6) px2rem(3);
        }
        &:nth-child(3n) {
          padding: 0 px2rem(6) px2rem(6) px2rem(3);
        }
        .cover {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
</style>
