const mutaions = {
  'SET_FILENAME': (state, fileName) => {
    state.book.fileName = fileName
  },
  'SET_MENUVISIBLE': (state, menuVisible) => {
    state.book.menuVisible = menuVisible
  }
}

export default mutaions
