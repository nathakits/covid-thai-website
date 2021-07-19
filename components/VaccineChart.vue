<template lang="pug">
//- todo
//- update tooltip to html
//- ref - nyt
div.chart
  canvas(id="vaccine-chart")
</template>

<script>
import { isoParse, timeFormat } from "d3"
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
      chartjs: {},
      vacData: this.data,
      firstDoseLabel: "1st Dose",
      firstDoseColor: "rgb(168,218,181)",
      secondDoseLabel: "2nd Dose",
      secondDoseColor: "rgb(91,185,116)",
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
            // enabled: false,
            // external: this.externalTooltipHandler,
            // position: "nearest",
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
      const firstDose = this.vacData.map((d) => d.people_vaccinated)
      const secondDose = this.vacData.map((d) => d.people_fully_vaccinated)
      const dataset = [
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
          borderColor: this.secondDoseColor,
          pointStyle: "circle",
        },
      ]
      return dataset
    },
    dailyVaccineYAxis() {
      const firstDoseDaily = this.vacData.map((d) => d.first_dose_plus)
      const secondDoseDaily = this.vacData.map((d) => d.second_dose_plus)
      const dataset = [
        {
          label: this.secondDoseLabel,
          data: secondDoseDaily,
          backgroundColor: this.secondDoseColor,
          fill: true,
          pointStyle: "circle",
        },
        {
          label: this.firstDoseLabel,
          data: firstDoseDaily,
          backgroundColor: this.firstDoseColor,
          fill: true,
          borderColor: this.secondDoseColor,
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
      if (this.chartType === "Total") {
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
          this.barOptions,
          `bar`
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
      const parseDate = isoParse
      const formatTime = timeFormat("%d %b")
      const dateArr = date.split("-")
      const year = dateArr.pop()
      const day = dateArr.shift()
      const month = dateArr.pop()
      const newDate = parseDate(`${year}-${month}-${day}`)
      const format = formatTime(newDate)
      return format
    },
    formatFullDate(date) {
      const parseDate = isoParse
      const formatTime = timeFormat("%d %b %Y")
      const dateArr = date.split("-")
      const year = dateArr.pop()
      const day = dateArr.shift()
      const month = dateArr.pop()
      const newDate = parseDate(`${year}-${month}-${day}`)
      const format = formatTime(newDate)
      return format
    },
    updateConfigAsNewObject(chart, data, options, type) {
      chart.config._config.type = type
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
          // const colors = tooltip.labelColors[i]
          const div = document.createElement("div")
          // div.style.background = colors.backgroundColor
          // div.style.borderColor = colors.borderColor
          // div.style.borderWidth = "2px"
          // div.style.marginRight = "10px"
          // div.style.height = "10px"
          // div.style.width = "10px"
          // div.style.display = "inline-block"
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

      const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas

      // Display, position, and set styles for font
      tooltipEl.style.opacity = 1
      tooltipEl.style.left = positionX + tooltip.caretX + "px"
      tooltipEl.style.top = "0px"
      console.log(positionY)
      console.log(tooltip.caretY)
      // tooltipEl.style.top = positionY + tooltip.caretY + "px"
      tooltipEl.style.font = tooltip.options.bodyFont.string
      tooltipEl.style.padding =
        tooltip.options.padding + "px " + tooltip.options.padding + "px"
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
