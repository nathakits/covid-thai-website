<template lang="pug">
main
  vaccine-overview(:data="dailyJSON")
  div.container.mx-auto.h-full.divide-y.divide-gray-200(
    class="md:divide-y-0"
  )
    //- vaccination goal
    div.vaccination-goal
      div.date-padding.pt-10.flex.justify-between
        div.last-updated.dark-blue
          span {{ `Last updated: ${dailyJSON.date.replaceAll("-", "/")}` }}
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
          div.select-menu.relative(@click="menu = !menu")
            span {{ selected }}
            div.dropdown-menu.border.border-gray-200.z-10(v-show="menu")
              div.pb-2(@click="updateChartType(`Total`)") Total
              div(@click="updateChartType(`Daily`)") Daily
          div.legend.flex.text-sm
            div.pr-3
              span.dot.firstDose
              span 1st Dose
            div
              span.dot.secondDose
              span 2nd Dose
        div.relative
          div.responsive.bg-gray-100.rounded
          VaccineChart(:data="fullJSON")
    //- vaccination progress
    div.vaccination-block.container-padding
      div.explainer.pb-4(
        class="lg:pb-0"
      )
        p.pb-3
          | Percentage of people who have received COVID-19 vaccine,
          | broken down into 3 progress bars.
        P
          | Thailand's 2020 population census: 
          a.link(
            href="https://github.com/owid/covid-19-data/blob/master/scripts/input/un/population_2020.csv"
            target="_blank"
            rel="noreferrer noopenner"
          ) {{ population.toLocaleString() }}
        a.link(
          href="https://ourworldindata.org/"
          target="_blank"
          rel="noreferrer noopenner"
        )
          p From Our World in Data
      div.progress-bar
        //- total bar
        div.total-bar.pb-8
          div.flex.justify-between.items-center
            h3(style="height:43px;") Total
            span.text-sm.text-gray-400 % of population
          div.vac-progress-bar
            div.vac-progress.vac-total.rounded-full(
              :style="`width:${vacTotalProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            div
              span.text-base.pr-2 {{ dailyJSON.total_vaccinations }} doses
            span.text-base.font-bold {{ `${vacTotalPercentage}%` }}
        //- 1st dose
        div.total-bar.pb-8
          div.flex.justify-between.items-center
            h3(style="height:43px;") 1st Dose
            span.text-sm.text-gray-400 % of population
          div.vac-progress-bar
            div.vac-progress.vac-1dose.rounded-full(s
              :style="`width:${vac1DoseProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            div
              span.text-base.pr-2 {{ dailyJSON.people_vaccinated }} doses
            span.text-base.font-bold {{ `${vac1DosePercentage}%` }}
        //- 2nd dose
        div.total-bar
          div.flex.justify-between.items-center
            h3(style="height:43px;") 2nd Dose
            span.text-sm.text-gray-400 % of population
          div.vac-progress-bar
            div.vac-progress.vac-2dose.rounded-full(
              :style="`width:${vacProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            div
              span.text-base.pr-2 {{ dailyJSON.people_fully_vaccinated }} doses
            span.text-base.font-bold {{ `${vac2DosePercentage}%` }}
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
      vacProgress: 20,
      vacTarget: 0,
      menu: false,
      progressBarWidth: 0,
    }
  },
  computed: mapState({
    selected: "selected",
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
.select-menu {
  @apply border border-gray-400 rounded py-1 px-5 focus:outline-none text-sm w-min cursor-pointer;
}
.controls {
  @apply pb-4;
}
.dropdown-menu {
  @apply absolute rounded bg-white p-2 shadow w-full;
  top: 30px;
  left: 0;
}

// legend
.dot {
  display: inline-block;
  border-radius: 50%;
  width: 8px;
  height: 8px;
  margin-right: 8px;

  &.firstDose {
    background-color: rgb(168, 218, 181);
  }
  &.secondDose {
    background-color: rgb(91, 185, 116);
  }
}
</style>
