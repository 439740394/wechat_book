<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="scroll" ref="scroll">
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
      <p>111111111111111111111111111111</p>
    </scroll>
  </div>
</template>

<script>
/* 引入mixin */
import { storeHomeMixin } from '../../utils/mixins'
/* 引入搜索组件 */
import SearchBar from '../../components/home/searchBar'
/* 引入滚屏组件 */
import Scroll from '../../components/scroll'
/* 引入推荐动画组件 */
import FlapCard from '../../components/home/flapCard'
/* 请求数据方法 */
import { home } from '../../api/store'

export default {
  name: 'storeHome',
  mixins: [storeHomeMixin],
  components: {
    SearchBar,
    Scroll,
    FlapCard
  },
  data () {
    return {
      scrollTop: 94,
      random: ''
    }
  },
  mounted () {
    home().then(res => {
      if (res && res.status === 200) {
        const data = res.data
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
      }
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    scroll (v) {
      this.setOffsetY(v)
      if (v > 0) {
        this.scrollTop = 52
      } else if (v === 0) {
        this.scrollTop = 94
      }
      this.$refs.scroll.refresh()
    }
  }
}
</script>

<style lang="scss" scoped>
  .store-home {
    width: 100%;
    height: 100%;
  }
</style>
