<template lang="pug">
div(style="background-color:#ebeef3;")
  div.container.mx-auto.h-full
    div.vaccination-goal
      div.container-padding.grid.gap-4
        div.grid.grid-cols-8(
          class="gap-4 sm:gap-4 md:gap-4"
        )
          div.rounded-md.bg-white.p-4.shadow-md.col-span-4(
            v-for="(item, index) in mapArray"
            class="md:col-span-2"
          )
            div.w-full
              span.font-bold.text-sm.text-gray-900(class="lg:text-base") {{ item.name }}
            div.flex.flex-col.justify-between.pt-2
              h2.text-xl.font-bold(
                class="lg:text-3xl"
                style="color:#090076;"
              ) {{ item.total }}
              div.w-full.border-b.my-2
              div.flex.flex-wrap.justify-between.gap-2
                div.flex.flex-col.justify-between(style="min-height:48px;")
                  div.text-sm.font-medium.text-gray-500 Doses
                  div.flex.items-center.gap-1
                    plus-icon(style="opacity:0.8;")
                    span.text-base.font-bold.text-gray-900 {{ item.daily }}
                div.flex.flex-col.justify-between(style="min-height:48px;")
                  span.text-sm.font-medium.text-gray-500(
                    v-if="item.percent"
                  ) Population
                  div.flex.items-center(
                    :class="item.percent ? 'gap-1' : ''"
                  )
                    template(v-if="item.percent")
                      arrow-up(style="opacity:0.8;")
                    div.font-bold {{ item.percent }}
        div.grid.grid-cols-8(
          class="gap-4 sm:gap-4 md:gap-4"
        )
          div.rounded-md.bg-white.p-4.shadow-md.col-span-8(
            class="md:col-span-4"
          )
            span.font-bold.text-sm.text-gray-900(class="lg:text-base") Vaccination Progress
            div.progress.py-2
              span.flex.h-4.overflow-hidden.rounded-lg.bg-gray-200.relative
                span.firstDose.absolute.h-full(:style="`width:${firstDosePercentage}%`")
                span.secondDose.absolute.h-full(:style="`width:${secondDosePercentage}%`")
                span.thirdDose.absolute.h-full(:style="`width:${thirdDosePercentage}%`")
                //- span.bg-gray-200(class="w-4/12")
            div.legend.flex.flex-wrap.gap-x-4.gap-y-1.pt-1
              div.flex.items-center
                span.dot.firstDose
                span.text-sm.font-medium
                  | 1st Dose - 
                  strong {{ `${firstDosePercentage}%` }}
              div.flex.items-center
                span.dot.secondDose
                span.text-sm.font-medium
                  | 2nd Dose - 
                  strong {{ `${secondDosePercentage}%` }}
              div.flex.items-center
                span.dot.thirdDose
                span.text-sm.font-medium
                  | 3rd Dose - 
                  strong {{ `${thirdDosePercentage}%` }}
          div.rounded-md.bg-white.p-4.shadow-md.col-span-8(
            class="md:col-span-4"
          )
            div
              div.flex.justify-between.items-center.flex-wrap.gap-2
                div.flex.items-center.gap-2
                  span.font-bold.text-sm.text-gray-900(class="lg:text-base")
                    | 100 Doses Goal
                span.text-sm.font-medium.pt-1.text-gray-500 Fully Vaccinated
              div.progress.py-2
                span.flex.h-4.overflow-hidden.rounded-lg.bg-gray-200
                  span.goalBar(:style="`width:${popGoal}%`")
              div.flex.justify-between.items-center.flex-wrap.gap-2
                span.text-sm.font-medium.text-gray-800.pt-1 % of 100 Million Doses
                span.text-sm.font-bold {{ `${popGoal}%` }}
</template>

<script>
import { mapGetters } from "vuex"

export default {
  props: {
    daily: {
      type: Object,
      default: () => {},
    },
    all: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      array: [
        {
          name: "1st Dose Total",
          total: "",
          daily: "",
        },
        {
          name: "2nd Dose Total",
          total: "",
          daily: "",
        },
        {
          name: "3rd Dose Total",
          total: "",
          daily: "",
        },
        {
          name: "Total Dose",
          total: "",
          daily: "",
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      population: "thPopulation",
      popGoal100: "popGoal100",
    }),
    latestData() {
      if (this.all) {
        return this.all[this.all.length - 1]
      } else {
        return {}
      }
    },
    popGoal() {
      if (this.all) {
        const latest = this.latestData
        const goal = ((latest.second_dose_cum / this.popGoal100) * 100).toFixed(
          2
        )
        return goal
      } else {
        return 0
      }
    },
    firstDosePercentage() {
      if (this.all) {
        const latest = this.latestData
        return ((latest.first_dose_cum / this.population) * 100).toFixed(2)
      } else {
        return 0
      }
    },
    secondDosePercentage() {
      if (this.all) {
        const latest = this.latestData
        const vaccinated = latest.second_dose_cum
        return ((vaccinated / this.population) * 100).toFixed(2)
      } else {
        return 0
      }
    },
    thirdDosePercentage() {
      if (this.all) {
        const latest = this.latestData
        const vaccinated = latest.third_dose_cum
        return ((vaccinated / this.population) * 100).toFixed(2)
      } else {
        return 0
      }
    },
    mapArray() {
      if (this.all) {
        const latest = this.latestData
        const dailyfirst = latest.first_dose_daily
        const dailysecond = latest.second_dose_daily
        const dailythird = latest.third_dose_daily
        const firstPercentage = (dailyfirst / this.population) * 100
        const secondPercentage = (dailysecond / this.population) * 100
        const thirdPercentage = (dailythird / this.population) * 100

        const arr = this.array.map((d) => {
          let obj = {}
          if (d.name === "1st Dose Total") {
            obj = {
              name: d.name,
              total: latest.first_dose_cum.toLocaleString(),
              daily: dailyfirst.toLocaleString(),
              percent: this.formatDecimal(firstPercentage),
            }
          } else if (d.name === "2nd Dose Total") {
            obj = {
              name: d.name,
              total: latest.second_dose_cum.toLocaleString(),
              daily: dailysecond.toLocaleString(),
              percent: this.formatDecimal(secondPercentage),
            }
          } else if (d.name === "3rd Dose Total") {
            obj = {
              name: d.name,
              total: latest.third_dose_cum.toLocaleString(),
              daily: dailythird.toLocaleString(),
              percent: this.formatDecimal(thirdPercentage),
            }
          } else {
            obj = {
              name: d.name,
              total: latest.total_vaccinations_cum.toLocaleString(),
              daily: latest.total_vaccinations_daily.toLocaleString(),
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

<style lang="scss" scoped>
// legend
.dot {
  display: inline-block;
  border-radius: 50%;
  width: 12px;
  height: 12px;
  margin-right: 8px;
}
.firstDose {
  background-color: rgb(168, 218, 181);
}
.secondDose {
  background-color: rgb(91, 185, 116);
}
.thirdDose {
  background-color: rgb(12, 132, 63);
}
.unvaccinated {
  background-color: rgb(12, 132, 63);
}
.goalBar {
  background-color: rgb(98, 188, 122);
}
</style>
