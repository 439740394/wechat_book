<template>
  <transition name="fade">
    <div class="shelf-title-wrapper" :class="{'hide-shadow': shadowVisible}" v-show="shelfTitleVisible">
      <div class="shelf-title-text-wrapper">
        <span class="shelf-title-text">{{title}}</span>
        <span class="shelf-title-sub-text" v-show="isEditMode">{{selectedText}}</span>
        <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showClear">
          <span class="shelf-title-btn-text" @click="clearCache">{{$t('shelf.clearCache')}}</span>
        </div>
        <div class="shelf-title-btn-wrapper shelf-title-right" @click="changeEdit" v-if="showEdit"><span class="shelf-title-btn-text">{{isEditMode ? $t('shelf.cancel') : $t('shelf.edit')}}</span></div>
        <div class="shelf-title-btn-wrapper shelf-title-left" v-if="showBack" @click="back"><span class="icon-back"></span></div>
        <div
          class="shelf-title-btn-wrapper"
          :class="{'shelf-title-left': changeGroupLeft, 'shelf-title-right': changeGroupRight}"
          @click="changeGroup"
          v-if="showChangeGroup">
          <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
/* 引入混入 */
import { storeShelfMixin } from '../../utils/mixins'
import { clearLocalStorage, saveBookShelf } from '../../utils/localStorage'
import { clearLocalForage } from '../../utils/localForage'

export default {
  name: 'ShelfTitle',
  mixins: [storeShelfMixin],
  props: {
    title: String
  },
  data () {
    return {
      shadowVisible: false
    }
  },
  methods: {
    onComplete () {
      this.hidePopup()
      const list = this.shelfList.filter(book => book.id !== this.shelfCategory.id)
      this.setShelfList(list).then(() => {
        saveBookShelf(this.shelfList)
        this.setIsEditMode(false)
        setTimeout(() => {
          this.$router.go(-1)
        }, 1500)
      })
    },
    deleteGroup () {
      if (!this.emptyCategory) {
        this.setShelfSelected(this.shelfCategory.itemList)
        this.moveOutOfGroup(this.onComplete)
      } else {
        this.onComplete()
      }
    },
    showDeleteGroup () {
      this.hidePopup()
      setTimeout(() => {
        this.popupMenu = this.popup({
          title: this.$t('shelf.deleteGroupTitle'),
          btn: [
            this.createPopupBtn(this.$t('shelf.confirm'), () => {
              this.deleteGroup()
            }, 'danger'),
            this.popupCancelBtn
          ]
        }).show()
      }, 200)
    },
    changeGroupName () {
      this.hidePopup()
      this.dialog({
        showNewGroup: true,
        groupName: this.shelfCategory.title
      }).show()
    },
    hidePopup () {
      this.popupMenu.hide()
    },
    createPopupBtn (text, fn, type = 'normal') {
      return {
        text,
        type,
        click: fn
      }
    },
    changeGroup () {
      this.popupMenu = this.popup({
        btn: [
          this.createPopupBtn(this.$t('shelf.editGroupName'), () => {
            this.changeGroupName()
          }),
          this.createPopupBtn(this.$t('shelf.deleteGroup'), () => {
            this.showDeleteGroup()
          }, 'danger'),
          this.popupCancelBtn
        ]
      }).show()
    },
    back () {
      this.$router.go(-1)
      this.setIsEditMode(false)
    },
    clearCache () {
      clearLocalStorage()
      clearLocalForage()
      this.setShelfSelected([])
      this.getShelfList()
      this.simpleToast(this.$t('shelf.clearCacheSuccess'))
    },
    changeEdit () {
      if (!this.isEditMode) {
        this.setShelfSelected([])
        this.shelfList.forEach(item => {
          item.selected = false
          if (item.itemList) {
            item.itemList.forEach(val => {
              val.selected = false
            })
          }
        })
      }
      this.setIsEditMode(!this.isEditMode)
    }
  },
  computed: {
    emptyCategory () {
      return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
    },
    showEdit () {
      return this.currentType === 1 || !this.emptyCategory
    },
    showClear () {
      return this.currentType === 1
    },
    showBack () {
      return this.currentType === 2 && !this.isEditMode
    },
    showChangeGroup () {
      return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
    },
    changeGroupLeft () {
      return !this.emptyCategory
    },
    changeGroupRight () {
      return this.emptyCategory
    },
    selectedText () {
      const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
      return selectedNumber <= 0 ? this.$t('shelf.selectBook') : (selectedNumber === 1 ? this.$t('shelf.haveSelectedBook').replace('$1', selectedNumber) : this.$t('shelf.haveSelectedBooks').replace('$1', selectedNumber))
    },
    popupCancelBtn () {
      return this.createPopupBtn(this.$t('shelf.cancel'), () => {
        this.hidePopup()
      })
    }
  },
  watch: {
    offsetY (v) {
      if (v > 0) {
        this.shadowVisible = true
      } else {
        this.shadowVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/mixin";

  .shelf-title-wrapper {
    position: relative;
    width: 100%;
    height: px2rem(42);
    z-index: 110;
    background: #ffffff;
    box-shadow: none;
    &.hide-shadow {
      box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
    }
    .shelf-title-text-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: px2rem(42);
      @include columnCenter;
      .shelf-title-text {
        font-size: px2rem(16);
        line-height: px2rem(20);
        font-weight: bold;
        color: #333;
      }
      .shelf-title-sub-text {
        font-size: px2rem(10);
        color: #333;
      }
    }
    .shelf-title-btn-wrapper {
      position: absolute;
      top: 0;
      box-sizing: border-box;
      height: 100%;
      @include center;
      .shelf-title-btn-text, .icon-back {
        font-size: px2rem(14);
        color: #666;
      }
      &.shelf-title-left {
        left: 0;
        padding-left: px2rem(15);
      }
      &.shelf-title-right {
        right: 0;
        padding-right: px2rem(15);
      }
    }
  }
</style>
