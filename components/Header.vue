<template lang="pug">
  div.header.bg-gray-200
    div.container.mx-auto.h-full
      div.px-10.py-6
        div.grid.gap-4.h-full.grid-cols-2
          div
            nuxt-link(to="/")
              h1.text-3xl.font-bold.inline-block {{ title }}
          div.d-flex.justify-end.text-right(class="sm:pt-2")
            nuxt-link(
              v-for="(link, index) in headLinks"
              :key="link.name"
              class="hover:underline hover:text-blue-500"
              :class="headLinks.length !== (index + 1) ? 'pr-6' : ''"
              :to="link.path"
            ) {{ link.name }}
</template>

<script>
export default {
  data() {
    return {
      title: "Covid Vaccine",
      headLinks: [
        { name: "Projects", path: "/projects/" },
        // { name: "Photo", path: "/photo/" },
        // { name: "Blog", path: "/blog/" },
        { name: "Info", path: "/info/" },
        { name: "CV", path: "/cv/" },
      ],
    }
  },
}
</script>
