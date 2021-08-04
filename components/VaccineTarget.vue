<template lang="pug">
div
  div.vaccination-block.container-padding
    div.explainer.pb-4.hidden(class="lg:pb-0 md:block")
      p
        | At this current rate, we are below the daily target dose and likely will not reach the goal by the end of the year.
      P 
        | This is due to many factors, such as low inoculation during weekends and vaccine procurement.
    div.progress-bar
      div.card.grid.divide-y.divide-gray-300
        div.card-item-padding.flex.justify-between.items-center
          div.flex.items-center
            vaccine-icon
            span.text-base.pl-2(class="md:pl-4") Target Dose
          span.text-base.font-bold.text-gray-800.text-right {{ calcTarget }} doses/day
        div.card-item-padding.flex.justify-between.items-center.font-medium
          div.flex.items-center
            vaccine-icon
            span.text-sm.pl-2(class="md:pl-4") Current 14-Day Average
          p.text-base.font-bold.text-gray-800.text-right {{ calcAverage }} doses/day
        //- div.card-item-padding.flex.justify-between.items-center.font-medium
        //-   div.flex.items-center
        //-     vaccine-icon
        //-     span.text-sm.pl-2(class="md:pl-4") To Reach Target
        //-   p.text-base.font-bold.text-gray-800.text-right {{ calcTargetNeeded }} doses/day

  div.vaccination-block.container-padding
    div.explainer.pb-4.hidden(class="lg:pb-0 md:block")
      p
        | With the current average vaccination rate, we will likely not meet the goal set out by the Thai government.
    div.progress-bar
      div.card.grid.divide-y.divide-gray-300
        div.card-item-padding.flex.justify-between
          div.flex.items-center
            calendar-icon
            span.text-sm.pl-2.font-medium(class="md:pl-4") Days left in 2021
          div
            p.text-base.font-bold.text-right.text-gray-800 {{ `${endOfYear} Days` }}
        div.card-item-padding.flex.justify-between
          div.flex.items-center
            calendar-icon
            span.text-sm.pl-2.font-medium(class="md:pl-4") Time Till Goal Reached
          div
            p.text-base.font-bold.text-right.text-gray-800 ~{{ `${calcGoalDays} Days` }}
            p.text-xs.text-right.text-gray-500 {{ `(${calcGoalDate})` }}
        div.card-item-padding.flex.justify-between
          div.flex.items-center
            calendar-icon
            span.text-sm.pl-2.font-medium(class="md:pl-4") Time Till Everyone Is Vaccinated
          div
            p.text-base.font-bold.text-right.text-gray-800 ~{{ `${calcCountryVacDays} Days` }}
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
    endOfYear() {
      const today = new Date()
      const newYear = new Date(today.getFullYear(), 11, 31)
      const oneDay = 1000 * 60 * 60 * 24
      const days = Math.ceil((newYear.getTime() - today.getTime()) / oneDay)
      return days
    },
    calcTargetNeeded() {
      if (!this.$fetchState.pending) {
        const avg = Number(this.calcAverage.replace(/,/g, ""))
        const target = Number(this.calcTarget.replace(/,/g, ""))
        const targetNeeded = (target - avg).toLocaleString()
        return targetNeeded
      } else {
        return 0
      }
    },
    calcAverage() {
      if (!this.$fetchState.pending) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue
        const totalDosePlusArr = this.slicedData(this.fullJSON).map((el) =>
          Number(el.total_dose_plus)
        )
        const calcAverage = totalDosePlusArr.reduce(reducer) / 14
        const formatAvg = Math.round(calcAverage).toLocaleString()
        return formatAvg
      } else {
        return 0
      }
    },
    calcTarget() {
      if (!this.$fetchState.pending) {
        const latest = this.fullJSON[this.fullJSON.length - 1]
        const totalVac = Number(latest.total_vaccinations.replace(/,/g, ""))
        const targetDoses = 100 * 1000000 - totalVac
        const targetAvgDose = Math.ceil(targetDoses / this.endOfYear)
        return targetAvgDose.toLocaleString()
      } else {
        return 0
      }
    },
    calcGoalDays() {
      if (!this.$fetchState.pending) {
        const latest = this.fullJSON[this.fullJSON.length - 1]
        const totalVacLeft = Number(latest.total_vaccinations.replace(/,/g, ""))
        const dosesLeftTillTarget = 100 * 1000000 - totalVacLeft
        const daysTillTarget =
          dosesLeftTillTarget / Number(this.calcAverage.replace(/,/g, ""))
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
        const goalDate = `${year}-${month}-${day}`
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
        const latest = this.fullJSON[this.fullJSON.length - 1]
        const totalVacLeft = Number(latest.total_vaccinations.replace(/,/g, ""))
        const dosesLeftTillTarget = 139599956 - totalVacLeft
        const daysTillTarget =
          dosesLeftTillTarget / Number(this.calcAverage.replace(/,/g, ""))
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
        const goalDate = `${year}-${month}-${day}`
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
  methods: {
    slicedData(data) {
      const sliced = data.slice(Math.max(data.length - 14, 0))
      return sliced
    },
  },
}
</script>
