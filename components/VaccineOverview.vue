<template lang="pug">
div(style="background-color:rgba(6,1,70,0.2);")
  div.container.mx-auto.h-full
    div.vaccination-goal
      div.grid.grid-cols-3.container-padding(
        class="gap-4 sm:gap-4 md:gap-6 lg:gap-12 xl:gap-16 sm:grid-cols-9"
      )
        div.rounded-md.bg-white.p-4.shadow-md.col-span-3(
          v-for="(item, index) in array"
        )
          div.rounded.bg-dark-blue.text-white.px-2.py-1.w-max
            span {{ item.name }}
          div.grid.grid-cols-4.justify-between.items-center.pt-2(
            class="sm:flex sm:flex-col lg:flex-row sm:items-start lg:items-center"
          )
            h2.col-span-3 {{ item.total }}
            div.my-0.hidden.w-full(class="sm:block sm:border-b sm:my-2 lg:hidden lg:my-0")
            div.text-sm.flex.items-end
              div.pr-2.pl-2.pb-1.order-1(class="sm:order-2 lg:order-1")
                arrow-up
              div.dark-blue.order-2(class="sm:order-1 lg:order-2")
                div Daily
                span {{ item.daily }}
</template>

<script>
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
          name: "Total Dose",
          total: this.data.total_vaccinations,
          daily: this.data.total_dose_plus,
        },
      ],
    }
  },
}
</script>
