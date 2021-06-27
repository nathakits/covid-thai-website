<template lang="pug">
  div.header.bg-gray-200
    div.container.mx-auto.h-full
      div.header-padding
        div.grid.gap-4.h-full.grid-cols-1(
          class="sm:grid-cols-2"
        )
          div.flex.justify-center(
            class="sm:justify-start"
          )
            nuxt-link(
              to="/"
              class="hover:no-underline hover:text-black"
            )
              h1.title.flex.items-center
                span.border-r-2.border-black.pr-3 {{ title }}
                span.country Thailand
          div.flex.justify-center.text-right(
            class="sm:pt-2 sm:justify-end"
          )
            a(
              v-for="(link, index) in headLinks"
              :key="link.name"
              :href="link.path"
              :class="headLinks.length !== (index + 1) ? 'pr-6' : ''"
              target="_blank"
              rel="noopener noreferrer"
            ) {{ link.name }}
</template>

<script>
export default {
  data() {
    return {
      title: "Covid-19 Tracker",
      headLinks: [
        { name: "Twitter Bot", path: "https://twitter.com/THVaccinecount" },
        {
          name: "Gituhub",
          path: "https://github.com/nathakits/covid-thai-website",
        },
        { name: "Support", path: "https://ko-fi.com/nathakits" },
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
