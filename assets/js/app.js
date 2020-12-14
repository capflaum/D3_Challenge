// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 10, 
    right: 20, 
    bottom: 80, 
    left: 80
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("assets/data/data.csv").then(function(stateData) {
    console.log(stateData);
    stateData.forEach(function(data) {
        state = data.state;
        abbr = data.abbr;
        age = data.age
        poverty = data.poverty;
        obesity = data.obesity;

        income = data.income;
        smokes = data.smokes;
        healthcare = data.healthcare
        console.log(age, smokes);
    })
    // Add X axis
    var x = d3.scaleLinear()
        .domain([5, 25])
        .range([0, width]);

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([5, d3.max(stateData, d => d.obesity)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(x);
    var leftAxis = d3.axisLeft(y);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    chartGroup.append("g")
        .call(leftAxis);

    // Add dots
    var circlesGroup = chartGroup.selectAll("circle")
        .data(stateData)
        .enter()
        .append("circle")
        .attr("cx", d => x(d.poverty))
        .attr("cy", d => y(d.obesity))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("stroke", "black")
        .attr("opacity", "0.5");
        
        // Add state labels to the points
    var circleLabels = chartGroup.selectAll(null)
        .data(stateData)
        .enter()
        .append("text");

    var circleText = circleLabels
            .attr("x", d => x(d.poverty))
            .attr("y", d => y(d.obesity))
            .text(d => d.abbr)
            .attr("font-family", "sans-serif")
            .attr("font-size", "9px")
            .attr("fill", "white")
            .attr("text-anchor", "middle");

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`<b>${d.abbr}<br>Poverty: ${d.poverty}<br>Obesity: ${d.obesity}`);
        });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("mouseover", function(stateData) {
        toolTip.show(stateData, this);
    })
        // onmouseout event
        .on("mouseout", function(stateData, index) {
            toolTip.hide(stateData);
        });

    circleText.on("mouseover", function(stateData) {
        toolTip.show(stateData, this);
    })
        .on("mouseout", function(stateData, index) {
            toolTip.hide(stateData);
        });

        // Create axes labels
        chartGroup.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height / 2))
            .attr("dy", "1em")
            .attr("class", "axisText")
            .text("Obesity Rate");
  
        chartGroup.append("text")
            .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
            .attr("class", "axisText")
            .text("% In Poverty");

    }).catch(function(error) {
      console.log(error);
});



