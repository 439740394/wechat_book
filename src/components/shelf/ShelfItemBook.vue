<template>
  <div class="shelf-item-book">
    <img class="cover" :src="data.cover" alt="">
  </div>
</template>

<script>
export default {
  name: 'ShelfItemImage',
  props: {
    data: Object
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/mixin";
  .shelf-item-book {
    width: 100%;
    height: 100%;
    .cover {
      width: 100%;
      height: 100%;
    }
  }
</style>
