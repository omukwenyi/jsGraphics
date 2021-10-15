"use strict";

import {
    drawRectClear,
    drawValue,
    drawGrid,
    drawLine,
    drawCircleClear,
    getRandomIntInclusive,
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
            const graph = createGraph(parseInt(nodes), 3);

            //sort graph by  centrality
            //graph.sort((a, b) => a.closenessCentrality - b.closenessCentrality).reverse();

            let coods = [];
            let positions = spring(graph, cw, ch);
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

function spring(graph, cw, ch) {
    let positions = [graph.length];

    for (const graphNode of graph) {
        let nx = getRandomIntInclusive(100, cw - 100);
        let ny = getRandomIntInclusive(100, ch - 100);
        positions[graphNode.id - 1] = [nx, ny];
    }
    let c1 = 2,
        c2 = 1,
        c3 = 1,
        c4 = 0.1;

    for (let m = 0; m < 100; m++) {
        //calculate the force on each vertex;
        //d is the length of the spring

        for (const graphNode of graph) {
            //attractive : c1 ∗ log(d/c2),

            for (const neighbour of graphNode.neighbours) {
                const neighbourNode = graph[neighbour - 1];
                const v1 = positions[graphNode.id - 1];
                const v2 = positions[neighbour - 1];
                const dx = v1[0] - v2[0];
                const dy = v1[1] - v2[1];
                let d = Math.sqrt(dx * dx + dy * dy);
                let Fa = c1 * Math.log10(d / c2);
                let moveD = c4 * Fa;
                let angle = Math.atan2(dy, dx);
                let deltaX = moveD * Math.cos(angle);
                let deltaY = moveD * Math.sin(angle);
                deltaX = dx > 0 ? -1 * deltaX : deltaX;
                deltaY = dy > 0 ? -1 * deltaY : deltaY;

                positions[graphNode.id - 1] = [v1[0] + deltaX, v1[1] + deltaY];
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
                let fr = c3 / (d * d);
                let moveD = c4 * fr;
                let angle = Math.atan2(dy, dx);
                let deltaX = moveD * Math.cos(angle);
                let deltaY = moveD * Math.sin(angle);

                deltaX = dx < 0 ? -1 * deltaX : deltaX;
                deltaY = dy < 0 ? -1 * deltaY : deltaY;
                positions[graphNode.id - 1] = [v1[0] + deltaX, v1[1] + deltaY];
            }
        }
    }

    return positions;
}

function drawGraphNode(ctx, graph, node, positions, x, y, coods, px = null, py = null) {
    // let nx = getRandomIntInclusive(box[0], box[2]);
    // let ny = getRandomIntInclusive(box[1], box[3]);

    if (px === null && py === null) {
        // nx = (box[0] + box[2]) / 2;
        // ny = (box[1] + box[3]) / 2;
        // let foundxy = coods.find((xy) => xy !== undefined && xy[0] === nx && xy[1] === ny);
        // //console.log(node.id, "Found:", foundxy);
        // if (foundxy !== undefined) {
        //     let direction = getRandomIntInclusive(0, 1);
        //     nx = direction === 0 ? nx - 100 : nx + 100;
        //     ny = direction === 0 ? ny - 100 : ny + 100;
        //     console.log(node.id, "Coods:", coods, "Adjusted:", [nx, ny]);
        // }
    }

    if (coods[node.id] !== undefined) {
        if (px !== null && py !== null) {
            drawLine(ctx, [px, py], coods[node.id], "darkblue", 1);
        }
        return;
    }

    // drawRectClear(ctx, box[0], box[1], box[2] - box[0], box[3] - box[1], "red");

    drawCircleClear(ctx, x, y, 25, "black", node.closenessCentrality * 2 + 0.5);
    drawValue(ctx, x - 8, y, node.id);

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
