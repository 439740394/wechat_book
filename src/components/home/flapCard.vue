<template>
  <div class="flap-card-wrapper" v-show="flapCardVisible">
    <div class="flap-card-background" :class="{'animation': runAnimation}">
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
    <div class="close-btn-wrapper" @click="hideFlapCard">
      <span class="icon-close"></span>
    </div>
  </div>
</template>

<script>
import { storeHomeMixin } from '../../utils/mixins'
import { flapCardList } from '../../utils/flapCard'

export default {
  name: 'flapCard',
  mixins: [storeHomeMixin],
  props: {
    data: Object
  },
  data () {
    return {
      flapCardList,
      front: 0,
      back: 1,
      intervalTime: 25,
      runAnimation: false,
      pointList: [],
      pointAnimation: false
    }
  },
  created () {
    this.pointList = []
    for (let i = 0; i < 18; i++) {
      this.pointList.push(`point${i}`)
    }
  },
  methods: {
    startPointAnimation () {
      this.pointAnimation = true
      setTimeout(() => {
        this.stopAnimation()
      }, 2500)
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
      }, this.intervalTime)
      setTimeout(() => {
        this.stopAnimation()
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
      this.setFlapCardVisible(false)
    }
  },
  watch: {
    flapCardVisible (v) {
      if (v) {
        this.runAnimation = true
        setTimeout(() => {
          this.startPointAnimation()
          this.startFlapCardAnimation()
        }, 500)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/mixin";
  @import "../../assets/styles/flapCard";
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