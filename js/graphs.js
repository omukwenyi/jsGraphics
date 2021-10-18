"use strict";

import {
    drawRectClear,
    drawValue,
    drawGrid,
    drawLine,
    drawCircleClear,
    drawCircle,
    getRandomIntInclusive,
    drawValueActive,
    create2DArray,
} from "./common.js";

import { createGraph } from "./nodedata.js";

function draw(nodes, maxEdges) {
    console.clear();

    const canvas = document.querySelector("#canvas");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - headerHeight - 10;
    const cw = canvas.width;
    const ch = canvas.height;

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        drawGrid(ctx, canvas.width, canvas.height, 10, 0.2);

        if (nodes > 0) {
            const graph = createGraph(parseInt(nodes), parseInt(maxEdges));

            //sort graph by  centrality
            //graph.sort((a, b) => a.closenessCentrality - b.closenessCentrality).reverse();

            let coods = [];
            //let positions = spring(ctx, graph, cw, ch, 25);
            let positions = reinGold(ctx, graph, cw, ch);
            const edgePositions = getEdgePositions(graph, positions);

            console.log(graph);
            // console.log(cw, ch);
            console.log(positions);

            for (let i = 0; i < graph.length; i++) {
                const node = graph[i];
                const x = positions[i][0];
                const y = positions[i][1];
                // drawGraphNode(ctx, graph, node, positions, x, y, coods);
                drawGraphNode(ctx, node, x, y);
            }

            for (let i = 0; i < edgePositions.length; i++) {
                const pos = edgePositions[i];
                      drawLine(ctx, pos[2], pos[3], "black", 0.75 );          
            }
        }
    }
}


function simulate(ctx, positions, color) {
    for (let i = 0; i < positions.length; i++) {
        const x = positions[i][0];
        const y = positions[i][1];

        drawCircleClear(ctx, x, y, 5, color, 1);
        drawValueActive(ctx, x - 2, y + 2, i + 1, "white");
    }
}

function getEdgePositions(graph, positions) {
    let edgePositions = [];

    for (const node of graph) {
        if (node.neighbours.length > 0) {
            for (const neighbour of node.neighbours) {
                let foundEdge1 = edgePositions.find((e) => e[0] === node.id && e[1] === neighbour);
                let foundEdge2 = edgePositions.find((e) => e[0] === neighbour && e[1] === node.id);

                if (foundEdge1 === undefined && foundEdge2 === undefined) {
                    edgePositions.push([
                        node.id,
                        neighbour,
                        positions[node.id - 1],
                        positions[neighbour - 1],
                    ]);
                }
            }
        }
    }

    return edgePositions;
}

function getEdges(graph) {
    let edges = [];

    for (const node of graph) {
        if (node.neighbours.length > 0) {
            for (const neighbour of node.neighbours) {
                let foundEdge1 = edges.find((e) => e[0] === node.id && e[1] === neighbour);
                let foundEdge2 = edges.find((e) => e[0] === neighbour && e[1] === node.id);

                if (foundEdge1 === undefined && foundEdge2 === undefined) {
                    edges.push([node.id, neighbour]);
                }
            }
        }
    }

    return edges;
}

function reinGold(ctx, graph, cw, ch) {
    const W = cw;
    const L = ch;
    const area = cw * ch;
    const k = Math.sqrt(area / graph.length);
    let t = cw / (cw * 10);
    let iterations = 50;
    let dt = t / (iterations + 1);

    let positions = new Array(graph.length);
    let edges = getEdges(graph);

    //the vertices are assigned random initial positions

    for (let i = 0; i < graph.length; i++) {
        let nx = getRandomIntInclusive(100, cw - 100);
        let ny = getRandomIntInclusive(100, ch - 100);
        positions[i] = [nx, ny];
    }

    // simulate(ctx, positions, "red");

    const fa = (D, kk) => {
        return (D * D) / kk;
    };

    const fr = (D, kk) => {
        return (kk * kk) / D;
    };

    let displacement = create2DArray(graph.length, 2);

    for (let i = 0; i < iterations; i++) {
        // console.log("iter:", i, positions);
        // simulate(ctx, positions, "red");
        //calculate repulsive forces
        for (const v of graph) {
            //each vertex has two vectors: .pos and .disp
            displacement[v.id - 1][0] = 0;
            displacement[v.id - 1][1] = 0;

            for (const u of graph) {
                if (v.id !== u.id) {
                    let dx = positions[v.id - 1][0] - positions[u.id - 1][0];
                    let dy = positions[v.id - 1][1] - positions[u.id - 1][1];
                    let delta = Math.sqrt(dx * dx + dy * dy);

                    if (delta !== 0) {
                        let d = fr(delta, k) / delta;
                        displacement[v.id - 1][0] += dx * d;
                        displacement[v.id - 1][1] += dy * d;
                    }
                }
            }
        }

        //calculate attractive forces
        for (const edge of edges) {
            let dx = positions[edge[0] - 1][0] - positions[edge[1] - 1][0];
            let dy = positions[edge[0] - 1][1] - positions[edge[1] - 1][1];
            let delta = Math.sqrt(dx * dx + dy * dy);
            if (delta !== 0) {
                let d = fa(delta, k) / delta;
                let ddx = dx * d;
                let ddy = dy * d;
                displacement[edge[0] - 1][0] += -ddx;
                displacement[edge[1] - 1][0] += +ddx;
                displacement[edge[0] - 1][1] += -ddy;
                displacement[edge[1] - 1][1] += +ddy;
            }
        }

        // limit the maximum displacement to the temperature t
        // and then prevent from being displace outside frame

        for (const v of graph) {
            let dx = displacement[v.id - 1][0];
            let dy = displacement[v.id - 1][1];
            let disp = Math.sqrt(dx * dx + dy * dy);

            if (disp !== 0) {
                
                let d = Math.min(disp, t) / disp;
                let x = positions[v.id - 1][0] + dx * d;
                let y = positions[v.id - 1][1] + dy * d;
                

                positions[v.id - 1][0] = x;
                positions[v.id - 1][1] = y;

                positions[v.id - 1][0] = Math.min(W, Math.max(0, positions[v.id - 1][0]));
                positions[v.id - 1][1] = Math.min(L , Math.max(0, positions[v.id - 1][1]));

            }
        }

        // # cooling
        t -= dt;
    }

    return positions;
}

function spring(ctx, graph, cw, ch, radius) {
    let positions = [graph.length];

    let twoPI = 2 * Math.PI;
    let xyRadius = (ch - 70) / 2;

    let cx = cw / 2,
        cy = ch / 2;

    const angle = twoPI / graph.length;

    for (let i = 0; i < graph.length; i++) {
        let centrality = 1; //(graph[i].closenessCentrality > 0) ? graph[i].closenessCentrality : 0.2;
        let xpos = cx + (xyRadius * Math.cos((i + 1) * angle)) / centrality;
        let ypos = cy + (xyRadius * Math.sin((i + 1) * angle)) / centrality;

        if (xpos < 40) {
            xpos = 40;
        }
        if (xpos > cw - 40) {
            xpos = cw - 40;
        }
        if (ypos < 40) {
            ypos = 40;
        }
        if (ypos > ch - 40) {
            ypos = ch - 40;
        }

        positions[i] = [xpos, ypos];
        //simulate(ctx, positions, "red");
    }

    // for (const graphNode of graph) {
    //     let nx = getRandomIntInclusive(100, cw - 100);
    //     let ny = getRandomIntInclusive(100, ch - 100);
    //     positions[graphNode.id - 1] = [nx, ny];

    //     // simulate(ctx, positions, "blue");
    // }
    let c1 = 1.5,
        c2 = 1,
        c3 = 1,
        c4 = 0.1;

    for (let m = 0; m < 100; m++) {
        //calculate the force on each vertex;
        //d is the length of the spring
        let edgesVisited = [];

        for (const graphNode of graph) {
            //attractive : c1 ∗ log(d/c2),
            //console.log(edgesVisited);

            for (const neighbour of graphNode.neighbours) {
                let foundA = edgesVisited.find((e) => e[0] === graphNode.id && e[1] === neighbour);
                let foundB = edgesVisited.find((e) => e[0] === neighbour && e[1] === graphNode.id);

                if (foundA !== undefined || foundB !== undefined) {
                    //console.log("Processed:", [graphNode.id, neighbour]);
                    continue;
                }

                const v1 = positions[graphNode.id - 1];
                const v2 = positions[neighbour - 1];
                const dx = v1[0] - v2[0];
                const dy = v1[1] - v2[1];
                let d = Math.sqrt(dx * dx + dy * dy);

                if (d < 40 + radius * 2) {
                    continue;
                }
                let Fa = c1 * Math.log10(d / c2);
                let moveD = c4 * Fa;
                let angle = Math.atan2(dy, dx);
                let deltaX = Math.abs(moveD * Math.cos(angle));
                let deltaY = Math.abs(moveD * Math.sin(angle));

                if (dx > 0 && dy === 0) {
                    deltaX = -1 * deltaX;
                    deltaY = 0;
                } else if (dx > 0 && dy > 0) {
                    deltaX = -1 * deltaX;
                    deltaY = -1 * deltaY;
                } else if (dx === 0 && dy > 0) {
                    deltaX = 0;
                    deltaY = -1 * deltaY;
                } else if (dx < 0 && dy > 0) {
                    deltaY = -1 * deltaY;
                } else if (dx < 0 && dy === 0) {
                    deltaY = 0;
                } else if (dx < 0 && dy < 0) {
                } else if (dx == 0 && dy < 0) {
                    deltaX = 0;
                } else if (dx > 0 && dy < 0) {
                    deltaX = -1 * deltaX;
                }

                positions[graphNode.id - 1] = [v1[0] + deltaX, v1[1] + deltaY];
                positions[neighbour - 1] = [v2[0] - deltaX, v2[1] - deltaY];
                // simulate(ctx, positions, "red");

                edgesVisited.push([graphNode.id, neighbour]);
                edgesVisited.push([neighbour, graphNode.id]);
            }

            //repulsive
            let nonadjacent = graph.filter(
                (g) => graphNode.neighbours.includes(g.id) == false && g.id != graphNode.id
            );

            for (const farNode of nonadjacent) {
                const v1 = positions[graphNode.id - 1];
                const v2 = positions[farNode.id - 1];
                const dx = v1[0] - v2[0];
                const dy = v1[1] - v2[1];
                let d = Math.sqrt(dx * dx + dy * dy);

                if (d > Math.sqrt((cw * ch) / graph.length)) {
                    continue;
                }

                let fr = c3 / (d * d);
                let moveD = c4 * fr;
                let angle = Math.atan2(dy, dx);
                let deltaX = Math.abs(moveD * Math.cos(angle));
                let deltaY = Math.abs(moveD * Math.sin(angle));

                if (dx > 0 && dy === 0) {
                    deltaY = 0;
                } else if (dx > 0 && dy > 0) {
                } else if (dx === 0 && dy > 0) {
                    deltaX = 0;
                } else if (dx < 0 && dy > 0) {
                    deltaX = -1 * deltaX;
                } else if (dx < 0 && dy === 0) {
                    deltaX = -1 * deltaX;
                    deltaY = 0;
                } else if (dx < 0 && dy < 0) {
                    deltaY = -1 * deltaY;
                    deltaX = -1 * deltaX;
                } else if (dx == 0 && dy < 0) {
                    deltaX = 0;
                    deltaY = -1 * deltaY;
                } else if (dx > 0 && dy < 0) {
                    deltaY = -1 * deltaY;
                }

                let newX1 = v1[0] + deltaX;
                let newY1 = v1[1] + deltaY;

                let newX2 = v1[0] - deltaX;
                let newY2 = v1[1] - deltaY;

                if (newX1 < 30 || newX1 > cw - 30 || newY1 < 30 || newY1 > ch - 30) {
                    continue;
                }

                if (newX2 < 30 || newX2 > cw - 30 || newY2 < 30 || newY2 > ch - 30) {
                    continue;
                }
                positions[graphNode.id - 1] = [newX1, newY1];
                //positions[farNode.id - 1] = [newX2, newY2];

                //simulate(ctx, positions, "blue");
            }
        }
    }

    return positions;
}

function drawGraphNode(ctx, node, x, y) {
    // let px =
    drawCircle(ctx, x, y, 12, "blue", "blue", 1);
    drawValueActive(ctx, x - 4, y + 4, node.id, "white");
}

function drawGraphNode_Deprecated(ctx, graph, node, positions, x, y, coods, px = null, py = null) {
    if (coods[node.id] !== undefined) {
        if (px !== null && py !== null) {
            drawLine(ctx, [px, py], coods[node.id], "black", 1);
        }
        return;
    }

    drawCircle(ctx, x, y, 16, "black", "black", 1);
    drawValueActive(ctx, x - 4, y + 4, node.id, "white");

    coods[node.id] = [x, y];

    let index = 0;
    for (const childId of node.neighbours) {
        let child = graph.find((g) => g.id == childId);
        let childX = positions[child.id - 1][0];
        let childY = positions[child.id - 1][1];
        drawGraphNode(ctx, graph, child, positions, childX, childY, coods, x, y);
    }
}

const controlOut = document.getElementById("nodes-output");
const control = document.getElementById("nodes");
const maxEdges = document.getElementById("maxEdges");

let r = parseInt(control.value); // nodes
let m = parseInt(maxEdges.value);


maxEdges.onchange = () => {
    m = maxEdges.value;
    draw(r,m);
}
control.oninput = () => {
    controlOut.textContent = r = control.value;
    draw(r, m);
};

window.onresize = () => {
    const canvas = document.querySelector("#canvas");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.width = window.innerWidth - 60;
    canvas.height = window.innerHeight - headerHeight;

    draw(r, m);
};

draw(r,m);
