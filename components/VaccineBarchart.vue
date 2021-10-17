<template lang="pug">
div.container-padding
  //- div.flex.justify-end.pb-4
  //-   facebook-share.pr-2
  //-   twitter-share
  div.rounded-md.bg-white.p-6.shadow
    div.flex.flex-col.justify-between.flex-wrap.gap-4(
      class="sm:flex-row"
    )
      div.order-2(class="sm:order-1")
        h2.pb-2 Vaccination Progress
      div.order-1(class="sm:order-2")
        div.flex.justify-start.dark-blue(class="sm:justify-end")
          div.last-updated.dark-blue {{ `Last updated: ${getLastUpdated}` }}
    div.grid-block
      div.block.pb-4
        p.text-gray-500
          | This chart shows how many people have received vaccine since the start of vaccination program in Thailand.
        p.text-gray-500 People who are fully vaccinated may have received more than one dose.
    div
      div.flex.justify-between.items-center.flex-wrap.gap-4.pb-6
        div.flex.text-gray-500
          div.mr-4.cursor-pointer(
            :class="selected === `Cumulative` ? `dark-blue font-bold border-b-2 border-dark-blue` : ``"
            @click="updateChartType(`Cumulative`)"
          ) Cumulative
          div.cursor-pointer(
            :class="selected === `Daily` ? `dark-blue font-bold border-b-2 border-dark-blue` : ``"
            @click="updateChartType(`Daily`)"
          ) Daily
      div.relative
        div.responsive.bg-gray-100.rounded
        div.chart
          canvas(id="vaccine-chart" style="width:100%;height:100%;")
      div.pt-4
        //- div.border-b.my-2
        div.flex.justify-between.items-center.flex-wrap.gap-4
          p.text-xs Note: There are days with a reporting anomaly
          div.legend.flex.text-sm.flex-wrap.gap-4
            div.flex.items-center
              span.dot.firstDose
              span 1st Dose
            div.flex.items-center
              span.dot.secondDose
              span 2nd Dose
            div.flex.items-center
              span.dot.thirdDose
              span 3rd Dose
            div.flex.items-center
              span.line.avgDose
              span 7-Day Moving Average
</template>

<script>
import dayjs from "dayjs"
import Chart from "chart.js/auto"
import { LineController } from "chart.js"
import { mapGetters } from "vuex"
import { ma } from "moving-averages"

// show vertical line on hover
class Custom extends LineController {
  draw() {
    // Call line controller method to draw all the points
    super.draw(arguments)
    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
      const ctx = this.chart.ctx
      const activePoint = this.chart.tooltip._active[0]
      const x = activePoint.element.x
      const topY = this.chart.legend.bottom
      const bottomY = this.chart.chartArea.bottom

      // draw line
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(x, topY)
      ctx.lineTo(x, bottomY)
      ctx.lineWidth = 0.5
      ctx.strokeStyle = "#6B7280"
      ctx.stroke()
      ctx.restore()
    }
  }
}
Custom.id = "lineWithLine"
Custom.defaults = LineController.defaults
Chart.register(Custom)

export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      chartjs: {},
      vacData: this.data,
      firstDoseLabel: "1st Dose",
      firstDoseColor: "rgb(168,218,181)",
      secondDoseLabel: "2nd Dose",
      secondDoseColor: "rgb(91,185,116)",
      thirdDoseLabel: "3rd Dose",
      thirdDoseColor: "rgb(12,132,63)",
      lineOptions: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              title: this.tooltipTitle,
              footer: this.totalVaccineValue,
            },
            backgroundColor: "rgba(9,0,118,0.7)",
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        radius: 0,
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6,
            },
          },
          y: {
            grid: {
              drawBorder: false,
            },
            stacked: true,
            ticks: {
              callback(val, index) {
                // Hide the label of every 4nd dataset
                const o = Intl.NumberFormat("en", { notation: "compact" })
                return o.format(val)
              },
            },
          },
        },
      },
      barOptions: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            usePointStyle: true,
            callbacks: {
              footer: this.totalVaccineValue,
            },
            backgroundColor: "rgba(9,0,118,0.7)",
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
        radius: 0,
        scales: {
          x: {
            grid: {
              display: false,
            },
            stacked: true,
            ticks: {
              maxRotation: 0,
              minRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6,
            },
          },
          y: {
            grid: {
              drawBorder: false,
            },
            stacked: true,
            ticks: {
              callback(val, index) {
                // Hide the label of every 4nd dataset
                const o = Intl.NumberFormat("en", { notation: "compact" })
                return o.format(val)
              },
            },
          },
        },
      },
    }
  },
  computed: {
    ...mapGetters({
      selected: "selected",
    }),
    getLastUpdated() {
      if (this.data) {
        const data = this.data[this.data.length - 1]
        const date = data.date.split("-")
        const day = date[2]
        const month = date[1]
        const year = date[0]
        const formattedDate = `${day}/${month}/${year}`
        return formattedDate
      } else {
        return ``
      }
    },
    chartType() {
      return this.$store.state.selected
    },
    dateXAxis() {
      const dates = this.vacData.map((d) => this.formatDate(d.date))
      return dates
    },
    totalVaccineYAxis() {
      const firstDose = this.vacData.map((d) => d.first_dose_cum)
      const secondDose = this.vacData.map((d) => d.second_dose_cum)
      const thirdDose = this.vacData.map((d) => d.third_dose_cum)
      const dataset = [
        {
          label: this.thirdDoseLabel,
          data: thirdDose,
          backgroundColor: this.thirdDoseColor,
          fill: true,
          pointStyle: "circle",
        },
        {
          label: this.secondDoseLabel,
          data: secondDose,
          backgroundColor: this.secondDoseColor,
          fill: true,
          pointStyle: "circle",
        },
        {
          label: this.firstDoseLabel,
          data: firstDose,
          backgroundColor: this.firstDoseColor,
          fill: true,
          borderColor: this.firstDoseColor,
          pointStyle: "circle",
        },
      ]
      return dataset
    },
    dailyVaccineYAxis() {
      const firstDoseDaily = this.vacData.map((d) => {
        if (d.first_dose_daily < 0) {
          console.log(d.first_dose_daily)
        }
        return Math.abs(d.first_dose_daily)
      })
      const secondDoseDaily = this.vacData.map((d) => d.second_dose_daily)
      const thirdDoseDaily = this.vacData.map((d) => d.third_dose_daily)
      // average
      const totalDosePlusArr = this.vacData.map(
        (d) => d.total_vaccinations_daily
      )
      // const avgArr = this.caculateMovingAverage(totalDosePlusArr, 7)
      const avgArr = ma(totalDosePlusArr, 7)
      // const formatAvg = Math.round(avgArr).toLocaleString()
      const dataset = [
        {
          type: "line",
          label: `7-day MA`,
          data: avgArr,
          fill: false,
          borderColor: "#303f9f",
          borderWidth: 2,
          tension: 0.2,
        },
        {
          type: "bar",
          label: this.thirdDoseLabel,
          data: thirdDoseDaily,
          backgroundColor: this.thirdDoseColor,
          fill: true,
          pointStyle: "circle",
        },
        {
          type: "bar",
          label: this.secondDoseLabel,
          data: secondDoseDaily,
          backgroundColor: this.secondDoseColor,
          fill: true,
          pointStyle: "circle",
        },
        {
          type: "bar",
          label: this.firstDoseLabel,
          data: firstDoseDaily,
          backgroundColor: this.firstDoseColor,
          fill: true,
          borderColor: this.firstDoseColor,
          pointStyle: "circle",
        },
      ]
      return dataset
    },
  },
  watch: {
    // watch for state of chart type
    // then update the chart type and dataset
    chartType() {
      if (this.chartType === "Cumulative") {
        this.updateConfigAsNewObject(
          this.chartjs,
          this.totalVaccineYAxis,
          this.lineOptions,
          `lineWithLine`
        )
      } else if (this.chartType === "Daily") {
        this.updateConfigAsNewObject(
          this.chartjs,
          this.dailyVaccineYAxis,
          this.barOptions
        )
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      // create chart and set chartjs as data object
      this.chartjs = this.genLineChart()
    })
  },
  methods: {
    updateChartType(type) {
      this.$store.commit("updateSelection", type)
    },
    genLineChart() {
      const ctx = document.getElementById("vaccine-chart")
      const chart = new Chart(ctx, {
        type: "lineWithLine",
        data: {
          labels: this.dateXAxis,
          datasets: this.totalVaccineYAxis,
        },
        options: this.lineOptions,
      })
      return chart
    },
    formatDate(date) {
      const format = dayjs(date).format("DD MMM")
      return format
    },
    formatFullDate(date) {
      const format = dayjs(date).format("DD MMM YYYY")
      return format
    },
    updateConfigAsNewObject(chart, data, options, type) {
      if (type) {
        chart.config._config.type = type
      }
      chart.data.datasets = data
      chart.options = options
      chart.update()
    },
    totalVaccineValue(tooltipItems) {
      let sum = 0
      tooltipItems.forEach((tooltipItem) => {
        sum += tooltipItem.parsed.y
      })
      return `Total: ${sum.toLocaleString()}`
    },
    tooltipTitle(tooltipItems) {
      let title = ""
      const dates = this.vacData.map((d) => this.formatFullDate(d.date))
      tooltipItems.forEach((item) => {
        title = dates[item.dataIndex]
      })
      return title
    },
    getOrCreateTooltip(chart) {
      let tooltipEl = chart.canvas.parentNode.querySelector("div")
      if (!tooltipEl) {
        tooltipEl = document.createElement("div")
        tooltipEl.style.background = "rgba(0, 0, 0, 0.7)"
        tooltipEl.style.borderRadius = "3px"
        tooltipEl.style.color = "white"
        tooltipEl.style.opacity = 1
        tooltipEl.style.pointerEvents = "none"
        tooltipEl.style.position = "absolute"
        tooltipEl.style.transform = "translate(-50%, 0)"
        tooltipEl.style.transition = "all .1s ease"
        // wrapper
        const innerDiv = document.createElement("div")
        innerDiv.classList = "tooltip-container"
        tooltipEl.appendChild(innerDiv)
        chart.canvas.parentNode.appendChild(tooltipEl)
      }
      return tooltipEl
    },
    externalTooltipHandler(context) {
      // Tooltip Element
      const { chart, tooltip } = context
      const tooltipEl = this.getOrCreateTooltip(chart)

      // Hide if no tooltip
      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0
        return
      }

      // Set Text
      if (tooltip.body) {
        const titleLines = tooltip.title || []
        const bodyLines = tooltip.body.map((b) => b.lines)
        const titleEl = document.createElement("div")
        titleLines.forEach((title) => {
          const text = document.createTextNode(title)
          titleEl.appendChild(text)
        })

        const bodyEl = document.createElement("div")
        bodyLines.forEach((body, i) => {
          const div = document.createElement("div")
          div.textContent = body
          bodyEl.appendChild(div)
        })

        const tooltipContainer = tooltipEl.querySelector(".tooltip-container")
        // Remove old children
        while (tooltipContainer.firstChild) {
          tooltipContainer.firstChild.remove()
        }
        // Add new children
        tooltipContainer.appendChild(titleEl)
        tooltipContainer.appendChild(bodyEl)
      }

      const { offsetLeft: positionX } = chart.canvas

      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1
      tooltipEl.style.left = positionX + tooltip.caretX + "px"
      tooltipEl.style.top = "0px"
      tooltipEl.style.font = tooltip.options.bodyFont.string
      tooltipEl.style.padding =
        tooltip.options.padding + "px " + tooltip.options.padding + "px"
    },
  },
}
</script>

<style lang="scss">
.dot {
  display: inline-block;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  margin-right: 8px;

  &.firstDose {
    background-color: rgb(168, 218, 181);
  }
  &.secondDose {
    background-color: rgb(91, 185, 116);
  }
  &.thirdDose {
    background-color: rgb(12, 132, 63);
  }
}
.line {
  display: inline-block;
  width: 40px;
  height: 3px;
  margin-right: 8px;

  &.avgDose {
    background-color: #303f9f;
  }
}

.chart {
  top: 0;
  left: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
canvas {
  background-color: white;
}
</style>
