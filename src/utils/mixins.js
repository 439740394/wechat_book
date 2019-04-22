import { mapGetters, mapActions } from 'vuex'
import { themeList, adddCss, removeAllCss } from './bookConfig'
import { saveLocation, getReadTime, getBookmark } from './localStorage'
import { gotoBookDetail } from './store'

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
      'setOffsetY'
    ]),
    showBookDetail (book) {
      gotoBookDetail(this, book)
    }
  },
  computed: {
    ...mapGetters([
      'isEditMode',
      'shelfList',
      'shelfSelected',
      'shelfTitleVisible',
      'offsetY'
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
