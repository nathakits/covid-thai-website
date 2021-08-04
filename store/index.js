export const state = () => ({
  selected: "Cumulative",
  menuOpened: false,
})

export const mutations = {
  updateSelection: (state, value) => {
    state.selected = value
  },
  menuState: (state, value) => {
    state.menuOpened = value
  },
}

export const getters = {
  selected: (state) => {
    return state.selected
  },
  menuOpened: () => {
    return state.menuOpened
  },
}
