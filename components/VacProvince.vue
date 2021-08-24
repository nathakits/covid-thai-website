<template lang="pug">
div.vaccine-province
  div.date-padding.dark-blue.pt-6
    div.last-updated {{ `Last updated: ${data.update_date}` }}
  div.container-padding.table-container.w-full
    h2.pb-2 Province
    p
      | This table is sorted by provinces with the most vaccination.
    div.py-4
      template(v-if="provinces.length === 6")
        button.button(@click="showMore()") Show all
      template(v-else)
        button.button(@click="showLess()") Show less
    div.border.rounded-lg.shadow-lg
      table.w-full
        thead.border-b.border-gray-300
          tr
            th.text-sm(v-for="head in header")
              | {{ head }}
        tbody
          tr(v-for="p in provinces")
            td.text-xs.font-bold.w-20(class="sm:text-sm md:w-40 lg:w-52 xl:w-72") {{ p.name }}
            //- td.text-xs(class="sm:text-sm px-6")
            td.text-xs(class="sm:text-sm") {{ p.total_1dose }}
            td.text-xs(class="sm:text-sm") {{ p.total_2dose }}
            td.text-xs(class="sm:text-sm") {{ p.total_3dose }}
            td.text-xs(class="sm:text-sm") 0%
</template>

<script>
export default {
  data() {
    return {
      data: {},
      numProvinces: 6,
      header: [
        "",
        "1st Dose",
        "2nd Dose",
        "3rd Dose",
        "% of Population (2 Doses)",
      ],
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
    }
  },
  async fetch() {
    this.data = await this.$axios.$get(
      "https://raw.githubusercontent.com/wiki/porames/the-researcher-covid-data/vaccination/provincial-vaccination.json"
    )
  },
  computed: {
    provinces() {
      if (!this.$fetchState.pending) {
        const prov = this.data.data
        const provArray = prov.map((d) => {
          // match thai and english province names
          let provinceName = ""
          for (const [key, value] of Object.entries(this.province_th_map)) {
            if (value === d.province) {
              provinceName = key
            }
          }
          // map to new object
          const obj = {
            name: provinceName.replace(/_/g, " "),
            population: 0,
            total_1dose: d.total_1st_dose.toLocaleString(),
            total_2dose: d.total_2nd_dose.toLocaleString(),
            total_3dose: d.total_3rd_dose.toLocaleString(),
            totalDose: d.total_1st_dose + d.total_2nd_dose + d.total_3rd_dose,
          }
          return obj
        })
        // sort by total dose
        provArray.sort((a, b) => b.totalDose - a.totalDose)
        // show only 15 provinces
        const slicedArr = provArray.slice(0, this.numProvinces)
        return slicedArr
      } else {
        return []
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
      this.numProvinces = 6
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
    padding: 16px 24px;
  }
  th {
    text-align: start;
  }
}
</style>
