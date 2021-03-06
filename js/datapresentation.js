var widthPanel = document.getElementById('panel-stat').offsetWidth;

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = widthPanel - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var z = d3.scale.ordinal()
    .rangeRoundBands([0, width], 0.4);

var x = d3.scale.ordinal();

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.ordinal()
    .range(["#ff0000", "#00ff00", "#0000ff"]);

var xAxis = d3.svg.axis()
    .scale(z)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(15,10000);

var svg = d3.select("#YrStat").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("csv/data.csv", function(error, data) {
    if (error) throw error;

    var statInfo = d3.keys(data[0]).filter(function(key) { return key !== "Month"; });

    data.forEach(function(d) {
        d.ages = statInfo.map(function(name) { return {name: name, value: +d[name]}; });
    });

    z.domain(data.map(function(d) { return d.Month; }));
    x.domain(statInfo).rangeRoundBands([0, z.rangeBand()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(d.ages, function(d) { return d.value; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".75em")
        .style("text-anchor", "end")
        .text("Yearly Data");

    var state = svg.selectAll(".state")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + z(d.Month) + ",0)"; });

    state.selectAll("rect")
        .data(function(d) { return d.ages; })
        .enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("x", function(d) { return x(d.name); })
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); })
        .style("fill", function(d) { return color(d.name); });

    var legend = svg.selectAll(".legend")
        .data(statInfo.slice().reverse())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", "0.40em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

});