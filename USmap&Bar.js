// modified code from https://bl.ocks.org/sjengle/2e58e83685f6d854aa40c7bc546aeb24
// zoomable function modified from https://bl.ocks.org/iamkevinv/0a24e9126cd2fa6b283c6f2d774b69a2

var margin = {top: 0, right: 0, bottom: 0, left: 0};

var width = 800;
var height = 600;

/*
var svg = d3.select("body").select("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", 2*(height + margin.top + margin.bottom));*/

//buttons for zooming in and out
/*
svg.append('button')
.attr('type', 'button')
.attr("transform", "translate(100, 150)")
.text('sdfsdffsdfsg');

svg.append("text").style("font-size", "50px").attr("fill", "rgb(0, 0, 0)")
			.attr("transform", "translate(200, 150)").text('sdfsdfsdf');*/


var issue_id = {};

// color for the issue
var color = d3.scaleOrdinal(d3.schemeCategory10);

//BAR CHART
var ORIGIN = {x: 300, y: height - 100};
var TOP_SPACE = 100;
var RIGHT_SPACE = 50;
var bar_chart_svg = d3.select("#bar_svg")
                      .attr("width", width + margin.left + margin.right)
                      .attr("height", height + margin.top + margin.bottom);

var bar_chart_g = bar_chart_svg.append("g")
		                       .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// set the ranges
var x = d3.scaleLinear().range([0, width - ORIGIN.x - RIGHT_SPACE]);
var y = d3.scaleBand().range([ORIGIN.y - TOP_SPACE, 0]).padding(0.1);

var tooltip = d3.select("body")
                .append("div")
				.attr("id", "tooltip")
				.style("background-color", "lightblue")
				.style("position", "absolute")
				.style("z-index", "10")
				.style("visibility", "hidden")
				.style("font-size", "15px");

d3.csv("USmapnew2.csv", function(error, data) {
  	if (error) throw error;
    //data.forEach(function(d){
    //  d.Count =+ d.Count;
    //  d.Issue = d.Issue;
    //})
    //console.log(data)

	//process the data
    var counted_data = [];
	var dataNest = d3.nest()
                     .key(function(d) {return d.Issue;})
                     .entries(data);

	dataNest.forEach(function(d, i){
		issue_id[d.key] = i;

		var current_entry = {Issue: d.key, Count: 0};
		d.values.forEach(function(v){
			current_entry.Count += +v.Count;
		});
		counted_data.push(current_entry);
	});

    x.domain([0, d3.max(counted_data, function(d) { return d.Count; })]);
  	//x.domain(d3.extent(data, function(d) { return d.Count; }));
    //console.log(x.domain());
    y.domain(counted_data.map(function(d) { return d.Issue; })).padding(0.1);

    // text label for the x axis
    bar_chart_g.append("text")
			   .attr("transform", "translate(" + ((ORIGIN.x+width-RIGHT_SPACE)/2) + " ," + (ORIGIN.y + 40) + ")")
               .style("text-anchor", "middle")
			   .style("font-size", "20px")
               .attr('stroke', 'black')
               .text("Count");

	// text label for y axis
    bar_chart_g.append("text")
               .attr("transform", "translate(" + (ORIGIN.x - 40) + " ," + (TOP_SPACE - 10) + ")")
               .style("text-anchor", "middle")
			   .style("font-size", "20px")
               .attr('stroke', 'black')
               .text("Issue");

    bar_chart_g.append("text")
               .attr("transform", "translate(" + ((ORIGIN.x+width-RIGHT_SPACE)/2) + " ," + (TOP_SPACE - 50) + ")")
               .style("text-anchor", "middle")
               .attr('stroke', 'black')
               .style("font-size", "30px")
               .text("Top 10 Bank Issue Bar Chart In U.S.");

	//x axis
    bar_chart_g.append("g")
			   .attr("class", "x axis")
       	       .attr("transform", "translate(" + ORIGIN.x + "," + ORIGIN.y + ")")
      	       .call(d3.axisBottom(x).tickFormat(function(d) {
				                                       return parseInt(d / 1000) + "k"; })
			   .tickSizeInner([-(ORIGIN.y-TOP_SPACE)]));

	//y axis
    bar_chart_g.append("g")
               .attr("class", "y axis")
			   .attr("transform", "translate(" + ORIGIN.x + "," + TOP_SPACE + ")")
               .call(d3.axisLeft(y));

	//bar
    bar_chart_g.selectAll(".bar")
               .data(counted_data)
               .enter().append("rect")
               .attr("class", "bar")
               .attr("x", ORIGIN.x)
               .attr("y", function(d) { return y(d.Issue) + TOP_SPACE; })
               .attr("width", function(d) { return x(d.Count); })
			   .attr("height", y.bandwidth())
			   .attr("active", "1")
			   .style("fill", function(d){ return color(d.Issue); })
               .on("mouseover", function(){
					 d3.select(this).style("cursor", "pointer");
					 return tooltip.style("visibility", "visible");})
	           .on("mousemove", function(d){
					 return tooltip.style("top", (d3.event.pageY-10)+"px")
					               .style("left",(d3.event.pageX+20)+"px") +
						    tooltip.html("Issue: "+d.Issue+ "<br/>" +"Count: " + d.Count);})
	           .on("mouseout", function(){
					 return tooltip.style("visibility", "hidden");})
			   .on("click", function(d){
					if(d.Issue == null){
					    throw "d.Issue is null";
					}

					//make the circles on the map appear/disappear
					var className = "circle" + issue_id[d.Issue];
					var oldOpacity = d3.select("." + className).style("opacity");
					var newOpacity = oldOpacity * (-1) + 1;
					var circles = d3.selectAll("." + className).style("opacity", newOpacity);

					//put the circle elements at the top or bottom
					if( newOpacity == "0" ){
						circles.lower();
					}
					else{
						circles.raise();
					}

					//activate / deactivate the bar to change color
					this_bar = d3.select(this)
					var current_active_state = this_bar.attr("active");
					var new_active_state = current_active_state * (-1) + 1;

					this_bar.attr("active", new_active_state);
					if( current_active_state == "1" ){
					    //this_bar.style("fill", "rgb(220,220,220)");
					    this_bar.style("opacity", 0.3);
					}
					else{
					    //this_bar.style("fill", color(d.Issue));
					    this_bar.style("opacity", 1);
					}

			   });

});

//US MAP

var urls= {
  usa: "https://gist.githubusercontent.com/mbostock/4090846/raw/us.json"
};

CIRCLE_SIZE = 3.5;

var map_svg = d3.select("#map_svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				//.attr("transform", "translate(80, 0)")
				.on("click", stopped, true);

var map_g = map_svg.append("g")
                   .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var g = {
  basemap: map_g.append("g").attr("id", "basemap"),
  Issue: map_g.append("g").attr("id", "Issues"),
  //tooltip: svg.append("g").attr("id", "tooltip"),
  legend: map_g.append("g").attr("id", "legend"),
};

var zoom = d3.zoom()
    // no longer in d3 v4 - zoom initialises with zoomIdentity, so it's already at origin
    // .translate([0, 0])
    // .scale(1)
    .scaleExtent([1, 8])
    .on("zoom", zoomed);
map_g.call(zoom); // delete this line to disable free zooming
    // .call(zoom.event); // not in d3 v4

//var width  = +svg.attr("width");
//var height = +svg.attr("height");

var radius = {min: 6, max: 12};

// placeholder for state data once loaded
var states = null;
    active = d3.select(null);

// only focus on the continental united states
// https://github.com/d3/d3-geo#geoAlbers
var projection = d3.geoAlbers();

// trigger map drawing
d3.json(urls.usa, drawMap);

/*
 * draw the continental united states
 */
function drawMap(error, map) {
    // determines which ids belong to the continental united states
    // https://gist.github.com/mbostock/4090846#file-us-state-names-tsv
    var isContinental = function(d) {
        var id = +d.id;
        return id<60 && id!=2 && id!=15;
    };

    // filter out non-continental united states
    var old = map.objects.states.geometries.length;
    map.objects.states.geometries = map.objects.states.geometries.filter(isContinental);
    //console.log("Filtered out " + (old - map.objects.states.geometries.length) + " states from base map.");

    // size projection to fit continental united states
    // https://github.com/topojson/topojson-client/blob/master/README.md#feature

    states= topojson.feature(map, map.objects.states);
    projection.fitSize([width, height], states);

    // draw base map with state borders
    var base = g.basemap.append("g").attr("id", "basemap");
    var path = d3.geoPath(projection);

    base.append("path")
        .datum(states)
        .attr("class", "land")
        .attr("d", path)
        .attr("width", 100 )
        .attr("height", 220)
        .on("click", clicked);

    //console.log("hi", base);
    //console.log(basemap);
    // draw interior and exterior borders differently
    // https://github.com/topojson/topojson-client/blob/master/README.md#mesh

    // used to filter only interior borders
    var isInterior = function(a, b) { return a !== b; };

    // used to filter only exterior borders
    var isExterior = function(a, b) { return a === b; };

    base.append("path")
    .datum(topojson.mesh(map, map.objects.states, isInterior))
    .attr("class", "border interior")
    .attr("d", path);

    base.append("path")
    .datum(topojson.mesh(map, map.objects.states, isExterior))
    .attr("class", "border exterior")
    .attr("d", path);

    //boarder
    map_g.append("rect")
	   .attr("class", "background")
       .attr("width", width)
       .attr("height", height)
       .attr("stroke", "black")
       .on("click", reset);

    // Get the data
    d3.csv("USmapnew2.csv", function(error, data) {
        //console.log(data)
        if (error) throw error;
        // format the data
        data.forEach(function(d) {
            d.Longitude = +d.Longitude;
            d.Latitude = +d.Latitude;
            d.Count =+ d.Count;
            d.ZIP_code =+ d.ZIP_code;
        });
        //
        // // Scale the range of the data
        // x.domain(d3.extent(data, function(d) { return d.Longitude; }));
        // y.domain([0, d3.max(data, function(d) { return d.Latitude; })]);

        var dataNest = d3.nest()
                    .key(function(d) {return d.Issue;})
                    .entries(data)
                    .reverse();

        //console.log(dataNest)

        var legendSpace = width/(dataNest.length*20); // spacing for the legend
        //console.log(legendSpace)

        var select = false;
        var highlight = '#333333';
        var background = '#ccc';

		//legend background
		/*
		map_svg.append("rect")
		       .attr("width", 265)
			   .attr("height", dataNest.length * 30)
			   .attr("transform", "translate(" + (width - 275) + ", 40)")
			   .style("fill", "rgb(253, 219, 172)")*/

        dataNest.forEach(function(d,i) {
            var className = "circle" + issue_id[d.key];
            d.values.forEach(function(o,i){

                map_g.append("circle")
			        .attr("class", className)
                    .style("fill", color(d.key))
					.style("opacity", 1)
                    .attr("cx", projection([o.Longitude, o.Latitude])[0])
                    .attr("cy", projection([o.Longitude, o.Latitude])[1])
                    .attr("r", CIRCLE_SIZE)
					.on("mouseover", function(){
						if( d3.select(this).style("opacity") == "1" ){
							return tooltip.style("visibility", "visible");
						}
					})
	                .on("mousemove", function(){
					    if( d3.select(this).style("opacity") == "1" ){
							tooltip.style("top", (d3.event.pageY-10)+"px")
					               .style("left", (d3.event.pageX+20)+"px");
						    tooltip.html("Issue: " + o.Issue + "<br/>" +
						                 "State: " + o.State + "<br/>" +
         						         "Zip Code: " + o.ZIP_code + "<br/>" +
									     "Count: " + o.Count + "<br/>" +
									     "Latitude: " + o.Latitude + "<br/>" +
									     "Longitude: " + o.Longitude);
						}
					})
	                .on("mouseout", function(){
					    if( d3.select(this).style("opacity") == "1" ){
							return tooltip.style("visibility", "hidden");
						}
					})

            });

            //legend
			/*
            map_svg.append("text")
               .attr("x", width - 20)  // space legend
               .attr("y", 60 + i*30)
               .attr("class", "legend")    // style the legend
               .attr("fill", function() { // Add the colours dynamically
                          return d.color = color(d.key); })
			   .style("font-size", "12px")
               .style("text-anchor", "end")
			   .on("mouseover", function(){
					 d3.select(this).style("cursor", "pointer");
			   })
			   .on("click", function(){
						  var oldOpacity = d3.select("." + className).style("opacity");
						  var newOpacity = oldOpacity * (-1) + 1;
						  d3.selectAll("." + className).style("opacity", newOpacity);

				})
                .text(d.key)*/

        }); //end dataNest.forEach

		//title background
		map_g.append("rect")
		       .attr("width", width - 2)
			   .attr("height", 40)
			   .attr("transform", "translate(1, 0)")
			   .style("fill", "rgb(250, 250, 250)")

        // Title
        /*svg.append("div")
		       .style("background-color", "lightgrey").text("testtttdfff")
			   .style("top", "1000px")
			   .style("left","500px")
			   .attr("transform", "translate(" + 400 + " ," + 0 + ")")*/
		map_g.append("text")
               .attr("transform", "translate(" + (width/2) + " ," + 0 + ")")
               .attr('stroke', 'black')
               .style("font-size", "30px")
               .style("text-anchor", "middle")
               .attr("dominant-baseline", "hanging")
               .text("Map For Top Ten Bank Issues In CA");
    });
}


function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);

  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = Math.max(1, Math.min(8, 0.9 / Math.max(dx / width, dy / height))),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

      map_g.transition()
          .duration(750)
          // .call(zoom.translate(translate).scale(scale).event); // not in d3 v4
          .call( zoom.transform, d3.zoomIdentity.translate(translate[0],translate[1]).scale(scale) ); // updated for d3 v4
}

// legend = g.legend.attr("transform", translate(150,200))
//          .selectAll("g")
//          .data(d.key)
//          .enter().append("g");



  // legend.append("text")
  //       .attr("dx", 8)
  //       .attr("dy", function(d,i){return (i*20)+8})
  //       .style("font-size", 11)
  //       // .style("font-weight", "bolder")
  //       .text(function(d){return d});

function reset() {
    active.classed("active", false);
    active = d3.select(null);

    map_g.transition()
      .duration(750)
      // .call( zoom.transform, d3.zoomIdentity.translate(0, 0).scale(1) ); // not in d3 v4
      .call( zoom.transform, d3.zoomIdentity ); // updated for d3 v4
}

function zoomed() {
    map_g.style("stroke-width", 1.5 / d3.event.transform.k + "px");
    // g.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")"); // not in d3 v4
    //map_g.attr("transform", d3.event.transform); // updated for d3 v4
    g.basemap.attr("transform", d3.event.transform); // updated for d3 v4
    d3.selectAll("circle").attr("transform", d3.event.transform)
                          .attr("r", CIRCLE_SIZE / d3.event.transform.k);
}

// If the drag behavior prevents the default click,
// also stop propagation so we don’t click-to-zoom.
function stopped() {
  if (d3.event.defaultPrevented) d3.event.stopPropagation();
}

/*
map_g.append('input')
       .attr('type', 'button')
	   .attr('value', 'sdfsdfsdfsdf')
	   .attr("transform", "translate(100,100)")
	   //.call(d3.button());*/
