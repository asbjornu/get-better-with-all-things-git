var graph = d3.select(".graph")
              .append("svg")
              .attr("width", 200)
              .attr("height", 200);

Reveal.initialize();
Reveal.addEventListener('slidechanged', drawGraph);
Reveal.addEventListener('fragmentshown', drawGraph);
Reveal.addEventListener('fragmenthidden', drawGraph);

function drawGraph(event) {
    var id = Reveal.getCurrentSlide().id;
    var step = Reveal.getIndices().f;

    console.log(id, step);

    if (id != 'dag1') {
        return;
    }

    switch (step) {
        case 0:
            var nodes = [
                {
                    x: 10,
                    y: 50
                },
                {
                    x: 70,
                    y: 10
                },
                {
                    x: 140,
                    y: 50
                }
            ]

            graph.selectAll("circle.nodes")
                .data(nodes)
                .enter()
                .append("svg:circle")
                .attr("cx", function(d) {
                    return d.x;
                })
                .attr("cy", function(d) {
                    return d.y;
                })
                .attr("r", "10px")
                .attr("fill", "white");
            break;

        case 1:
            // move to vis state 1
            break;

        case 2:
            // move to vis state 2
            break;
    }
}
