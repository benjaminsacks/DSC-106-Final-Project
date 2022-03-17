function plots() {
   var filePath = "data/subset_hate.csv";
 var q1_2_filePath = "data/q1_2.csv";
   var q1_2_filePath = "data/q1_2.csv";
   question1(filePath);
   question1_2(q1_2_filePath);
   question2(filePath);
   question3(filePath);

}

@ -14,6 +15,7 @@ var question1 = function (filePath) {
 svg_q1 = d3.select("#q1_plot").append("svg").attr("id", "q1plot").attr("width", svgwidth_q1).attr("height", svgheight_q1);
 const data_frame = d3.csv(filePath);
 data_frame.then(function(data){
   console.log(data);
     // Pre sort the year, so don't need to sort rollup (which is tedious)
     sorted_year = data.sort((a, b) => d3.ascending(a.Year, b.Year));
     year_grouped = d3.rollup(sorted_year, v => v.length, d => d.Year);
@ -163,14 +165,12 @@ var question2 = function (filePath) {
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
@ -241,3 +241,82 @@ var question2 = function (filePath) {
         .style("alignment-baseline", "middle")
 });
}

var question3 = function (filePath) {
 var svgheight_q3 = 600;
 var svgwidth_q3 = 1000;
 var padding = 150;
 svg_q3 = d3.select("#q3_plot").append("svg").attr("id", "q3plot").attr("width", svgwidth_q3).attr("height", svgheight_q3);
 const data_frame = d3.csv(filePath);
 data_frame.then(function(data){
     // Pre sort the city, so don't need to sort rollup (which is tedious)
     sorted_city = data.sort((a, b) => d3.ascending(a.City, b.City));
     offenders_grouped = d3.rollup(sorted_city, v => d3.mean(v, d => d.Offender_count), d => d.City);
     victims_grouped = d3.rollup(sorted_city, v => d3.mean(v, d => d.Victim_count), d => d.City);
     console.log(offenders_grouped);
     console.log(victims_grouped);
     // Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
     // Its opacity is set to 0: we don't see it by default.
         const tooltip = d3.select("#q3_plot")
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
         };

         const mousemove = function(event, d) {
           tooltip
             .style("opacity", 1);
           tooltip
               .html(d[1] + ', '+ yScale.invert(d3.select(this).attr("cy")));
           tooltip.style("left", event.pageX + "px").style("top", event.pageY+ "px");

         };

         // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
         const mouseleave = function(event,d) {
           tooltip
             .transition()
             .duration(200)
             .style("opacity", 0)
         };
         var xScale = d3.scaleLinear()
                   .domain([0, 10])
                   .range([50, svgwidth_q3 - 50]);

         var yScale = d3.scaleLinear().domain([0, 10])
                 .range([svgheight_q3 - 30, padding]);

         var xAxis = d3.axisBottom().scale(xScale);
         var yAxis = d3.axisLeft().scale(yScale);
         svg_q3.selectAll("circle_OV")
               .data(offenders_grouped).enter().append("circle")
               .attr("cx", function(d, i){
                 return xScale(Array.from(offenders_grouped.values())[i]);
               })
               .attr("cy", function(d, i){
                 return yScale(Array.from(victims_grouped.values())[i]);
               })
               .attr("r", 5).attr("fill", d3.schemeCategory10[0])
               .on("mouseover", mouseover)
               .on("mousemove", mousemove)
               .on("mouseleave", mouseleave);


         svg_q3.append("g").call(xAxis).attr("class", "xAxis").attr("transform","translate(0,570)");
         svg_q3.append("g").call(yAxis).attr("class", "yAxis").attr("transform","translate(50,0)");

 });
}
