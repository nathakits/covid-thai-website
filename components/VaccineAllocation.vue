<template lang="pug">
//- todo add allocation by province
//- horizontal bar chart
div.vaccination-manufacturers
  div.date-padding.dark-blue.pt-6
    div.last-updated {{ `Last updated: ${getLastUpdated}` }}
  div.vaccination-block.container-padding
    div.explainer.pb-4(
      class="lg:pb-0"
    )
      h2.pb-2 Vaccination Allocation
      p Vaccines allocated to different provinces and local agencies.
      p
        | Allocation data only includes
        strong  Sinovac
        |  and
        strong  AstraZeneca
        |  since these two vaccines are handled directly by the MOPH (Ministry of Public Health),
        |  whereas 
        strong Sinopharm
        |  is handled by Chulabhorn Hospital
    div.progress-bar
      div.card.grid.divide-y.divide-gray-300
        div.card-item-padding.flex.justify-between
          div.text-base.font-bold Vaccines
          span.text-base.font-bold Allocated
        div.card-item-padding.grid.grid-cols-2.gap-8(
          v-for="vac in latestAllocation"
        )
          div
            div.text-base.font-medium {{ vac.name }}
          span.text-base.flex.justify-end.items-center.font-medium.text-gray-800 {{ vac.doses_allocated.toLocaleString() }}
        div.card-item-padding.grid.grid-cols-2.gap-8
          div.text-base.font-bold Total
          span.text-base.flex.justify-end.items-center.font-bold.text-gray-800 {{ totalLatestAllocation }}
      //- div.total-bar.pb-8
      //-   div.flex.justify-between.items-center.pb-2
      //-     h3 Remaining vaccines
      //-     span.text-lg.font-bold 0 / {{ totalSupply }}
      //-   div.vac-progress-bar
      //-     div.vac-progress.vac-total.rounded-full(
      //-       :style="`width:${vacTotalProgress}px;`"
      //-     )
      //-     div.vac-bar
      //-   div.flex.justify-between.pt-3.font-medium
      //-     span.text-sm.text-gray-500 % of population
      //-     span.text-base.font-bold {{ `${0}%` }}
</template>

<script>
export default {
  data() {
    return {
      data: [],
      vacc_allocation: [
        {
          name: "AstraZeneca",
          doses_allocated: 0,
        },
        {
          name: "Sinovac",
          doses_allocated: 0,
        },
      ],
    }
  },
  async fetch() {
    this.data = await this.$axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/vac_allocation.json"
    )
  },
  computed: {
    totalSupply() {
      if (!this.$fetchState.pending) {
        const data = this.data
        const latest = data[data.length - 1]
        return latest.total_supply.toLocaleString()
      } else {
        return ``
      }
    },
    latestAllocation() {
      if (!this.$fetchState.pending) {
        const data = this.data
        const latest = data[data.length - 1]
        const allocationArr = this.vacc_allocation.map((d) => {
          let obj = {}
          if (d.name === "Sinovac") {
            obj = {
              name: d.name,
              doses_allocated: latest.allocated_sinovac,
            }
          } else if (d.name === "AstraZeneca") {
            obj = {
              name: d.name,
              doses_allocated: latest.allocated_astrazeneca,
            }
          } else {
            obj = {
              name: d.name,
              doses_allocated: 0,
            }
          }
          return obj
        })
        return allocationArr
      } else {
        return ``
      }
    },
    totalLatestAllocation() {
      if (!this.$fetchState.pending) {
        const data = this.data
        const latest = data[data.length - 1]
        return latest.allocated_total.toLocaleString()
      } else {
        return ``
      }
    },
    getLastUpdated() {
      if (!this.$fetchState.pending) {
        const data = this.data
        const latest = data[data.length - 1]
        const date = latest.date.split("-")
        const year = date[0]
        const month = date[1]
        const day = date[2]
        const formattedDate = `${day}/${month}/${year}`
        return formattedDate
      } else {
        return ``
      }
    },
  },
  methods: {
    filterVaccines(array, name) {
      return array.filter((d) => d.manufacturer === name)
    },
  },
}
</script>
