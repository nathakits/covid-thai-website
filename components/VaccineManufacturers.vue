<template lang="pug">
div.vaccination-manufacturers
  div.date-padding
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
        div.card-item-padding.grid.grid-cols-2.gap-8(
          v-for="vac in manufacturers"
          :class="`${vac.name.split(' ').join('-').toLowerCase()} ${vac.status !== 'Approved' ? 'text-gray-400' : ''}`"
        )
          div
            div.text-sm.font-semibold {{ vac.name }}
            div
              span.text-sm.text-gray-400.vac-type {{ vac.type }}
              span.text-sm.text-gray-400.vac-status {{ vac.status }}
          span.text-sm.flex.justify-end.items-center.font-semibold(:class="`${vac.status === 'Approved' ? 'text-gray-900' : ''}`") {{ vac.doses_administered.toLocaleString() }} 
</template>

<script>
export default {
  data() {
    return {
      data: [],
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
      "https://raw.githubusercontent.com/porames/the-researcher-covid-bot/master/components/gis/data/manufacturer-vaccination-data.json"
    )
  },
  computed: {
    manufacturers() {
      if (!this.$fetchState.pending) {
        const reducer = (accumulator, currentValue) =>
          accumulator + currentValue
        // filter array by manufacturers
        const sinovac = this.filterVaccines(this.data, "Sinovac Life Sciences")
        const astrazeneca = this.filterVaccines(this.data, "AstraZeneca")
        const sinopharm = this.filterVaccines(this.data, "Sinopharm")
        // map by doses administered
        const sinovacMap = sinovac.map((d) => d.doses_administered)
        const astrazenecaMap = astrazeneca.map((d) => d.doses_administered)
        const sinopharmMap = sinopharm.map((d) => d.doses_administered)
        // add up all the doses administered
        const sinovacDoses = sinovacMap.reduce(reducer)
        const astrazenecaDoses = astrazenecaMap.reduce(reducer)
        const sinopharmDoses = sinopharmMap.reduce(reducer)
        // map doses to array
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
        // sort by doses administered
        vaccineArr.sort((a, b) => b.doses_administered - a.doses_administered)
        return vaccineArr
      } else {
        return []
      }
    },
    getLastUpdated() {
      if (!this.$fetchState.pending) {
        const data = this.data
        const latest = data.pop()
        const date = latest.date.split("-")
        console.log(latest)
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
