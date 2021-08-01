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
      astrazenecaColor: "rgb(168,218,181)",
      sinopharmColor: "rgb(91,185,116)",
      sinovacColor: "rgb(91,200,150)",
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
      const astrazeneca = this.vacData.map((d, i, arr) => {
        return d.AstraZeneca_rate
        // let astra = ""
        // if (d.AstraZeneca_rate === 0) {
        //   const prevValue = arr[i - 1].AstraZeneca_rate
        //   console.log(prevValue)
        //   astra = prevValue === undefined ? 0 : prevValue
        // } else {
        //   astra = d.AstraZeneca_rate
        // }
        // return astra
        // return d.AstraZeneca_rate
        // return d.AstraZeneca_rate === 0
        //   ? arr[i - 1].AstraZeneca_rate
        //   : d.AstraZeneca_rate
      })
      // const sinopharm = this.vacData.map((d) => d.Sinopharm_rate)
      // const sinovac = this.vacData.map((d) => d.Sinovac_rate)
      const dataset = [
        {
          label: "AstraZeneca",
          data: astrazeneca,
          borderColor: this.astrazenecaColor,
          pointStyle: "circle",
          tension: 0.6,
        },
        // {
        //   label: "Sinopharm",
        //   data: sinopharm,
        //   borderColor: this.sinopharmColor,
        //   pointStyle: "circle",
        // },
        // {
        //   label: "Sinovac",
        //   data: sinovac,
        //   borderColor: this.sinovacColor,
        //   pointStyle: "circle",
        // },
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
