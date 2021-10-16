<template lang="pug">
div.container-padding
  div.div.rounded-md.bg-white.p-6.shadow
    div.flex.flex-col.justify-between.flex-wrap.gap-4(
      class="sm:flex-row"
    )
      div.order-2(class="sm:order-1")
        h2.pb-2
          | Vaccine Allocation
          br
          | By MOPH
      div.order-1(class="sm:order-2")
        div.flex.justify-start.dark-blue(class="sm:justify-end")
          div.last-updated {{ `Last updated: ${getLastUpdated}` }}
    div.vaccination-block
      div.explainer.pb-4(
        class="lg:pb-0"
      )
        p.text-gray-600 Vaccines allocated to different provinces and local agencies.
        p.text-gray-600
          | Allocation data only includes Sinovac, AstraZeneca and Pfizer
          | since these vaccines are handled directly by the MOPH (Ministry of Public Health),
          | whereas Sinopharm is handled by Chulabhorn Hospital.
      div.progress-bar
        div.card.grid.divide-y.divide-gray-300
          div.card-item-padding.flex.justify-between
            div.text-base.font-bold Vaccine
            span.text-base.font-bold Allocated
          div.card-item-padding.grid.grid-cols-2.gap-8(
            v-for="vac in latestAllocation"
          )
            div
              div.text-sm.font-medium {{ vac.name }}
            span.text-sm.flex.justify-end.items-center.font-bold.text-gray-800 {{ vac.doses_allocated.toLocaleString() }}
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
        {
          name: "Pfizer",
          doses_allocated: 0,
        },
      ],
    }
  },
  async fetch() {
    // this.data = await this.$axios.$get(
    //   "https://nathakits.github.io/covid-tracker-twitter-bot/data/dylan/vac_allocation.json"
    // )
    this.data = await this.$axios.$get(
      "https://raw.githubusercontent.com/wiki/porames/the-researcher-covid-data/vaccination/vaccine-delivery.json"
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
        // const data = this.latestObj(this.data)
        const data = this.data.data
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue
        const sinovacArr = data.map((d) => d.delivered_sinovac)
        const astraArr = data.map((d) => d.delivered_astrazeneca)
        const pfizerArr = data.map((d) => d.delivered_pfizer)
        const sinovacTotal = sinovacArr.reduce(reducer)
        const astraTotal = astraArr.reduce(reducer)
        const pfizerTotal = pfizerArr.reduce(reducer)

        const allocationArr = this.vacc_allocation.map((d) => {
          let obj = {}
          if (d.name === "Sinovac") {
            obj = {
              name: d.name,
              doses_allocated: sinovacTotal,
            }
          } else if (d.name === "AstraZeneca") {
            obj = {
              name: d.name,
              doses_allocated: astraTotal,
            }
          } else if (d.name === "Pfizer") {
            obj = {
              name: d.name,
              doses_allocated: pfizerTotal,
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
        // const data = this.latestObj(this.data)
        // return data.allocated_total.toLocaleString()
        const data = this.data.data
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue
        const sinovacArr = data.map((d) => d.delivered_sinovac)
        const astraArr = data.map((d) => d.delivered_astrazeneca)
        const pfizerArr = data.map((d) => d.delivered_pfizer)
        const sinovacTotal = sinovacArr.reduce(reducer)
        const astraTotal = astraArr.reduce(reducer)
        const pfizerTotal = pfizerArr.reduce(reducer)
        const total = sinovacTotal + astraTotal + pfizerTotal
        return total.toLocaleString()
      } else {
        return ``
      }
    },
    getLastUpdated() {
      if (!this.$fetchState.pending) {
        // const data = this.latestObj(this.data)
        const data = this.data.update_date
        const date = data.split("-")
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
  // mounted() {
  //   this.$nextTick(() => {
  //     const data = this.test.data
  //     const pfizer = data.map((d) => d.delivered_pfizer)
  //     const reducer = (accumulator, currentValue) => accumulator + currentValue
  //     console.log(pfizer.reduce(reducer))
  //   })
  // },
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
