<template>
  <div class="flap-card-wrapper" v-if="flapCardVisible">
    <div class="flap-card-background" :class="{'animation': runAnimation}" v-show="runAnimation">
      <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
        <div class="flap-card-circle">
          <div class="circle circle-left" :style="circleStyle(item, 'left')" ref="left"></div>
          <div class="circle circle-right" :style="circleStyle(item, 'right')" ref="right"></div>
        </div>
      </div>
      <div class="point-wrapper">
        <div class="point" :class="{'animation': pointAnimation}" v-for="(item, index) of pointList" :key="index"></div>
      </div>
    </div>
    <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
      <div class="book-card-wrapper">
        <div class="img-wrapper">
          <img class="img" :src="data.cover">
        </div>
        <div class="content-wrapper">
          <div class="title">{{data.title}}</div>
          <div class="author sub-title-medium">{{data.author}}</div>
          <div class="category">{{categoryText()}}</div>
        </div>
        <div class="read-btn" @click.stop="showBookDetail(data)">{{$t('home.readNow')}}</div>
      </div>
    </div>
    <div class="close-btn-wrapper" @click="hideFlapCard">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixins'
import { flapCardList, categoryText } from '../../utils/store'
export default {
  name: 'flapCard',
  mixins: [storeHomeMixin],
  props: {
    data: {
      type: Object,
      default () {
        return {
          author: 'Jeroen Kool',
          bookId: '2016_Book_SustainableDevelopmentInTheJor',
          cache: false,
          category: 3,
          categoryText: 'Economics',
          cover: 'http://47.99.166.157/book/res/img/Economics/2016_Book_SustainableDevelopmentInTheJor.jpeg',
          fileName: '2016_Book_SustainableDevelopmentInTheJor',
          haveRead: 0,
          id: 227,
          language: 'en',
          private: false,
          publisher: 'Springer International Publishing, Cham',
          selected: false,
          title: 'Sustainable Development in the Jordan Valley'
        }
      }
    }
  },
  data () {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      runAnimation: false,
      pointList: [],
      pointAnimation: false,
      runBookCardAnimation: false
    }
  },
  created () {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  },
  methods: {
    categoryText () {
      if (this.data) {
        return categoryText(this.data.category, this)
      } else {
        return ''
      }
    },
    reset () {
      this.front = 0
      this.back = 1
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - index
        item._g = item.g
        item.rotateDegree = 0
        this.rotate(index, 'front')
        this.rotate(index, 'back')
      })
      this.runAnimation = false
      this.pointAnimation = false
      this.runBookCardAnimation = false
    },
    stopAnimation () {
      this.runAnimation = false
      if (this.task) {
        clearInterval(this.task)
      }
      this.reset()
    },
    flapCardRotateAnimation () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree += 10
      frontFlapCard._g -= 5
      backFlapCard.rotateDegree -= 10
      if (backFlapCard.rotateDegree < 90) {
        backFlapCard._g += 5
      }
      if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
        backFlapCard.zIndex += 2
      }
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      if (frontFlapCard.rotateDegree === 180 && backFlapCard.rotateDegree === 0) {
        this.next()
      }
    },
    next () {
      const frontFlapCard = this.flapCardList[this.front]
      const backFlapCard = this.flapCardList[this.back]
      frontFlapCard.rotateDegree = 0
      frontFlapCard._g = frontFlapCard.g
      backFlapCard.rotateDegree = 0
      backFlapCard._g = backFlapCard.g
      this.rotate(this.front, 'front')
      this.rotate(this.back, 'back')
      this.front++
      this.back++
      const len = this.flapCardList.length
      if (this.front >= len) {
        this.front = 0
      }
      if (this.back >= len) {
        this.back = 0
      }
      this.flapCardList.forEach((item, index) => {
        item.zIndex = 100 - ((index - this.front + len) % len)
      })
      this.prepare()
    },
    prepare () {
      const backFlapCard = this.flapCardList[this.back]
      backFlapCard.rotateDegree = 180
      backFlapCard._g = backFlapCard.g - 5 * 9
      this.rotate(this.back, 'back')
    },
    startFlapCardAnimation () {
      this.prepare()
      this.task = setInterval(() => {
        this.flapCardRotateAnimation()
        this.pointAnimation = true
      }, this.intervalTime)
      this.timer1 = setTimeout(() => {
        this.stopAnimation()
        this.runBookCardAnimation = true
      }, 2500)
    },
    rotate (index, type) {
      const item = this.flapCardList[index]
      let dom = type === 'front' ? this.$refs.right[index] : this.$refs.left[index]
      dom.style.transform = `rotateY(${item.rotateDegree}deg)`
      dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
    },
    circleStyle (v, dir) {
      return {
        backgroundColor: `rgb(${v.r}, ${v.g}, ${v.b})`,
        backgroundSize: v.backgroundSize,
        backgroundImage: dir === 'left' ? v.imgLeft : v.imgRight
      }
    },
    hideFlapCard () {
      this.stopAnimation()
      if (this.timer1) {
        clearTimeout(this.timer1)
      }
      this.setFlapCardVisible(false)
    }
  },
  watch: {
    flapCardVisible (v) {
      if (v) {
        this.runAnimation = true
        setTimeout(() => {
          this.startFlapCardAnimation()
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/flapCard";
  @import "../../assets/styles/home";
  .flap-card-wrapper {
    @include absCenter;
    z-index: 999;
    background: rgba(0, 0, 0, .6);
    @include center;
    .flap-card-background {
      position: relative;
      width: px2rem(64);
      height: px2rem(64);
      border-radius: px2rem(5);
      background: #ffffff;
      transform: scale(0);
      opacity: 0;
      &.animation {
        animation: flap-card-move .5s ease-in both;
      }
      @keyframes flap-card-move {
        0% {
          transform: scale(0);
          opacity: 0;
        }
        50% {
          transform: scale(1.2);
          opacity: 1;
        }
        75% {
          transform: scale(.9);
          opacity: 1;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      .flap-card {
        width: px2rem(48);
        height: px2rem(48);
        @include absCenter;
        .flap-card-circle {
          width: 100%;
          height: 100%;
          display: flex;
          overflow: hidden;
          .circle {
            flex: 0 0 50%;
            width: 50%;
            height: 100%;
            background-repeat: no-repeat;
            backface-visibility: hidden;
          }
          .circle-left {
            border-radius: px2rem(24) 0 0 px2rem(24);
            background-position: center right;
            transform-origin: right;
          }
          .circle-right {
            border-radius: 0 px2rem(24) px2rem(24) 0;
            background-position: center left;
            transform-origin: left;
          }
        }
      }
      .point-wrapper {
        @include absCenter;
        z-index: 103;
        .point {
          border-radius: 50%;
          @include absCenter;
          &.animation {
            @for $i from 1 to length($moves) {
              &:nth-child(#{$i}) {
                @include move($i);
              }
            }
          }
        }
      }
    }
    .book-card {
      position: relative;
      width: 65%;
      box-sizing: border-box;
      border-radius: px2rem(15);
      background: white;
      &.animation {
        animation: scale .3s ease-in both;
        @keyframes scale {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      }
      .book-card-wrapper {
        width: 100%;
        height: 100%;
        margin-bottom: px2rem(30);
        @include columnTop;
        .img-wrapper {
          width: 100%;
          margin-top: px2rem(20);
          @include center;
          .img {
            width: px2rem(90);
            height: px2rem(130);
          }
        }
        .content-wrapper {
          padding: 0 px2rem(20);
          margin-top: px2rem(20);
          .title {
            color: #333;
            font-weight: bold;
            font-size: px2rem(18);
            line-height: px2rem(20);
            max-height: px2rem(40);
            text-align: center;
            @include ellipsis2(2)
          }
          .author {
            margin-top: px2rem(10);
            text-align: center;
          }
          .category {
            color: #999;
            font-size: px2rem(14);
            margin-top: px2rem(10);
            text-align: center;
          }
        }
        .read-btn {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 1100;
          width: 100%;
          border-radius: 0 0 px2rem(15) px2rem(15);
          padding: px2rem(15) 0;
          text-align: center;
          color: white;
          font-size: px2rem(14);
          background: $color-blue;
        }
      }
    }
    .close-btn-wrapper {
      position: absolute;
      left: 0;
      bottom: px2rem(30);
      z-index: 1000;
      width: 100%;
      @include center;
      .icon-close {
        width: px2rem(40);
        height: px2rem(40);
        border-radius: 50%;
        background: #333333;
        color: white;
        @include center;
      }
    }
  }
</style>
