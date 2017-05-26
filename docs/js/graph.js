var graph = d3.select('.graph')
              .append('svg')
              .attr('width', window.innerWidth)
              .attr('height', window.innerHeight);

var blueGradient = graph.append('svg:defs')
                        .append('svg:linearGradient')
                        .attr('id', 'b')
                        .attr('x1', 0)
                        .attr('y1', 0)
                        .attr('x2', 0)
                        .attr('y2', 1)
                        .attr('spreadMethod', 'pad');

blueGradient.append('svg:stop')
            .attr('offset', '0%')
            .attr('stop-color', '#e4f5fc')
            .attr('stop-opacity', 1);

blueGradient.append('svg:stop')
            .attr('offset', '100%')
            .attr('stop-color', '#2ab0ed')
            .attr('stop-opacity', 1);

var orangeGradient = graph.append('svg:defs')
                          .append('svg:linearGradient')
                          .attr('id', 'o')
                          .attr('x1', 0)
                          .attr('y1', 0)
                          .attr('x2', 0)
                          .attr('y2', 1)
                          .attr('spreadMethod', 'pad');

orangeGradient.append('svg:stop')
              .attr('offset', '0%')
              .attr('stop-color', '#f6e6b4')
              .attr('stop-opacity', 1);

orangeGradient.append('svg:stop')
              .attr('offset', '100%')
              .attr('stop-color', '#ed9017')
              .attr('stop-opacity', 1);

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

    switch (step) {
        case -1:
            var nodes = [
                {
                    x: 100,
                    y: 20,
                    c: 'b',
                },
                {
                    x: 300,
                    y: 20,
                    c: 'b'
                },
                {
                    x: 500,
                    y: 20,
                    c: 'b'
                },
                {
                    x: 625,
                    y: 175,
                    c: 'b'
                },
                {
                    x: 500,
                    y: 300,
                    c: 'o'
                },
                {
                    x: 300,
                    y: 300,
                    c: 'o'
                },
                {
                    x: 100,
                    y: 300,
                    c: 'o'
                },
                {
                    x: 20,
                    y: 175,
                    c: 'o'
                }
            ];

            var lineFunction = d3.line()
                                 .x(function(d) { return d.x; })
                                 .y(function(d) { return d.y; });

            var lineGraph = graph.append('path')
                                 .attr('d', lineFunction(nodes))
                                 .attr('stroke', '#888')
                                 .attr('stroke-width', 20)
                                 .attr('fill', 'none');

            graph.selectAll('circle.nodes')
                 .data(nodes)
                 .enter()
                 .append('svg:circle')
                 .attr('cx', function(d) { return d.x; })
                 .attr('cy', function(d) { return d.y; })
                 .attr('r', '19px')
                 .attr('fill', function(d) { return 'url(#' + d.c + ')'; })
                 .attr('stroke', function(d) {
                     switch (d.c) {
                         case 'b':
                            return '#2E75B6';
                         case 'o':
                            return '#BF9000';
                     }
                 });

            break;

        case 0:
            break;

        case 1:
            break;

        case 2:
            break;
    }
}
