<template lang="pug">
div(style="background-color:rgba(6,1,70,0.2);")
  div.container.mx-auto.h-full
    div.vaccination-goal
      div.grid.grid-cols-8.container-padding(
        class="gap-4 sm:gap-4 md:gap-4"
      )
        div.rounded-md.bg-white.p-4.shadow-md.col-span-4(
          v-for="(item, index) in mapArray"
          class="md:col-span-2"
        )
          div.w-full
            span.font-medium.text-sm.text-gray-900(class="lg:text-base") {{ item.name }}
          div.flex.flex-col.justify-between.pt-2
            h2.text-xl.font-bold(
              class="lg:text-3xl"
              style="color:#090076;"
            ) {{ item.total }}
            div.w-full.border-b.my-2
            div.flex.justify-between.items-end(style="min-height:48px;")
              div
                div.text-sm.font-medium.text-gray-500 Daily
                div.flex.items-center.gap-2
                  plus-icon(style="opacity:0.6;")
                  span.text-base.font-bold.text-gray-900 {{ item.daily }}
              div
                span.text-sm.font-medium.text-gray-500(
                  v-if="item.percent"
                ) Population
                div.flex.items-center(
                  :class="item.percent ? 'gap-2' : ''"
                )
                  template(v-if="item.percent")
                    arrow-up(style="opacity:0.6;")
                  div.font-bold {{ item.percent }}
</template>

<script>
import { mapGetters } from "vuex"

export default {
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      array: [
        {
          name: "1st Dose Total",
          total: this.data.people_vaccinated,
          daily: this.data.first_dose_plus,
        },
        {
          name: "2nd Dose Total",
          total: this.data.people_fully_vaccinated,
          daily: this.data.second_dose_plus,
        },
        {
          name: "3rd Dose Total",
          total: this.data.booster_vaccinated,
          daily: this.data.third_dose_plus,
        },
        {
          name: "Total Dose",
          total: this.data.total_vaccinations,
          daily: this.data.total_dose_plus,
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      population: "thPopulation",
    }),
    mapArray() {
      if (this.data) {
        const dailyfirst = this.data.first_dose_plus.replace(/,/g, "")
        const dailysecond = this.data.second_dose_plus.replace(/,/g, "")
        const dailythird = this.data.third_dose_plus.replace(/,/g, "")
        const firstPercentage = (dailyfirst / this.population) * 100
        const secondPercentage = (dailysecond / this.population) * 100
        const thirdPercentage = (dailythird / this.population) * 100

        const arr = this.array.map((d) => {
          let obj = {}
          if (d.name === "1st Dose Total") {
            obj = {
              name: d.name,
              total: d.total,
              daily: d.daily,
              percent: this.formatDecimal(firstPercentage),
            }
          } else if (d.name === "2nd Dose Total") {
            obj = {
              name: d.name,
              total: d.total,
              daily: d.daily,
              percent: this.formatDecimal(secondPercentage),
            }
          } else if (d.name === "3rd Dose Total") {
            obj = {
              name: d.name,
              total: d.total,
              daily: d.daily,
              percent: this.formatDecimal(thirdPercentage),
            }
          } else {
            obj = {
              name: d.name,
              total: d.total,
              daily: d.daily,
              percent: "",
            }
          }
          return obj
        })
        return arr
      } else {
        return 0
      }
    },
  },
  methods: {
    formatDecimal(num) {
      if (num > 0.0099) {
        const formatted = num.toFixed(2)
        return `${formatted}%`
      } else {
        const formatted = num.toFixed(3)
        return `${formatted}%`
      }
    },
  },
}
</script>
