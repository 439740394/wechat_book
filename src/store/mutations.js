const mutaions = {
  'SET_FILENAME': (state, fileName) => {
    state.book.fileName = fileName
  },
  'SET_MENU_VISIBLE': (state, visible) => {
    state.book.menuVisible = visible
  },
  'SET_SETTING_VISIBLE': (state, visible) => {
    state.book.settingVisible = visible
  },
  'SET_DEFAULT_FONT_SIZE': (state, fontSize) => {
    state.book.defaultFontSize = fontSize
  },
  'SET_DEFAULT_FONT_FAMILY': (state, font) => {
    state.book.defaultFontFamily = font
  },
  'SET_FONT_FAMILY_VISIBLE': (state, visible) => {
    state.book.fontFamilyVisible = visible
  },
  'SET_DEFAULT_THEME': (state, theme) => {
    state.book.defaultTheme = theme
  },
  'SET_BOOK_AVAILABLE': (state, bookAvailable) => {
    state.book.bookAvailable = bookAvailable
  },
  'SET_PROGRESS': (state, progress) => {
    state.book.progress = progress
  },
  'SET_SECTION': (state, section) => {
    state.book.section = section
  },
  'SET_IS_PAGINATING': (state, isPaginating) => {
    state.book.isPaginating = isPaginating
  },
  'SET_CURRENT_BOOK': (state, currentBook) => {
    state.book.currentBook = currentBook
  },
  'SET_NAVIGATION': (state, navigation) => {
    state.book.navigation = navigation
  },
  'SET_COVER': (state, cover) => {
    state.book.cover = cover
  },
  'SET_METADATA': (state, metadata) => {
    state.book.metadata = metadata
  },
  'SET_PAGINATE': (state, paginate) => {
    state.book.paginate = paginate
  },
  'SET_PAGELIST': (state, pagelist) => {
    state.book.pagelist = pagelist
  },
  'SET_OFFSETY': (state, offsetY) => {
    state.book.offsetY = offsetY
  },
  'SET_IS_BOOKMARK': (state, isBookMark) => {
    state.book.isBookMark = isBookMark
  },
  'SET_SPEAKING_ICON_BOTTOM': (state, speakingIconBottom) => {
    state.book.speakingIconBottom = speakingIconBottom
  },
  'SET_HOT_SEARCH_OFFSETY': (state, offsetY) => {
    state.hotSearchOffsetY = offsetY
  },
  'SET_FLAP_CARD_VISIBLE': (state, visible) => {
    state.flapCardVisible = visible
  },
  'SET_IS_EDIT_MODE': (state, isEditMode) => {
    state.isEditMode = isEditMode
  },
  'SET_SHELF_LIST': (state, list) => {
    state.shelfList = list
  },
  'SET_SHELF_SELECTED': (state, selected) => {
    state.shelfSelected = selected
  },
  'SET_SHELF_TITLE_VISIBLE': (state, visible) => {
    state.shelfTitleVisible = visible
  },
  'SET_SHELF_CATEGORY': (state, category) => {
    state.shelfCategory = category
  },
  'SET_CURRENT_TYPE': (state, type) => {
    state.currentType = type
  }
}

export default mutaions
