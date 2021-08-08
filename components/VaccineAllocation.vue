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
      h2.pb-2
        | Vaccine Allocation
        br
        | By MOPH
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
          div.text-base.font-bold Vaccine
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
        const data = this.latestObj(this.data)
        const allocationArr = this.vacc_allocation.map((d) => {
          let obj = {}
          if (d.name === "Sinovac") {
            obj = {
              name: d.name,
              doses_allocated: data.allocated_sinovac,
            }
          } else if (d.name === "AstraZeneca") {
            obj = {
              name: d.name,
              doses_allocated: data.allocated_astrazeneca,
            }
          } else {
            obj = {
              name: d.name,
              doses_allocated: 0,
            }
          }
          return obj
        })
        allocationArr.sort((a, b) => b.doses_allocated - a.doses_allocated)
        return allocationArr
      } else {
        return ``
      }
    },
    totalLatestAllocation() {
      if (!this.$fetchState.pending) {
        const data = this.latestObj(this.data)
        return data.allocated_total.toLocaleString()
      } else {
        return ``
      }
    },
    getLastUpdated() {
      if (!this.$fetchState.pending) {
        const data = this.latestObj(this.data)
        const date = data.date.split("-")
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
    latestObj(array) {
      const reversedArray = [...array].reverse()
      const nonEmptyArray = reversedArray.filter((obj) => {
        const astrazenecaDoses = obj.allocated_astrazeneca
        const sinovacDoses = obj.allocated_sinovac
        return astrazenecaDoses !== 0 || sinovacDoses !== 0
      })
      const latestObj = nonEmptyArray.shift()
      return latestObj
    },
  },
}
</script>
