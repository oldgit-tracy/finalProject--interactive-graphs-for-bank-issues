//modified code from https://bl.ocks.org/Ananda90/c181d1fc7b6e5acd63f2155319387412
// tooltip: modified from http://bl.ocks.org/biovisualize/1016860


    var margin = {top: 30, right: 500, bottom: 100, left: 200},
        width = 1000 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
        // append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
    var svg2 = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


// set the ranges
var x = d3.scaleLinear().range([0, width+200]);
var y = d3.scaleBand().range([height, 0]).padding(0.1);

var tooltip = d3.select("body")
         .append("div")
         .style("position", "absolute")
         .style("z-index", "10")
         .style("visibility", "hidden")
         .style("font-size", "15px")

var g = svg2.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("barchartnew.csv", function(error, data) {
  	if (error) throw error;
    data.forEach(function(d){
      d.Count =+ d.Count;
    //  d.Issue = d.Issue;
    })
console.log(data)
    //data.sort(function(a, b) { return a.value - b.value; });
    x.domain([0, d3.max(data, function(d) { return d.Count; })]);
  	//x.domain(d3.extent(data, function(d) { return d.Count; }));
//console.log(x.domain());
  y.domain(data.map(function(d) { return d.Issue; })).padding(0.1);

      // text label for the x axis
    svg2.append("text")
        .attr("transform", "translate(" + (width/2+250) + " ," + (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .attr('stroke', 'black')
        .text("Count");

    svg2.append("text")
        .attr("transform", "translate(" + 60 + " ," + 25 + ")")
        .style("text-anchor", "middle")
        .attr('stroke', 'black')
        .text("Issue");

    svg2.append("text")
        .attr("transform", "translate(" + (width+100) + " ," + 0 + ")")
        .style("text-anchor", "middle")
        .attr('stroke', 'black')
        .style("font-size", "30px")
        .text("Top 10 Bank Issue Bar Chart In U.S.");


    g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).tickFormat(function(d) { return parseInt(d / 1000) + "k"; }).tickSizeInner([-height]));

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.Issue); })
        .attr("width", function(d) { return x(d.Count); })
        .on("mouseover", function(){return tooltip.style("visibility", "visible");})
	      .on("mousemove", function(d){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")+tooltip.html("Issue: "+d.Issue+ "<br/>" +"Count: " + d.Count);})
	      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});



});
