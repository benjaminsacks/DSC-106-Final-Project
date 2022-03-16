function plots() {
    var filePath = "data/subset_hate.csv";
	var q1_2_filePath = "data/q1_2.csv";
    question1(filePath);
	question1_2(q1_2_filePath);

}

var question1 = function (filePath) {
  var svgheight_q1 = 600;
  var svgwidth_q1 = 1000;
  var padding = 150;
  svg_q1 = d3.select("#q1_plot").append("svg").attr("id", "q1plot").attr("width", svgwidth_q1).attr("height", svgheight_q1);
  const data_frame = d3.csv(filePath);
  data_frame.then(function(data){
      // Pre sort the year, so don't need to sort rollup (which is tedious)
      sorted_year = data.sort((a, b) => d3.ascending(a.Year, b.Year));
      year_grouped = d3.rollup(sorted_year, v => v.length, d => d.Year);
      // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
      // Its opacity is set to 0: we don't see it by default.
          const tooltip = d3.select("#q1_plot")
            .append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")
            .style('position', 'absolute')
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "10px");



          // A function that change this tooltip when the user hover a point.
          const mouseover = function(event, d) {
            tooltip
              .style("opacity", 1);
            tooltip
              .html('The exact count of hate crime in year ' + d3.format("d")(d[0]) + ' is: '+ d[1]);
            tooltip.style("left", event.pageX + "px").style("top", event.pageY+ "px");
          };

          const mousemove = function(event, d) {
            tooltip
              .style("opacity", 1);
            tooltip
              .html('The exact count of hate crime in year ' + d3.format("d")(d[0]) + ' is: '+ d[1]);
            tooltip.style("left", event.pageX+ "px"+ "px").style("top", event.pageY+ "px");

          };

          // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
          const mouseleave = function(event,d) {
            tooltip
              .transition()
              .duration(200)
              .style("opacity", 0)
          };
          console.log(year_grouped);
          var xScale = d3.scaleBand()
                    .domain(Array.from(year_grouped.keys()).reverse())
                    .range([svgwidth_q1 - 50, 50]);

          var yScale = d3.scaleLinear().domain([0, d3.max(Array.from(year_grouped.values()))])
                  .range([svgheight_q1, padding]);

          var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
          var yAxis = d3.axisLeft().scale(yScale);
          svg_q1.selectAll("circle_US")
                .data(year_grouped).enter().append("circle")
                .attr("cx", function(d, i){
                  return xScale(Array.from(year_grouped.keys())[i]) + 20;
                })
                .attr("cy", function(d){
                  return yScale(d[1]);
                })
                .attr("r", 5).attr("fill", d3.schemeCategory10[0])
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave);


          svg_q1.append("g").call(xAxis).attr("class", "xAxis").attr("transform","translate(0,570)");
          svg_q1.append("g").call(yAxis).attr("class", "yAxis").attr("transform","translate(50,-30)");
          // Generating lines:
          var line = d3.line()
              .x(function(d, i) { return xScale(Array.from(year_grouped.keys())[i]) + 20; }) // set the x values for the line generator
              .y(function(d) {
                return yScale(d[1]); }) // set the y values for the line generator
              .curve(d3.curveMonotoneX) // apply smoothing to the line
          svg_q1.append("path")
          .datum(year_grouped) // Binds data to the line
          .attr("fill", "none")
          .attr("stroke", d3.schemeCategory10[0])
          .attr("class", "line") // Assign a class for styling
          .attr("d", line);  // Calls the line generator

  });
}

var question1_2 = function (filePath) {
	const dataset = d3.csv(filePath);

}

var question2 = function (filePath) {
	const dataset = d3.csv(filePath);

}
