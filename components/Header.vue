<template lang="pug">
  div.header
    aside.shadow.h-full.nav-drawer.bg-white.text-gray-900.p-4(
      style="transform:translateX(100%);"
    )
      div.flex.justify-end.items-end
        svg.cursor-pointer(
          id="menuCloseIcon"
          style="width:24px;height:24px" viewBox="0 0 24 24"
          @click="menuOpen = false"
        )
          path(fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z")
      h3.pt-2 Covid-19 Vaccine Tracker
      div.border-b.my-3
      div.flex.flex-col.gap-4
        a.pr-6.text-sm(
          v-for="(link, index) in headLinks"
          :key="link.name"
          :href="link.path"
          target="_blank"
          rel="noopener noreferrer"
        )
          span {{ link.name }}
        a.button.ko-fi.flex.items-center(
          href="https://ko-fi.com/nathakits"
          target="_blank"
          rel="noopener noreferrer"
        ) 
          div.inline-block(style="width:18px;height:18px;")
            <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32">
              <path fill="white" d="M31.844 11.932c-1.032-5.448-6.48-6.125-6.48-6.125h-24.4c-0.808 0-0.907 1.063-0.907 1.063s-0.109 9.767-0.027 15.767c0.22 3.228 3.448 3.561 3.448 3.561s11.021-0.031 15.953-0.067c3.251-0.568 3.579-3.423 3.541-4.98 5.808 0.323 9.896-3.776 8.871-9.219zM17.093 16.615c-1.661 1.932-5.348 5.297-5.348 5.297s-0.161 0.161-0.417 0.031c-0.099-0.073-0.14-0.12-0.14-0.12-0.595-0.588-4.491-4.063-5.381-5.271-0.943-1.287-1.385-3.599-0.119-4.948 1.265-1.344 4.005-1.448 5.817 0.541 0 0 2.083-2.375 4.625-1.281 2.536 1.095 2.443 4.016 0.963 5.751zM25.323 17.251c-1.24 0.156-2.244 0.036-2.244 0.036v-7.573h2.359c0 0 2.631 0.735 2.631 3.516 0 2.552-1.313 3.557-2.745 4.021z"/>
            </svg>
          span.pl-2 Sponsor
    div.drawer-scrim(
      @click="menuOpen = false"
      style="opacity:0;display:none;"
    )
    div.container.mx-auto.h-full
      div.header-padding
        div.flex.flex-wrap.justify-between.gap-4.h-full
          div.flex.justify-center.items-center(
            class="sm:justify-start"
          )
            nuxt-link(
              to="/"
              class="hover:no-underline hover:text-black"
            )
              h1.title.flex.items-center
                span.border-r-2.border-white.pr-3 {{ title }}
                span.country Thailand
          div.justify-center.text-right.items-center.hidden(
            class="sm:pt-2 md:pt-0 sm:justify-end lg:flex"
          )
            a.pr-6.text-sm(
              v-for="(link, index) in headLinks"
              :key="link.name"
              :href="link.path"
              target="_blank"
              rel="noopener noreferrer"
            )
              span {{ link.name }}
            a.button.ko-fi.flex.items-center(
              href="https://ko-fi.com/nathakits"
              target="_blank"
              rel="noopener noreferrer"
            ) 
              div.inline-block(style="width:18px;height:18px;")
                <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 32 32">
                  <path fill="white" d="M31.844 11.932c-1.032-5.448-6.48-6.125-6.48-6.125h-24.4c-0.808 0-0.907 1.063-0.907 1.063s-0.109 9.767-0.027 15.767c0.22 3.228 3.448 3.561 3.448 3.561s11.021-0.031 15.953-0.067c3.251-0.568 3.579-3.423 3.541-4.98 5.808 0.323 9.896-3.776 8.871-9.219zM17.093 16.615c-1.661 1.932-5.348 5.297-5.348 5.297s-0.161 0.161-0.417 0.031c-0.099-0.073-0.14-0.12-0.14-0.12-0.595-0.588-4.491-4.063-5.381-5.271-0.943-1.287-1.385-3.599-0.119-4.948 1.265-1.344 4.005-1.448 5.817 0.541 0 0 2.083-2.375 4.625-1.281 2.536 1.095 2.443 4.016 0.963 5.751zM25.323 17.251c-1.24 0.156-2.244 0.036-2.244 0.036v-7.573h2.359c0 0 2.631 0.735 2.631 3.516 0 2.552-1.313 3.557-2.745 4.021z"/>
                </svg>
              span.pl-2 Sponsor
          div.flex.justify-between.items-center(
            class="lg:hidden"
          )
            div.menu.cursor-pointer(@click="menuOpen = !menuOpen")
              <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 12H18V10H0V12ZM0 7H18V5H0V7ZM0 0V2H18V0H0Z" fill="white"/>
              </svg>
            
</template>

<script>
export default {
  data() {
    return {
      title: "Covid-19 Vaccine Tracker",
      menuOpen: false,
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
  watch: {
    menuOpen(state) {
      const asideEl = document.querySelector("aside")
      const navEl = document.querySelector(".nav-drawer")
      const scrimEl = document.querySelector(".drawer-scrim")
      if (state === true) {
        navEl.style.transform = "translateX(0)"
        asideEl.insertAdjacentElement("afterend", scrimEl)
        scrimEl.style.display = "block"
        setTimeout(() => {
          scrimEl.style.opacity = "0.46"
        }, 25)
      } else {
        navEl.style.transform = "translateX(100%)"
        scrimEl.style.opacity = "0"
        setTimeout(() => {
          scrimEl.style.display = "none"
        }, 200)
      }
      this.$store.commit("menuState", state)
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  color: #fafafa;
  background-color: #040133;
  a {
    &:hover:not(.button) {
      @apply hover:no-underline hover:text-blue-400;
    }
    h1 {
      @apply hover:no-underline hover:text-white;
    }
  }
}

.title {
  @apply text-2xl font-bold;
}

.country {
  @apply pl-3;
  @apply font-normal;
  font-size: 16px;
}

.nav-drawer {
  width: 280px;
  position: fixed;
  z-index: 80;
  top: 0;
  right: 0;
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: transform, visibility, width;
}
</style>

<style lang="scss">
.drawer-scrim {
  opacity: 0;
  position: fixed;
  height: 100%;
  width: 100%;
  z-index: 70;
  background-color: rgb(33, 33, 33);
  transition-duration: 200ms;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: opacity;
}
</style>
