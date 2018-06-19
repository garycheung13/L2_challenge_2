function scatterplot() {
    // chart size defaults;
    let height = 550;
    let width = 900;
    let margin = {top: 20, right: 20, bottom: 40, left: 60};
    let axisOffset = 4;
    let updateData;

    // chart text defaults;
    let xAxisLabel = "X Axis";
    let yAxisLabel = "Y Axis";

    // conversion x, y key
    let xValue = function(d) {return d[0]};
    let yValue = function(d) {return d[1]};

    // interpolation
    let xScale = d3.scaleLinear();
    let yScale = d3.scaleLinear();
    let xAxis = d3.axisBottom(xScale).tickSize(0).tickPadding(8);
    let yAxis = d3.axisLeft(yScale).tickSizeOuter(0).tickPadding(8);

    // chart specific
    let _data = [];

    function chart(selection) {
        selection.each(function(){
            // convert from array of objects into array of arrays in order to use index accessors
            // avoids needing property names to get x and y values
            _data = _data.map(function(d, i){
                return [xValue.call(null, d, i), yValue.call(null, d, i)]
            });

            xScale
                .domain([0, d3.max(_data, function(d){return d[0]}) + axisOffset])
                .range([0, width - margin.left - margin.right]);

            yScale
                .domain([0, d3.max(_data, function(d){return d[1]}) + axisOffset])
                .range([height - margin.top - margin.bottom, 0]);

            // update guidelines width before drawing starts
            yAxis.tickSizeInner(-width + margin.left + margin.right)

            // start chart drawing
            // Using viewbox to make chart responsive
            // must assign at least one size attribute or else most browsers
            // will implicitly apply width: 100%, height: auto to the svg (too large)
            const svg = d3.select(this).append("svg")
                .attr("viewBox", "0,0," + width + "," + height)
                .attr("perserveAspectRatio", "xMinYmid meet")
                .style("max-width", width + "px");

            const chartArea = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // create x-axis
            chartArea.append("g")
                    .attr("class", "x-axis axis")
                    .attr("transform", "translate(0," + (height - margin.bottom - margin.top) + ")")
                    .call(xAxis)
                .append("text")
                    .attr("class", "label")
                    .attr("x", width/2)
                    .attr("y", margin.bottom)
                    .style("text-anchor", "end")
                    .text(xAxisLabel);

            // create y-axis
            chartArea.append("g")
                    .attr("class", "y-axis axis")
                    .call(yAxis)
                .append("text")
                    .attr("class", "label")
                    .attr("x", -height/2 + margin.top + margin.bottom)
                    .attr("y", -margin.left/2)
                    .attr("transform", "rotate(-90)")
                    .style("text-anchor", "end")
                    .text(yAxisLabel)


            // create scatterplot dots
            chartArea.selectAll(".dot").data(_data).enter()
                .append("circle")
                    .attr("class", "dot")
                    .attr("r", 5)
                    .attr("cx", function(d){return xScale(d[0]); })
                    .attr("cy", function(d){return yScale(d[1]); })
                    .style("fill", "#c3d855")

            // tooltips
            const tooltip = svg.append("g")
                    .attr("class", "tooltip")
                    .style("display", "none");

            tooltip.append("rect")
                .attr("width", 80)
                .attr("height", 80)
                .attr("fill", "white")
                .attr("stroke", "#c3d855")
                .style("opacity", 1);

            tooltip.append("text")
                .attr("x", 15)
                .attr("dy", "1.2em")
                .style("text-anchor", "start")
                .attr("font-size", "12px")
                .attr("font-weight", "bold");

            // event logic for triggering the tooltip
            svg.selectAll(".dot")
                .on("mouseover", function(d){
                    const hoveredDot = d3.select(this)
                    hoveredDot.attr("stroke", "black");

                    tooltip.style("display", null);
                    const containerText = tooltip.select("text")
                        .attr("class", "tooltip-text")
                        .attr("x", 0)
                        .attr("y", 0)

                    hoveredDot.datum().map(function(item, i){
                        const tooltipLabels = ["X-value", "Y-value"];

                        containerText.append("tspan")
                            .attr("class", "tooltip-label")
                            .attr("x", 10)
                            .attr("dy", 20)
                            .text(tooltipLabels[i]);

                        containerText.append("tspan")
                            .attr("class", "tooltip-value")
                            .attr("x", 10)
                            .attr("dy", 15)
                            .text(item)
                    });
                })

                .on("mousemove", function(){
                    // in the format off [x, y]
                    const mousePos = d3.mouse(this);
                    // offset the position because mouse directly under the mouse causes thrashing
                    tooltip.attr("transform", "translate(" + (mousePos[0] + 65) + "," + (mousePos[1] - 30) + ")");
                })

                .on("mouseout", function(){
                    const hoveredDot = d3.select(this)
                    hoveredDot.attr("stroke", "none");
                    tooltip.style("display", "none");
                    // or else there are leftover tspans from the previous hover
                    tooltip.selectAll("tspan").remove();
                })

            // update steps
            updateData = function() {
                // data formatting
                _data = _data.map(function(d, i){
                    return [xValue.call(null, d, i), yValue.call(null, d, i)]
                });

                xScale
                    .domain([0, d3.max(_data, function(d){return d[0]}) + axisOffset])
                    .range([0, width - margin.left - margin.right]);

                yScale
                    .domain([0, d3.max(_data, function(d){return d[1]}) + axisOffset])
                    .range([height - margin.top - margin.bottom, 0]);

                // updates
                chartArea.select(".x-axis")
                    .transition()
                    .call(xAxis)

                chartArea.select(".y-axis")
                    .transition()
                    .call(yAxis)

                const update = chartArea.selectAll(".dot").data(_data);

                update.transition()
                    .attr("cx", function(d){return xScale(d[0]); })
                    .attr("cy", function(d){return yScale(d[1]); });

                update.enter()
                    .append("circle")
                    .attr("class", "dot")
                    .attr("r", 5)
                    .attr("cx", function(d){return xScale(d[0]); })
                    .attr("cy", function(d){return yScale(d[1]); })
                    .style("fill", "#c3d855");

                update.exit().remove();
            }
        })
    }

    // setter/getters

    chart.height = function(value) {
        if (!arguments.length) return height;
        height = value;
        return chart;
    }

    chart.width = function(value) {
        if (!arguments.length) return width;
        width = value;
        return chart;
    }

    chart.margin = function(value) {
        if (!arguments.length) return margin;
        margin = value;
        return chart;
    }

    chart.axisOffset = function(value) {
        if (!arguments.length) return axisOffset;
        axisOffset = value;
        return axisOffset;
    }

    // get/sets the column used for x values
    chart.xKey = function(value) {
        if (!arguments.length) return xValue;
        xValue = value;
        return chart;
    }

    // get/sets the column used for y values
    chart.yKey = function(value) {
        if (!arguments.length) return yValue;
        yValue = value;
        return chart;
    }

    chart.xAxisLabel = function(value) {
        if (!arguments.length) return xAxisLabel;
        xAxisLabel = value;
        return chart;
    }

    chart.yAxisLabel = function(value) {
        if (!arguments.length) return yAxisLabel;
        yAxisLabel = value;
        return chart;
    }

    // set the chart data
    chart.data = function(data) {
        if (!arguments.length) return _data;
        _data = data;
        if (typeof updateData === 'function') updateData();
        return chart;
    }

    return chart;
}