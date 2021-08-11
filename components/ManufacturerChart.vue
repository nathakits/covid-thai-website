<template lang="pug">
div.chart
  canvas(id="vaccine-manufacturer-chart" style="width:100%;height:100%;")
</template>

<script>
import dayjs from "dayjs"
import Chart from "chart.js/auto"
import { LineController } from "chart.js"

// show vertical line on hover
class Custom extends LineController {
  draw() {
    // Call line controller method to draw all the points
    super.draw(arguments)
    if (this.chart.tooltip._active && this.chart.tooltip._active.length) {
      const ctx = this.chart.ctx
      console.log(this.chart)
      console.log(ctx)
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
      vacData: this.data,
      astrazenecaColor: "#10B981",
      sinopharmColor: "#3B82F6",
      sinovacColor: "#F59E0B",
      pfizerColor: "#EF4444",
      thickness: 3,
      lineOptions: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            usePointStyle: true,
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
    chartType() {
      return this.$store.state.selected
    },
    dateXAxis() {
      const dates = this.vacData.map((d) => this.formatDate(d.date))
      return dates
    },
    totalVaccineYAxis() {
      const astrazeneca = this.vacData.map((d) => d.AstraZeneca)
      const sinopharm = this.vacData.map((d) => d.Sinopharm)
      const sinovac = this.vacData.map((d) => d.Sinovac)
      const pfizer = this.vacData.map((d) => d.Pfizer)
      const dataset = [
        {
          label: "Sinovac",
          data: sinovac,
          backgroundColor: this.sinovacColor,
          fill: true,
          pointStyle: "circle",
        },
        {
          label: "AstraZeneca",
          data: astrazeneca,
          backgroundColor: this.astrazenecaColor,
          fill: true,
          pointStyle: "circle",
        },
        {
          label: "Sinopharm",
          data: sinopharm,
          backgroundColor: this.sinopharmColor,
          fill: true,
          pointStyle: "circle",
        },
        {
          label: "Pfizer",
          data: pfizer,
          backgroundColor: this.pfizerColor,
          fill: true,
          pointStyle: "circle",
        },
      ]
      return dataset
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.genLineChart()
    })
  },
  methods: {
    genLineChart() {
      const ctx = document.getElementById("vaccine-manufacturer-chart")
      const chart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.dateXAxis,
          datasets: this.totalVaccineYAxis,
        },
        options: this.barOptions,
      })
      return chart
    },
    totalVaccineValue(tooltipItems) {
      let sum = 0
      tooltipItems.forEach((tooltipItem) => {
        sum += tooltipItem.parsed.y
      })
      return `Total: ${sum.toLocaleString()}`
    },
    formatDate(date) {
      const newDate = new Date(date)
      const format = dayjs(newDate).format("DD MMM")
      return format
    },
  },
}
</script>

<style lang="scss">
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
