import { mapGetters, mapActions } from 'vuex'
import { themeList, adddCss, removeAllCss } from './bookConfig'
import { saveLocation, getReadTime } from './localStorage'

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
      'setIsBookmark',
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
        const precent = Math.floor(progress * 100)
        this.setProgress(precent)
        this.setSection(currentLocation.start.index)
        saveLocation(this.fileName, startCfi)
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
      'isBookmark',
      'speakingIconBottom'
    ]),
    themeList () {
      return themeList(this)
    }
  }
}
