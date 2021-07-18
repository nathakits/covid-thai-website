<template lang="pug">
  div.header.bg-gray-200
    div.container.mx-auto.h-full
      div.header-padding
        div.grid.gap-4.h-full.grid-cols-1(
          class="sm:grid-cols-2"
        )
          div.flex.justify-center.items-center(
            class="sm:justify-start"
          )
            nuxt-link(
              to="/"
              class="hover:no-underline hover:text-black"
            )
              h1.title.flex.items-center
                span.border-r-2.border-black.pr-3 {{ title }}
                span.country Thailand
          div.flex.justify-center.text-right.items-center(
            class="sm:pt-2 sm:justify-end"
          )
            a.pr-6(
              v-for="(link, index) in headLinks"
              :key="link.name"
              :href="link.path"
              target="_blank"
              rel="noopener noreferrer"
            ) {{ link.name }}
            a.button.ko-fi.flex.items-center(
              href="https://ko-fi.com/nathakits"
              target="_blank"
              rel="noopener noreferrer"
            ) 
              div.inline-block(style="width:18px;height:18px;")
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32">
                  <path d="M31.844 11.932c-1.032-5.448-6.48-6.125-6.48-6.125h-24.4c-0.808 0-0.907 1.063-0.907 1.063s-0.109 9.767-0.027 15.767c0.22 3.228 3.448 3.561 3.448 3.561s11.021-0.031 15.953-0.067c3.251-0.568 3.579-3.423 3.541-4.98 5.808 0.323 9.896-3.776 8.871-9.219zM17.093 16.615c-1.661 1.932-5.348 5.297-5.348 5.297s-0.161 0.161-0.417 0.031c-0.099-0.073-0.14-0.12-0.14-0.12-0.595-0.588-4.491-4.063-5.381-5.271-0.943-1.287-1.385-3.599-0.119-4.948 1.265-1.344 4.005-1.448 5.817 0.541 0 0 2.083-2.375 4.625-1.281 2.536 1.095 2.443 4.016 0.963 5.751zM25.323 17.251c-1.24 0.156-2.244 0.036-2.244 0.036v-7.573h2.359c0 0 2.631 0.735 2.631 3.516 0 2.552-1.313 3.557-2.745 4.021z"/>
                </svg>
              span.pl-2 Support Me
            
            
</template>

<script>
export default {
  data() {
    return {
      title: "Covid-19 Tracker",
      headLinks: [
        { name: "Twitter Bot", path: "https://twitter.com/THVaccinecount" },
        {
          name: "Github",
          path: "https://github.com/nathakits/covid-thai-website",
        },
        // { name: "Support Me", path: "https://ko-fi.com/nathakits" },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
.title {
  @apply text-2xl font-bold;
}

.country {
  @apply pl-3;
  @apply font-normal;
  font-size: 16px;
  color: #686868;
}
</style>
