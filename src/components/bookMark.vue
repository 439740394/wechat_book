<template>
  <div class="book-mark" :style="style" ref="bookmark"></div>
</template>

<script type="text/ecmascript-6">
import { px2rem } from '../utils/utils'

export default {
  name: 'bookMark',
  props: {
    width: Number,
    height: Number,
    color: {
      type: String,
      default: 'white'
    }
  },
  mounted () {
    this.refresh()
  },
  methods: {
    refresh () {
      if (this.height && this.width) {
        this.$refs.bookmark.style.borderWidth = `${px2rem(this.height - 5)}rem ${px2rem(this.width / 2)}rem ${px2rem(5)}rem ${px2rem(this.width / 2)}rem`
      }
    }
  },
  computed: {
    style () {
      return {
        borderColor: `${this.color} ${this.color} transparent ${this.color}`
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/styles/mixin";
  .book-mark {
      width: 0;
      height: 0;
      border-width: px2rem(50) px2rem(10) px2rem(10) px2rem(10);
      border-style: solid;
  }
</style>
