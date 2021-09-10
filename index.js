const width = 900;
const height = 500;
const padding = 50;

const svg = d3
  .select("div")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
).then(function (dataset) {
  const minutes = dataset.map((elem) => {
    var parsedTime = elem.Time.split(":");
    return new Date(2000, 0, 1, 0, parsedTime[0], parsedTime[1]);
  });

  const years = dataset.map((elem) => new Date(elem.Year, 1, 1));

  const scale_X = d3
    .scaleTime()
    .domain([new Date(d3.min(years).getFullYear() - 1, 1, 1), d3.max(years)])
    .range([padding, width - padding]);

  const scale_Y = d3
    .scaleTime()
    .domain([d3.min(minutes), d3.max(minutes)])
    .range([padding, height - padding])
    .nice();

  const axis_X = d3.axisBottom().scale(scale_X);
  const axis_Y = d3
    .axisLeft()
    .scale(scale_Y)
    .tickFormat(d3.timeFormat("%M:%S"));

  const tooltip = d3.select("div").append("div").attr("id", "tooltip");

  svg
    .append("g")
    .attr("transform", "translate(0, " + (height - padding) + ")")
    .call(axis_X)
    .attr("id", "x-axis");
  svg
    .append("g")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(axis_Y)
    .attr("id", "y-axis");

  svg.append("g").attr("id", "legend");

  const nonDopingGroup = svg.select("#legend").append("g");
  const dopingGroup = svg.select("#legend").append("g");

  nonDopingGroup
    .append("text")
    .text("No doping allegations")
    .attr("x", width - 300)
    .attr("y", height - 237);

  nonDopingGroup
    .append("rect")
    .attr("height", 15)
    .attr("width", 15)
    .attr("fill", "#FFB830")
    .attr("x", width - 70)
    .attr("y", height - 250);

  dopingGroup
    .append("text")
    .text("Riders with doping allegations")
    .attr("x", width - 300)
    .attr("y", height - 215);

  dopingGroup
    .append("rect")
    .attr("height", 15)
    .attr("width", 15)
    .attr("fill", "#3DB2FF")
    .attr("x", width - 70)
    .attr("y", height - 225);

  svg
    .selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("cx", (d, i) => scale_X(years[i]))
    .attr("cy", (d, i) => scale_Y(minutes[i]))
    .attr("r", 7)
    .attr("class", "dot")
    .attr("fill", (d) => {
      if (d.Doping === "") {
        return "#FFB830";
      } else {
        return "#3DB2FF";
      }
    })
    .attr("data-xvalue", (d, i) => years[i])
    .attr("data-yvalue", (d, i) => minutes[i])
    .on("mouseover", function (evt, d) {
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(
        d.Name +
          ": " +
          d.Nationality +
          "<br>" +
          "Year " +
          d.Year +
          ", " +
          "Time: " +
          d.Time +
          "<br>" +
          d.Doping
      );
      tooltip.style("position", "absolute");
      tooltip.style("left", evt.pageX + 20 + "px");
      tooltip.style("top", evt.pageY + "px");
      tooltip.attr("data-year", new Date(d.Year, 1, 1));
    })
    .on("mouseout", function () {
      tooltip.transition().duration(400).style("opacity", 0);
    });
});
