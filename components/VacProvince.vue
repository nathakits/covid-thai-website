<template lang="pug">
div.vaccine-province
  div.date-padding.dark-blue.pt-6
    div.last-updated {{ `Last updated: ${getLastUpdated}` }}
  div.container-padding.table-container.w-full
    div.grid.grid-cols-8.gap-4(class="sm:gap-10 md:gap-20")
      div.col-span-full(class="md:col-span-3")
        h2.pb-2 Vaccination by Province
        p
          | This table s sorted by provinces with the most fully vaccinated population.
        p 
          | Click on 
          strong Show All
          |  to expand the table and show all the other provinces.
        p
          | Hover over the 
          strong Info
          |  icon to view the population figure.
    div.pb-4.pt-6.flex.justify-start(class="md:justify-end")
      template(v-if="provinces.length === 10")
        button.button(
          title="Show all items in the table"
          @click="showMore()"
        ) Show all
      template(v-else)
        button.button(
          title="Show less items in the table"
          @click="showLess()"
        ) Show Less
    div.border.rounded-lg.shadow-lg.overflow-x-auto
      table.w-full
        thead.border-b.border-gray-300
          tr
            th.text-xs.text-center(
              v-for="head in header"
              class="sm:text-sm"
            ) {{ head }}
        tbody
          tr(v-for="p in provinces")
            td.text-xs.font-bold.border-r.text-center(class="sm:text-sm")
              div.flex.gap-3.items-center
                span.text-left {{ p.name }}
                div(:title="`${p.name} population - ${p.population}`")
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 0C3.584 0 0 3.584 0 8C0 12.416 3.584 16 8 16C12.416 16 16 12.416 16 8C16 3.584 12.416 0 8 0ZM8.8 12H7.2V7.2H8.8V12ZM8.8 5.6H7.2V4H8.8V5.6Z" fill="#6881D8"/>
                  </svg>
            //- td.text-xs(class="sm:text-sm px-6")
            td.text-xs.w-auto.font-medium.text-center(class="sm:text-sm md:w-32") {{ p.total_1dose }}
            td.text-xs.w-auto.font-medium.text-center(class="sm:text-sm md:w-32") {{ p.total_2dose }}
            td.text-xs.w-auto.font-medium.border-r.text-center(class="sm:text-sm md:w-32") {{ p.total_3dose }}
            td.text-xs.w-auto.font-bold.text-center(
              class="sm:text-sm md:w-44"
              :title="`${p.name} population - ${p.population}`"
            ) {{ `${p.fully_vaccinated}%` }}
</template>

<script>
import dayjs from "dayjs"

export default {
  data() {
    return {
      data: {},
      numProvinces: 10,
      header: ["", "1st Dose", "2nd Dose", "3rd Dose", "Fully Vaccinated"],
      province_th_map: {
        Bangkok: "กรุงเทพมหานคร",
        Amnat_Charoen: "อำนาจเจริญ",
        Ang_Thong: "อ่างทอง",
        Bueng_Kan: "บึงกาฬ",
        Buriram: "บุรีรัมย์",
        Chachoengsao: "ฉะเชิงเทรา",
        Chai_Nat: "ชัยนาท",
        Chaiyaphum: "ชัยภูมิ",
        Chanthaburi: "จันทบุรี",
        Chiang_Mai: "เชียงใหม่",
        Chiang_Rai: "เชียงราย",
        Chonburi: "ชลบุรี",
        Chumphon: "ชุมพร",
        Kalasin: "กาฬสินธุ์",
        Kamphaeng_Phet: "กำแพงเพชร",
        Kanchanaburi: "กาญจนบุรี",
        Khon_Kaen: "ขอนแก่น",
        Krabi: "กระบี่",
        Lampang: "ลำปาง",
        Lamphun: "ลำพูน",
        Loei: "เลย",
        Lopburi: "ลพบุรี",
        Mae_Hong_Son: "แม่ฮ่องสอน",
        Maha_Sarakham: "มหาสารคาม",
        Mukdahan: "มุกดาหาร",
        Nakhon_Nayok: "นครนายก",
        Nakhon_Pathom: "นครปฐม",
        Nakhon_Phanom: "นครพนม",
        Nakhon_Ratchasima: "นครราชสีมา",
        Nakhon_Sawan: "นครสวรรค์",
        Nakhon_Si_Thammarat: "นครศรีธรรมราช",
        Nan: "น่าน",
        Narathiwat: "นราธิวาส",
        Nong_Bua_Lamphu: "หนองบัวลำภู",
        Nong_Khai: "หนองคาย",
        Nonthaburi: "นนทบุรี",
        Pathum_Thani: "ปทุมธานี",
        Pattani: "ปัตตานี",
        Phang_Nga: "พังงา",
        Phatthalung: "พัทลุง",
        Phayao: "พะเยา",
        Phetchabun: "เพชรบูรณ์",
        Phetchaburi: "เพชรบุรี",
        Phichit: "พิจิตร",
        Phitsanulok: "พิษณุโลก",
        Phra_Nakhon_Si_Ayutthaya: "พระนครศรีอยุธยา",
        Phrae: "แพร่",
        Phuket: "ภูเก็ต",
        Prachinburi: "ปราจีนบุรี",
        Prachuap_Khiri_Khan: "ประจวบคีรีขันธ์",
        Ranong: "ระนอง",
        Ratchaburi: "ราชบุรี",
        Rayong: "ระยอง",
        Roi_Et: "ร้อยเอ็ด",
        Sa_Kaeo: "สระแก้ว",
        Sakon_Nakhon: "สกลนคร",
        Samut_Prakan: "สมุทรปราการ",
        Samut_Sakhon: "สมุทรสาคร",
        Samut_Songkhram: "สมุทรสงคราม",
        Saraburi: "สระบุรี",
        Satun: "สตูล",
        Sing_Buri: "สิงห์บุรี",
        Sisaket: "ศรีสะเกษ",
        Songkhla: "สงขลา",
        Sukhothai: "สุโขทัย",
        Suphan_Buri: "สุพรรณบุรี",
        Surat_Thani: "สุราษฎร์ธานี",
        Surin: "สุรินทร์",
        Tak: "ตาก",
        Trang: "ตรัง",
        Trat: "ตราด",
        Ubon_Ratchathani: "อุบลราชธานี",
        Udon_Thani: "อุดรธานี",
        Uthai_Thani: "อุทัยธานี",
        Uttaradit: "อุตรดิตถ์",
        Yala: "ยะลา",
        Yasothon: "ยโสธร",
      },
      province_population: {
        Bangkok: "7699175",
        Amnat_Charoen: "379995",
        Ang_Thong: "292159",
        Bueng_Kan: "425427",
        Buriram: "1587359",
        Chachoengsao: "750784",
        Chai_Nat: "335049",
        Chaiyaphum: "ชัยภูมิ",
        Chanthaburi: "1134867",
        Chiang_Mai: "1729353",
        Chiang_Rai: "1172648",
        Chonburi: "2047622",
        Chumphon: "543683",
        Kalasin: "978299",
        Kamphaeng_Phet: "725873",
        Kanchanaburi: "848454",
        Khon_Kaen: "1837005",
        Krabi: "503538",
        Lampang: "731573",
        Lamphun: "417225",
        Loei: "640283",
        Lopburi: "760478",
        Mae_Hong_Son: "245764",
        Maha_Sarakham: "957365",
        Mukdahan: "351257",
        Nakhon_Nayok: "271739",
        Nakhon_Pathom: "1125350",
        Nakhon_Phanom: "724861",
        Nakhon_Ratchasima: "2692890",
        Nakhon_Sawan: "1059708",
        Nakhon_Si_Thammarat: "1575117",
        Nan: "477862",
        Narathiwat: "805356",
        Nong_Bua_Lamphu: "523861",
        Nong_Khai: "519027",
        Nonthaburi: "1609192",
        Pathum_Thani: "1533781",
        Pattani: "743054",
        Phang_Nga: "286339",
        Phatthalung: "528207",
        Phayao: "468292",
        Phetchabun: "992791",
        Phetchaburi: "502827",
        Phichit: "536012",
        Phitsanulok: "1050000",
        Phra_Nakhon_Si_Ayutthaya: "921047",
        Phrae: "441310",
        Phuket: "547584",
        Prachinburi: "579651",
        Prachuap_Khiri_Khan: "578094",
        Ranong: "228507",
        Ratchaburi: "918674",
        Rayong: "966932",
        Roi_Et: "1307158",
        Sa_Kaeo: "586286",
        Sakon_Nakhon: "1145848",
        Samut_Prakan: "1931727",
        Samut_Sakhon: "953167",
        Samut_Songkhram: "204018",
        Saraburi: "720145",
        Satun: "331057",
        Sing_Buri: "214665",
        Sisaket: "1460182",
        Songkhla: "1487320",
        Sukhothai: "596902",
        Suphan_Buri: "850709",
        Surat_Thani: "1144090",
        Surin: "1392583",
        Tak: "589901",
        Trang: "659636",
        Trat: "249458",
        Ubon_Ratchathani: "1880468",
        Udon_Thani: "1565740",
        Uthai_Thani: "334270",
        Uttaradit: "455259",
        Yala: "547993",
        Yasothon: "535512",
      },
    }
  },
  async fetch() {
    // https://raw.githubusercontent.com/wiki/djay/covidthailand/vaccinations.csv
    this.data = await this.$axios.$get(
      "https://raw.githubusercontent.com/wiki/porames/the-researcher-covid-data/vaccination/provincial-vaccination.json"
    )
  },
  computed: {
    provinces() {
      if (!this.$fetchState.pending) {
        const prov = this.data.data
        const provArray = prov.map((d) => {
          let provinceName = ""
          let provincePopulation = ""
          // match thai and english province names
          for (const [key, value] of Object.entries(this.province_th_map)) {
            if (value === d.province) {
              provinceName = key
            }
          }
          // match province name to population
          for (const [key, value] of Object.entries(this.province_population)) {
            if (key === provinceName) {
              provincePopulation = value
            }
          }
          // calculate fully vaccinated percentage
          const populationPercentage =
            (d.total_2nd_dose / provincePopulation) * 100
          // map to new object
          const obj = {
            name: provinceName.replace(/_/g, " "),
            population: Number(provincePopulation).toLocaleString(),
            total_1dose: d.total_1st_dose.toLocaleString(),
            total_2dose: d.total_2nd_dose.toLocaleString(),
            total_3dose: d.total_3rd_dose.toLocaleString(),
            totalDose: d.total_1st_dose + d.total_2nd_dose + d.total_3rd_dose,
            fully_vaccinated: populationPercentage.toFixed(1),
          }
          return obj
        })
        // sort by total dose
        provArray.sort((a, b) => b.fully_vaccinated - a.fully_vaccinated)
        // show only 10 provinces
        const slicedArr = provArray.slice(0, this.numProvinces)
        return slicedArr
      } else {
        return []
      }
    },
    getLastUpdated() {
      if (!this.$fetchState.pending) {
        const date = new Date(this.data.update_date)
        const format = dayjs(date).format("DD/MM/YYYY")
        return format
      } else {
        return ``
      }
    },
  },
  methods: {
    showMore() {
      // when this function is clicked
      // the computed function will automatically run
      // updating the array
      this.numProvinces = 77
    },
    showLess() {
      this.numProvinces = 10
    },
  },
}
</script>

<style lang="scss">
.vaccine-province {
  table {
    tr {
      th:first-child {
        border-top-left-radius: 8px;
      }
      th:last-child {
        border-top-right-radius: 8px;
      }
    }
    tr:last-child {
      td:first-child {
        border-bottom-left-radius: 8px;
      }
      td:last-child {
        border-bottom-right-radius: 8px;
      }
    }
  }
  thead,
  tbody {
    background-color: #f7f7f7;
  }
  tbody tr:not(:last-child) td {
    border-bottom: 1px solid #d1d5db;
  }
  td,
  th {
    @apply py-3 px-2 md:py-4 md:px-6;
  }
}
</style>
