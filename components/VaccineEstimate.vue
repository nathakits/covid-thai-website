<template lang="pug">
div.vaccination-block.container-padding
  div.explainer.pb-4.hidden(class="lg:pb-0 md:block")
  div.progress-bar
    div.card.grid.divide-y.divide-gray-300
      div.card-item-padding.grid.grid-cols-2.gap-8
        span.text-sm Target dose / day:
        span.text-sm.flex.justify-end.items-center {{ calcTarget }}
      div.card-item-padding.grid.grid-cols-2.gap-8
        span.text-sm 14-day average:
        span.text-sm.flex.justify-end.items-center {{ calcAverage }}
      div.card-item-padding.grid.grid-cols-2.gap-8
        span.text-sm Date till goal reached:
        div
          p.text-sm.text-right ~{{ `${calcGoalDays} Days` }}
          p.text-sm.text-right.text-gray-400 {{ `(${calcGoalDate})` }}
      div.card-item-padding.grid.grid-cols-2.gap-8
        span.text-sm Date till everyone is vaccinated:
        div
          p.text-sm.text-right ~{{ `${calcCountryVacDays} Days` }}
          p.text-sm.text-right.text-gray-400 {{ `(${calcCountryVacDate})` }}
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
