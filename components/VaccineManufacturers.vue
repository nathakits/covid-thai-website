<template lang="pug">
div.container-padding
  div.rounded-md.bg-white.p-6.shadow
    div.flex.flex-col.justify-between.flex-wrap.gap-4(
      class="sm:flex-row"
    )
      div.order-2(class="sm:order-1")
        h2.pb-2 Vaccine Manufacturers
      div.order-1(class="sm:order-2")
        div.flex.justify-start.dark-blue(class="sm:justify-end")
          div.last-updated.dark-blue {{ `Last updated: ${getLastUpdated}` }}
    div.grid-block
      div.block.pb-4
        p.text-gray-500 This chart shows how many doses was administered by each vaccine manufacturers.
    div
      div.controls.flex.justify-between.items-center.pb-4.flex-wrap.gap-4
        div.flex.text-gray-500
          div(
            class="dark-blue font-bold border-b-2 border-dark-blue"
          ) Cumulative
      div
        div.relative
          div.responsive.bg-gray-100.rounded
          manufacturer-chart(:data="porames")
        div.pt-4
          div.flex.flex-wrap.gap-4.items-center.justify-between
            div
              span.text-xs Note: Some data might not be available
            div.legend.flex.flex-wrap.text-sm.gap-4
              div.flex.items-center
                span.dot.sinovac
                span Sinovac
              div.flex.items-center
                span.dot.astrazeneca
                span Astrazeneca
              div.flex.items-center
                span.dot.sinopharm
                span Sinopharm
              div.flex.items-center
                span.dot.pfizer
                span Pfizer
    div.border-b.my-6
    div.vaccination-block
      div.explainer.text-gray-500
        p
          | Part of 
          strong AstraZeneca
          |  vaccines are manufactured here in Thailand by Siam Bioscience company.
          | The rest of the vaccines are bought or donated by other countries.
        p
          strong {{ manufacturers.filter(vac => vac.status === 'Approved').length }}
          |  vaccines approved by the FDA (Food and Drug Administration) for use in Thailand.
        p
          strong {{ vaccinesInUse }}
          |  vaccines currently being administered to the public.
        p
          strong Johnson & Johnson
          |  vaccine was procured and administered by the French Embassy for French citizens only.
      div.progress-bar
        div.card.grid.divide-y.divide-gray-300
          div.card-item-padding.flex.justify-between
            div.text-base.font-bold Vaccine
            span.text-base.font-bold Doses Administered
          div.card-item-padding.grid.grid-cols-2.gap-8(
            v-for="vac in manufacturers"
            :class="`${vac.name.split(' ').join('-').toLowerCase()} ${vac.status !== 'Approved' ? 'text-gray-400' : ''}`"
          )
            div
              div.text-sm.font-medium {{ vac.name }}
              div
                span.text-sm.text-gray-500.vac-type {{ vac.type }}
                span.text-sm.text-gray-500.vac-status {{ vac.status }}
            span.text-sm.flex.justify-end.items-center.font-bold(:class="`${vac.status === 'Approved' ? 'text-gray-800' :''}`") {{ vac.doses_administered.toLocaleString() }}
          div.card-item-padding.grid.grid-cols-2.gap-8
            div.text-sm.font-bold Total
            span.text-base.flex.justify-end.items-center.font-bold.text-gray-800 {{ totalVaccinesAdministered }}
</template>

<script>
export default {
  data() {
    return {
      vac_given: [],
      porames: [],
      latestData: {},
      vacApproval: [
        {
          name: "Sinovac",
          status: "Approved",
          type: "Inactivated",
        },
        {
          name: "AstraZeneca",
          status: "Approved",
          type: "Viral Vector",
        },
        {
          name: "Moderna",
          status: "Approved",
          type: "mRNA",
        },
        {
          name: "Pfizer",
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
  async fetch() {
    // this.vac_given = await this.$axios.$get(
    //   "https://raw.githubusercontent.com/nathakits/covid-tracker-twitter-bot/main/data/dylan/vac_given.json"
    // )
    this.porames = await this.$axios.$get(
      "https://raw.githubusercontent.com/wiki/porames/the-researcher-covid-data/vaccination/vaccine-manufacturer-timeseries.json"
    )
  },
  computed: {
    manufacturers() {
      if (!this.$fetchState.pending) {
        // const data = this.latestObj(this.vac_given)
        const porData = this.latestObj(this.porames)
        const astrazenecaDoses = porData.AstraZeneca
        const sinovacDoses = porData.Sinovac
        const sinopharmDoses = porData.Sinopharm
        const pfizerDoses = porData.Pfizer
        const jnjDoses = porData["Johnson & Johnson"]

        const vaccineArr = this.vacApproval.map((d) => {
          let obj = {}
          if (d.name === "Sinovac") {
            obj = {
              name: d.name,
              status: d.status,
              type: d.type,
              doses_administered: sinovacDoses,
            }
          } else if (d.name === "AstraZeneca") {
            obj = {
              name: d.name,
              status: d.status,
              type: d.type,
              doses_administered: astrazenecaDoses,
            }
          } else if (d.name === "Sinopharm") {
            obj = {
              name: d.name,
              status: d.status,
              type: d.type,
              doses_administered: sinopharmDoses,
            }
          } else if (d.name === "Pfizer") {
            obj = {
              name: d.name,
              status: d.status,
              type: d.type,
              doses_administered: pfizerDoses,
            }
          } else if (d.name === "Johnson & Johnson") {
            obj = {
              name: d.name,
              status: d.status,
              type: d.type,
              doses_administered: jnjDoses,
            }
          } else {
            obj = {
              name: d.name,
              status: d.status,
              type: d.type,
              doses_administered: 0,
            }
          }
          return obj
        })

        vaccineArr.sort((a, b) => {
          return b.doses_administered - a.doses_administered
        })

        return vaccineArr
      } else {
        return []
      }
    },
    totalVaccinesAdministered() {
      if (!this.$fetchState.pending) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue
        const doses = this.manufacturers.map((d) => d.doses_administered)
        const total = doses.reduce(reducer)
        return total.toLocaleString()
      } else {
        return 0
      }
    },
    vaccinesInUse() {
      if (!this.$fetchState.pending) {
        const vaccines = this.manufacturers.filter((vac) => {
          let vacs = 0
          if (vac.name !== "Johnson & Johnson") {
            vacs = vac.doses_administered > 0
          }
          return vacs
        })
        return vaccines.length
      } else {
        return 0
      }
    },
    getLastUpdated() {
      if (!this.$fetchState.pending) {
        const data = this.latestObj(this.porames)
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
        const astrazenecaDoses = obj.AstraZeneca
        const sinovacDoses = obj.Sinovac
        const sinopharmDoses = obj.Sinopharm
        return (
          astrazenecaDoses !== 0 || sinovacDoses !== 0 || sinopharmDoses !== 0
        )
      })
      const latestObj = nonEmptyArray.shift()
      return latestObj
    },
  },
}
</script>

<style lang="scss" scoped>
.vac-type {
  &:after {
    font-size: 12px;
    content: "•";
    margin: 0 5px;
    color: #5f6368;
  }
}
// legend
.dot {
  display: inline-block;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 8px;

  &.sinovac {
    background-color: #f59e0b;
  }
  &.astrazeneca {
    background-color: #10b981;
  }
  &.sinopharm {
    background-color: #3b82f6;
  }
  &.pfizer {
    background-color: #ef4444;
  }
}
</style>
