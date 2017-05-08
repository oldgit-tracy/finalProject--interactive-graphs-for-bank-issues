var svg = d3.select("svg");

var path = d3.geoPath();

d3.json("https://d3js.org/us-10m.v1.json", function(error, us) {
  if (error) throw error;

  svg.append("g")
      .attr("class", "states")
    .selectAll("path")
    .data(topojson.feature(us, us.objects.states).features)
    .enter().append("path")
      .attr("d", path);

  svg.append("path")
      .attr("class", "state-borders")
      .attr("d", path(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; })));
});



// Creating a smooth color legend with an SVG gradient, modified code from https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html

// //Append a defs (for definition) element to your SVG
// var defs = svg.append("defs");
//
// //Append a linearGradient element to the defs and give it a unique id
// var linearGradient = defs.append("linearGradient")
//     .attr("id", "linear-gradient");
//
// //Set the color for the start (0%)
// linearGradient.append("stop")
//     .attr("offset", "0%")
//     .attr("stop-color", "#90eb9d"); //light blue
//
// //Set the color for the end (100%)
// linearGradient.append("stop")
//     .attr("offset", "100%")
//     .attr("stop-color", "#2c7bb6"); //dark blue
//
// var scale = ["#90eb9d", "#90eb9d", "#00a6ca", "#00a6ca"]
//
// //Draw the rectangle and fill with gradient
// svg.append("rect")
//   	.attr("width", 300)
//   	.attr("height", 20)
//   	.style("fill", "url(#linear-gradient)")
//     .attr("x", 600)
//     .attr("y", 0)
//
// /////////////////////////////////// TO DO (append legend text)
//
// var legedScale = svg.inearGradient()
//     .domain([12,100])
//     .range([200,0])

  // svg.append("text")
  //   .attr("x", 0)
  //   .attr("y", 0)
  //   .text(function(d,i) { return legend_label[i]; });



// modified code from https://gist.github.com/michellechandra/0b2ce4923dc9b5809922

// Load in my general info data!
////color.domain([0,1,2,3]); // setting the range of the input data


// // Load GeoJSON data and merge with general info data
// d3.json("us-states.json", function(json) {





var colorScale = d3.scaleSequential(quantile.domain(["#90eb9d", "#90eb9d", "#00a6ca", "#00a6ca"]));

var drawLegend = function() {
	// our color scale doesn't have an invert() function
	// and we need some way of mapping 0% and 100% to our domain
	// so we'll create a scale to reverse that mapping
	var percentScale = d3.scaleLinear()
		.domain([0, 100])
		.range(colorScale.domain());

    svg.append("defs")
  		.append("linearGradient")
  		.attr("id", "gradient")
  		.selectAll("stop")
  		.data(d3.ticks(0, 100, 5))
  		.enter()
  		.append("stop")
  		.attr("offset", function(d) {
  			return d + "%";
  		})
  		.attr("stop-color", function(d) {
  			return colorScale(percentScale(d));
  		});
