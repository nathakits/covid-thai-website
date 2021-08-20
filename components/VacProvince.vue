<template lang="pug">
div.vaccine-province
  div.date-padding.dark-blue.pt-6
    div.last-updated {{ `Last updated: ${data.update_date}` }}
  div.vaccination-block.container-padding
    div.explainer.pb-4(
      class="lg:pb-0"
    )
      h2.pb-2 Province
      p
        | This table is sorted by provinces with the most vaccination.
    div.progress-bar
  div.container-padding.table-container.w-full
    table.w-full
      thead.border-b.border-gray-300
        tr
          th.text-sm(v-for="head in header")
            | {{ head }}
      tbody
        tr(v-for="p in provinces")
          td.text-xs(class="sm:text-sm font-bold") {{ p.name }}
          td.text-xs(class="sm:text-sm px-6")
          td.text-xs(class="sm:text-sm") {{ p.total_1dose }}
          td.text-xs(class="sm:text-sm") {{ p.total_2dose }}
          td.text-xs(class="sm:text-sm") {{ p.total_3dose }}
          td.text-xs(class="sm:text-sm") {{ p.totalDose.toLocaleString() }}
</template>

<script>
export default {
  data() {
    return {
      data: {},
      header: ["", "", "1st Dose", "2nd Dose", "3rd Dose", "Total"],
      province_th_map: {
        Krabi: "กระบี่",
        Bangkok: "กรุงเทพมหานคร",
        Kanchanaburi: "กาญจนบุรี",
        Kalasin: "กาฬสินธุ์",
        Kamphaengphet: "กำแพงเพชร",
        Khonkaen: "ขอนแก่น",
        Chanthaburi: "จันทบุรี",
        Chachoengsao: "ฉะเชิงเทรา",
        Chonburi: "ชลบุรี",
        Chainat: "ชัยนาท",
        Chaiyaphum: "ชัยภูมิ",
        Chumphon: "ชุมพร",
        Chiangrai: "เชียงราย",
        Chiangmai: "เชียงใหม่",
        Trang: "ตรัง",
        Trat: "ตราด",
        Tak: "ตาก",
        Nakhonnayok: "นครนายก",
        Nakhonpathom: "นครปฐม",
        Nakhonphanom: "นครพนม",
        Nakhonratchasima: "นครราชสีมา",
        Nakhonsithammarat: "นครศรีธรรมราช",
        Nakhonsawan: "นครสวรรค์",
        Nonthaburi: "นนทบุรี",
        Narathiwat: "นราธิวาส",
        Nan: "น่าน",
        Buriram: "บุรีรัมย์",
        Pathumthani: "ปทุมธานี",
        Prachuapkhirikhan: "ประจวบคีรีขันธ์",
        Prachinburi: "ปราจีนบุรี",
        Pattani: "ปัตตานี",
        Ayutthaya: "พระนครศรีอยุธยา",
        Phayao: "พะเยา",
        Phangnga: "พังงา",
        Phatthalung: "พัทลุง",
        Phichit: "พิจิตร",
        Phitsanulok: "พิษณุโลก",
        Phetchaburi: "เพชรบุรี",
        Phetchabun: "เพชรบูรณ์",
        Phrae: "แพร่",
        Phuket: "ภูเก็ต",
        Mahasarakham: "มหาสารคาม",
        Mukdahan: "มุกดาหาร",
        Maehongson: "แม่ฮ่องสอน",
        Yasothon: "ยโสธร",
        Yala: "ยะลา",
        Roiet: "ร้อยเอ็ด",
        Ranong: "ระนอง",
        Rayong: "ระยอง",
        Ratchaburi: "ราชบุรี",
        Lopburi: "ลพบุรี",
        Loei: "เลย",
        Lampang: "ลำปาง",
        Lamphun: "ลำพูน",
        Sisaket: "ศรีสะเกษ",
        Sakonnakhon: "สกลนคร",
        Songkhla: "สงขลา",
        Satun: "สตูล",
        Samutprakan: "สมุทรปราการ",
        Samutsongkhram: "สมุทรสงคราม",
        Samutsakhon: "สมุทรสาคร",
        Sakaeo: "สระแก้ว",
        Saraburi: "สระบุรี",
        Singburi: "สิงห์บุรี",
        Sukhothai: "สุโขทัย",
        Suphanburi: "สุพรรณบุรี",
        Suratthani: "สุราษฎร์ธานี",
        Surin: "สุรินทร์",
        Nongkhai: "หนองคาย",
        Nongbualamphu: "หนองบัวลำภู",
        Angthong: "อ่างทอง",
        Amnatcharoen: "อำนาจเจริญ",
        Udonthani: "อุดรธานี",
        Uttaradit: "อุตรดิตถ์",
        Uthaithani: "อุทัยธานี",
        Ubonratchathani: "อุบลราชธานี",
        Betong: "เบตง",
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
            name: provinceName,
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
        const slicedArr = provArray.slice(0, 15)
        return slicedArr
      } else {
        return []
      }
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
    background-color: #f0f0f0;
  }
  tbody tr:not(:last-child) td {
    border-bottom: 1px solid #d1d5db;
  }
  td,
  th {
    padding: 12px 16px;
  }
  th {
    text-align: start;
  }
}
</style>
