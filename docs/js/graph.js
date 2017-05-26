var graph = d3.select('.graph')
              .append('svg')
              .attr('width', window.innerWidth)
              .attr('height', window.innerHeight);

var defs = graph.append('svg:defs');

var blueGradient = defs.append('svg:linearGradient')
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

var orangeGradient = defs.append('svg:linearGradient')
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

var head = defs.append('svg:marker')
               .attr('id', 'head')
               .attr('orient', 'auto')
               .attr('markerWidth', 2)
               .attr('markerHeight', 4)
               .attr('refX', 0.1)
               .attr('refY', 2);

head.append('path')
    .attr('d', 'M0,0 V4 L2,2 Z')
    .attr('fill', '#aaa');

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
                    y: 50,
                    c: 'b',
                },
                {
                    x: 300,
                    y: 50,
                    c: 'b'
                },
                {
                    x: 500,
                    y: 50,
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

            var lineData = d3.line()
                             .x(function(d) { return d.x; })
                             .y(function(d) { return d.y; });

            for (var i = 0; i < nodes.length; i++) {
                var currentNode = nodes[i];
                var nextNode = i < nodes.length - 1
                             ? nodes[i + 1]
                             : nodes[0];

                currentNode = {
                    x : currentNode.x,
                    y : currentNode.y,
                    c : currentNode.c
                };

                nextNode = {
                    x : nextNode.x,
                    y : nextNode.y,
                    c : nextNode.c
                };

                var xDiff = nextNode.x - currentNode.x;
                var yDiff = nextNode.y - currentNode.y;

                console.log(currentNode, {x: xDiff, y: yDiff});

                if (xDiff > 0 && yDiff > 0) {
                    currentNode.x += 20;
                    currentNode.y += 20;
                    nextNode.x -= 32;
                    nextNode.y -= 32;
                } else if (xDiff < 0 && yDiff > 0) {
                    currentNode.x -= 20;
                    currentNode.y += 20;
                    nextNode.x += 32;
                    nextNode.y -= 32;
                } else if (xDiff < 0 && yDiff < 0) {
                    currentNode.x -= 15;
                    currentNode.y -= 20;
                    nextNode.x += 22;
                    nextNode.y += 37;
                } else if (xDiff > 0 && yDiff < 0) {
                    currentNode.x += 15;
                    currentNode.y -= 20;
                    nextNode.x -= 22;
                    nextNode.y += 37;
                } else if (xDiff > 0 && yDiff == 0) {
                    currentNode.x += 25;
                    nextNode.x -= 42;
                } else if (xDiff < 0 && yDiff == 0) {
                    currentNode.x -= 25;
                    nextNode.x += 42;
                }

                graph.append('path')
                     .attr('d', lineData([currentNode, nextNode]))
                     .attr('stroke', '#aaa')
                     .attr('stroke-width', 10)
                     .attr('fill', 'none')
                     .attr('marker-end', 'url(#head)');
            }

            graph.selectAll('circle.nodes')
                 .data(nodes)
                 .enter()
                 .append('svg:circle')
                 .attr('cx', function(d) { return d.x; })
                 .attr('cy', function(d) { return d.y; })
                 .attr('r', 19)
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
