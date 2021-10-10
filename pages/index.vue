<template lang="pug">
main(style="background-color:#f9fafb;")
  vaccine-overview(:all="fullJSON")
  div.container.mx-auto.h-full
    vaccine-barchart(:data="fullJSON")
    vaccine-trends
    div.border-b.container-margin
    vaccine-target
    div.border-b.container-margin
    vac-province
    div.border-b.container-margin
    vaccine-manufacturers
    div.border-b.container-margin
    vaccine-allocation
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const fullJSON = await $axios.$get(
      "https://nathakits.github.io/covid-tracker-twitter-bot/data/dashboard/national-vacmod-timeseries.json"
    )
    return { fullJSON }
  },
}
</script>
