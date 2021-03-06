<template lang="pug">
div.container-padding
  div.div.rounded-md.bg-white.p-6.shadow
    div.vaccination-block
      div.explainer.text-gray-600
        h2.pb-2 Vaccination Goal
        p
          | Thai Government's vaccination goal of fully inoculating 50 million people with 2 doses of vaccines by the end of 2021.
        p
          |The 2nd dose 14-day average rate is on track to reach the 50 million doses in time.
      div.rounded-md.border.p-4.progress-bar
        div.grid.gap-6
          div
            div.flex.justify-between.items-center.pb-2
              span.text-lg.font-medium.w-min(class="md:w-auto") 50 Million Doses
              span.text-2xl.font-bold.text-gray-900
                | {{ latestData.second_dose_cum.toLocaleString() }}
            div.vac-goal-bar
              div.vac-progress.vac-goal.rounded-full(
                :style="`width:${vacGoalPercentage}%;`"
              )
              div.vac-bar(id="vac-goal")
            div.flex.justify-between.pt-3.font-medium
              span.text-sm.text-gray-500 % of 50 Million 2nd Dose
              span.text-base.font-bold.text-gray-900 {{ `${vacGoalPercentage}%` }}
          div.grid.gap-4
            div.flex.flex-col.gap-4(class="sm:justify-between sm:items-center sm:flex-row")
              div.flex.items-center
                vaccine-icon
                span.text-sm.font-medium.pl-2(class="md:pl-4") Target Dose Needed
              span.text-sm.font-bold.text-gray-800.text-left(class="sm:text-right") {{ calcTarget }} Doses/Day
            div.flex.flex-col.gap-4(class="sm:justify-between sm:items-center sm:flex-row")
              div.flex.items-center
                vaccine-icon
                span.text-sm.font-medium.pl-2(class="md:pl-4") 2nd Dose 14-Day Avg
              p.text-sm.font-bold.text-gray-800.text-left(class="sm:text-right") {{ calcAverage.toLocaleString() }} Doses/Day
            div.flex.flex-col.gap-4(class="sm:justify-between sm:items-center sm:flex-row")
              div.flex.items-center
                calendar-icon
                span.text-sm.pl-2.font-medium(class="md:pl-4") Days Left In 2021
              div
                p.text-sm.font-bold.text-gray-800.text-left(class="sm:text-right") {{ `${endOfYear} Days` }}
            div.flex.flex-col.gap-4(class="sm:justify-between sm:items-center sm:flex-row")
              div.flex.items-center
                calendar-icon
                span.text-sm.pl-2.font-medium(class="md:pl-4") Time Till Goal Reached
              div
                p.text-sm.font-bold.text-gray-800.text-left(class="sm:text-right") ~{{ `${calcGoalDays} Days` }}
                p.text-xs.text-gray-500.pt-0 {{ `(${calcGoalDate})` }}
</template>

<script>
import { mapGetters } from "vuex"

export default {
  data() {
    return {
      vacAverage: 0,
      vacTarget: 0,
      vacTargetMonths: 0,
      vacTargetDate: "",
      vacGoalProgress: 0,
      vacGoalPercentage: 0,
      progressBarWidth: 0,
      fullJSON: [],
    }
  },
  async fetch() {
    this.fullJSON = await this.$axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/dashboard/national-vacmod-timeseries.json"
    )
  },
  computed: {
    ...mapGetters({
      goal50: "goal50",
    }),
    latestData() {
      if (!this.$fetchState.pending) {
        return this.fullJSON[this.fullJSON.length - 1]
      } else {
        return {}
      }
    },
    calcAverage() {
      if (!this.$fetchState.pending) {
        const reducer = (accum, current) => accum + current
        const secondDoseArr = this.slicedData(this.fullJSON).map((el) =>
          Number(el.second_dose_daily)
        )
        const avg = secondDoseArr.reduce(reducer) / 14
        const formatAvg = Math.round(avg)
        return formatAvg
      } else {
        return 0
      }
    },
    endOfYear() {
      const today = new Date()
      const newYear = new Date(today.getFullYear(), 11, 31)
      const oneDay = 1000 * 60 * 60 * 24
      const days = Math.ceil((newYear.getTime() - today.getTime()) / oneDay)
      return days
    },
    calcTarget() {
      if (!this.$fetchState.pending) {
        const targetDoses = this.goal50 - this.calcSecondDose
        const targetAvgDose = Math.ceil(targetDoses / this.endOfYear)
        return targetAvgDose.toLocaleString()
      } else {
        return 0
      }
    },
    calcVaccinationEndOfYear() {
      if (!this.$fetchState.pending) {
        const avg = this.calcAverage
        const vaccinated = avg * this.endOfYear
        const latest = this.fullJSON[this.fullJSON.length - 1]
        const dose2 = Number(latest.second_dose_cum)
        const total = dose2 + vaccinated
        return total.toLocaleString()
      } else {
        return 0
      }
    },
    calcSecondDose() {
      if (!this.$fetchState.pending) {
        const latest = this.fullJSON[this.fullJSON.length - 1]
        const dose2 = Number(latest.second_dose_cum)
        return dose2
      } else {
        return 0
      }
    },
    calcGoalDays() {
      if (!this.$fetchState.pending) {
        const dosesLeftTillTarget = this.goal50 - this.calcSecondDose
        const daysTillTarget = dosesLeftTillTarget / this.calcAverage
        return Math.ceil(daysTillTarget)
      } else {
        return 0
      }
    },
    calcGoalDate() {
      if (!this.$fetchState.pending) {
        const date = new Date()
        date.setDate(date.getDate() + this.calcGoalDays)
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const goalDate = `${year}-${month < 10 ? "0" + month : month}-${day}`
        const formatGoalDate = new Date(goalDate).toLocaleDateString("en-us", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        return formatGoalDate
      } else {
        return ``
      }
    },
    calcCountryVacDays() {
      if (!this.$fetchState.pending) {
        const dosesLeftTillTarget =
          this.$store.getters.thPopulation - this.calcSecondDose
        const daysTillTarget = dosesLeftTillTarget / this.calcAverage
        return Math.ceil(daysTillTarget)
      } else {
        return 0
      }
    },
    calcCountryVacDate() {
      if (!this.$fetchState.pending) {
        const date = new Date()
        date.setDate(date.getDate() + this.calcCountryVacDays)
        const day = date.getDate()
        const month = date.getMonth() + 1
        const year = date.getFullYear()
        const goalDate = `${year}-${month < 10 ? "0" + month : month}-${day}`
        const formatGoalDate = new Date(goalDate).toLocaleDateString("en-us", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        return formatGoalDate
      } else {
        return ``
      }
    },
  },
  mounted() {
    this.calcVacGoal()
  },
  methods: {
    slicedData(data) {
      const sliced = data.slice(Math.max(data.length - 14, 0))
      return sliced
    },
    calcVacGoal() {
      if (!this.$fetchState.pending) {
        const secondDose = this.latestData.second_dose_cum
        const percentage = (secondDose / this.goal50) * 100
        this.vacGoalPercentage = percentage.toFixed(2)
      } else {
        return 0
      }
    },
  },
}
</script>
