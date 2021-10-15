"use strict";

function drawRect(ctx, x, y, width, height, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, width, height);
}

function drawRectClear(ctx, x, y, width, height, stroke) {
    ctx.strokeStyle = stroke;
    ctx.strokeRect(x, y, width, height);
}

function drawValue(ctx, x, y, value) {
    ctx.font = "bold 12px serif";
    ctx.fillStyle = "black";
    ctx.fillText(value, x, y);
}

function drawGrid(ctx, width, height, gap, lineWidth) {
    for (let i = 0; i < width; i += gap) {
        drawLine(ctx, [i, 0], [i, height], "gray", lineWidth);
    }
    for (let i = 0; i < height; i += gap) {
        drawLine(ctx, [0, i], [width, i], "gray", lineWidth);
    }
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

function drawCircleClear(ctx, x, y, radius = 10, stroke = "black", lineWidth = 1) {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
    ctx.stroke();
    //ctx.fill();
}

function drawCircle(ctx, x, y, radius = 10, stroke = "black", lineWidth = 1) {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = "rgba(0,0,0,1)";
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
    ctx.stroke();
    ctx.fill();
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

export {drawRect, drawRectClear, drawValue, drawGrid, drawLine, drawCircle, drawCircleClear, getRandomIntInclusive};