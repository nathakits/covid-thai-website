<template lang="pug">
div
  div.vaccination-block.container-padding
    div.explainer.pb-4(class="lg:pb-0")
      p
        | At this rate, we are below the daily target dose and will likely not reach the goal by the end of the year.
      P 
        | This is due to many factors, such as low inoculation during weekends and holidays and also issues with vaccine procurement.
    div.progress-bar
      div.card.grid.divide-y.divide-gray-300
        div.card-item-padding.flex.justify-between.items-center
          div.flex.items-center
            vaccine-icon
            span.text-sm.font-medium.pl-2(class="md:pl-4") Target Dose Needed
          span.text-base.font-bold.text-gray-800.text-right {{ calcTarget }} Doses/Day
        div.card-item-padding.flex.justify-between.items-center.font-medium
          div.flex.items-center
            vaccine-icon
            span.text-sm.font-medium.pl-2(class="md:pl-4") 1+2 Dose 14-Day Avg
          p.text-base.font-bold.text-gray-800.text-right {{ calcAverage.toLocaleString() }} Doses/Day
        //- div.card-item-padding.flex.justify-between.items-center.font-medium
        //-   div.flex.items-center
        //-     vaccine-icon
        //-     span.text-sm.pl-2(class="md:pl-4") To Reach Target
        //-   p.text-base.font-bold.text-gray-800.text-right {{ calcTargetNeeded }} doses/day

  div.vaccination-block.container-padding
    div.explainer.pb-4(class="lg:pb-0")
      p
        | With the current 14-day average vaccination rate, we will likely not meet the goal set out by the Thai government.
    div.progress-bar
      div.card.grid.divide-y.divide-gray-300
        div.card-item-padding.flex.justify-between
          div.flex.items-center
            calendar-icon
            span.text-sm.pl-2.font-medium(class="md:pl-4") Days Left In 2021
          div
            p.text-base.font-bold.text-right.text-gray-800 {{ `${endOfYear} Days` }}
        div.card-item-padding.flex.justify-between
          div.flex.items-center
            calendar-icon
            span.text-sm.pl-2.font-medium(class="md:pl-4") Time Till Goal Reached
          div
            p.text-base.font-bold.text-right.text-gray-800 ~{{ `${calcGoalDays} Days` }}
            p.text-xs.text-right.text-gray-500 {{ `(${calcGoalDate})` }}
        //- div.card-item-padding.flex.justify-between
        //-   div.flex.items-center
        //-     calendar-icon
        //-     span.text-sm.pl-2.font-medium(class="md:pl-4") Time Till Everyone Is Vaccinated
        //-   div
        //-     p.text-base.font-bold.text-right.text-gray-800 ~{{ `${calcCountryVacDays} Days` }}
        //-     p.text-xs.text-right.text-gray-500 {{ `(${calcCountryVacDate })` }}

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
        const avg = this.calcAverage
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
        const firstDoseArr = this.slicedData(this.fullJSON).map((el) =>
          Number(el.first_dose_plus)
        )
        const secondDoseArr = this.slicedData(this.fullJSON).map((el) =>
          Number(el.second_dose_plus)
        )
        const totalDosePlusArr = firstDoseArr.map(
          (el, i) => el + secondDoseArr[i]
        )
        const calcAverage = totalDosePlusArr.reduce(reducer) / 14
        const formatAvg = Math.round(calcAverage)
        return formatAvg
      } else {
        return 0
      }
    },
    calcFullyVaccinated() {
      if (!this.$fetchState.pending) {
        const latest = this.fullJSON[this.fullJSON.length - 1]
        const dose1st = Number(latest.people_vaccinated.replace(/,/g, ""))
        const dose2nd = Number(latest.people_fully_vaccinated.replace(/,/g, ""))
        return dose1st + dose2nd
      } else {
        return 0
      }
    },
    calcTarget() {
      if (!this.$fetchState.pending) {
        const targetDoses = 100 * 1000000 - this.calcFullyVaccinated
        const targetAvgDose = Math.ceil(targetDoses / this.endOfYear)
        return targetAvgDose.toLocaleString()
      } else {
        return 0
      }
    },
    calcGoalDays() {
      if (!this.$fetchState.pending) {
        const dosesLeftTillTarget = 100 * 1000000 - this.calcFullyVaccinated
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
          this.$store.getters.thPopulation - this.calcFullyVaccinated
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
  methods: {
    slicedData(data) {
      const sliced = data.slice(Math.max(data.length - 14, 0))
      return sliced
    },
  },
}
</script>
