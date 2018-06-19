(function(){
    "use strict";

    d3.csv("data.csv").then(function(d){
        const initialGroup = d.filter(function(row){
            return row.group === "I";
        })

        // configuration
        const chart = scatterplot().width(950).height(600)
            .xKey(function(d){return +d.x})
            .yKey(function(d){return +d.y})
            .data(initialGroup);

        // attach and perform render
        d3.select("#chart").call(chart);

        // form closure on data to event handler
        document.getElementById("group-select").addEventListener("change", function(e) {
            const newData = d.filter(function(row){
                return row.group === e.target.value;
            });

            chart.data(newData);
        })
    }).catch(function(){
        d3.select("#chart").text("Failed to open the csv. Check for CORS issues.")
    })
})();