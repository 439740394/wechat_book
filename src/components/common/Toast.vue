<template>
  <transition name="fade">
    <div class="toast-modal" v-if="visible" @click.prevent>
      <div class="toast-bg">
        <div class="toast-wrapper">
          <div class="toast" v-html="showText"></div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'toast',
  props: {
    text: [String, Number],
    timeout: {
      type: Number,
      default: 1500
    }
  },
  data () {
    return {
      visible: false,
      showText: ''
    }
  },
  methods: {
    hide () {
      this.visible = false
    },
    show () {
      this.updateText(this.text)
      clearTimeout(this.task)
      this.task = null
      this.visible = true
      this.task = setTimeout(() => {
        this.visible = false
      }, this.timeout)
    },
    continueShow () {
      clearTimeout(this.task)
      this.task = null
      this.visible = true
    },
    updateText (text) {
      this.showText = text
    }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../../assets/styles/home";
  .toast-modal {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2000;
    .toast-bg {
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0 0 0 -50%;
      width: 100%;
      @include center;
      .toast-wrapper {
        max-width: 60%;
        line-height: px2rem(20);
        padding: px2rem(6) px2rem(12);
        box-sizing: border-box;
        background: rgba(0, 0, 0, .8);
        border-radius: px2rem(6);
        font-size: px2rem(14);
        color: white;
        .toast {
          text-align: center;
          word-break: break-all;
        }
      }
    }
  }
</style>
