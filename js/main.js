(function(){
    "use strict";

    d3.csv("data.csv").then(function(d){
        const initialGroup = d.filter(function(row){
            return row.group === "I";
        })

        // configuration
        const chart = scatterplot()
            .x(function(d){return +d.x})
            .y(function(d){return +d.y})
            .data(initialGroup);

        // perform render
        d3.select("#chart").call(chart);

        document.getElementById("group-select").addEventListener("change", function(e) {
            const newData = d.filter(function(row){
                return row.group === e.target.value;
            });

            chart.data(newData);
        })
    })
})();