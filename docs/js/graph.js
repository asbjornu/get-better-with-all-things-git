var graph = d3.select('.graph')
    .append('svg');

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

Reveal.initialize({
    width: 1920,
	height: 1080,
	margin: 0.1,
});
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

function Edge(nodes, index, node) {
    var edge = this;
    var leftMostNode = nodes.slice().sort(function(a, b) {
        if (a.x === b.x) {
            return 0;
        }

        if (a.x < b.x) {
            return -1;
        }

        return 1;
    })[0];

    var currentNode = node || nodes[index];
    var nextNode;

    if (currentNode.p) {
        nextNode = nodes.filter(n => n.id === currentNode.p)[0];
    } else if (index < nodes.length - 1) {
        nextNode = nodes[index + 1];
    } else {
        nextNode = nodes[0];
    }

    var line = d3.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; });

    this.index = index;

    this.start = {
        x: currentNode.x,
        y: currentNode.y,
        c: currentNode.c
    };

    this.end = {
        x: nextNode.x,
        y: nextNode.y,
        c: nextNode.c
    };

    this.direction = (currentNode.r === true) || (this.end.x > leftMostNode.x && this.end.y < leftMostNode.y)
                ? 'reverse'
                : 'forward';

    this.line = function() {
        if (edge.direction === 'reverse') {
            return line([edge.end, edge.start]);
        } else {
            return line([edge.start, edge.end]);
        }
    };

    this.withMargins = function() {
        var diff = {
            x: edge.end.x - edge.start.x,
            y: edge.end.y - edge.start.y
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
            margins.start.x = 35;
        } else if (diff.x < 0 && diff.y === 0) {
            margins.start.x = -35;
        } else if (diff.x > 0) {
            margins.start.x = 25;
        } else if (diff.x < 0) {
            margins.start.x = -25;
        }

        if (diff.y > 0 && diff.x === 0) {
            margins.start.y = 35;
        } else if (diff.y < 0 && diff.x === 0) {
            margins.start.y = -35;
        } else if (diff.y > 0) {
            margins.start.y = 25;
        } else if (diff.y < 0) {
            margins.start.y = -25;
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

        // If the edge is reversed, its margins
        // needs to be inverted too.
        if (edge.direction === 'reverse') {
            var startX = margins.start.x;
            var startY = margins.start.y;
            margins.start.x = margins.end.x * -1;
            margins.start.y = margins.end.y * -1;
            margins.end.x = startX * -1;
            margins.end.y = startY * -1;
        }

        edge.start.x += margins.start.x;
        edge.start.y += margins.start.y;
        edge.end.x += margins.end.x;
        edge.end.y += margins.end.y;

        return edge;
    };

    this.collapse = function(predicate, to) {
        if (predicate !== true) {
            return edge;
        }

        if (to === 'end') {
            edge.start.x = edge.end.x;
            edge.start.y = edge.end.y;
        } else {
            edge.end.x = edge.start.x;
            edge.end.y = edge.start.y;
        }

        return edge;
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

    if (nav.id != 'dag1') {
        return;
    }

    Reveal.configure({ center: false, margins: 0 });

    var container = document.querySelector('.present').parentNode;
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    console.log(container, width, height);

    graph.attr('width', width).attr('height', height);

    var centerX = width / 2;
    var centerY = height / 2;

    var nodes = [
        {
            x: centerX - 200,
            y: centerY - 100,
            c: 'b',
        },
        {
            x: centerX,
            y: centerY - 100,
            c: 'b'
        },
        {
            x: centerX + 200,
            y: centerY - 100,
            c: 'b'
        },
        {
            x: centerX + 300,
            y: centerY,
            c: 'g'
        },
        {
            x: centerX + 200,
            y: centerY + 100,
            c: 'o'
        },
        {
            x: centerX,
            y: centerY + 100,
            c: 'o'
        },
        {
            x: centerX - 200,
            y: centerY + 100,
            c: 'o'
        },
        {
            id: 'n1',
            x: centerX - 300,
            y: centerY,
            c: 'g'
        }
    ];

    switch (nav.step) {
        case -1:
            var edges;

            graph.append('path')
                .datum({
                    id: 'n0',
                    p: 'n1',
                    r: true,
                    x: centerX - 450,
                    y: centerY,
                    c: 'g'
                })
                .attr('class', 'origo')
                .attr('stroke', '#aaa')
                .attr('stroke-width', 10)
                .attr('fill', 'none')
                .attr('d', function(c, i) {
                    var edge = new Edge(nodes, i, c).collapse(true, 'end');
                    return edge.line();
                });

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
                        var edge = new Edge(nodes, i);
                        return edge.line();
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
                    .append('circle')
                    .attr('class', 'node')
                    .attr('cx', function(d) { return d.x; })
                    .attr('cy', function(d) { return d.y; })
                    .attr('r', 25)
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
            } else {
                graph.selectAll('.edge')
                    .transition()
                    .duration(1000)
                    .attr('d', function(node, i) {
                        var edge = new Edge(nodes, i);
                        return edge.line();
                    });
            }
            break;

        case 1:
            graph.selectAll('.edge')
                .transition()
                .duration(1000)
                .attr('d', function(node, i) {
                    var edge = new Edge(nodes, i)
                        // Make the 2nd path vanish on fragment 1 and onward.
                        .collapse(i === 2);

                    return edge.line();
                });
            break;

        case 2:
            if (nav.forward) {
                graph.selectAll('.edge')
                    .transition()
                    .duration(1000)
                    .attr('d', function(node, i) {
                        var edge = new Edge(nodes, i).withMargins()
                            // Make the 2nd path vanish on fragment 1 and onward.
                            .collapse(i === 2);

                        return edge.line();
                    })
                    .attr('marker-end', function(c, i) {
                        return (i == 2) ? null : 'url(#arrow)';
                    });
            } else {
                graph.select('.origo')
                    .transition()
                    .duration(1000)
                    .attr('d', function(node, i) {
                        var edge = new Edge(nodes, i, node).collapse(true, 'end');
                        return edge.line();
                    });
            }

            graph.select('#n0').remove();
            break;

        case 3:
            d3.select('.origo')
                .transition()
                .duration(1000)
                .attr('marker-end', 'url(#arrow)')
                .attr('d', function(node, i) {
                    var edge = new Edge(nodes, i, node).withMargins();
                    return edge.line();
                }).on('end', function(node, i) {
                    graph.append('circle')
                        .datum(node)
                        .attr('class', 'node')
                        .attr('id', 'n0')
                        .attr('cx', function(d) { return d.x; })
                        .attr('cy', function(d) { return d.y; })
                        .attr('r', 25)
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
                });

            break;
    }

    previousStep = nav.step;
}
