<template lang="pug">
div.vaccination-manufacturers
  div.date-padding.dark-blue.pt-6
    div.last-updated {{ `Last updated: ${getLastUpdated}` }}
  div.vaccination-block.container-padding
    div.explainer.pb-4(
      class="lg:pb-0"
    )
      h2.pb-2 Vaccinations Manufacturers
      p 
        | {{ manufacturers.filter(vac => vac.status === 'Approved').length }} vaccines approved for Use in Thailand.
      p {{ manufacturers.filter(vac => vac.doses_administered > 0).length }} vaccines currently in use.
    div.progress-bar
      div.card.grid.divide-y.divide-gray-300
        div.card-item-padding.flex.justify-between
          div.text-base.font-bold Vaccines
          span.text-base.font-bold Total doses administered
        div.card-item-padding.grid.grid-cols-2.gap-8(
          v-for="vac in manufacturers"
          :class="`${vac.name.split(' ').join('-').toLowerCase()} ${vac.status !== 'Approved' ? 'text-gray-400' : ''}`"
        )
          div
            div.text-sm.font-bold {{ vac.name }}
            div
              span.text-sm.text-gray-400.vac-type {{ vac.type }}
              span.text-sm.text-gray-400.vac-status {{ vac.status }}
          span.text-base.flex.justify-end.items-center(:class="`${vac.status === 'Approved' ? 'text-black' : ''}`") {{ vac.doses_administered.toLocaleString() }}
</template>

<script>
export default {
  data() {
    return {
      data: [],
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
          type: "Adenoviral",
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
        // {
        //   name: "Novavax",
        //   status: "",
        //   type: "Subunit",
        // },
        // {
        //   name: "Sputnik V",
        //   status: "",
        //   type: "Adenoviral",
        // },
      ],
    }
  },
  async fetch() {
    this.data = await this.$axios.$get(
      "https://raw.githubusercontent.com/porames/the-researcher-covid-bot/master/components/gis/data/vaccine-manufacturer-timeseries.json"
    )
  },
  computed: {
    manufacturers() {
      if (!this.$fetchState.pending) {
        const array = this.data
        const latestArray = array[array.length - 1]
        const astrazenecaDoses = latestArray.AstraZeneca
        const sinovacDoses = latestArray.Sinovac
        const sinopharmDoses = latestArray.Sinopharm

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

<style lang="scss" scoped>
.vac-type {
  &:after {
    font-size: 12px;
    content: "•";
    margin: 0 5px;
    color: #5f6368;
  }
}
</style>
