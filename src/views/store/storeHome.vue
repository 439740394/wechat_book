<template>
  <div class="store-home">
    <search-bar></search-bar>
    <flap-card :data="random"></flap-card>
    <scroll :top="scrollTop" @onScroll="scroll" ref="scroll">
      <div class="banner-wrapper">
        <div class="banner-img" :style="{backgroundImage: `url('${banner}')`}"></div>
      </div>
      <guess-you-like :data="guessYouLike"></guess-you-like>
      <recommend :data="recommend"></recommend>
      <featured :data="featured" :titleText="$t('home.featured')" :btnText="$t('home.seeAll')"></featured>
      <div class="category-list-wrapper" v-for="(item, index) of categoryList" :key="index">
        <category-book :data="item"></category-book>
      </div>
      <category :data="categories"></category>
    </scroll>
  </div>
</template>

<script>
/* 引入mixin */
import { storeHomeMixin } from '../../utils/mixins'
/* 引入搜索组件 */
import SearchBar from '../../components/home/searchBar'
/* 引入滚屏组件 */
import Scroll from '../../components/common/scroll'
/* 引入推荐动画组件 */
import FlapCard from '../../components/home/flapCard'
/* 请求数据方法 */
import { home } from '../../api/store'
import GuessYouLike from '../../components/home/GuessYouLike'
import Recommend from '../../components/home/Recommend'
import Featured from '../../components/home/Featured'
import CategoryBook from '../../components/home/CategoryBook'
import Category from '../../components/home/Category'

export default {
  name: 'storeHome',
  mixins: [storeHomeMixin],
  components: {
    Category,
    CategoryBook,
    Featured,
    Recommend,
    GuessYouLike,
    SearchBar,
    Scroll,
    FlapCard
  },
  data () {
    return {
      scrollTop: 94,
      random: null,
      banner: '',
      guessYouLike: null,
      recommend: null,
      featured: null,
      categoryList: null,
      categories: null
    }
  },
  mounted () {
    home().then(res => {
      if (res && res.status === 200) {
        const data = res.data
        const randomIndex = Math.floor(Math.random() * data.random.length)
        this.random = data.random[randomIndex]
        this.banner = data.banner
        this.guessYouLike = data.guessYouLike
        this.recommend = data.recommend
        this.featured = data.featured
        this.categoryList = data.categoryList
        this.categories = data.categories
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
  @import "../../assets/styles/home";
  .store-home {
    width: 100%;
    height: 100%;
    .banner-wrapper {
      width: 100%;
      box-sizing: border-box;
      padding: px2rem(10);
      .banner-img {
        width: 100%;
        height: px2rem(100);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .category-list-wrapper {
      margin-top: px2rem(20);
    }
  }
</style>
