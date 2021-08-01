<template lang="pug">
div.bg-disclaimer.text-white
  div.container.mx-auto.h-full
    div.container-padding.flex.justify-between
      div.col-span-5
        h3.pb-2 About The Data
        p
          | Data are extracted from DDC (Department of Disease Control) daily briefing PDFs.
          | Otherwise the data is manually input in the JSON with scripts to update the other files.
        p.pb-3
          | Some data are from Dylan Jay's COVID Thailand Github repository.
        p Source: 
          a.underline(
            target="_blank"
            rel="noopener noreferrer"
            href="https://ddc.moph.go.th/dcd/pagecontent.php?page=643&dept=dcd"
          ) DDC Daily Reports (Thai)
        p Source: 
          a.underline(
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/djay/covidthailand/"
          ) Dylan Jay Repo
      div.flex.justify-start.col-span-full.pt-4(
        class="sm:col-span-4 md:col-span-5 sm:justify-end sm:pt-0"
      )
        div
          a(
            class="hover:no-underline"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/nathakits/covid-tracker-twitter-bot/tree/main/data"
          )
            div.bg-white.text-gray-800.py-2.px-4.rounded-lg.flex.items-center.gap-2
              div.bg-dark-blue.px-2.py-1.flex.justify-center.items-center.rounded
                div(style="width:14px;height:auto;")
                  <svg width="100%" height="100%" viewBox="0 0 14 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 17.2754H14V15.2754H0V17.2754ZM14 6.27539H10V0.275391H4V6.27539H0L7 13.2754L14 6.27539Z" fill="white"/>
                  </svg>
              span.text-sm All Data
    div.container-padding
      div
        p Attempts are made to retrieve data from aforementioned sources everyday but is not guaranteed to be up to date.
        p
          | If you would like to report any issues or request features please contact me via email.
        p.font-bold No affiliation with any government entity
</template>

<style lang="scss" scoped>
.container-padding {
  @apply grid grid-cols-8 gap-4 sm:gap-10 md:gap-20;

  div:first-child {
    @apply col-span-full sm:col-span-4 md:col-span-3;
  }
}
</style>
