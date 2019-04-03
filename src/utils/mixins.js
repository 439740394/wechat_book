import { mapGetters, mapActions } from 'vuex'
import { themeList, adddCss, removeAllCss } from './bookConfig'
import { saveLocation } from './localStorage'

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
      const startCfi = currentLocation.start.cfi
      const progress = this.currentBook.locations.percentageFromCfi(currentLocation.start.cfi)
      const precent = Math.floor(progress * 100)
      this.setProgress(precent)
      saveLocation(this.fileName, startCfi)
    },
    display (target, callback) {
      if (target) {
        this.currentBook.rendition.display(target)
        callback && callback()
      } else {
        this.currentBook.rendition.display()
        callback && callback()
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
