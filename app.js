function plots() {
    var q1_filePath = "data/q1_1.csv";
	var q1_2_filePath = "data/q1_2.csv";
    question1(q1_filePath);
	question1_2(q1_2_filePath);

}

var question1 = function (filePath) {
	const dataset = d3.csv(filePath);
	
	var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 760 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

	var svg = d3.select("#q1_plot")
	  .append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	  .append("g")
		.attr("transform",
			  "translate(" + margin.left + "," + margin.top + ")");
			  
	dataset.then(function (data) {
		 var x = d3.scaleLinear()
		  .domain(d3.extent(data, function(d) { return d.year; }))
		  .range([ 0, width ]);
		svg.append("g")
		  .attr("transform", "translate(0," + height + ")")
		  .call(d3.axisBottom(x).tickFormat(d3.format("d")));

		// Add Y axis
		var y = d3.scaleLinear()
		  .domain([0, d3.max(data, function(d) { return +d.count; })])
		  .range([ height, 0 ]);
		svg.append("g")
		  .call(d3.axisLeft(y));

		// Add the line
		svg.append("path")
		  .datum(data)
		  .attr("fill", "none")
		  .attr("stroke", "steelblue")
		  .attr("stroke-width", 1.5)
		  .attr("d", d3.line()
			.x(function(d) { return x(d.year) })
			.y(function(d) { return y(d.count) })
			)
	});
}

var question1_2 = function (filePath) {
	const dataset = d3.csv(filePath);
	
});