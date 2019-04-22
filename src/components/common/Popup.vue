<template>
  <div class="popup" v-show="popupVisible">
    <div class="popup-wrapper">
      <div class="popup-title" v-if="title && title.length > 0">{{title}}</div>
      <div
        class="popup-btn"
        :class="{'danger': item.type === 'danger'}"
        v-for="(item, index) of btn"
        :key="index"
        @click="item.click">{{item.text}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Popup',
  props: {
    title: String,
    btn: Array
  },
  data () {
    return {
      popupVisible: false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/mixin";
</style>
