<template lang="pug">
div
  //- trends
  div.shadow.border.w-full.rounded-lg.p-6.mt-6(
    style="background-color:#fafafa;"
  )
    h3.font-bold All Time High
    div.border-b.my-4
    div.grid.grid-cols-3
      div
        span.text-sm.font-medium 1st Dose
        div
          span.text-base.font-bold.text-gray-900(
            class="md:text-xl"
          ) {{ doseHigh("first_dose_plus") }}
      div
        span.text-sm.font-medium 2nd Dose
        div
          span.text-base.font-bold.text-gray-900(
            class="md:text-xl"
          ) {{ doseHigh("second_dose_plus") }}
      div
        span.text-sm.font-medium 3rd Dose
        div
          span.text-base.font-bold.text-gray-900(
            class="md:text-xl"
          ) {{ doseHigh("third_dose_plus") }}
  //- average
  div.shadow.border.w-full.rounded-lg.p-6.mt-6(
    style="background-color:#fafafa;"
  )
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
          //- style="min-width:68px;"
          span.text-sm {{ days }} D
    div.border-b.my-4
    div.grid.grid-cols-3
      div
        span.text-sm 1st Dose
        div
          span.text-base.font-bold.text-gray-900(
            class="md:text-xl"
          ) {{ doseAverage("first_dose_plus") }}
      div
        span.text-sm 2nd Dose
        div
          span.text-base.font-bold.text-gray-900(
            class="md:text-xl"
          ) {{ doseAverage("second_dose_plus") }}
      div
        span.text-sm 3rd Dose
        div
          span.text-base.font-bold.text-gray-900(
            class="md:text-xl"
          ) {{ doseAverage("third_dose_plus") }}
</template>

<script>
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
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/Thailand.json"
    )
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
