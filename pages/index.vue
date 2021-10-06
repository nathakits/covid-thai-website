<template lang="pug">
main
  vaccine-overview(:all="fullJSON")
  div.container.mx-auto.h-full
    //- vaccine goal and estimate
    vaccine-target
    div.border-b.container-margin
    //- vaccination progress
    div.vaccination-block.container-padding
      div.explainer.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Progress
        p
          | This chart shows how many people have received vaccine since the start of vaccination program in Thailand.
        p People who are fully vaccinated may have received more than one dose.
      div.progress-bar
        div.controls.flex.justify-between.items-center.flex-wrap.gap-4
          div.flex.text-gray-500
            div.mr-4.cursor-pointer(
              :class="selected === `Cumulative` ? `dark-blue font-bold border-b-2 border-dark-blue` : ``"
              @click="updateChartType(`Cumulative`)"
            ) Cumulative
            div.cursor-pointer(
              :class="selected === `Daily` ? `dark-blue font-bold border-b-2 border-dark-blue` : ``"
              @click="updateChartType(`Daily`)"
            ) Daily
          div.legend.flex.text-sm.flex-wrap.gap-4
            div.flex.items-center
              span.dot.firstDose
              span 1st Dose
            div.flex.items-center
              span.dot.secondDose
              span 2nd Dose
            div.flex.items-center
              span.dot.thirdDose
              span 3rd Dose
        div.relative
          div.responsive.bg-gray-100.rounded
          vaccine-barchart(:data="fullJSON")
        div.pt-4
          div.border-b.my-2
          p.text-xs Note: There are days with a reporting anomaly
    div.vaccination-block.container-padding
      div.explainer.pb-4(
        class="lg:pb-0"
      )
        p.pb-4
          | Percentage of people who have received COVID-19 vaccine,
          | broken down into 3 progress bars.
        p.pb-4
          | Thailand's 2021 population figure is from MOPH daily report.
        tooltip
          span.text-sm.text-blue-900 2021 Population: {{ population.toLocaleString() }}
      div.progress-bar
        //- total bar
        div.shadow.border.w-full.rounded-lg.p-6(
          style="background-color:#fafafa;"
        )
          div.total-bar
            div.flex.justify-between.items-center.pb-2
              h3.font-bold Total Vaccines Given
              div.highlight-card
                span.font-bold.text-gray-900 {{ latestData.total_vaccinations_cum.toLocaleString() }}
          div.border-b.my-4
          //- 1st dose
          div.total-bar.pb-8
            div.flex.justify-between.items-center.pb-2
              h3 1st Dose
              div.highlight-card
                span.font-bold.text-gray-900 {{ latestData.first_dose_cum.toLocaleString() }}
            div.vac-progress-bar
              div.vac-progress.vac-1dose.rounded-full(s
                :style="`width:${vac1DosePercentage}%;`"
              )
              div.vac-bar
            div.flex.justify-between.pt-3.font-medium
              span.text-sm.text-gray-500 % of Population
              span.text-base.font-bold.text-gray-900(
                class="md:text-lg"
              ) {{ `${vac1DosePercentage}%` }}
          //- 2nd dose
          div.total-bar.pb-8
            div.flex.justify-between.items-center.pb-2
              h3 2nd Dose
              div.highlight-card
                span.font-bold.text-gray-900 {{ latestData.second_dose_cum.toLocaleString() }}
            div.vac-progress-bar
              div.vac-progress.vac-2dose.rounded-full(
                :style="`width:${vac2DosePercentage}%;`"
              )
              div.vac-bar
            div.flex.justify-between.pt-3.font-medium
              span.text-sm.text-gray-500 % of Population
              div
                span.text-base.font-bold.text-gray-900(
                  class="md:text-lg"
                ) {{ `${vac2DosePercentage}%` }}
          //- 3rd dose
          div.total-bar
            div.flex.justify-between.items-center.pb-2
              h3 3rd Dose
              div.highlight-card
                span.font-bold.text-gray-900 {{ latestData.third_dose_cum.toLocaleString() }}
            div.vac-progress-bar
              div.vac-progress.vac-2dose.rounded-full(
                :style="`width:${vac3DosePercentage}%;`"
              )
              div.vac-bar
            div.flex.justify-between.pt-3.font-medium
              span.text-sm.text-gray-500 % of Population
              div
                span.text-base.font-bold.text-gray-900(
                  class="md:text-lg"
                ) {{ `${vac3DosePercentage}%` }}
        vaccine-trends
    div.border-b.container-margin
    vac-province
    div.border-b.container-margin
    vaccine-manufacturers
    div.border-b.container-margin
    vaccine-allocation
</template>

<script>
import { mapGetters } from "vuex"

export default {
  async asyncData({ $axios }) {
    const fullJSON = await $axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/dashboard/national-vacmod-timeseries.json"
    )
    return { fullJSON }
  },
  data() {
    return {
      vac1DosePercentage: 0,
      vac2DosePercentage: 0,
      vac3DosePercentage: 0,
      doses_administered: 0,
    }
  },
  computed: {
    ...mapGetters({
      selected: "selected",
      population: "thPopulation",
      popGoal1: "popGoal1",
    }),
    latestData() {
      if (this.fullJSON) {
        return this.fullJSON[this.fullJSON.length - 1]
      } else {
        return {}
      }
    },
  },
  mounted() {
    this.calcVac1Dose()
    this.calcVac2Dose()
    this.calcVac3Dose()
  },
  methods: {
    dosesAdministered() {
      if (this.fullJSON) {
        const firstDose = this.latestData.first_dose_cum
        const secondDose = this.latestData.second_dose_cum
        const totalDoses = Number(firstDose) + Number(secondDose)
        this.doses_administered = totalDoses
      } else {
        return 0
      }
    },
    calcVac1Dose() {
      if (this.fullJSON) {
        const firstDose = this.latestData.first_dose_cum
        const percentage = (firstDose / this.population) * 100
        this.vac1DosePercentage = percentage.toFixed(2)
      } else {
        return 0
      }
    },
    calcVac2Dose() {
      if (this.fullJSON) {
        const secondDose = this.latestData.second_dose_cum
        const percentage = (secondDose / this.population) * 100
        this.vac2DosePercentage = percentage.toFixed(2)
      } else {
        return 0
      }
    },
    calcVac3Dose() {
      if (this.fullJSON) {
        const thirdDose = this.latestData.third_dose_cum
        const percentage = (thirdDose / this.population) * 100
        this.vac3DosePercentage = percentage.toFixed(2)
      } else {
        return 0
      }
    },
    updateChartType(type) {
      this.$store.commit("updateSelection", type)
    },
  },
}
</script>

<style scoped lang="scss">
// chart
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
  &.thirdDose {
    background-color: rgb(12, 132, 63);
  }
}
</style>
