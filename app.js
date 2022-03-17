function plots() {
  var filePath_edwin = "data/subset_hate.csv";
  var filePath_ben = "data/crimes.csv"
  var q1_2_filePath = "data/q1_2.csv";
  question1(filePath_edwin);
  question1_2(q1_2_filePath);
  question2(filePath_edwin);
  question3(filePath_ben);
}

var question1 = function (filePath) {
  var svgheight_q1 = 600;
  var svgwidth_q1 = 1000;
  var padding = 150;
  svg_q1 = d3.select("#q1_plot").append("svg").attr("id", "q1plot").attr("width", svgwidth_q1).attr("height", svgheight_q1);
  const data_frame = d3.csv(filePath);
  data_frame.then(function (data) {
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
    const mouseover = function (event, d) {
      tooltip
        .style("opacity", 1);
      tooltip
        .html('The exact count of hate crime in year ' + d3.format("d")(d[0]) + ' is: ' + d[1]);
      tooltip.style("left", event.pageX + "px").style("top", event.pageY + "px");
    };

    const mousemove = function (event, d) {
      tooltip
        .style("opacity", 1);
      tooltip
        .html('The exact count of hate crime in year ' + d3.format("d")(d[0]) + ' is: ' + d[1]);
      tooltip.style("left", event.pageX + "px" + "px").style("top", event.pageY + "px");

    };

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function (event, d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
    };
    var xScale = d3.scaleBand()
      .domain(Array.from(year_grouped.keys()).reverse())
      .range([svgwidth_q1 - 50, 50]);

    var yScale = d3.scaleLinear().domain([0, d3.max(Array.from(year_grouped.values()))])
      .range([svgheight_q1, padding]);

    var xAxis = d3.axisBottom().scale(xScale).tickFormat(d3.format("d"));
    var yAxis = d3.axisLeft().scale(yScale);
    svg_q1.selectAll("circle_US")
      .data(year_grouped).enter().append("circle")
      .attr("cx", function (d, i) {
        return xScale(Array.from(year_grouped.keys())[i]) + 20;
      })
      .attr("cy", function (d) {
        return yScale(d[1]);
      })
      .attr("r", 5).attr("fill", d3.schemeCategory10[0])
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);


    svg_q1.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0,570)");
    svg_q1.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(50,-30)");
    // Generating lines:
    var line = d3.line()
      .x(function (d, i) { return xScale(Array.from(year_grouped.keys())[i]) + 20; }) // set the x values for the line generator
      .y(function (d) {
        return yScale(d[1]);
      }) // set the y values for the line generator
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
  data_frame.then(function (data) {
    var grouped_race = d3.flatRollup(data, v => v.length, d => d.Victim_race, d => d.Offense);
    var flatten_race = grouped_race.map(([Victim_race, Offense, Count]) => ({ Offense, Victim_race, Count }));
    var key = ["Assault", "Intimidation", "Others", "Property"];
    var filter_assault = flatten_race.filter(function (d) {
      if (d["Offense"] == "Assault") {
        return d;
      }
    });
    var filter_assault_array = filter_assault.map(function (d) { return d.Count; })
    var filter_intimidation = flatten_race.filter(function (d) {
      if (d["Offense"] == "Intimidation") {
        return d;
      }
    });
    var filter_intimidation_array = filter_intimidation.map(function (d) { return d.Count; });
    var filter_others = flatten_race.filter(function (d) {
      if (d["Offense"] == "Others") {
        return d;
      }
    });
    var filter_others_array = filter_others.map(function (d) { return d.Count; });
    var filter_property = flatten_race.filter(function (d) {
      if (d["Offense"] == "Property") {
        return d;
      }
    });
    var filter_property_array = filter_property.map(function (d) { return d.Count; });
    var victim_race_arr = Array.from(d3.rollup(flatten_race, v => v.length, d => d.Victim_race).keys())
    var stack_data = [];
    for (let i = 0; i < victim_race_arr.length; i++) {
      stack_data.push({
        Victim_race: victim_race_arr[i], Assault: filter_assault_array[i], Intimidation: filter_intimidation_array[i],
        Others: filter_others_array[i], Property: filter_property_array[i]
      });
    }
    var series = d3.stack().keys(key)(stack_data);
    // create a tooltip
    const Tooltip = svg_q2
      .append("text")
      .attr("text-anchor", "end")
      .attr("x", 650)
      .attr("y", 600)
      .style("opacity", 0)
      .style("font-size", 17);

    // Three function that change the tooltip when user hover / move / leave a cell
    const mouseover = function (event, d) {
      Tooltip.style("opacity", 1)
      d3.selectAll(".gbars").style("opacity", .2)
      d3.select(this).style("fill", "black")
      d3.select(this.parentNode)
        .style("stroke", "black")
        .style("opacity", 1)
    }
    const mousemove = function (event, d, i) {
      grp = d3.select(this.parentNode).datum().key;
      val = d.data[grp];
      Tooltip.text("There are " + val + " counts of " + grp + " recorded for " + d.data.Victim_race);
    }
    const mouseleave = function (event, d) {
      Tooltip.style("opacity", 0)
      d3.selectAll(".gbars").style("opacity", 1).style("stroke", "none")
      d3.select(this).style("fill", d3.select(this.parentNode).attr("fill"))
    }
    // plotting stacked bar chart
    var xScale = d3.scaleBand()
      .domain(d3.range(victim_race_arr.length))
      .range([padding, svgwidth_q2 - padding])
      .paddingInner(0.05);

    var yScale = d3.scaleLinear()
      .domain([0, d3.max(stack_data, function (d) {
        return d.Assault + d.Intimidation + d.Others + d.Property;
      })])
      .range([svgheight_q2 - padding, padding]);
    /*group bars with respect to the secondary Key */
    var groups = svg_q2.selectAll(".gbars").data(series).enter().append("g")
      .attr("class", "gbars").attr("fill", function (d, i) { return d3.schemeCategory10[i] });
    //draw a bar for each Key value
    var rects = groups.selectAll("rect").data(function (d) {
      return d;
    }).enter().append("rect")
      .attr("x", function (d, i) {
        return xScale(i);
      }).attr("y", function (d) {
        return yScale(d[1]);
      }).attr("width", function (d) {
        return xScale.bandwidth();
      }).attr("height", function (d) {
        return yScale(d[0]) - yScale(d[1]);
      }).on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    var xAxis = d3.axisBottom().scale(xScale);
    xAxis.tickFormat((d, i) => victim_race_arr[i]);
    var yAxis = d3.axisLeft().scale(yScale);
    svg_q2.append("g").call(xAxis).attr("class", "xAxis").attr("transform", "translate(0,550)");
    svg_q2.append("g").call(yAxis).attr("class", "yAxis").attr("transform", "translate(150,0)");


    // Legend
    // Add one dot in the legend for each name.
    svg_q2.selectAll("mydots2")
      .data(key)
      .enter()
      .append("circle")
      .attr("cx", 550)
      .attr("cy", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function (d, i) { return d3.schemeCategory10[i] })

    // Add one dot in the legend for each name.
    svg_q2.selectAll("mylabels2")
      .data(key)
      .enter()
      .append("text")
      .attr("x", 570)
      .attr("y", function (d, i) { return 100 + i * 25 }) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function (d, i) { return d3.schemeCategory10[i] })
      .text(function (d) { return d })
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle")
  });
}

var question3 = function (filePath) {

  // set the dimensions and margins of the graph
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  const svg = d3.select("#q3_plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      `translate(${margin.left}, ${margin.top})`);

  //Read the data
  d3.csv(filePath).then(function (data) {
    // Get maps of average victim/offender count by city
    var avgVicCntByCity = d3.rollup(data, v => d3.mean(v, d => d.victim_count), d => d.city);
    var avgOffCntByCity = d3.rollup(data, v => d3.mean(v, d => d.offender_count), d => d.city);

    // Get max of each map for axes sizes
    const maxVicCount = Math.max(...avgVicCntByCity.values());
    const maxOffCount = Math.max(...avgOffCntByCity.values());

    // Add X axis
    const x = d3.scaleLinear()
      .domain([0, maxVicCount * 1.1])
      .range([0, width]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x));

    // Add Y axis
    const y = d3.scaleLinear()
      .domain([0, maxOffCount * 1.1])
      .range([height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
    // Its opacity is set to 0: we don't see it by default.
    const tooltip = d3.select("#q3_plot")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
    // .style("background-color", "white")
    // .style("border", "solid")
    // .style("border-width", "1px")
    // .style("border-radius", "5px")
    // .style("padding", "10px")


    // A function that change this tooltip when the user hover a point.
    // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
    const mouseover = function (event, d) {
      tooltip
        .style("opacity", 1)
    }

    const mousemove = function (event, d) {
      tooltip
        .html(`City: ${d.city} <br>
               Average Victim Count: ${avgVicCntByCity.get(d.city)} <br>
               Average Offender Count: ${avgOffCntByCity.get(d.city)} <br>`)
        .style("left", (event.x) / 2 + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
        .style("top", (event.y) / 2 + "px")
    }

    // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
    const mouseleave = function (event, d) {
      tooltip
        //.transition()
        //.duration(200)
        .style("opacity", 0)
    }

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)//.filter(function(d,i){return i % 5 == 0})) // the .filter part is just to keep a few dots on the chart, not all of them
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(avgVicCntByCity.get(d.city)); })
      .attr("cy", function (d) { return y(avgOffCntByCity.get(d.city)); })
      .attr("r", 5)
      .style("fill", "#69b3a2")
      .style("opacity", 0.3)
      .style("stroke", "white")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)

  })


}
