function plots() {
    var filePath = "data/subset_hate.csv";
	var q1_2_filePath = "data/q1_2.csv";
    question1(filePath);
	question1_2(q1_2_filePath);
  question2(filePath);

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
  var svgheight_q2 = 700;
  var svgwidth_q2 = 700;
  var padding = 150;
  svg_q2 = d3.select("#q2_plot").append("svg").attr("id", "q2plot").attr("width", svgwidth_q2).attr("height", svgheight_q2);
  const data_frame = d3.csv(filePath);
  data_frame.then(function(data){
    var grouped_race = d3.flatRollup(data, v => v.length, d => d.Victim_race, d => d.Offense);
    var flatten_race = grouped_race.map(([Victim_race, Offense, Count]) => ({Offense, Victim_race, Count}));
    console.log(flatten_race);
    var key = ["Assault", "Intimidation", "Others", "Property"];
    console.log(flatten_race);
    var filter_assault = flatten_race.filter(function(d){
      if (d["Offense"] == "Assault") {
        return d;
      }
    });
    var filter_assault_array = filter_assault.map(function(d) {return d.Count;})
    var filter_intimidation = flatten_race.filter(function(d){
      if (d["Offense"] == "Intimidation") {
        return d;
      }
    });
    var filter_intimidation_array = filter_intimidation.map(function(d) {return d.Count;});
    var filter_others = flatten_race.filter(function(d){
      if (d["Offense"] == "Others") {
        return d;
      }
    });
    var filter_others_array = filter_others.map(function(d) {return d.Count;});
    var filter_property = flatten_race.filter(function(d){
      if (d["Offense"] == "Property") {
        return d;
      }
    });
    var filter_property_array = filter_property.map(function(d) {return d.Count;});
    var victim_race_arr = Array.from(d3.rollup(flatten_race, v => v.length, d => d.Victim_race).keys())
    var stack_data = [];
    for (let i = 0; i < victim_race_arr.length; i++) {
      stack_data.push({Victim_race: victim_race_arr[i], Assault: filter_assault_array[i], Intimidation: filter_intimidation_array[i],
        Others: filter_others_array[i], Property: filter_property_array[i]});
    }
    console.log(stack_data);
    var series = d3.stack().keys(key)(stack_data);
    console.log(series);
    // create a tooltip
        const Tooltip = svg_q2
                        .append("text")
                        .attr("text-anchor", "end")
                        .attr("x", 650)
                        .attr("y", 600)
                        .style("opacity", 0)
                        .style("font-size", 17);

    // Three function that change the tooltip when user hover / move / leave a cell
      const mouseover = function(event,d) {
        Tooltip.style("opacity", 1)
        d3.selectAll(".gbars").style("opacity", .2)
        console.log(this)
        d3.select(this).style("fill", "black")
        d3.select(this.parentNode)
          .style("stroke", "black")
          .style("opacity", 1)
      }
      const mousemove = function(event,d,i) {
        console.log(d.data)
        grp = d3.select(this.parentNode).datum().key;
        val = d.data[grp];
        Tooltip.text("There are " + val + " counts of "+ grp + " recorded for " + d.data.Victim_race);
      }
      const mouseleave = function(event,d) {
        Tooltip.style("opacity", 0)
        d3.selectAll(".gbars").style("opacity", 1).style("stroke", "none")
        d3.select(this).style("fill", d3.select(this.parentNode).attr("fill"))
       }
    // plotting stacked bar chart
    var xScale = d3.scaleBand()
						.domain(d3.range(victim_race_arr.length))
						.range([padding, svgwidth_q2-padding])
						.paddingInner(0.05);

    var yScale = d3.scaleLinear()
						.domain([0, d3.max(stack_data, function(d){
							return d.Assault + d.Intimidation + d.Others + d.Property;
						})])
						.range([svgheight_q2-padding, padding]);
    /*group bars with respect to the secondary Key */
    var groups = svg_q2.selectAll(".gbars").data(series).enter().append("g")
                        .attr("class", "gbars").attr("fill", function(d, i) {return d3.schemeCategory10[i]});
    //draw a bar for each Key value
    var rects = groups.selectAll("rect").data(function(d) {
                        return d;
                    }).enter().append("rect")
                    .attr("x", function(d, i) {
                        return xScale(i);
                    }).attr("y", function(d) {
                        return yScale(d[1]);
                    }).attr("width", function(d) {
                        return xScale.bandwidth();
                    }).attr("height", function(d) {
                        return yScale(d[0])-yScale(d[1]);
                    }).on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseleave", mouseleave);

    var xAxis = d3.axisBottom().scale(xScale);
    xAxis.tickFormat((d,i) => victim_race_arr[i]);
    var yAxis = d3.axisLeft().scale(yScale);
    svg_q2.append("g").call(xAxis).attr("class", "xAxis").attr("transform","translate(0,550)");
    svg_q2.append("g").call(yAxis).attr("class", "yAxis").attr("transform","translate(150,0)");


      // Legend
      // Add one dot in the legend for each name.
      svg_q2.selectAll("mydots2")
        .data(key)
        .enter()
        .append("circle")
          .attr("cx", 550)
          .attr("cy", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill", function(d, i){ return d3.schemeCategory10[i]})

      // Add one dot in the legend for each name.
      svg_q2.selectAll("mylabels2")
        .data(key)
        .enter()
        .append("text")
          .attr("x", 570)
          .attr("y", function(d,i){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", function(d, i){ return d3.schemeCategory10[i]})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
  });
}
