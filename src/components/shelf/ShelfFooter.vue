<template>
  <div class="shelf-footer" v-show="isEditMode">
    <div class="shelf-tab-wrapper" v-for="item of tab" :key="item.index" @click="tabClick(item)">
      <div class="tab-item" :class="{'is-selected': isSelected}">
        <div class="icon-private tab-icon" v-if="item.index === 1 && !isPrivate"></div>
        <div class="icon-private-see tab-icon" v-if="item.index === 1 && isPrivate"></div>
        <div class="icon-download tab-icon" v-if="item.index === 2 && !isDownload"></div>
        <div class="icon-download-remove tab-icon" v-if="item.index === 2 && isDownload"></div>
        <div class="icon-move tab-icon" v-if="item.index === 3"></div>
        <div class="icon-shelf tab-icon" v-if="item.index === 4"></div>
        <div class="tab-text" :class="{'remove-text': item.index === 4}">{{label(item)}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { storeShelfMixin } from '../../utils/mixins'
import { removeLocalStorage, saveBookShelf } from '../../utils/localStorage'
import { cacheBook } from '../../api/store'
import { removeLocalForage } from '../../utils/localForage'

export default {
  name: 'ShelfFooter',
  mixins: [storeShelfMixin],
  data () {
    return {
    }
  },
  methods: {
    removeSelected () {
      this.shelfSelected.forEach(selected => {
        const nowList = this.shelfList.filter(book => book !== selected)
        this.setShelfList(nowList)
      })
      this.setShelfSelected([])
      this.complete()
      this.toast({
        text: '已成功移除选中书籍'
      }).show()
    },
    showRemove () {
      let title
      if (this.shelfSelected.length === 1) {
        title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
      } else {
        title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
      }
      this.popupMenu = this.popup({
        title,
        btn: [
          {
            text: this.$t('shelf.removeBook'),
            click: () => {
              this.removeSelected()
            },
            type: 'danger'
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    removeBook (book) {
      return new Promise((resolve, reject) => {
        removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
        removeLocalForage(`${book.fileName}`)
        resolve(book)
      })
    },
    removeSelectedBook () {
      Promise.all(this.shelfSelected.map(book => this.removeBook(book))).then(books => {
        books.map(book => {
          book.cache = false
        })
        saveBookShelf(this.shelfList)
        this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
      })
    },
    downloadBook (book) {
      let text = ''
      const toast = this.simpleToast(text)
      toast.continueShow()
      return new Promise((resolve, reject) => {
        cacheBook(book, res => {
          toast.hide()
          book.cache = true
          resolve(book)
        }, reject, progressEvent => {
          const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
          text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
          toast.updateText(text)
        })
      })
    },
    async downloadSelectedBook () {
      for (let i = 0; i < this.shelfSelected.length; i++) {
        await this.downloadBook(this.shelfSelected[i])
      }
    },
    async setDownload () {
      this.complete()
      if (this.isDownload) {
        this.removeSelectedBook()
      } else {
        await this.downloadSelectedBook()
        saveBookShelf(this.shelfList)
        this.simpleToast(this.$t('shelf.setDownloadSuccess'))
      }
    },
    showDownload () {
      this.popupMenu = this.popup({
        title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
        btn: [
          {
            text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
            click: () => {
              this.setDownload()
            },
            type: 'danger'
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    setPrivate () {
      let isPrivate
      if (this.isPrivate) {
        isPrivate = false
      } else {
        isPrivate = true
      }
      this.shelfSelected.forEach(item => {
        item.private = isPrivate
      })
      this.complete()
      if (isPrivate) {
        this.simpleToast(this.$t('shelf.setPrivateSuccess'))
      } else {
        this.simpleToast(this.$t('shelf.closePrivateSuccess'))
      }
    },
    showPrivate () {
      this.popupMenu = this.popup({
        title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
        btn: [
          {
            text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
            click: () => {
              this.setPrivate()
            },
            type: 'danger'
          },
          {
            text: this.$t('shelf.cancel'),
            click: () => {
              this.hidePopup()
            }
          }
        ]
      }).show()
    },
    tabClick (v) {
      if (!this.isSelected) {
        return
      }
      switch (v.index) {
        case 1:
          this.showPrivate()
          break
        case 2:
          this.showDownload()
          break
        case 3:
          this.dialog().show()
          break
        case 4:
          this.showRemove()
          break
      }
    },
    hidePopup () {
      this.popupMenu.hide()
    },
    complete () {
      this.hidePopup()
      this.setIsEditMode(false)
      saveBookShelf(this.shelfList)
    },
    label (v) {
      switch (v.index) {
        case 1:
          return this.isPrivate ? v.label2 : v.label
        case 2:
          return this.isDownload ? v.label2 : v.label
        default:
          return v.label
      }
    }
  },
  computed: {
    isDownload () {
      if (!this.isSelected) {
        return false
      } else {
        return this.shelfSelected.every(item => item.cache)
      }
    },
    isPrivate () {
      if (!this.isSelected) {
        return false
      } else {
        return this.shelfSelected.every(item => item.private)
      }
    },
    tab () {
      return [
        {
          label: this.$t('shelf.private'),
          label2: this.$t('shelf.noPrivate'),
          index: 1
        },
        {
          label: this.$t('shelf.download'),
          label2: this.$t('shelf.delete'),
          index: 2
        },
        {
          label: this.$t('shelf.move'),
          index: 3
        },
        {
          label: this.$t('shelf.remove'),
          index: 4
        }
      ]
    },
    isSelected () {
      return this.shelfSelected && this.shelfSelected.length > 0
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../../assets/styles/home";
  .shelf-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 111;
    display: flex;
    width: 100%;
    height: px2rem(48);
    background: #fff;
    box-shadow: 0 px2rem(-2) px2rem(4) 0 rgba(0, 0, 0, .1);
    .shelf-tab-wrapper {
      flex: 1;
      width: 25%;
      height: 100%;
      .tab-item {
        width: 100%;
        height: 100%;
        opacity: .5;
        @include columnCenter;
        .tab-icon {
          font-size: px2rem(20);
          color: #666;
        }
        .tab-text {
          margin-top: px2rem(2);
          font-size: px2rem(12);
          color: #666;
          &.remove-text {
            color: $color-pink;
          }
        }
        &.is-selected {
          opacity: 1;
        }
        .icon-shelf {
          color: $color-pink;
        }
      }
    }
  }
</style>
