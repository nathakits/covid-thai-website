<template lang="pug">
div
  div.vaccination-block.container-padding
    div.explainer.pb-4.hidden(class="lg:pb-0 md:block")
      p
        | Currently we are way below the target dose needed to reach the goal by the end of the year.
      P 
        | This is due to many factors, such as low inoculation during weekends and vaccine procurement.
    div.progress-bar
      div.flex.justify-between
        h3(style="height:43px;") Target Dose
        div {{ calcTarget }} doses/day
      div.vac-goal-bar
        div.vac-progress.vac-target.rounded-full(
          :style="`width:${20}px;`"
        )
        div.vac-bar(id="vac-target")
      div.flex.justify-between.pt-3.font-medium
        p.text-base {{ calcAverage }} (14-Day Average)
        div
          p.text-base.font-bold Stll need: {{ calcTargetNeeded }}
  div.vaccination-block.container-padding
    div.explainer.pb-4.hidden(class="lg:pb-0 md:block")
      p
        | With the current average vaccination rate, we will likely not meet the goal set out by the Thai government.
    div.progress-bar
      div.card.grid.divide-y.divide-gray-300
        div.card-item-padding.grid.grid-cols-2.gap-8
          span.text-sm Days till goal reached:
          div
            p.text-sm.text-right ~{{ `${calcGoalDays} Days` }}
            p.text-xs.text-right.text-gray-400 {{ `(${calcGoalDate})` }}
        div.card-item-padding.grid.grid-cols-2.gap-8
          span.text-sm Days till everyone is vaccinated:
          div
            p.text-sm.text-right ~{{ `${calcCountryVacDays} Days` }}
            p.text-xs.text-right.text-gray-400 {{ `(${calcCountryVacDate})` }}
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
    }
  },
  computed: {
    calcTargetNeeded() {
      const avg = Number(this.calcAverage.replaceAll(",", ""))
      const target = Number(this.calcTarget.replaceAll(",", ""))
      const targetNeeded = (target - avg).toLocaleString()
      return targetNeeded
    },
    calcAverage() {
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      const totalDosePlusArr = this.slicedData(this.dataFull).map((el) =>
        Number(el.total_dose_plus)
      )
      const calcAverage = totalDosePlusArr.reduce(reducer) / 14
      const formatAvg = Math.round(calcAverage).toLocaleString()
      return formatAvg
    },
    calcTarget() {
      const today = new Date()
      const newYear = new Date(today.getFullYear(), 11, 31)
      const oneDay = 1000 * 60 * 60 * 24
      const daysLeft = Math.ceil((newYear.getTime() - today.getTime()) / oneDay)
      const totalVac = Number(
        this.dataDaily.total_vaccinations.replaceAll(",", "")
      )
      const targetDoses = 100 * 1000000 - totalVac
      const targetAvgDose = Math.ceil(targetDoses / daysLeft)
      return targetAvgDose.toLocaleString()
    },
    calcGoalDays() {
      const totalVacLeft = Number(
        this.dataDaily.total_vaccinations.replaceAll(",", "")
      )
      const dosesLeftTillTarget = 100 * 1000000 - totalVacLeft
      const daysTillTarget =
        dosesLeftTillTarget / Number(this.calcAverage.replaceAll(",", ""))
      return Math.ceil(daysTillTarget)
    },
    calcGoalDate() {
      const date = new Date()
      date.setDate(date.getDate() + this.calcGoalDays)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const goalDate = `${year}-${month}-${day}`
      console.log(date)
      const formatGoalDate = new Date(goalDate).toLocaleDateString("en-us", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      console.log(formatGoalDate)
      return formatGoalDate
    },
    calcCountryVacDays() {
      const totalVacLeft = Number(
        this.dataDaily.total_vaccinations.replaceAll(",", "")
      )
      const dosesLeftTillTarget = 139599956 - totalVacLeft
      const daysTillTarget =
        dosesLeftTillTarget / Number(this.calcAverage.replaceAll(",", ""))
      return Math.ceil(daysTillTarget)
    },
    calcCountryVacDate() {
      const date = new Date()
      date.setDate(date.getDate() + this.calcCountryVacDays)
      const day = date.getDate()
      const month = date.getMonth() + 1
      const year = date.getFullYear()
      const goalDate = `${year}-${month}-${day}`
      console.log(date)
      const formatGoalDate = new Date(goalDate).toLocaleDateString("en-us", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      console.log(formatGoalDate)
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
