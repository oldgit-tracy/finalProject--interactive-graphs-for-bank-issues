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



// var countries = d3.map();
//
// var x = d3.scaleLinear()
//     .domain([1, 10])
//     .rangeRound([600, 860]);
//
// var color = d3.scaleThreshold()
//     .domain(d3.range(12, 109627))
//     .range(d3.schemeBlues[9]);
//
// var g = svg.append("g")
//     .attr("class", "key")
//     .attr("transform", "translate(0,20)");
//
//     g.append("text")
//     .attr("class", "caption")
//     .attr("x", x.range()[0])
//     .attr("y", -6)
//     .attr("fill", "#000")
//     .attr("text-anchor", "start")
//     .attr("font-weight", "bold")
//     .text("Count of counties");
//
//     g.call(d3.axisBottom(x)
//     .tickSize(10)
//     //.tickFormat(function(x, i) { return i ? x : x + "%"; })
//     .tickValues(color.domain()))
//   .select(".domain")
//     .remove();
//
//
//
//
//     d3.queue()
//        //.defer(d3.json, "https://d3js.org/us-10m.v1.json")
//         .defer(d3.csv, "general.csv", function(d) { countries.set(+d.latitude, +d.longitude); })
//         .await(ready);
//
//     function ready(error, us) {
//       if (error) throw error;
//
//       svg.append("g")
//           //.attr("class", "states")
//       //  .selectAll("path")
//         .data(csv.feature(d, d.Count).features)
//         .enter().append("path")
//           .attr("fill", function(d) { return color(d.states = countries.get(d.Count)); })
//           .attr("d", path)
//         .append("title")
//           .text(function(d) { return d.rate + "%"; });
//
//       svg.append("path")
//           //.datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
//           .attr("class", "states")
//           .attr("d", path);
// }
