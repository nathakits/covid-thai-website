<template lang="pug">
div.bg-gray-200
  div.container.mx-auto.h-full
    div.container-padding
      div
        h3.pb-2 Disclaimer
        p.pb-3.font-medium
          | No affiliation with any government entity
        p
          | Attempts are made to retrieve data from aforementioned sources daily but is not guaranteed to be up to date.
        p
          | Consult your local health department for the most up-to-date information.
</template>

<style lang="scss" scoped>
.container-padding {
  @apply grid grid-cols-8 gap-4 sm:gap-10 md:gap-20;

  div:first-child {
    @apply col-span-full sm:col-span-4 md:col-span-3;
  }
}
</style>
