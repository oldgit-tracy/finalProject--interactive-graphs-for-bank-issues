// modified code from https://gist.github.com/d3noob/f8b7f107ba25c21971851728520224cb

// Set the dimensions of the canvas / graph
var margin = {top: 30, right: 20, bottom: 70, left: 50},
    width = 830 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;



// set the ranges
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// Define the line
var companyline = d3.line()
    .x(function(d) { return x(d.Year); })
    .y(function(d) { return y(d.Count); })

    //console.log(companyline)

    // append the svg obgect to the body of the page
    // appends a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
var svg = d3.select("body")
    .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


// Get the data
d3.csv("line.csv", function(error, data) {
    console.log(data)
    if (error) throw error;
    // format the data
    data.forEach(function(d) {
      d.Year = +d.Year;
      //d.Year = parseDate(d.Year);
      d.Count = +d.Count;


      //console.log(data)
    })
      ;
//console.log(data)
    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d.Year; }));
    y.domain([0, d3.max(data, function(d) { return d.Count; })]);

    data.sort(function(a, b){return a.Year-b.Year}); // sort data in ascending order
    //Nest the entries by Company
    var dataNest = d3.nest()
        .key(function(d) {return d.Company;})
        //.key(function(d) { return d.Year; }).sortKeys(d3.ascending)
        //.rollup(function(v) { return d3.sum(v, function(d) { return d.Count; }); })
        .entries(data);
        console.log(dataNest)

        // set the colour scale
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        legendSpace = width/(dataNest.length*1.485); // spacing for the legend

        // Loop through each symbol / key
        dataNest.forEach(function(d,i) {
          if (error) throw error;
            svg.append("path")
                .attr("class", "line")
                //.attr("d", companyline(d.values))
                //.style("stroke", "orange");
                .style("stroke", function() { // Add the colours dynamically
                    return d.color = color(d.key); })
                .attr("d", companyline(d.values));
// console.log(d.values)
            // Add the Legend
            svg.append("text")
                .attr("x", (legendSpace/30)+i*1.765*legendSpace)  // space legend
                .attr("y", height + (margin.bottom/2)+ 15)
                .attr("class", "legend")    // style the legend
                .style("fill", function() { // Add the colours dynamically
                    return d.color = color(d.key); })
                .text(d.key);


    // Add the X Axis
    svg.append("g")
        //.attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        ;

    // text label for the x axis
svg.append("text")
    .attr("transform",
          "translate(" + (width/2) + " ," +
                         (height + margin.top + 3) + ")")
    .style("text-anchor", "middle")
    .text("Year");

    // Add the Y Axis
    svg.append("g")
    //.attr("class", "axis")
    .call(d3.axisLeft(y));


    // text label for the y axis
  svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Count");


});
});
