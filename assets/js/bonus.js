// Chart Params
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 10, 
    right: 20, 
    bottom: 140, 
    left: 120
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
        .domain([d3.min(stateData, d => d[chosenXAxis]) * 0.9, d3.max(stateData, d => d[chosenXAxis]) * 1.2
        ])
        .range([0, width]);
    return xLinearScale;
}
function yScale(stateData, chosenYAxis){
    var yLinearScale = d3.scaleLinear()
        .domain([5, d3.max(stateData, d => d[chosenYAxis]) * 0.5, d3.max(stateData, d => d[chosenYAxis]) * 1.2
        ])
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
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    return yAxis
}

// update circles group with transition
function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cx", d => newXScale(d[chosenXAxis]));
    return circlesGroup;
}
function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
        .duration(1000)
        .attr("cy", d => newXScale(d[chosenYAxis]));
    return circlesGroup;
}

//update circles group
function updateToolTip(chosenXAxis, circlesGroup) {
    var xLabel;
    if (chosenXAxis === "age") {
        xLabel = "Age (median)";
    }
    else if (chosenXAxis === "income") {
        xLabel = "Household Income";
    }
    else {
        xLabel ="% in Poverty";
    }

    var yLabel;
    if (chosenYAxis === "smokes") {
        yLabel = "Smoking Rate";
    }
    else if (chosenYAxis === "healthcare") {
        yLabel = "% with Healthcare";
    }
    else {
        yLabel ="Obesity Rate";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`<b>${d.abbr}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
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
    });
    
    // Add X axis
    var x = xScale(stateData, chosenXAxis);
    // Add Y axis
    var y = yScale(stateData, chosenYAxis);
    // initial axis 
    var bottomAxis = d3.axisBottom(x);
    var leftAxis = d3.axisLeft(y);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);
    var yAxis = chartGroup.append("g")
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
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 30})`);
    
        // multiple x labels
    var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .attr("active", true)
        .attr("class", "axisText")
        .text("% In Poverty");
    var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .attr("inactive", true)
        .attr("class", "axisText")
        .text("Age (median)");
    var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .attr("inactive", true)
        .attr("class", "axisText")
        .text("Household Income");
    
        // multiple y labels
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
    var obesityLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 20)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "obesity")
        .attr("active", true)
        .attr("class", "axisText")
        .text("Obesity Rate");
    var smokesLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "smokes")
        .attr("inactive", true)
        .attr("class", "axisText")
        .text("Smoking Rate");
    var healthcareLabel = yLabelsGroup.append("text")
        .attr("y", 0 - margin.left + 60)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("value", "healthcare")
        .attr("inactive", true)
        .attr("class", "axisText")
        .text("% with Healthcare");

    var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
    
    xLabelsGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(stateData, chosenYAxis);
                xAxis = renderAxes(xLinearScale, xAxis);

                circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);
                
                circlesGroup = updateToolTip(chosenXAxis, chosenYAxis);
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

        yLabelsGroup.selectAll("text")
        .on("click", function(){
            var value = d3.select(this).attr("value");
            if (value !== chosenYAxis) {
                chosenYAxis = value;
                yLinearScale = yScale(stateData, chosenYAxis);
                yAxis = renderAxes(yLinearScale, yAxis);

                circlesGroup = renderCircles(circlesGroup, yLinearScale, chosenYAxis);
                
                circlesGroup = updateToolTip(chosenXAxis, circlesGroup);
                if (chosenYAxis === "smokes"){
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    healthcareLabel
                        .classed("active", false)
                        .classed("inactive", true);
                }
                else if (chosenYAxis === "healthcare"){
                    obesityLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
                        .classed("active", true)
                        .classed("inactive", false);
                }
                else {
                    obesityLabel
                        .classed("active", true)
                        .classed("inactive", false);
                    smokesLabel
                        .classed("active", false)
                        .classed("inactive", true);
                    healthcareLabel
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
        .attr("x", d => x(d[chosenXAxis]))
        .attr("y", d => y(d[chosenYAxis]))
        .text(d => d.abbr)
        .attr("font-family", "sans-serif")
        .attr("font-size", "9px")
        .attr("fill", "white")
        .attr("text-anchor", "middle");

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`<b>${d.abbr}<br>${xLabel}: ${d[chosenXAxis]}<br>${yLabel}: ${d[chosenYAxis]}`);
        });
        circlesText.on("mouseover", function(stateData) {
            toolTip.show(stateData, this);
        })
            .on("mouseout", function(stateData, index) {
                toolTip.hide(stateData);
            });

    }).catch(function(error) {
      console.log(error);
});



