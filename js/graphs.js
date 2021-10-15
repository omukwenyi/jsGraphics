"use strict";

import { drawRectClear, drawValue, drawGrid, drawLine, drawCircleClear } from "./common.js";

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
            const graph = createGraph(parseInt(nodes), 3);
            //console.log(graph);

            //sort graph by  centrality

            graph.sort((a, b) => a.closenessCentrality - b.closenessCentrality).reverse();

            let coods = [];
            console.log(graph);

            for (let i = 0; i < graph.length; i++) {
                const node = graph[i];
                const box = [
                    cx - 50 * (i + 1),
                    cy - 50 * (i + 1),
                    cx + 50 * (i + 1),
                    cy + 50 * (i + 1),
                ];
                drawGraphNode(ctx, graph, node, box, coods);
            }
        }
    }
}

function drawGraphNode(ctx, graph, node, box, coods, px = null, py = null) {
    let nx = getRandomIntInclusive(box[0],  box[2]);
    let ny = getRandomIntInclusive(box[1], box[3]);

    if (px === null && py === null) {
        nx = (box[0] + box[2]) / 2;
        ny = (box[1] + box[3]) / 2;

        let foundxy = coods.find((xy) => xy !== undefined && xy[0] === nx && xy[1] === ny);

        //console.log(node.id, "Found:", foundxy);

        if (foundxy !== undefined) {
            let direction = getRandomIntInclusive(0, 1);
            nx = direction === 0 ? nx - 100 : nx + 100;
            ny = direction === 0 ? ny - 100 : ny + 100;
            console.log(node.id, "Coods:", coods, "Adjusted:", [nx,ny]);
        }
    }

    if (coods[node.id] !== undefined) {
        if (px !== null && py !== null) {
            drawLine(ctx, [px, py], coods[node.id], "darkblue", 1);
        }
        return;
    }

    drawRectClear(ctx, box[0], box[1], box[2] - box[0], box[3] - box[1], "red");

    drawCircleClear(ctx, nx, ny, 25, "black", node.closenessCentrality * 3 + 0.5);
    drawValue(ctx, nx - 8, ny, node.id + "-" + node.closenessCentrality.toFixed(1));

    coods[node.id] = [nx, ny];

    let index = 0;
    for (const childId of node.neighbours) {
        let child = graph.find((g) => g.id == childId);
        let childBox = [box[0] - 50, box[1] - 50, box[2] + 50, box[3] + 50];
        drawGraphNode(ctx, graph, child, childBox, coods, nx, ny);
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
