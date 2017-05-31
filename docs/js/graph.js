var graph = d3.select('.graph')
    .append('svg')
    .attr('width', window.innerWidth)
    .attr('height', window.innerHeight);

var defs = graph.append('svg:defs');

createGradient('b', '#e4f5fc', '#2ab0ed');
createGradient('o', '#f6e6b4', '#ed9017');
createGradient('g', '#e2f0d9', '#c5e0b4');

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

var visited = [];
var previousStep = -1;

function createGradient(id, fromColor, toColor) {
    var gradient = defs.append('svg:linearGradient')
        .attr('id', id)
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', 0)
        .attr('y2', 1)
        .attr('spreadMethod', 'pad');

    gradient.append('svg:stop')
        .attr('offset', 0)
        .attr('stop-color', fromColor)
        .attr('stop-opacity', 1);

    gradient.append('svg:stop')
        .attr('offset', '100%')
        .attr('stop-color', toColor)
        .attr('stop-opacity', 1);

    return gradient;
}

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
    var nav = {
        id: Reveal.getCurrentSlide().id,
        step: Reveal.getIndices().f,
    };

    nav.forward = nav.step >= previousStep;
    nav.backward = nav.step < previousStep;
    nav.stepVisited = visited.indexOf(nav.step) !== -1;

    if (!nav.stepVisited) {
        visited.push(nav.step);
    }

    console.log(nav);

    if (nav.id != 'dag1') {
        return;
    }

    var nodes = [
        {
            x: 200,
            y: 50,
            c: 'b'
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
            c: 'g'
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
            c: 'g'
        }
    ];

    switch (nav.step) {
        case -1:
            var edges;

            if (!nav.stepVisited) {
                graph.selectAll('.edge')
                    .data(nodes)
                    .enter()
                    .append('path')
                    .attr('class', 'edge')
                    .attr('stroke', '#aaa')
                    .attr('stroke-width', 10)
                    .attr('fill', 'none')
                    .attr('d', function(c, i) {
                        var bounds = getPathBounds(nodes, i);
                        return bounds.line();
                    });
            }

            if (nav.backward) {
                graph.selectAll('.node')
                    .remove();

                graph.selectAll('.edge')
                    .attr('marker-end', null);
            }

            break;

        case 0:
            if (nav.forward) {
                graph.selectAll('.node')
                    .data(nodes)
                    .enter()
                    .append('svg:circle')
                    .attr('class', 'node')
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; })
                    .attr('r', 19)
                    .attr('fill', function(d) { return 'url(#' + d.c + ')'; })
                    .attr('stroke', function(d) {
                        switch (d.c) {
                            case 'b':
                                return '#2e75b6';

                            case 'o':
                                return '#bf9000';

                            case 'g':
                                return '#548235';
                        }
                    });

                graph.selectAll('.edge')
                    .attr('marker-end', 'url(#arrow)');
            } else {
                graph.selectAll('.edge')
                    .transition()
                    .duration(1000)
                    .attr('d', function(c, i) {
                        var bounds = getPathBounds(nodes, i);
                        return bounds.line();
                    });
            }
            break;

        case 1:
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
                        start: {
                            x: 0,
                            y: 0
                        },
                        end: {
                            x: 0,
                            y: 0
                        }
                    };

                    if (diff.x > 0 && diff.y === 0) {
                        margins.start.x = 30;
                    } else if (diff.x < 0 && diff.y === 0) {
                        margins.start.x = -30;
                    } else if (diff.x > 0) {
                        margins.start.x = 20;
                    } else if (diff.x < 0) {
                        margins.start.x = -20;
                    }

                    if (diff.y > 0 && diff.x === 0) {
                        margins.start.y = 30;
                    } else if (diff.y < 0 && diff.x === 0) {
                        margins.start.y = -30;
                    } else if (diff.y > 0) {
                        margins.start.y = 20;
                    } else if (diff.y < 0) {
                        margins.start.y = -20;
                    }

                    if (margins.start.x != 0) {
                        margins.end.x = margins.start.x < 0 ?
                            Math.abs(margins.start.x * 1.5) :
                            margins.start.x * -1.5;
                    }

                    if (margins.start.y != 0) {
                        margins.end.y = margins.start.y < 0 ?
                            Math.abs(margins.start.y * 1.5) :
                            margins.start.y * -1.5;
                    }

                    bounds.start.x += margins.start.x;
                    bounds.start.y += margins.start.y;
                    bounds.end.x += margins.end.x;
                    bounds.end.y += margins.end.y;

                    return bounds.line();
                });
            break;
    }

    previousStep = nav.step;
}
