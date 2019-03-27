const actions = {
  setFileName: ({ commit, state }, newTest) => {
    return commit('SET_FILENAME', newTest)
  },
  setMenuVisible: ({ commit, state }, menuVisible) => {
    return commit('SET_MENUVISIBLE', menuVisible)
  }
}

export default actions
