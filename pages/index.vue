<template lang="pug">
main
  vaccine-overview(:data="dailyJSON")
  div.container.mx-auto.h-full
    //- vaccination goal
    div.vaccination-goal
      div.date-padding.pt-10.flex.justify-between
        div.last-updated.dark-blue
          span {{ `Last updated: ${getLastUpdated}` }}
        div.flex
          facebook-share.pr-2
          twitter-share
      div.vaccination-block.container-padding
        div.explainer.pb-4(
          class="lg:pb-0"
        )
          h2.pb-2 Vaccination Goal
          p 
            | Government's vaccination goal of inoculating 50 million people (70% of the population) with 100 million doses of vaccines by the end of 2021
        div.progress-bar
          h3(style="height:43px;") 100 Million Doses
          div.vac-goal-bar
            div.vac-progress.vac-goal.rounded-full(
              :style="`width:${vacGoalProgress}px;`"
            )
            div.vac-bar(id="vac-goal")
          div.flex.justify-between.pt-3.font-medium
            span.text-base {{ dailyJSON.total_vaccinations }} / 100,000,000
            span.text-base.font-bold {{ `${vacGoalPercentage}%` }}
    //- vaccine target and estimate
    vaccine-target(:dataFull="fullJSON" :dataDaily="dailyJSON")
    div.border-b.container-margin
    //- vaccination progress
    div.vaccination-block.container-padding
      div.explainer.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Progress
        p
          | This data shows how many people have received at least one dose of a vaccine.
          | People who are fully vaccinated may have received more than one dose.
      div.progress-bar
        div.controls.flex.justify-between.items-center
          div.flex.text-gray-500
            div.mr-4.cursor-pointer(
              :class="selected === `Total` ? `dark-blue font-bold border-b-2 border-dark-blue` : ``"
              @click="updateChartType(`Total`)"
            ) Total
            div.cursor-pointer(
              :class="selected === `Daily` ? `dark-blue font-bold border-b-2 border-dark-blue` : ``"
              @click="updateChartType(`Daily`)"
            ) Daily
          div.legend.flex.text-sm
            div.pr-4.flex.items-center
              span.dot.firstDose
              span 1st Dose
            div.flex.items-center
              span.dot.secondDose
              span 2nd Dose
        div.relative
          div.responsive.bg-gray-100.rounded
          VaccineChart(:data="fullJSON")
    div.vaccination-block.container-padding
      div.explainer.pb-4(
        class="lg:pb-0"
      )
        p.pb-4
          | Percentage of people who have received COVID-19 vaccine,
          | broken down into 3 progress bars.
        tooltip
          a.link(
            href="https://github.com/owid/covid-19-data/blob/master/scripts/input/un/population_2020.csv"
            target="_blank"
            rel="noreferrer noopenner"
          )
            span.text-sm.text-blue-900 Thailand's 2020 population: {{ population.toString().slice(0,2) }} Million
      div.progress-bar
        //- total bar
        div.total-bar.pb-8
          div.flex.justify-between.items-center
            h3(style="height:43px;") Total
            span.text-lg.font-bold {{ `${vacTotalPercentage}%` }}
            
          div.vac-progress-bar
            div.vac-progress.vac-total.rounded-full(
              :style="`width:${vacTotalProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            span.text-sm.text-gray-500 % of population
            div
              span.text-base.pr-2 {{ dailyJSON.total_vaccinations }} doses
        //- 1st dose
        div.total-bar.pb-8
          div.flex.justify-between.items-center
            h3(style="height:43px;") 1st Dose
            span.text-lg.font-bold {{ `${vac1DosePercentage}%` }}
          div.vac-progress-bar
            div.vac-progress.vac-1dose.rounded-full(s
              :style="`width:${vac1DoseProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            span.text-sm.text-gray-500 % of population
            div
              span.text-base.pr-2 {{ dailyJSON.people_vaccinated }} doses
        //- 2nd dose
        div.total-bar
          div.flex.justify-between.items-center
            h3(style="height:43px;") 2nd Dose
            span.text-lg.font-bold {{ `${vac2DosePercentage}%` }}
            
          div.vac-progress-bar
            div.vac-progress.vac-2dose.rounded-full(
              :style="`width:${vac2DoseProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            span.text-sm.text-gray-500 % of population
            div
              span.text-base.pr-2 {{ dailyJSON.people_fully_vaccinated }} doses
    div.border-b.container-margin
    VaccineManufacturers
</template>

<script>
import { mapState } from "vuex"

export default {
  async asyncData({ $axios }) {
    const dailyJSON = await $axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/vaccinations.json"
    )
    const fullCSV = await $axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/Thailand.csv"
    )
    const fullJSON = await $axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/Thailand.json"
    )
    return { dailyJSON, fullCSV, fullJSON }
  },
  data() {
    return {
      population: 69799978,
      vacGoalProgress: 0,
      vacGoalPercentage: 0,
      vacTotalProgress: 0,
      vacTotalPercentage: 0,
      vac1DoseProgress: 0,
      vac1DosePercentage: 0,
      vac2DoseProgress: 0,
      vac2DosePercentage: 0,
      progressBarWidth: 0,
    }
  },
  computed: mapState({
    selected: "selected",
    getLastUpdated() {
      if (this.dailyJSON) {
        const data = this.dailyJSON
        const date = data.date.split("-")
        const day = Number(date[0]) + 1
        const month = date[1]
        const year = date[2]
        const formattedDate = `${day}/${month}/${year}`
        return formattedDate
      } else {
        return ``
      }
    },
  }),
  watch: {
    progressBarWidth() {
      this.calcVacGoal()
      this.calcVacTotal()
      this.calcVac1Dose()
      this.calcVac2Dose()
    },
  },
  mounted() {
    this.getVacGoalWidth()
    this.calcVacGoal()
    this.calcVacTotal()
    this.calcVac1Dose()
    this.calcVac2Dose()
    window.addEventListener("resize", this.getVacGoalWidth)
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.getVacGoalWidth)
  },
  methods: {
    calcVacGoal() {
      if (this.dailyJSON) {
        const totalVac = this.dailyJSON.total_vaccinations.replaceAll(",", "")
        const percentage = (totalVac / 100000000) * 100
        const progress = this.progressBarWidth * (percentage / 100)
        this.vacGoalPercentage = percentage.toFixed(2)
        this.vacGoalProgress = progress
      } else {
        return 0
      }
    },
    calcVacTotal() {
      if (this.dailyJSON) {
        const totalVac = this.dailyJSON.total_vaccinations.replaceAll(",", "")
        const percentage = (totalVac / this.population) * 100
        const progress = this.progressBarWidth * (percentage / 100)
        this.vacTotalPercentage = percentage.toFixed(2)
        this.vacTotalProgress = progress
      } else {
        return 0
      }
    },
    calcVac1Dose() {
      if (this.dailyJSON) {
        const firstDose = this.dailyJSON.people_vaccinated.replaceAll(",", "")
        const percentage = (firstDose / this.population) * 100
        const progress = this.progressBarWidth * (percentage / 100)
        this.vac1DosePercentage = percentage.toFixed(2)
        this.vac1DoseProgress = progress
      } else {
        return 0
      }
    },
    calcVac2Dose() {
      if (this.dailyJSON) {
        const secondDose = this.dailyJSON.people_fully_vaccinated.replaceAll(
          ",",
          ""
        )
        const percentage = (secondDose / this.population) * 100
        const progress = this.progressBarWidth * (percentage / 100)
        this.vac2DosePercentage = percentage.toFixed(2)
        this.vac2DoseProgress = progress
      } else {
        return 0
      }
    },
    getVacGoalWidth() {
      const width = document.getElementById("vac-goal").offsetWidth
      this.progressBarWidth = width
      // return width
    },
    updateChartType(type) {
      this.$store.commit("updateSelection", type)
    },
  },
}
</script>

<style scoped lang="scss">
// chart
.responsive {
  padding-bottom: 50%;
}
.controls {
  @apply pb-4;
}
// legend
.dot {
  display: inline-block;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 8px;

  &.firstDose {
    background-color: rgb(168, 218, 181);
  }
  &.secondDose {
    background-color: rgb(91, 185, 116);
  }
}
</style>
