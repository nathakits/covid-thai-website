<template lang="pug">
  main.container.mx-auto.h-full
    //- vaccination goal
    div.vaccination-block.container-padding
      div.flex-auto.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Goal
        p 
          | Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          | Aliquam, at elementum, morbi tellus aliquam.
          | Quis etiam tellus cursus arcu vulputate.
      div.flex-auto
        h3(style="height:43px;") 100 Million doses
        div.vac-goal-bar
          div.vac-progress.rounded-full(
            :style="`width:${vacProgress}px;`"
          )
          div.vac-bar
        div.flex.justify-between.pt-3.font-medium
          p.text-base 9,000,000 (+20000)
          p.text-base 2.00% (+0.03%)
    //- vaccination progress
    div.vaccination-block.container-padding
      div.flex-auto.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Progress
        p.pb-3
          | Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          | Aliquam, at elementum, morbi tellus aliquam.
          | Quis etiam tellus cursus arcu vulputate.
        P
          | Thailand Population 2020 cencus: 69million
      div.flex-auto
        //- total bar
        div.total-bar.pb-6
          h3(style="height:43px;") Total
          div.vac-progress-bar
            div.vac-progress.rounded-full(
              :style="`width:${vacProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            p.text-base 9,000,000 (+20000)
            p.text-base 2.00% (+0.03%)
        //- 1st dose
        div.total-bar.pb-6
          h3(style="height:43px;") 1st Dose
          div.vac-progress-bar
            div.vac-progress.rounded-full(
              :style="`width:${vacProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            p.text-base 9,000,000 (+20000)
            p.text-base 2.00% (+0.03%)
        //- 2nd dose
        div.total-bar
          h3(style="height:43px;") 2nd Dose
          div.vac-progress-bar
            div.vac-progress.rounded-full(
              :style="`width:${vacProgress}px;`"
            )
            div.vac-bar
          div.flex.justify-between.pt-3.font-medium
            p.text-base 9,000,000 (+20000)
            p.text-base 2.00% (+0.03%)
    //- vaccination allotment
    div.vaccination-block.container-padding
      div.flex-auto.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Allotment
        p 
          | Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          | Aliquam, at elementum, morbi tellus aliquam.
          | Quis etiam tellus cursus arcu vulputate.
      div.flex-auto
        div.vac-card
          div
          div.sinovac.flex.justify-between
            p Sinovac
            p 5,282,154 Doses
          div.astrazeneca.flex.justify-between
            p AstraZeneca
            p 5,282,154 Doses
          div.border-t.border-black.my-3
          div.total-allotment.flex.justify-between
            p Total
            p 5,282,154 Doses
    //- vaccination approval
    div.vaccination-block.container-padding
      div.flex-auto.pb-4(
        class="lg:pb-0"
      )
        h2.pb-2 Vaccination Approval
        p 
          | Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          | Aliquam, at elementum, morbi tellus aliquam.
          | Quis etiam tellus cursus arcu vulputate.
      div.flex-auto
        div.vac-card
          div.flex.justify-between(
            v-for="vac in vacApproval"
            :class="`${vac.name.split(' ').join('-').toLowerCase()} ${vac.status !== 'Approved' ? 'text-gray-400' : ''}`"
          )
            p {{ vac.name }}
            p {{ vac.status }}

</template>

<script>
export default {
  data() {
    return {
      vacProgress: 20,
      vacAllotment: [],
      vacApproval: [
        {
          name: "Sinovac",
          status: "Approved",
        },
        {
          name: "AstraZeneca",
          status: "Approved",
        },
        {
          name: "Moderna",
          status: "Approved",
        },
        {
          name: "Sinopharm",
          status: "Approved",
        },
        {
          name: "Sputnik V",
          status: "-",
        },
      ],
    }
  },
}
</script>

<style scoped lang="scss">
.vaccination-block {
  @apply flex flex-wrap space-x-0 lg:space-x-4;
}
.vaccination-block {
  div.flex-auto:first-child {
    @apply md:max-w-sm lg:max-w-md;
  }
}
.vac-goal-bar,
.vac-progress-bar {
  @apply w-full relative rounded-full;
  height: 16px;
}
.vac-progress {
  @apply absolute z-10;
  background-color: red;
  height: 16px;
}
.vac-bar {
  @apply w-full absolute rounded-full;
  background-color: #dbdbdb;
  height: 16px;
}
.vac-card {
  @apply shadow-lg h-full w-full border rounded-lg p-6;
}
.vac-card p {
  @apply text-base font-medium;
}
</style>
