// modified code from https://gist.github.com/d3noob/f8b7f107ba25c21971851728520224cb
// mouse event: https://bl.ocks.org/larsenmtl/e3b8b7c2ca4787f77d78f58d41c3da91

// Set the dimensions of the canvas / graph
var margin1 = {top: 50, right: 100, bottom: 150, left: 250},
    width1 = 830 - margin1.left - margin1.right,
    height1 = 600 - margin1.top - margin1.bottom;



// set the ranges
var xaxis = d3.scaleLinear().range([0, width1]);
var yaxis = d3.scaleLinear().range([height1, 30]);

// Define the line
var companyline = d3.line()
    .x(function(d) { return xaxis(d.Year); })
    .y(function(d) { return yaxis(d.Count); })

    //console.log(companyline)

    // append the svg1 obgect to the body of the page
    // appends a 'group' element to 'svg1'
    // moves the 'group' element to the top left margin1
var svg1 = d3.select("#lines_svg")
             .attr("width", width1 + margin1.left + margin1.right)
             .attr("height", height1 + margin1.top + margin1.bottom)
             .append("g")
             .attr("transform", "translate(" + margin1.left + "," + margin1.top + ")");


// Get the data1
d3.csv("lines.csv", function(error, data1) {
    console.log(data1)
    if (error) throw error;
    // format the data1
    data1.forEach(function(d1) {
      d1.Year = +d1.Year;
      d1.Count = +d1.Count;
      //console.log(data11)
    });

//console.log(data1)
    // Scale the range of the data1
    xaxis.domain(d3.extent(data1, function(d1) { return d1.Year; }));
    yaxis.domain([0, d3.max(data1, function(d1) { return d1.Count; })]);

    //data1.sort(function(a, b){return a.Year-b.Year}); // sort data1 in ascending order
    //Nest the entries by Company
    var dataNest1 = d3.nest()
        .key(function(d1) {return d1.Company;})
        .entries(data1);
        console.log(dataNest1)

       // set the colour scale
        var color = d3.scaleOrdinal(d3.schemeCategory10);
        // legendSpace = width1/(dataNest1.length*1.6); // spacing for the legend


        // Loop through each symbol / key
        dataNest1.forEach(function(d1,i) {
          if (error) throw error;
            var all_paths = svg1.append("path")
                .datum(d1)
                .attr("class", "line")
                .style("opacity", "0.5")
                .style("stroke", function() { // Add the colours dynamically
                    return d1.color = color(d1.key); })
                //.attr("id", 'tag'+d.key.replace(/\s+/g, '')) // assign an ID
                .attr("d", companyline(d1.values))
				.attr("stroke-dasharray", function(d) {
				    return this.getTotalLength() + " " + this.getTotalLength(); })
				.attr("stroke-dashoffset", function(d) { return this.getTotalLength(); })
				.transition()
				.duration(3000)
				.ease(d3.easeLinear)
				.attr("stroke-dashoffset", 0)
				;

			/*var t = d3.transition()
				      .duration(3000)
					  .ease(d3.easeLinear);

			all_paths.transition(t).attr("stroke-dashoffset", 0);*/

            // Add the Legend
            svg1.append("text")
                .attr("x", 455)  // space legend
                .attr("y", 80+i*30)
                .attr("class", "legend")    // style the legend
                .style("fill", function() { // Add the colours dynamically
                    return d1.color = color(d1.key); })
                .text(d1.key)
                .style("text-anchor", "end");


                // Add the X Axis
            svg1.append("g")
                .attr("transform", "translate(0," + height1 + ")")
                .call(d3.axisBottom(xaxis).ticks(7).tickFormat(d3.format(".0f")));

                // text label for the x axis
            svg1.append("text")
              .attr("transform", "translate(" + (width1/2) + " ," + (height1 + margin1.top ) + ")")
              .style("text-anchor", "middle")
              .text("Year");

              // Add the Y Axis
            svg1.append("g")
            //.attr("class", "axis")
              .call(d3.axisLeft(yaxis));


              // text label for the y axis
            svg1.append("text")
              .attr("transform", "rotate(-90)")
              .attr("y", 0 - 80)
              .attr("x",0 - (height1 / 2))
              .attr("dy", "1em")
              .style("text-anchor", "middle")
              .text("Count");

              // Title
            svg1.append("text")
              .attr("transform", "translate(" + (width1/2) + " ," + -15 + ")")
              .attr('stroke', 'black')
              .style("font-size", "30px")
              .style("text-anchor", "middle")
              .text("Top One Bank Issue Trend In Four Banks");
              // Title
            svg1.append("text")
              .attr("transform", "translate(" + (width1/2) + " ," + 15 + ")")
              //.attr('stroke', 'black')
              .style("font-size", "20px")
              .style("text-anchor", "middle")
              .text("Loan modification,collection,foreclosure");

//
// text box

 });


var mouseG = svg1.append("g")
     .attr("class", "mouse-over-effects");
   mouseG.append("path") // this is the black vertical line to follow mouse
     .attr("class", "mouse-line")
     .style("stroke", "black")
     .style("stroke-width", "1px")
     .style("opacity", "0");

   var lines = document.getElementsByClassName('line');
// console.log(lines);
   var mousePerLine = mouseG.selectAll('.mouse-per-line')
     .data(dataNest1)
     .enter()
     .append("g")
     .attr("class", "mouse-per-line");
// console.log(dataNest1);
// console.log(mousePerLine);



    //  text
   mousePerLine.raise().append("text")
     .attr("transform", "translate(10,30)")
     .attr("fill", function(d1) {return color(d1.key);})
console.log(mousePerLine);

//console.log(mousePerLine);
   mouseG.append('svg:rect') // append a rect to catch mouse movements on canvas
     .attr('width', width1) // can't catch mouse events on a g element
     .attr('height', height1)
     .attr('fill', 'none')
     .attr('pointer-events', 'all')
     .on('mouseout', function() { // on mouse out hide line and text
       d3.select(".mouse-line")
         .style("opacity", "1");
       d3.selectAll(".mouse-per-line text")
         .style("opacity", "1");
     })
     .on('mouseover', function() { // on mouse in show line and text
       d3.select(".mouse-line")
         .style("opacity", "0.5");
       d3.selectAll(".mouse-per-line text")
         .style("opacity", "0.8")
         .style("font-size", "20px");
     })
     .on('mousemove', function() { // mouse moving over canvas
       var mouse = d3.mouse(this);
       d3.select(".mouse-line")
         .attr("d", function() {
           var m = "M" + mouse[0] + "," + height1;
           m += " " + mouse[0] + "," + 0;
           return m;
         });

       d3.selectAll(".mouse-per-line")
         .attr("transform", function(d,i) {
          //  console.log(d,i,lines)
           //console.log(width1/mouse[0])

// console.log("hi",d,i)
           var beginning = 0,
               end = lines[i].getTotalLength(),
               target = null;
//console.log(lines[i]);
           while (true){
             target = Math.floor((beginning + end) / 2);

             pos = lines[i].getPointAtLength(target);

             if ((target === end || target === beginning) && pos.x !== mouse[0]) {
                 break;
             }
             if (pos.x > mouse[0])      end = target;
             else if (pos.x < mouse[0]) beginning = target;
             else break; //position found
           }

           d3.select(this).select('text')
             .text(yaxis.invert(pos.y).toFixed(0));

             var trans_x = mouse[0];
       if(i == 3 && 2014 < xaxis.invert(mouse[0])){
        trans_x = trans_x - 70;
       }
             return "translate(" + trans_x + "," + pos.y +")";
         });
         //console.log(mouse[0]);


});
});
