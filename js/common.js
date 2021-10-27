"use strict";

const scaleValues = function (low, high) {
    return function (value) {
        return (value - low) / (high - low);
    };
};

const roundValues = function (span) {
                if (Math.log10(span) <= 3) {
                    if (span < 100) {
                        let c = Math.ceil(span / 10);
                        if (c === 3 || c === 4) {
                            return 5;
                        } else if (c > 6) {
                            return 10;
                        } else return c;
                    } else
                        return 10;
                } else if (Math.log10(span) <= 4) {
                    return 100;
                } else if (Math.log10(span) <= 5) {
                    return 1000;
                } else if (Math.log10(span) <= 6) {
                    return 10000;
                } else if (Math.log10(span) <= 7) {
                    return 100000;
                } else if (Math.log10(span) <= 8) {
                    return 1000000;
                } else if (Math.log10(span) <= 9) {
                    return 10000000;
                } else if (Math.log10(span) <= 10) {
                    return 100000000;
                } else if (Math.log10(span) <= 11) {
                    return 1000000000;
                } else if (Math.log10(span) <= 12) {
                    return 10000000000;
                }
            }

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

function drawValueActive(ctx, x, y, value, fill = "black") {
    ctx.font = "bold 14px serif";
    ctx.fillStyle = fill;
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

function drawLines(ctx, positions, stroke, lineJoin="round", lineWidth=1) {
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.moveTo(...positions[0]);

    for (let i = 1; i < positions.length; i++) {
        const point = positions[i];
        ctx.lineTo(...point);
    }
    ctx.stroke();
}

function drawSplines(ctx, positions, stroke, lineJoin="round", lineWidth=1) {
    ctx.lineWidth = lineWidth;
    ctx.lineJoin = lineJoin;
    ctx.strokeStyle = stroke;
    ctx.beginPath();
    ctx.moveTo(...positions[0]);

    for (let i = 1; i < positions.length; i++) {
        const point = positions[i];
        ctx.lineTo(...point);
    }
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

function drawCircle(ctx, x, y, radius = 10, stroke = "black", fill = "black", lineWidth = 1) {
    ctx.strokeStyle = stroke;
    ctx.fillStyle = fill;
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

function create2DArray(i, j) {
    let array = new Array(i);
    for (let k = 0; k < i; k++) {
        array[k] = new Array(j);
    }
    return array;
}

export {
    drawRect,
    drawRectClear,
    drawValue,
    drawGrid,
    drawLine, drawLines,
    drawCircle,
    drawCircleClear,
    getRandomIntInclusive,
    drawValueActive, create2DArray,
    roundValues, scaleValues
};
