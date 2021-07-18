<template lang="pug">
div.vaccination-block.container-padding
  div.pb-4(
    class="lg:pb-0"
  )
    h2.pb-2 Vaccination Allotment
    p 
      | Sinovac and Astrazenca is handled by the CCSA
    p
      | *Note: Sinopharm is distributed by the Chulabhorn Royal Academy (CRA)
  div
    div.vac-card
      div
      div.sinovac.flex.justify-between
        p Sinovac
        p {{ dailyJSON.sinovac }} Doses
      div.astrazeneca.flex.justify-between
        p AstraZeneca
        p {{ dailyJSON.astrazeneca }} Doses
      div.sinopharm.flex.justify-between.text-gray-400
        p Sinopharm*
        p -
      div.border-t.border-black.my-3
      div.total-allotment.flex.justify-between
        p Total
        p {{ totalVacAllotment }} Doses
</template>

<script>
export default {
  data() {
    return {
      vacAllotment: [],
    }
  },
  mounted() {
    this.calcVacAllotment()
  },
  methods: {
    calcVacAllotment() {
      const sinovac = this.dailyJSON.sinovac.replaceAll(",", "")
      const astra = this.dailyJSON.astrazeneca.replaceAll(",", "")
      const total = Number(sinovac) + Number(astra)
      console.log(total)
      this.totalVacAllotment = Number(total).toLocaleString()
    },
  },
}
</script>
