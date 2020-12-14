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

// append svg group
var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left}, ${margin.top})`);

//initial param
var chosenXAxis = "poverty"
var chosenYAxis = "obesity"

//updating axis scale(size) with axis click
function xScale(stateData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
        .domain([d3.extent(chosenXAxis)])
        .range([0, width]);
    return xLinearScale;
}
function yScale(stateData, chosenYAxis){
    var yLinearScale = d3.scaleLinear()
        .domain([d3.extent(chosenYAxis)])
        .range([height, 0]);
    return yLinearScale;
}

// updating axis with transition
function renderAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
    return xAxis;
}

function renderAxes(newYScale, yAxis){
    var leftAxis = d3.axisLeft(y);

    yAxis.transition()
    .duration(1000)
    .call(leftAxis);
}

// update circles group with transition
function renderCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}
function renderCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newXScale(d[chosenYAxis]));
    return circlesGroup;
}

//update circles group
function updateToolTip(chosenXAxis, chosenYAxis) {
    var xlabel;
    if (chosenXAxis === "age") {
        xlabel = "Age (median)";
    }
    else if (chosenXAxis === "income") {
        xlabel = "Household Income";
    }
    else {
        xlabel ="% in Poverty"
    }
    var ylabel;
    if (chosenYAxis === "smokes") {
        ylabel = "Smoking Rate";
    }
    else if (chosenYAxis === "healthcare") {
        ylabel = "% with Healthcare";
    }
    else {
        ylabel ="Obesity Rate"
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80. -60])
        .html(function(d) {
            return (`<b>${d.abbr}<br>${xlabel}: ${d[chosenXAxis]}<br>${ylabel}: ${d[chosenYAxis]}`);
        });
    
    circlesGroup.call(toolTip);
    
    circlesGroup.on("mouseover", function(stateData) {
        toolTip.show(stateData, this);
    })
        // onmouseout event
        .on("mouseout", function(stateData, index) {
            toolTip.hide(stateData);
        });
    return circlesGroup;
}

//Read the data
d3.csv("assets/data/data.csv").then(function(stateData, err) {
    if(err) throw err;
    console.log(stateData);
    stateData.forEach(function(data) {
        state = data.state;
        abbr = data.abbr;
        
        poverty = data.poverty;
        age = data.age
        income = data.income;
        
        obesity = data.obesity;
        smokes = data.smokes;
        healthcare = data.healthcare
        console.log(age, smokes);
    })
    // Add X axis
    var x = xScale(stateData, chosenXAxis)

    // Add Y axis
    var y = yScale(chosenYAxis, stateData)

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
        .attr("cx", d => x(d[chosenXAxis]))
        .attr("cy", d => y(d[chosenYAxis]))
        .attr("r", 10)
        .attr("fill", "blue")
        .attr("stroke", "black")
        .attr("opacity", "0.5");
    
    // create multiple axis labels
    var labelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20})`);
    
        // multiple x labels
    var povertyLabel = labelsGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
        .attr("value", "poverty")
        .attr("active", true)
        .attr("class", "axisText")
        .text("% In Poverty");
    var ageLabel = labelsGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
        .attr("value", "age")
        .attr("inactive", true)
        .attr("class", "axisText")
        .text("Age (median)");
    var incomeLabel = labelsGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
        .attr("value", "income")
        .attr("inactive", true)
        .attr("class", "axisText")
        .text("Household Income");
    
        // multiple y labels
    var obesityLabel = labelsGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
        .attr("value", "obesity")
        .attr("active", true)
        .attr("class", "axisText")
        .text("Obesity Rate");
    var smokesLabel = labelsGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
        .attr("value", "smokes")
        .attr("inactive", true)
        .attr("class", "axisText")
        .text("Smoking Rate");
    var healthcareLabel = labelsGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 40})`)
        .attr("value", "healthcare")
        .attr("inactive", true)
        .attr("class", "axisText")
        .text("% with Healthcare");

    circlesGroup.updateToolTip(chosenXAxis, chosenYAxis);
    
    labelsGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;

                xLinearScale = xScale(stateData, chosenXAxis);
                xAxis = renderAxes(xLinearScale, xAxis);

                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

                if (chosenXAxis === "age"){
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    incomeLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenXAxis === "income"){
                    povertyLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    ageLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    incomeLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                povertyLabel
                    .classed("active", true)
                    .classed("inactive", false);
                ageLabel
                    .classed("active", false)
                    .classed("inactive", true);
                incomeLabel
                    .classed("active", false)
                    .classed("inactive", true);
                }
            }
        })
        
    // Add state labels to the points
    var circlesLabels = chartGroup.selectAll(null)
        .data(stateData)
        .enter()
        .append("text");

    var circlesText = circlesLabels
        .attr("x", d => x(d.poverty))
        .attr("y", d => y(d.obesity))
        .text(d => d.abbr)
        .attr("font-family", "sans-serif")
        .attr("font-size", "9px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");

        circlesText.on("mouseover", function(stateData) {
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
  
    }).catch(function(error) {
      console.log(error);
});



