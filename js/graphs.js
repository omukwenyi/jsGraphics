"use strict";

import {
    drawRectClear,
    drawValue,
    drawGrid,
    drawLine,
    drawCircleClear, drawCircle,
    getRandomIntInclusive, drawValueActive
} from "./common.js";

import { createGraph } from "./nodedata.js";

function draw(nodes) {
    console.clear();

    const canvas = document.querySelector("#canvas");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - headerHeight - 60;
    const cw = canvas.width;
    const ch = canvas.height;

    if (canvas.getContext) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;

        drawGrid(ctx, canvas.width, canvas.height, 10, 0.2);

        if (nodes > 0) {
            const graph = createGraph(parseInt(nodes), 5);

            //sort graph by  centrality
            //graph.sort((a, b) => a.closenessCentrality - b.closenessCentrality).reverse();

            let coods = [];
            let positions = spring(ctx, graph, cw, ch, 25);
            console.log(graph);
            console.log(positions);

            for (let i = 0; i < graph.length; i++) {
                const node = graph[i];
                const x = positions[i][0];
                const y = positions[i][1];
                drawGraphNode(ctx, graph, node, positions, x, y, coods);
            }
        }
    }
}

function simulate(ctx, positions, color) {
    for (let i = 0; i < positions.length; i++) {
        const x = positions[i][0];
        const y = positions[i][1];

        drawCircleClear(ctx, x, y, 8, color, 1);
        drawValueActive(ctx, x - 2, y + 2, i + 1, "white");
    }
}

function spring(ctx, graph, cw, ch, radius) {
    let positions = [graph.length];

    for (const graphNode of graph) {
        let nx = getRandomIntInclusive(100, cw - 100);
        let ny = getRandomIntInclusive(100, ch - 100);
        positions[graphNode.id - 1] = [nx, ny];

        // simulate(ctx, positions, "blue");
    }
    let c1 = 2,
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

                if (d < 20 + radius * 2) {
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
                // simulate(ctx, positions,"red");

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

                if (d > Math.sqrt(cw*ch/graph.length)) {
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
                //positions[graphNode.id - 1] = [v1[0] + deltaX, v1[1] + deltaY];
                //positions[farNode.id - 1] = [v1[0] - deltaX, v1[1] - deltaY];
                // simulate(ctx, positions,"red");
            }
        }
    }

    return positions;
}

function drawGraphNode(ctx, graph, node, positions, x, y, coods, px = null, py = null) {
    if (coods[node.id] !== undefined) {
        if (px !== null && py !== null) {
            drawLine(ctx, [px, py], coods[node.id], "black", 1);
        }
        return;
    }

    drawCircle(ctx, x, y, 25, "black", "black", node.closenessCentrality * 2 + 0.5);
    drawValueActive(ctx, x - 8, y, node.id, "white");

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
let r = parseInt(control.value); // nodes

control.oninput = () => {
    controlOut.textContent = r = control.value;
    draw(r);
};

window.onresize = () => {
    const canvas = document.querySelector("#canvas");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - headerHeight - 80;

    draw(r);
};

draw(r);
