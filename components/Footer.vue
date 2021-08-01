<template lang="pug">
div.bg-footer
  div.container.mx-auto.h-full
    div.container-padding
      div.pt-6(
        :class="checkRoute ? 'border-t' : ''"
      )
        div.flex.flex-col(class="sm:grid sm:grid-cols-3 sm:gap-4 lg:grid-cols-8")
          div.pb-4(class="sm:col-span-1 lg:col-start-1 lg:col-end-3")
            p.font-bold.text-gray-800 Copyright
            p.text-gray-700.text-sm © {{ setCurrentYear }} Nathakit Sae-Tan
          div.pb-4(class="sm:col-span-1 lg:col-start-4 lg:col-end-6")
            p.font-bold.text-gray-800 Contact
            a.text-gray-700.text-sm(
              class="hover:underline hover:text-blue-500"
              href="mailto:nathakit.tan@gmail.com"
              title="email"
            ) nathakit.tan@gmail.com
          div.pb-4(class="sm:col-span-1 lg:col-start-7 lg:col-end-9")
            p.font-bold.text-gray-800 Currently in
            a.text-gray-700.text-sm(
              class="hover:underline hover:text-blue-500"
              href="https://time.is/UTC+7"
              target="_blank"
              rel="noopener noreferrer"
            ) Bangkok (UTC+7)

</template>

<script>
export default {
  computed: {
    setCurrentYear() {
      return new Date().getFullYear()
    },
    checkRoute() {
      if (this.$route.name === "index") {
        return false
      } else {
        return true
      }
    },
  },
}
</script>
