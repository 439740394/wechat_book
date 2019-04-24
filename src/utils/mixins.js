import { mapGetters, mapActions } from 'vuex'
import { themeList, adddCss, removeAllCss } from './bookConfig'
import { saveLocation, getReadTime, getBookmark, getBookShelf, saveBookShelf } from './localStorage'
import { gotoBookDetail, addToShelf, computeId, removeToShelf } from './store'
import { shelf } from '../api/store'

export const ebookMinxins = {
  methods: {
    ...mapActions([
      'setFileName',
      'setMenuVisible',
      'setSettingVisible',
      'setDefaultFontSize',
      'setDefaultFontFamily',
      'setFontFamilyVisible',
      'setDefaultTheme',
      'setBookAvailable',
      'setProgress',
      'setSection',
      'setIsPaginating',
      'setCurrentBook',
      'setNavigation',
      'setCover',
      'setMetadata',
      'setPaginate',
      'setPagelist',
      'setOffsetY',
      'setIsBookMark',
      'setSpeakingIconBottom'
    ]),
    _initGlobalTheme () {
      removeAllCss()
      switch (this.defaultTheme) {
        case 'Default':
          adddCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
        case 'Eye':
          adddCss(`${process.env.VUE_APP_RES_URL}/theme/theme_eye.css`)
          break
        case 'Gold':
          adddCss(`${process.env.VUE_APP_RES_URL}/theme/theme_gold.css`)
          break
        case 'Night':
          adddCss(`${process.env.VUE_APP_RES_URL}/theme/theme_night.css`)
          break
        default:
          adddCss(`${process.env.VUE_APP_RES_URL}/theme/theme_default.css`)
          break
      }
    },
    refreshLocation () {
      const currentLocation = this.currentBook.rendition.currentLocation()
      if (currentLocation && currentLocation.start) {
        const startCfi = currentLocation.start.cfi
        const progress = this.currentBook.locations.percentageFromCfi(startCfi)
        const precent = Math.ceil(progress * 100)
        this.setProgress(precent)
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)
        const bookmark = getBookmark(this.fileName)
        if (bookmark) {
          if (bookmark.some(item => item.cfi === startCfi)) {
            this.setIsBookMark(true)
          } else {
            this.setIsBookMark(false)
          }
        } else {
          this.setIsBookMark(false)
        }
      }
    },
    getReadTimeText () {
      return this.$t('book.haveRead').replace('$1', this.getReadTimeByMinute())
    },
    getReadTimeByMinute () {
      const readTime = getReadTime(this.fileName)
      if (!readTime) {
        return 0
      } else {
        return Math.ceil(readTime / 60)
      }
    }
  },
  computed: {
    ...mapGetters([
      'fileName',
      'menuVisible',
      'settingVisible',
      'defaultFontSize',
      'defaultFontFamily',
      'fontFamilyVisible',
      'defaultTheme',
      'bookAvailable',
      'progress',
      'section',
      'isPaginating',
      'currentBook',
      'navigation',
      'cover',
      'metadata',
      'paginate',
      'pagelist',
      'offsetY',
      'isBookMark',
      'speakingIconBottom'
    ]),
    themeList () {
      return themeList(this)
    }
  }
}

export const storeShelfMixin = {
  methods: {
    ...mapActions([
      'setIsEditMode',
      'setShelfList',
      'setShelfSelected',
      'setShelfTitleVisible',
      'setOffsetY',
      'setShelfCategory',
      'setCurrentType'
    ]),
    moveOutOfGroup (fn) {
      const list = this.shelfList.map(book => {
        if (book.type === 2 && book.itemList) {
          book.itemList = book.itemList.filter(subBook => !subBook.selected)
        }
        return book
      })
      this.setShelfList(list).then(() => {
        const newList = computeId(addToShelf([].concat(removeToShelf(this.shelfList), ...this.shelfSelected)))
        this.setShelfList(newList).then(() => {
          this.simpleToast(this.$t('shelf.moveBookOutSuccess'))
          fn && fn()
        })
      })
    },
    getCategoryList (title) {
      this.getShelfList().then(() => {
        const categoryList = this.shelfList.filter(book => book.type === 2 && book.title === title)[0]
        this.setShelfCategory(categoryList)
      })
    },
    showBookDetail (book) {
      gotoBookDetail(this, book)
    },
    getShelfList () {
      let shelfList = getBookShelf()
      if (!shelfList) {
        shelf().then(res => {
          if (res.data && res.data.bookList.length > 0) {
            shelfList = addToShelf(res.data.bookList)
            saveBookShelf(shelfList)
            return this.setShelfList(shelfList)
          }
        }).catch(err => {
          console.log(err)
        })
      } else {
        return this.setShelfList(shelfList)
      }
    }
  },
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY',
      'shelfCategory',
      'currentType'
    ])
  }
}

export const storeHomeMixin = {
  methods: {
    ...mapActions([
      'setOffsetY',
      'setHotSearchOffsetY',
      'setFlapCardVisible'
    ]),
    showBookDetail (book) {
      gotoBookDetail(this, book)
    }
  },
  computed: {
    ...mapGetters([
      'offsetY',
      'hotSearchOffsetY',
      'flapCardVisible'
    ])
  }
}
