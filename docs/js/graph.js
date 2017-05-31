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
    .attr('offset', 0)
    .attr('stop-color', '#f6e6b4')
    .attr('stop-opacity', 1);

orangeGradient.append('svg:stop')
    .attr('offset', '100%')
    .attr('stop-color', '#ed9017')
    .attr('stop-opacity', 1);

var arrow = defs.append('svg:marker')
    .attr('id', 'arrow')
    .attr('orient', 'auto')
    .attr('markerWidth', 2)
    .attr('markerHeight', 4)
    .attr('refX', 0.1)
    .attr('refY', 2);

arrow.append('path')
    .attr('d', 'M0,0 V4 L2,2 Z')
    .attr('fill', '#aaa');

Reveal.initialize();
Reveal.addEventListener('slidechanged', drawGraph);
Reveal.addEventListener('fragmentshown', drawGraph);
Reveal.addEventListener('fragmenthidden', drawGraph);

var appended = false;

function getPathBounds(nodes, index) {
    var currentNode = nodes[index];
    var nextNode = index < nodes.length - 1 ?
        nodes[index + 1] :
        nodes[0];

    var start = {
        x: currentNode.x,
        y: currentNode.y,
        c: currentNode.c
    };

    var end = {
        x: nextNode.x,
        y: nextNode.y,
        c: nextNode.c
    };

    var line = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    return {
        start: start,
        end: end,
        line: function() {
            return line([start, end]);
        }
    };
}

function drawGraph(event) {
    var id = Reveal.getCurrentSlide().id;
    var step = Reveal.getIndices().f;

    if (id != 'dag1') {
        return;
    }

    var nodes = [
        {
            x: 200,
            y: 50,
            c: 'b',
        },
        {
            x: 400,
            y: 50,
            c: 'b'
        },
        {
            x: 600,
            y: 50,
            c: 'b'
        },
        {
            x: 725,
            y: 175,
            c: 'b'
        },
        {
            x: 600,
            y: 300,
            c: 'o'
        },
        {
            x: 400,
            y: 300,
            c: 'o'
        },
        {
            x: 200,
            y: 300,
            c: 'o'
        },
        {
            x: 75,
            y: 175,
            c: 'o'
        }
    ];

    switch (step) {
        case -1:
            var paths;

            if (!appended) {
                paths = graph.selectAll('.edge')
                    .data(nodes)
                    .enter()
                    .append('path')
                    .attr('class', 'edge')
                    .attr('stroke', '#aaa')
                    .attr('stroke-width', 10)
                    .attr('fill', 'none')
                    .attr('marker-end', 'url(#arrow)');

                graph.selectAll('circle.nodes')
                    .data(nodes)
                    .enter()
                    .append('svg:circle')
                    .attr('cx', function(d) {
                        return d.x;
                    })
                    .attr('cy', function(d) {
                        return d.y;
                    })
                    .attr('r', 19)
                    .attr('fill', function(d) {
                        return 'url(#' + d.c + ')';
                    })
                    .attr('stroke', function(d) {
                        switch (d.c) {
                            case 'b':
                                return '#2E75B6';
                            case 'o':
                                return '#BF9000';
                        }
                    });
            } else {
                paths = graph.selectAll('.edge')
                    .transition()
                    .duration(1000);
            }

            paths.attr('d', function(c, i) {
                var bounds = getPathBounds(nodes, i);
                return bounds.line();
            });

            appended = true;
            break;

        case 0:
            graph.selectAll('.edge')
                .transition()
                .duration(1000)
                .attr('d', function(c, i) {
                    var bounds = getPathBounds(nodes, i);

                    var diff = {
                        x: bounds.end.x - bounds.start.x,
                        y: bounds.end.y - bounds.start.y
                    };

                    var margins = {
                        current: {
                            x: 0,
                            y: 0
                        },
                        next: {
                            x: 0,
                            y: 0
                        }
                    };

                    if (diff.x > 0 && diff.y === 0) {
                        margins.current.x = 30;
                    } else if (diff.x < 0 && diff.y === 0) {
                        margins.current.x = -30;
                    } else if (diff.x > 0) {
                        margins.current.x = 20;
                    } else if (diff.x < 0) {
                        margins.current.x = -20;
                    }

                    if (diff.y > 0 && diff.x === 0) {
                        margins.current.y = 30;
                    } else if (diff.y < 0 && diff.x === 0) {
                        margins.current.y = -30;
                    } else if (diff.y > 0) {
                        margins.current.y = 20;
                    } else if (diff.y < 0) {
                        margins.current.y = -20;
                    }

                    if (margins.current.x != 0) {
                        margins.next.x = margins.current.x < 0 ?
                            Math.abs(margins.current.x * 1.5) :
                            margins.current.x * -1.5;
                    }

                    if (margins.current.y != 0) {
                        margins.next.y = margins.current.y < 0 ?
                            Math.abs(margins.current.y * 1.5) :
                            margins.current.y * -1.5;
                    }

                    bounds.start.x += margins.current.x;
                    bounds.start.y += margins.current.y;
                    bounds.end.x += margins.next.x;
                    bounds.end.y += margins.next.y;

                    return bounds.line();
                });
            break;

        case 1:
            break;

        case 2:
            break;
    }
}
