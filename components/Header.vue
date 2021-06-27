<template lang="pug">
  div.header.bg-gray-200
    div.container.mx-auto.h-full
      div.px-10.py-6
        div.grid.gap-4.h-full.grid-cols-2
          div
            nuxt-link(to="/")
              h1.title.flex.items-center
                span.border-r-2.border-black.pr-3 {{ title }}
                span.country Thailand
          div.d-flex.justify-end.text-right(class="sm:pt-2")
            a(
              v-for="(link, index) in headLinks"
              :key="link.name"
              :href="link.path"
              :class="headLinks.length !== (index + 1) ? 'pr-6' : ''"
              target="_blank"
              rel="noopener noreferrer"
            ) {{ link.name }}
            //- a(
            //-   v-for="(link, index) in headLinks"
            //-   :key="link.name"
            //-   :class="headLinks.length !== (index + 1) ? 'pr-6' : ''"
            //-   :href="link.path"
            //- ) {{ link.name }}
</template>

<script>
export default {
  data() {
    return {
      title: "Covid19 Vaccination Tracker",
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
  @apply text-3xl font-bold;
}

.country {
  @apply pl-3;
  @apply font-normal;
  font-size: 16px;
  color: #686868;
}
</style>
