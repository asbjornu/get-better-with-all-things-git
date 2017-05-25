var graph = d3.select(".graph")
              .append("svg")
              .attr("width", window.innerWidth)
              .attr("height", window.innerHeight);

Reveal.initialize();
Reveal.addEventListener('slidechanged', drawGraph);
Reveal.addEventListener('fragmentshown', drawGraph);
Reveal.addEventListener('fragmenthidden', drawGraph);

function drawGraph(event) {
    var id = Reveal.getCurrentSlide().id;
    var step = Reveal.getIndices().f;

    if (id != 'dag1') {
        return;
    }

    // Define the gradient
    var gradient = graph.append("svg:defs")
        .append("svg:linearGradient")
        .attr("id", "gradient")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", 0)
        .attr("y2", 1)
        .attr("spreadMethod", "pad");

    // Define the gradient colors
    gradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", "#e4f5fc")
        .attr("stop-opacity", 1);

    gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "#2ab0ed")
        .attr("stop-opacity", 1);

    switch (step) {
        case -1:
        var nodes = [
            {
                x: 100,
                y: 20
            },
            {
                x: 300,
                y: 20
            },
            {
                x: 500,
                y: 20
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
            .attr("r", "20px")
            .attr("fill", "url(#gradient)");


            break;

        case 0:
            break;

        case 1:
            break;

        case 2:
            break;
    }
}
