import { realPx } from '../utils/utils'

const state = {
  book: {
    fileName: '',
    menuVisible: false,
    settingVisible: -1, // -1:不显示 0：字号 1：主题 2：进度条 3：目录
    defaultFontSize: 16,
    defaultFontFamily: 'Default',
    fontFamilyVisible: false,
    defaultTheme: 'Default',
    bookAvailable: false,
    progress: 0,
    section: 0,
    isPaginating: true,
    currentBook: null,
    navigation: null,
    cover: null,
    metadata: {
      title: '',
      creator: ''
    },
    paginate: '',
    pagelist: null,
    offsetY: 0,
    isBookMark: null,
    speakingIconBottom: realPx(58)
  },
  hotSearchOffsetY: 0,
  flapCardVisible: false,
  isEditMode: false,
  shelfList: [],
  shelfSelected: [],
  shelfTitleVisible: true
}

export default state
