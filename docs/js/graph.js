var graph = d3.select('.graph')
    .append('svg');

var defs = graph.append('svg:defs');

createGradient('b', '#e4f5fc', '#2ab0ed');
createGradient('o', '#f6e6b4', '#ed9017');
createGradient('g', '#e2f0d9', '#c5e0b4');
createGradient('r', '#f8cbad', '#f4b183');
createGradient('w', '#ffffff', '#d9d9d9');

var arrow = defs.append('svg:marker')
    .attr('id', 'arrow')
    .attr('orient', 'auto')
    .attr('markerWidth', 2)
    .attr('markerHeight', 3)
    .attr('refX', 0.1)
    .attr('refY', 1.5);

arrow.append('path')
    .attr('d', 'M0,0 V3 L1.5,1.5 Z')
    .attr('fill', '#aaa');

var visited = [];
var previousStep = -1;

function stroke(d) {
    switch (d.c) {
        case 'b':
            return '#2e75b6';

        case 'o':
            return '#bf9000';

        case 'g':
            return '#548235';

        case 'r':
            return '#ed7d31';

        case 'w':
            return '#bfbfbf';
    }
}

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

function Edge(path, nodes, index, node) {
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
    var nextNode = nodes.filter(function(n) { return n.id === currentNode.p })[0];

    this.index = index;

    this.start = {
        x: currentNode.x,
        y: currentNode.y,
        c: currentNode.c
    };

    if (nextNode) {
        this.end = {
            x: nextNode.x,
            y: nextNode.y,
            c: nextNode.c
        };
    }

    if (currentNode.r === false) {
        this.direction = 'forward';
    } else if (currentNode.r === true || (this.end && this.end.x > leftMostNode.x && this.end.y < leftMostNode.y)) {
        this.direction = 'reverse';
    } else {
        this.direction = 'forward';
    }

    this.line = function() {
        var line = d3.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; });

        if (!edge.end) {
            return line([edge.start, edge.start]);
        }

        return line([edge.start, edge.end]);
    };

    this.withMargins = function() {
        if (!edge.end) {
            return edge;
        }

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
            margins.start.x = 30;
        } else if (diff.x < 0 && diff.y === 0) {
            margins.start.x = -30;
        } else if (diff.x > 0) {
            margins.start.x = 22;
        } else if (diff.x < 0) {
            margins.start.x = -22;
        }

        if (diff.y > 0 && diff.x === 0) {
            margins.start.y = 30;
        } else if (diff.y < 0 && diff.x === 0) {
            margins.start.y = -30;
        } else if (diff.y > 0) {
            margins.start.y = 22;
        } else if (diff.y < 0) {
            margins.start.y = -22;
        }

        if (margins.start.x != 0) {
            margins.end.x = margins.start.x < 0 ?
                Math.abs(margins.start.x * 1.4) :
                margins.start.x * -1.4;
        }

        if (margins.start.y != 0) {
            margins.end.y = margins.start.y < 0 ?
                Math.abs(margins.start.y * 1.4) :
                margins.start.y * -1.4;
        }

        edge.start.x += margins.start.x;
        edge.start.y += margins.start.y;
        edge.end.x += margins.end.x;
        edge.end.y += margins.end.y;

        return edge;
    };

    this.collapse = function(predicate, to) {
        if (!edge.end || predicate !== true) {
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

    if (nav.id != 'dag') {
        return;
    }

    nav.forward = nav.step >= previousStep;
    nav.backward = nav.step < previousStep;
    nav.stepVisited = visited.indexOf(nav.step) !== -1;

    if (!nav.stepVisited) {
        visited.push(nav.step);
    }


    Reveal.configure({ center: false, margins: 0 });

    var container = document.querySelector('.present').parentNode;
    var width = container.offsetWidth;
    var height = container.offsetHeight;

    graph.attr('width', width).attr('height', height);

    var centerX = width / 2;
    var centerY = height / 2;

    var nodes = [
        {
            n: 'A',
            id: 'g0',
            r: true,
            h: true,
            x: centerX - 700,
            y: centerY,
            c: 'g'
        },
        {
            n: 'B',
            id: 'g1',
            p: 'g0',
            h: 'path',
            x: centerX - 500,
            y: centerY,
            c: 'g'
        },
        {
            n: 'C',
            id: 'g2a',
            p: 'o3',
            x: centerX + 300,
            y: centerY,
            c: 'g'
        },
        {
            id: 'g2b',
            p: 'b3',
            x: centerX + 300,
            y: centerY,
            c: 'g'
        },
        {
            id: 'g2c',
            p: 'g1',
            h: true,
            x: centerX + 300,
            y: centerY,
            c: 'g'
        },
        {
            n: 'D',
            id: 'g3',
            p: 'g2a',
            h: true,
            x: centerX + 500,
            y: centerY,
            c: 'g'
        },
        {
            n: 'E',
            id: 'g4',
            p: 'g3',
            h: true,
            x: centerX + 700,
            y: centerY,
            c: 'g'
        },
        {
            n: 'E',
            id: 'b1',
            p: 'g1',
            r: true,
            x: centerX - 300,
            y: centerY - 200,
            c: 'b',
        },
        {
            n: 'F',
            id: 'b2',
            p: 'b1',
            r: true,
            x: centerX - 100,
            y: centerY - 200,
            c: 'b'
        },
        {
            n: 'G',
            id: 'b3',
            p: 'b2',
            r: true,
            x: centerX + 100,
            y: centerY - 200,
            c: 'b'
        },
        {
            n: 'H',
            id: 'b4',
            p: 'b3',
            r: false,
            h: true,
            x: centerX + 400,
            y: centerY - 200,
            c: 'b'
        },
        {
            n: 'I',
            id: 'o1',
            p: 'g1',
            x: centerX - 300,
            y: centerY + 200,
            c: 'o'
        },
        {
            n: 'J',
            id: 'o2',
            p: 'o1',
            x: centerX - 100,
            y: centerY + 200,
            c: 'o'
        },
        {
            n: 'K',
            id: 'o3',
            p: 'o2',
            x: centerX + 100,
            y: centerY + 200,
            c: 'o'
        }
    ];

    switch (nav.step) {
        case -1:
            if (!nav.stepVisited) {
                graph.selectAll('.edge')
                    .data(nodes)
                    .enter()
                    .append('path')
                    .attr('opacity', 1)
                    .attr('id', function(node, i) {
                        return node.id;
                    })
                    .attr('class', function(node, i) {
                        return (node.h === true) || (node.h === 'path')
                            ? 'edge hidden commit'
                            : 'edge commit';
                    })
                    .attr('stroke', '#aaa')
                    .attr('stroke-width', 10)
                    .attr('fill', 'none')
                    .attr('d', function(node, i) {
                        var edge = new Edge(this, nodes, i)
                            .collapse((node.h === true) || (node.h === 'path'));
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
                    .attr('class', 'node commit')
                    .attr('opacity', 1)
                    .attr('cx', function(node) { return node.x; })
                    .attr('cy', function(node) { return node.y; })
                    .attr('r', function(node, i) {
                        return node.h === true
                            ? 0
                            : 25;
                    })
                    .attr('fill', function(node) { return 'url(#' + node.c + ')'; })
                    .attr('stroke', stroke)
                    .attr('stroke-width', 2);
            } else {
                graph.selectAll('.edge')
                    .transition()
                    .duration(1000)
                    .attr('d', function(node, i) {
                        var edge = new Edge(this, nodes, i);
                        return edge.line();
                    });
            }
            break;

        case 1:
            graph.selectAll('.edge')
                .transition()
                .duration(1000)
                .attr('d', function(node, i) {
                    var edge = new Edge(this, nodes, i)
                        .collapse(node.id === 'g2b' || (node.h === true) || (node.h === 'path'));

                    return edge.line();
                });
            break;

        case 2:
            if (nav.forward) {
                graph.selectAll('.edge')
                    .transition()
                    .duration(1000)
                    .attr('d', function(node, i) {
                        var edge = new Edge(this, nodes, i).withMargins()
                            .collapse(node.id === 'g2b' || (node.h === true) || (node.h === 'path'));

                        return edge.line();
                    })
                    .attr('marker-end', function(node, i) {
                        return (node.id === 'g2b' || (node.h === true) || (node.h === 'path'))
                            ? null
                            : 'url(#arrow)';
                    });
            } else {
                graph.select('#g0')
                    .transition()
                    .duration(1000)
                    .attr('d', function(node, i) {
                        var edge = new Edge(this, nodes, i, node)
                            .collapse(true, 'end');
                        return edge.line();
                    });
            }

            break;

        case 3:
            d3.selectAll('.hidden')
                .transition()
                .duration(1000)
                .attr('marker-end', function(node, i) {
                    return node.id === 'g0'
                        ? null
                        : 'url(#arrow)';
                })
                .attr('d', function(node, i) {
                    var edge = new Edge(this, nodes, i, node)
                        .withMargins()
                        .collapse(node.id === 'g2b');

                    return edge.line();
                }).on('end', function(node, i) {
                    graph.append('circle')
                        .datum(node)
                        .attr('class', 'node commit')
                        .attr('opacity', 1)
                        .attr('id', 'n0')
                        .attr('cx', function(d) { return d.x; })
                        .attr('cy', function(d) { return d.y; })
                        .attr('r', 25)
                        .attr('fill', function(d) { return 'url(#' + d.c + ')'; })
                        .attr('stroke', stroke)
                        .attr('stroke-width', 2);
                });
            break;

        case 4:
            graph.selectAll('.node-name')
                .data(nodes.filter(function(n) { return n.n; }))
                .enter()
                .append('text')
                .attr('class', 'node-name commit')
                .attr('opacity', 1)
                .attr('alignment-baseline', 'middle')
                .attr('text-anchor', 'middle')
                .attr('dx', function(node, i) {
                    return node.x - 1;
                })
                .attr('dy', function(node, i) {
                    return node.y + 3;
                })
                .text(function(node, i) {
                    return node.n;
                });

            break;

        case 5:
            var references = [
                {
                    n: 'v1.0',
                    p: 'g1',
                    w: 150,
                    h: 50,
                    x: centerX - 500,
                    y: centerY - 400,
                    c: 'r'
                },
                {
                    n: 'develop',
                    p: 'b4',
                    w: 170,
                    h: 50,
                    x: centerX + 400,
                    y: centerY - 500,
                    c: 'b'
                },
                {
                    n: 'hotfix/login-enumeration',
                    p: 'o3',
                    w: 450,
                    h: 50,
                    x: centerX + 100,
                    y: centerY + 400,
                    c: 'o'
                },
                {
                    n: 'master',
                    w: 150,
                    h: 50,
                    x: centerX + 700,
                    y: centerY - 400,
                    c: 'g'
                },
                {
                    n: 'HEAD',
                    p: 'g4',
                    w: 150,
                    h: 50,
                    x: centerX + 700,
                    y: centerY - 325,
                    c: 'w'
                }
            ];

            var edges = graph.selectAll('.ref-edge')
                .data(references.filter(function(r) { return r.p; }))
                .enter()
                .append('path')
                .attr('class', 'ref-edge ref')
                .attr('opacity', 1)
                .attr('stroke', '#aaa')
                .attr('stroke-width', 10)
                .attr('fill', 'none')
                .attr('marker-end', 'url(#arrow)')
                .attr('d', function(ref, i) {
                    var edge = new Edge(this, nodes, i, ref).collapse(true)
                    return edge.line();
                });

            graph.selectAll('.ref-label')
                .data(references)
                .enter()
                .append('rect')
                .attr('class', 'ref-label ref')
                .attr('opacity', 1)
                .attr('rx', 6)
                .attr('ry', 6)
                .attr('width', function(ref) {
                    return ref.w;
                })
                .attr('height', function(ref) {
                    return ref.h;
                })
                .attr('x', function(ref) {
                    return ref.x - (ref.w / 2);
                })
                .attr('y', function(ref) {
                    return ref.y - (ref.h / 2);
                })
                .attr('fill', function(ref) {
                    return 'url(#' + ref.c + ')';
                })
                .attr('stroke', stroke)
                .attr('stroke-width', 2);

            edges.transition().duration(1000).attr('d', function(ref, i) {
                var edge = new Edge(this, nodes, i, ref).withMargins();
                return edge.line();
            })

            graph.selectAll('.ref-name')
                .data(references)
                .enter()
                .append('text')
                .attr('opacity', 1)
                .attr('alignment-baseline', 'middle')
                .attr('text-anchor', 'middle')
                .attr('class', 'ref-name ref')
                .attr('dx', function(ref) {
                    return ref.x;
                })
                .attr('dy', function(ref) {
                    return ref.y + 2;
                })
                .text(function(ref) {
                    return ref.n;
                });
            break;

        case 6:
            d3.selectAll('.ref')
                .transition()
                .duration(1000)
                .attr('opacity', 0.1);

            break;

        case 7:
            d3.selectAll('.ref')
                .transition()
                .duration(1000)
                .attr('opacity', 1);

            d3.selectAll('.commit')
                .transition()
                .duration(1000)
                .attr('opacity', 0.1);

            break;
    }

    previousStep = nav.step;
}
