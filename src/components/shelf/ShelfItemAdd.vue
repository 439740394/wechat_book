<template>
  <div class="shelf-item-add">
    <span class="icon-add"></span>
  </div>
</template>

<script>
export default {
  name: 'ShelfItemAdd'
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/mixin";
  .shelf-item-add {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: px2rem(1) solid #cccc;
    @include center;
    .icon-add {
      font-size: px2rem(40);
      color: #ccc;
    }
  }
</style>
