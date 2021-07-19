<template lang="pug">
div.vaccination-block.container-padding
  div.explainer.pb-4(
    class="lg:pb-0"
  )
    h2.pb-2 Vaccination Graph
    p 
      | This data shows how many people have received at least one dose of a vaccine.
      | People who are fully vaccinated may have received more than one dose.
  div.progress-bar
    div.vac-graph.w-full.h-full.relative
      svg
      div.tooltipDiv
        div.text
      div.line
</template>

<script>
import * as d3 from "d3"

export default {
  props: {
    csvData: {
      type: String,
      default: "",
    },
  },
  mounted() {
    this.genAreaChart(this.csvData)
  },
  methods: {
    formatDateLetter(date) {
      const formatTime = d3.timeFormat("%B %d %Y")
      return formatTime(date)
    },
    formatDate(date) {
      const parseDate = d3.isoParse
      const dateArr = date.split("-")
      const year = dateArr.pop()
      const day = dateArr.shift()
      const month = dateArr.pop()
      const newDate = parseDate(`${year}-${month}-${day}`)
      // console.log(newDate)
      return newDate
    },
    genAreaChart(csvData) {
      // csv data
      const data = d3.csvParse(csvData)
      // svg element
      const svgEl = document.querySelector("svg")
      const svgWidth = svgEl.parentElement.offsetWidth
      const svgHeight = svgEl.parentElement.offsetHeight
      // dimensions vars
      const margin = { top: 40, right: 40, bottom: 40, left: 40 }
      const width = svgWidth
      const height = svgHeight
      // svg
      const svg = d3
        .select("svg")
        .attr("viewBox", [
          0,
          0,
          width + margin.top * 2,
          height + margin.left * 2,
        ])
        .append("g")
        .attr(
          "transform",
          `translate(${margin.top * 1.5}, ${margin.left * 1.5})`
        )
      // X axis
      const x = d3
        .scaleTime()
        .domain(
          d3.extent(data, (d) => {
            return this.formatDate(d.date)
          })
        )
        .range([0, width])
      svg
        .append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(5))
      // Y axis
      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, (d) => {
            return +d.total_vaccinations
          }),
        ])
        .range([height, 0])
      svg.append("g").call(d3.axisLeft(y))
      // Add the area
      svg
        .append("g")
        .attr("class", "chartArea")
        .append("path")
        .datum(data)
        .attr("fill", "#cce5df")
        .attr("stroke", "#69b3a2")
        .attr("stroke-width", 1.5)
        .attr(
          "d",
          d3
            .area()
            .x((d) => x(this.formatDate(d.date)))
            .y0(y(0))
            .y1((d) => y(d.total_vaccinations))
        )
      // mouse interaction
      // mouseover area
      const mouseArea = svg.append("g").attr("class", "boundArea")
      const areaEl = document.querySelector(".boundArea")
      // create tooltip element
      const tooltip = svg.append("g")
      const textTooltip = tooltip.append("text")

      const tooltipEl = d3
        .select(".tooltipDiv")
        .attr("style", "opacity:0")
        .style("transform", `translate(0,0)`)
      const lineEl = d3.select(".line").style("display", "none")

      // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = (d) => {
        tooltipEl.style("opacity", 1)
        lineEl.style("display", "block")
      }
      const mousemove = (e, d) => {
        const mouse = d3.pointer(e)
        const hoveredDate = x.invert(mouse[0])
        // const hoveredVac = y.invert(mouse[1])

        // hover area scale
        const scrollScale = width / areaEl.getBoundingClientRect().width

        // tooltip position
        const tooltipXPosition =
          x(Math.round(hoveredDate)) -
          (textTooltip.node().getBBox().width + 30) / 2

        // todo: center align tooltip box
        // tooltip
        tooltipEl
          .style(
            "transform",
            `translate(${tooltipXPosition / scrollScale}px, 0)`
          )
          .style(
            "left",
            `${tooltipEl.node().offsetWidth / 2 / scrollScale - 10}px`
          )
          .text("ออกไป")
        // .text(this.formatDateLetter(hoveredDate))

        // line
        lineEl
          .style(
            "transform",
            `translate(${tooltipXPosition / scrollScale + 50}px, 0)`
          )
          .style("height", `${areaEl.getBoundingClientRect().height}px`)
      }
      const mouseleave = (d) => {
        tooltipEl.style("opacity", 0)
        lineEl.style("display", "none")
      }
      mouseArea
        .append("svg:rect")
        .data(data)
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "none")
        .attr("pointer-events", "all")
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
    },
    genBarChart(csvData) {
      // csv data
      const data = d3.csvParse(csvData)
      // svg element
      const svgEl = document.querySelector("svg")
      const svgWidth = svgEl.parentElement.offsetWidth
      const svgHeight = svgEl.parentElement.offsetHeight
      // dimensions vars
      const margin = { top: 40, right: 40, bottom: 40, left: 40 }
      const width = svgWidth
      const height = svgHeight
      // parent svg
      // select svg and append to page
      const svg = d3
        .select("svg")
        .attr("viewBox", [
          0,
          0,
          width + margin.top * 2,
          height + margin.left * 2,
        ])
        .append("g")
        .attr(
          "transform",
          `translate(${margin.top * 1.5}, ${margin.left * 1.5})`
        )

      // add x axis - date
      const dates = data.map((d) => d.date)
      const filter = dates.filter((d, i) => (i + 1) % 10 === 0)
      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.date))
        .range([0, width])
        .padding(0.4)
      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(
          d3
            .axisBottom(x)
            .tickValues(filter)
            .tickFormat((d) => {
              const formatTime = d3.timeFormat("%B %d")
              return formatTime(this.formatDate(d))
            })
        )

      // add y axis - accumulated vaccination
      const y = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, (d) => {
            return Number(d.total_vaccinations)
          }),
        ])
        .range([height, 0])
      svg.append("g").call(d3.axisLeft(y))

      // append the rectangles for the bar chart
      svg
        .append("g")
        .attr("fill", "steelblue")
        .datum(data)
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", (d) => {
          return x(d.date)
        })
        .attr("y", (d) => {
          return y(d.total_vaccinations)
        })
        .attr("width", x.bandwidth())
        .attr("height", (d) => {
          return height - y(d.total_vaccinations)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.vac-graph {
  min-height: 250px;
}
svg::v-deep {
  .tooltip {
    transition: opacity 0.1s ease-in-out;
  }
}
.tooltipDiv {
  position: absolute;
  display: block;
  box-shadow: 0 1px 3px rgb(0 0 0 / 20%), 0 1px 1px rgb(0 0 0 / 14%);
  z-index: 20;
  background-color: white;
  transition: transform 150ms ease, opacity 250ms;
  border-radius: 2px;
  padding: 8px;
  top: 50px;
  font-size: 12px;
}

.line {
  z-index: 10;
  border: none;
  border-left: 1px dotted #70757a;
  position: absolute;
  top: 50px;
  left: 25px;
  pointer-events: none;
}
</style>
