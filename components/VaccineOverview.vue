<template lang="pug">
div(style="background-color:rgba(6,1,70,0.2);")
  div.container.mx-auto.h-full
    div.vaccination-goal
      div.grid.grid-cols-8.container-padding(
        class="gap-4 sm:gap-4 md:gap-4"
      )
        div.rounded-md.bg-white.p-4.shadow-md.col-span-4(
          v-for="(item, index) in array"
          class="md:col-span-2"
        )
          div.rounded.bg-dark-blue.text-white.px-2.py-1.w-full
            span.text-sm(class="lg:text-base") {{ item.name }}
          div.flex.flex-col.justify-between.pt-2
            h2.text-xl.font-bold(
              class="lg:text-2xl"
              style="color:#090076;"
            ) {{ item.total }}
            div.w-full.border-b.my-2
            div.text-sm.flex.justify-between.items-end
              div.dark-blue
                div.font-bold Daily
                span {{ item.daily }}
              div.pr-2.pl-2.pb-1
                div
                  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11.3335 0.333984C9.1579 0.333984 7.03117 0.979123 5.22223 2.18782C3.41329 3.39651 2.00339 5.11448 1.17083 7.12446C0.338262 9.13445 0.120426 11.3462 0.544863 13.48C0.9693 15.6138 2.01695 17.5738 3.55533 19.1122C5.0937 20.6505 7.05372 21.6982 9.18751 22.1226C11.3213 22.5471 13.533 22.3292 15.543 21.4967C17.553 20.6641 19.271 19.2542 20.4797 17.4453C21.6884 15.6363 22.3335 13.5096 22.3335 11.334C22.3335 8.4166 21.1746 5.61871 19.1117 3.55581C17.0488 1.49291 14.2509 0.333984 11.3335 0.333984V0.333984ZM16.8335 11.0384C16.6498 11.2181 16.403 11.3187 16.146 11.3187C15.889 11.3187 15.6422 11.2181 15.4585 11.0384L12.296 7.89648V17.6177C12.296 17.873 12.1946 18.1178 12.0141 18.2983C11.8336 18.4788 11.5888 18.5802 11.3335 18.5802C11.0782 18.5802 10.8334 18.4788 10.6529 18.2983C10.4724 18.1178 10.371 17.873 10.371 17.6177V7.99273L7.32537 11.0384C7.14304 11.2207 6.89574 11.3231 6.63787 11.3231C6.38001 11.3231 6.13271 11.2207 5.95037 11.0384C5.76804 10.856 5.6656 10.6087 5.6656 10.3509C5.6656 10.093 5.76804 9.84569 5.95037 9.66336L11.3885 4.25273L16.8335 9.67711C16.9229 9.76648 16.9938 9.87259 17.0422 9.98938C17.0905 10.1062 17.1154 10.2313 17.1154 10.3577C17.1154 10.4841 17.0905 10.6093 17.0422 10.7261C16.9938 10.8429 16.9229 10.949 16.8335 11.0384Z" fill="#219653"/>
                  </svg>
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
}
</script>
