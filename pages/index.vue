<template lang="pug">
  main.container.mx-auto.h-full.divide-y.divide-gray-200(
    class="md:divide-y-0"
  )
    //- vaccination goal
    div.vaccination-block.header-padding.flex.justify-end
      p {{ `Last updated: ${data.date.replaceAll("-", "/")}` }}
    div.vaccination-block.container-padding
      div.flex-auto.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Goal
        p 
          | Government's vaccination goal of inoculating 50 million people with 100 million doses of vaccines by the end of 2021
      div.flex-auto
        h3(style="height:43px;") 100 Million doses
        div.vac-goal-bar
          div.vac-progress.rounded-full(
            :style="`width:${vacGoalProgress}px;`"
          )
          div.vac-bar(id="vac-goal")
        div.flex.justify-between.pt-3.font-medium
          p.text-base {{ data.total_vaccinations }} / 100,000,000
          p.text-base {{ `${vacGoalPercentage}%` }}
    //- vaccination progress
    div.vaccination-block.container-padding
      div.flex-auto.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Progress
        p.pb-3
          | Percentage of people who have received the COVID-19 vaccine in Thailand.
          | Broken down into 3 progress bars.
        a.link(
          href="https://github.com/owid/covid-19-data/blob/master/scripts/input/un/population_2020.csv"
          target="_blank"
          rel="noreferrer noopenner"
        )
          P
            | Thailand Population 2020 cencus: {{ population }}
      div.flex-auto
        //- total bar
        div.total-bar.pb-6
          h3(style="height:43px;") Total
          div.vac-progress-bar
            div.vac-progress.rounded-full(
              :style="`width:${vacTotalProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            p.text-base {{ data.total_vaccinations }} {{ `(+${data.total_dose_plus})` }}
            p.text-base {{ `${vacTotalPercentage}%` }} (+0.00%)
        //- 1st dose
        div.total-bar.pb-6
          h3(style="height:43px;") 1st Dose
          div.vac-progress-bar
            div.vac-progress.rounded-full(
              :style="`width:${vac1DoseProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            p.text-base {{ data.people_vaccinated }} {{ `(+${data.first_dose_plus})` }}
            p.text-base {{ `${vac1DosePercentage}%` }} (+0.00%)
        //- 2nd dose
        div.total-bar
          h3(style="height:43px;") 2nd Dose
          div.vac-progress-bar
            div.vac-progress.rounded-full(
              :style="`width:${vacProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            p.text-base {{ data.people_fully_vaccinated }} {{ `(+${data.second_dose_plus})` }}
            p.text-base {{ `${vac2DosePercentage}%` }} (+0.00%)
    //- vaccination allotment
    div.vaccination-block.container-padding
      div.flex-auto.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Allotment
        p 
          | Sinovac and Astrazenca is handled by the CCSA
        p
         | *Note: Sinopharm is distributed by the Chulabhorn Royal Academy (CRA)
      div.flex-auto
        div.vac-card
          div
          div.sinovac.flex.justify-between
            p Sinovac
            p {{ this.data.sinovac }} Doses
          div.astrazeneca.flex.justify-between
            p AstraZeneca
            p {{ this.data.astrazeneca }} Doses
          div.sinopharm.flex.justify-between.text-gray-400
            p Sinopharm*
            p -
          div.border-t.border-black.my-3
          div.total-allotment.flex.justify-between
            p Total
            p {{ totalVacAllotment }} Doses
    //- vaccination approval
    div.vaccination-block.container-padding
      div.flex-auto.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Approval
        p 
          | {{ vacApproval.length }} Vaccines Approved for Use in Thailand
      div.flex-auto
        div.vac-card
          div.flex.justify-between(
            v-for="vac in vacApproval"
            :class="`${vac.name.split(' ').join('-').toLowerCase()} ${vac.status !== 'Approved' ? 'text-gray-400' : ''}`"
          )
            p {{ vac.name }}
            p {{ vac.type }}
            p(:class="`${vac.status === 'Approved' ? 'text-green-600' : ''}`") {{ vac.status }}

</template>

<script>
export default {
  async asyncData({ $axios }) {
    const data = await $axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/vaccinations.json"
    )
    return { data }
  },
  data() {
    return {
      population: 69799978,
      totalVacAllotment: 0,
      vacGoalProgress: 0,
      vacGoalPercentage: 0,
      vacTotalProgress: 0,
      vacTotalPercentage: 0,
      vac1DoseProgress: 0,
      vac1DosePercentage: 0,
      vac2DoseProgress: 0,
      vac2DosePercentage: 0,
      vacProgress: 20,
      vacAllotment: [],
      vacApproval: [
        {
          name: "Sinovac",
          status: "Approved",
          type: "Inactivated",
        },
        {
          name: "Oxford/AstraZeneca",
          status: "Approved",
          type: "Viral Vector",
        },
        {
          name: "Moderna",
          status: "Approved",
          type: "mRNA",
        },
        {
          name: "Johnson & Johnson",
          status: "Approved",
          type: "Viral Vector",
        },
        {
          name: "Sinopharm",
          status: "Approved",
          type: "Inactivated",
        },
      ],
    }
  },
  mounted() {
    this.calcVacGoal()
    this.calcVacTotal()
    this.calcVac1Dose()
    this.calcVac2Dose()
    this.calcVacAllotment()
  },
  methods: {
    calcVacAllotment() {
      const sinovac = this.data.sinovac.replaceAll(",", "")
      const astra = this.data.astrazeneca.replaceAll(",", "")
      const total = Number(sinovac) + Number(astra)
      console.log(total)
      this.totalVacAllotment = Number(total).toLocaleString()
    },
    calcVacGoal() {
      if (this.data) {
        const totalVac = this.data.total_vaccinations.replaceAll(",", "")
        const percentage = (totalVac / 100000000) * 100
        const progress = this.getVacGoalWidth() * (percentage / 100)
        this.vacGoalPercentage = percentage.toFixed(2)
        this.vacGoalProgress = progress
      } else {
        return 0
      }
    },
    calcVacTotal() {
      if (this.data) {
        const totalVac = this.data.total_vaccinations.replaceAll(",", "")
        const percentage = (totalVac / this.population) * 100
        const progress = this.getVacGoalWidth() * (percentage / 100)
        this.vacTotalPercentage = percentage.toFixed(2)
        this.vacTotalProgress = progress
      } else {
        return 0
      }
    },
    calcVac1Dose() {
      if (this.data) {
        const firstDose = this.data.people_vaccinated.replaceAll(",", "")
        const percentage = (firstDose / this.population) * 100
        const progress = this.getVacGoalWidth() * (percentage / 100)
        this.vac1DosePercentage = percentage.toFixed(2)
        this.vac1DoseProgress = progress
      } else {
        return 0
      }
    },
    calcVac2Dose() {
      if (this.data) {
        const secondDose = this.data.people_fully_vaccinated.replaceAll(",", "")
        const percentage = (secondDose / this.population) * 100
        const progress = this.getVacGoalWidth() * (percentage / 100)
        this.vac2DosePercentage = percentage.toFixed(2)
        this.vac2DoseProgress = progress
      } else {
        return 0
      }
    },
    getVacGoalWidth() {
      const width = document.getElementById("vac-goal").offsetWidth
      return width
    },
  },
}
</script>

<style scoped lang="scss">
.vaccination-block {
  @apply flex flex-wrap space-x-0 lg:space-x-8;
}
.vaccination-block {
  div.flex-auto:first-child {
    @apply md:max-w-sm lg:max-w-md;
  }
  div.flex-auto:last-child {
    @apply md:max-w-lg lg:max-w-xl;
  }
}
.vac-goal-bar,
.vac-progress-bar {
  @apply w-full relative rounded-full;
  height: 16px;
}
.vac-progress {
  @apply absolute z-10;
  background-color: red;
  height: 16px;
}
.vac-bar {
  @apply w-full absolute rounded-full;
  background-color: #dbdbdb;
  height: 16px;
}
.vac-card {
  @apply shadow-lg h-full w-full border rounded-lg p-6;
}
.vac-card p {
  @apply text-base font-medium;
}
</style>
