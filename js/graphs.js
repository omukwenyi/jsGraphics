"use strict";

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
                const box = [cx - 100*(i+1), cy - 100*(i+1), cx + 100*(i+1), cy + 100*(i+1)];
                drawGraphNode(ctx, graph, node, box, coods);
            }
        }
    }
}

function drawGraphNode(ctx, graph, node, box, coods, px = null, py = null) {
    let nx = getRandomIntInclusive(20, (box[0] + box[2]) / 2 - 20);
    let ny = getRandomIntInclusive(20, (box[1] + box[3]) / 2 - 20);

    if (px === null && py === null) {
        nx = (box[0] + box[2]) / 2;
        ny = (box[1] + box[3]) / 2;

        let foundxy = coods.find((xy) => xy !== undefined && xy[0] === nx && xy[1] === ny);

        //console.log(node.id, "Found:", foundxy);

        if (foundxy !== undefined) {
            let direction = getRandomIntInclusive(0, 1);
            nx = direction === 0 ? nx - 100 : nx + 100;
            ny = direction === 0 ? ny - 100 : ny + 100;
            //console.log(node.id, "Coods:", coods, "Adjusted:", [nx,ny]);
        }
    }

    if (coods[node.id] !== undefined) {
        if (px !== null && py !== null) {
            drawLine(ctx, [px, py], coods[node.id], "darkblue", 1);
        }
        return;
    }

    drawCircle(
        ctx,
        nx,
        ny,
        20,
        "black",
        node.closenessCentrality * node.degreeCentrality * 5 + 0.5
    );
    drawValue(ctx, nx - 4, ny, node.id + "-" + node.neighbours.length);

    coods[node.id] = [nx, ny];

    let index = 0;
    for (const childId of node.neighbours) {
        let child = graph.find((g) => g.id == childId);
        let childBox = [box[0] - 100, box[1] - 100, box[2] + 100, box[3] + 100];
        drawGraphNode(ctx, graph, child, childBox, coods, nx, ny);
    }
}

function drawValue(ctx, x, y, value) {
    ctx.font = "bold 12px serif";
    ctx.fillStyle = "black";
    ctx.fillText(value, x, y);
}

function drawLine(ctx, begin, end, stroke = "black", width = 1) {
    if (stroke) {
        ctx.strokeStyle = stroke;
    }

    if (width) {
        ctx.lineWidth = width;
    }

    ctx.beginPath();
    ctx.moveTo(...begin);
    ctx.lineTo(...end);
    ctx.stroke();
}

function drawCircle(ctx, x, y, radius = 10, stroke = "black", lineWidth = 1) {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
    ctx.stroke();
    //ctx.fill();
}

function drawGrid(ctx, width, height, gap, lineWidth) {
    for (let i = 0; i < width; i += gap) {
        drawLine(ctx, [i, 0], [i, height], "gray", lineWidth);
    }
    for (let i = 0; i < height; i += gap) {
        drawLine(ctx, [0, i], [width, i], "gray", lineWidth);
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
