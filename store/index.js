export const state = () => ({
  selected: "Total",
})

export const mutations = {
  updateSelection: (state, value) => {
    state.selected = value
  },
}

export const getters = {
  selected: (state) => {
    return state.selected
  },
}
