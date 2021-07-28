<template lang="pug">
div
  div.vaccination-block.container-padding
    div.explainer.pb-4.hidden(class="lg:pb-0 md:block")
      p
        | Currently we are way below the target dose needed to reach the goal by the end of the year.
      P 
        | This is due to many factors, such as low inoculation during weekends and vaccine procurement.
    div.progress-bar
      div.card.grid.divide-y.divide-gray-300
        div.card-item-padding.flex.justify-between
          div.flex.items-center
            vaccine-icon
            span.text-lg.pl-4.font-bold Target Dose
          span.text-lg.font-bold {{ calcTarget }} doses/day
        div.card-item-padding.flex.justify-between.font-medium
          div.flex.items-center
            vaccine-icon
            span.text-sm.pl-4.mr-2 Current rate
            span.text-sm.text-gray-500 (14-Day Average)
          div
            p.text-sm {{ calcAverage }} doses/day
        div.card-item-padding.flex.justify-between.font-medium
          div.flex.items-center
            vaccine-icon
            span.text-sm.pl-4.mr-2 To reach target
          div
            p.text-sm {{ calcTargetNeeded }} doses/day

  div.vaccination-block.container-padding
    div.explainer.pb-4.hidden(class="lg:pb-0 md:block")
      p
        | With the current average vaccination rate, we will likely not meet the goal set out by the Thai government.
    div.progress-bar
      div.card.grid.divide-y.divide-gray-300
        div.card-item-padding.flex.justify-between
          div.flex.items-center
            vaccine-icon
            div.pl-4.text-sm Time till goal reached
          div
            p.text-sm.text-right ~{{ `${calcGoalDays } Days` }}
            p.text-xs.text-right.text-gray-500 {{ `(${calcGoalDate})` }}
        div.card-item-padding.flex.justify-between
          div.flex.items-center
            vaccine-icon
            div.pl-4.text-sm Time till everyone is vaccinated
          div
            p.text-sm.text-right ~{{ `${calcCountryVacDays } Days` }}
            p.text-xs.text-right.text-gray-500 {{ `(${calcCountryVacDate })` }}
</template>

<script>
export default {
  props: {
    dataFull: {
      type: Array,
      default: () => [],
    },
    dataDaily: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      vacAverage: 0,
      vacTarget: 0,
      vacTargetMonths: 0,
      vacTargetDate: "",
      fullJSON: [],
    }
  },
  async fetch() {
    this.fullJSON = await this.$axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/Thailand.json"
    )
  },
  computed: {
    calcTargetNeeded() {
      const avg = Number(this.calcAverage.replace(/,/g, ""))
      const target = Number(this.calcTarget.replace(/,/g, ""))
      const targetNeeded = (target - avg).toLocaleString()
      return targetNeeded
    },
    calcAverage() {
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      const totalDosePlusArr = this.slicedData(this.fullJSON).map((el) =>
        Number(el.total_dose_plus)
      )
      const calcAverage = totalDosePlusArr.reduce(reducer) / 14
      const formatAvg = Math.round(calcAverage).toLocaleString()
      return formatAvg
    },
    calcTarget() {
      const latest = this.fullJSON[this.fullJSON.length - 1]
      const today = new Date()
      const newYear = new Date(today.getFullYear(), 11, 31)
      const oneDay = 1000 * 60 * 60 * 24
      const daysLeft = Math.ceil((newYear.getTime() - today.getTime()) / oneDay)
      const totalVac = Number(latest.total_vaccinations.replace(/,/g, ""))
      const targetDoses = 100 * 1000000 - totalVac
      const targetAvgDose = Math.ceil(targetDoses / daysLeft)
      return targetAvgDose.toLocaleString()
    },
    calcGoalDays() {
      const latest = this.fullJSON[this.fullJSON.length - 1]
      const totalVacLeft = Number(latest.total_vaccinations.replace(/,/g, ""))
      const dosesLeftTillTarget = 100 * 1000000 - totalVacLeft
      const daysTillTarget =
        dosesLeftTillTarget / Number(this.calcAverage.replace(/,/g, ""))
      return Math.ceil(daysTillTarget)
    },
    calcGoalDate() {
      const date = new Date()
      date.setDate(date.getDate() + this.calcGoalDays)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const goalDate = `${year}-${month}-${day}`
      const formatGoalDate = new Date(goalDate).toLocaleDateString("en-us", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      return formatGoalDate
    },
    calcCountryVacDays() {
      const latest = this.fullJSON[this.fullJSON.length - 1]
      const totalVacLeft = Number(latest.total_vaccinations.replace(/,/g, ""))
      const dosesLeftTillTarget = 139599956 - totalVacLeft
      const daysTillTarget =
        dosesLeftTillTarget / Number(this.calcAverage.replace(/,/g, ""))
      return Math.ceil(daysTillTarget)
    },
    calcCountryVacDate() {
      const date = new Date()
      date.setDate(date.getDate() + this.calcCountryVacDays)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const goalDate = `${year}-${month}-${day}`
      const formatGoalDate = new Date(goalDate).toLocaleDateString("en-us", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      return formatGoalDate
    },
  },
  methods: {
    slicedData(data) {
      const sliced = data.slice(Math.max(data.length - 14, 0))
      return sliced
    },
  },
}
</script>

<style></style>
