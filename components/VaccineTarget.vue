<template lang="pug">
div
  div.vaccination-block.container-padding
    div.explainer.pb-4(class="lg:pb-0")
      p
        | With the newly revised goal set out by the Thai government, the 1st dose 14-day average rate has exceeded the target dose needed to reach the 50 million doses.
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
            span.text-sm.font-medium.pl-2(class="md:pl-4") 1st Dose 14-Day Avg
          p.text-base.font-bold.text-gray-800.text-right {{ calcAverage.toLocaleString() }} Doses/Day

  div.vaccination-block.container-padding
    div.explainer.pb-4(class="lg:pb-0")
      p
        | At this current rate, we should reach the goal before the end of the year.
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

  //- div.vaccination-block.container-padding
  //-   div.explainer.pb-4(class="lg:pb-0")
  //-   div.progress-bar
  //-     div.card.grid.divide-y.divide-gray-300
  //-       div.card-item-padding.flex.justify-between.items-center.font-medium
  //-         div.flex.items-center
  //-           vaccine-icon
  //-           span.text-sm.pl-2(class="md:pl-4") End Of Year Vaccination
  //-         p.text-base.font-bold.text-gray-800.text-right ~{{ calcVaccinationEndOfYear }} Doses

</template>

<script>
import { mapGetters } from "vuex"

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
    ...mapGetters({
      popGoal1: "popGoal1",
    }),
    calcAverage() {
      if (!this.$fetchState.pending) {
        const reducer = (accum, current) => accum + current
        const firstDoseArr = this.slicedData(this.fullJSON).map((el) =>
          Number(el.first_dose_plus)
        )
        const avg = firstDoseArr.reduce(reducer) / 14
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
        const targetDoses = this.popGoal1 - this.calcFirstDose
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
        const dose1st = Number(latest.people_vaccinated.replace(/,/g, ""))
        const total = dose1st + vaccinated
        return total.toLocaleString()
      } else {
        return 0
      }
    },
    calcFirstDose() {
      if (!this.$fetchState.pending) {
        const latest = this.fullJSON[this.fullJSON.length - 1]
        const dose1st = Number(latest.people_vaccinated.replace(/,/g, ""))
        return dose1st
      } else {
        return 0
      }
    },
    calcGoalDays() {
      if (!this.$fetchState.pending) {
        const dosesLeftTillTarget = this.popGoal1 - this.calcFirstDose
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
          this.$store.getters.thPopulation - this.calcFirstDose
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
