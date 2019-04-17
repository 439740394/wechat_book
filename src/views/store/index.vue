<template>
  <div class="store">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'index.vue'
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/mixin";
  .store {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #ffffff;
  }
</style>
