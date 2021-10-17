<template lang="pug">
div.container-padding
  div.rounded-md.bg-white.p-6.shadow
    div.grid.grid-rows-2.gap-8(
      class="md:grid-rows-none md:grid-cols-2"
    )
      //- total bar
      div
        div.total-bar
          div.flex.justify-between.items-center
            h3.font-bold Total Vaccines Given
            div.highlight-card
              span.font-bold.text-gray-900 {{ totalDoseCum }}
        div.border-b.my-4
        //- 1st dose
        div.total-bar.pb-8
          div.flex.justify-between.items-center.pb-2
            h3 1st Dose
            div.highlight-card
              span.font-bold.text-gray-900 {{ firstDoseCum }}
          div.vac-progress-bar
            div.vac-progress.vac-1dose.rounded-full(s
              :style="`width:${calcVac1Dose}%;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            span.text-sm.text-gray-500 % of Population
            span.text-base.font-bold.text-gray-900(
              class="md:text-lg"
            ) {{ `${calcVac1Dose}%` }}
        //- 2nd dose
        div.total-bar.pb-8
          div.flex.justify-between.items-center.pb-2
            h3 2nd Dose
            div.highlight-card
              span.font-bold.text-gray-900 {{ secondDoseCum }}
          div.vac-progress-bar
            div.vac-progress.vac-2dose.rounded-full(
              :style="`width:${calcVac2Dose}%;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            span.text-sm.text-gray-500 % of Population
            div
              span.text-base.font-bold.text-gray-900(
                class="md:text-lg"
              ) {{ `${calcVac2Dose}%` }}
        //- 3rd dose
        div.total-bar
          div.flex.justify-between.items-center.pb-2
            h3 3rd Dose
            div.highlight-card
              span.font-bold.text-gray-900 {{ thirdDoseCum }}
          div.vac-progress-bar
            div.vac-progress.vac-3dose.rounded-full(
              :style="`width:${calcVac3Dose}%;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            span.text-sm.text-gray-500 % of Population
            div
              span.text-base.font-bold.text-gray-900(
                class="md:text-lg"
              ) {{ `${calcVac3Dose}%` }}
      div
        div
          tooltip
            span.text-sm.text-blue-900 2021 Population: {{ population.toLocaleString() }}
          div.border-b.my-4
          div.flex.flex-wrap.items-center.justify-between.gap-4
            h3.font-bold Average
            div.grid.grid-cols-4.gap-4.w-full
              button.py-1.px-2.rounded-full.w-full(
                v-for="days in daysSelector"
                class="md:px-3"
                :class="selectedAvgDays === days ? 'bg-green text-white font-bold' : 'bg-gray-200 font-medium text-gray-500 hover:bg-gray-300'"
                :title="`${days} Days`"
                @click="changeAvgDays(days)"
              )
                span.text-sm {{ days }} D
          div.my-4
          div.grid.grid-cols-3
            div.grid.gap-2
              span.text-sm 1st Dose
              div
                span.text-base.font-bold.text-gray-900(
                  class="md:text-xl"
                ) {{ doseAverage("first_dose_daily") }}
            div.grid.gap-2
              span.text-sm 2nd Dose
              div
                span.text-base.font-bold.text-gray-900(
                  class="md:text-xl"
                ) {{ doseAverage("second_dose_daily") }}
            div.grid.gap-2
              span.text-sm 3rd Dose
              div
                span.text-base.font-bold.text-gray-900(
                  class="md:text-xl"
                ) {{ doseAverage("third_dose_daily") }}
        div.border-b.my-8
        div
          h3.font-bold All Time High
          div.my-4
          div.grid.grid-cols-3
            div.grid.gap-2
              span.text-sm.font-medium 1st Dose
              div
                span.text-base.font-bold.text-gray-900(
                  class="md:text-xl"
                ) {{ doseHigh("first_dose_daily") }}
            div.grid.gap-2
              span.text-sm.font-medium 2nd Dose
              div
                span.text-base.font-bold.text-gray-900(
                  class="md:text-xl"
                ) {{ doseHigh("second_dose_daily") }}
            div.grid.gap-2
              span.text-sm.font-medium 3rd Dose
              div
                span.text-base.font-bold.text-gray-900(
                  class="md:text-xl"
                ) {{ doseHigh("third_dose_daily") }}
</template>

<script>
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      fullJSON: [],
      selectedAvgDays: 7,
      daysSelector: [7, 14, 30, 90],
    }
  },
  async fetch() {
    this.fullJSON = await this.$axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/dashboard/national-vacmod-timeseries.json"
    )
  },
  computed: {
    ...mapGetters({
      population: "thPopulation",
    }),
    latestData() {
      if (!this.$fetchState.pending) {
        return this.fullJSON[this.fullJSON.length - 1]
      } else {
        return {}
      }
    },
    calcVac1Dose() {
      if (!this.$fetchState.pending) {
        const firstDose = this.latestData.first_dose_cum
        const percentage = (firstDose / this.population) * 100
        return percentage.toFixed(2)
      } else {
        return 0
      }
    },
    calcVac2Dose() {
      if (!this.$fetchState.pending) {
        const secondDose = this.latestData.second_dose_cum
        const percentage = (secondDose / this.population) * 100
        return percentage.toFixed(2)
      } else {
        return 0
      }
    },
    calcVac3Dose() {
      if (!this.$fetchState.pending) {
        const thirdDose = this.latestData.third_dose_cum
        const percentage = (thirdDose / this.population) * 100
        return percentage.toFixed(2)
      } else {
        return 0
      }
    },
    totalDoseCum() {
      if (!this.$fetchState.pending) {
        return this.latestData.total_vaccinations_cum.toLocaleString()
      } else {
        return 0
      }
    },
    firstDoseCum() {
      if (!this.$fetchState.pending) {
        return this.latestData.first_dose_cum.toLocaleString()
      } else {
        return 0
      }
    },
    secondDoseCum() {
      if (!this.$fetchState.pending) {
        return this.latestData.second_dose_cum.toLocaleString()
      } else {
        return 0
      }
    },
    thirdDoseCum() {
      if (!this.$fetchState.pending) {
        return this.latestData.third_dose_cum.toLocaleString()
      } else {
        return 0
      }
    },
  },
  methods: {
    changeAvgDays(days) {
      this.selectedAvgDays = days
    },
    slicedData(data) {
      const sliced = data.slice(Math.max(data.length - this.selectedAvgDays, 0))
      return sliced
    },
    doseHigh(dose) {
      if (!this.$fetchState.pending) {
        const doseArr = this.fullJSON.map((el) => Number(el[dose]))
        return Math.max.apply(null, doseArr).toLocaleString()
      } else {
        return 0
      }
    },
    doseAverage(dose) {
      if (!this.$fetchState.pending) {
        const reducer = (accum, current) => accum + current
        const doseArr = this.slicedData(
          this.fullJSON.map((el) => Number(el[dose]))
        )
        const length = doseArr.length
        const avg = doseArr.reduce(reducer) / length
        return Math.round(avg).toLocaleString()
      } else {
        return 0
      }
    },
  },
}
</script>

<style scoped lang="scss">
.bg-green {
  background-color: #15be53;
}
</style>
