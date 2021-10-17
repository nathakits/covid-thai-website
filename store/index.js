// 2020 owid population: 69799978
// 2021 moph population: 72034815

export const state = () => ({
  selected: "Cumulative",
  menuOpened: false,
  thPopulation: 72034815,
  popGoal50: 50000000,
  popGoal100: 100000000,
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
  thPopulation: (state) => {
    return state.thPopulation
  },
  popGoal50: (state) => {
    return state.popGoal50
  },
  popGoal100: (state) => {
    return state.popGoal100
  },
}
