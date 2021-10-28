"use strict";

import {
    drawGrid,
    drawLine,
    drawValue,
    drawRect,
    drawLines,
    drawLineArea,
    roundValues,
    scaleValues,
    drawSplines
} from "./common.js";
import {
    getChartData
} from "./chartdata.js";

function draw(points = 0, xAxisText = "", yAxisText = "", showPoints = true, type = "line") {
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
        ctx.clearRect(0, 0, cw, ch);
        const cx = cw / 2;
        const cy = ch / 2;

        drawGrid(ctx, cw, ch, 10, 0.2);

        if (points > 0) {
            //Axis
            let baseY = ch - 50;
            let baseX = 100;
            let rightEdge = cw - 50;
            let yTop = 35;
            const lchart = getChartData(points, false, true);


            //Y axis
            let max = Math.max(...lchart.map(b => b.value));
            let min = Math.min(...lchart.map(b => b.value));

            let zero = 0.0;

            if (max < 0) {
                max = 0.0;
                // zero = max;
            }
            if (min > 0) {
                // zero = min;
                min = 0.0;
            }

            let range = max - min;
            var scaleYValues = scaleValues(min, max);

            //Y axis ticks
            let yAxisHeight = baseY - yTop - 20;
            let ticks = 10;
            let tickHeight = yAxisHeight / ticks;

            let tickRange = range / ticks;

            drawLine(ctx, [baseX, yTop - tickHeight], [baseX, baseY + tickHeight], "black", 2);

            let roundRange = roundValues(range);
            let roundedTickRange = (tickRange > 1) ? Math.round(tickRange / roundRange) * roundRange : 1;
            let adRatio = roundedTickRange / tickRange;

            let baseY0Offset = scaleYValues(zero);
            let baseY0 = baseY - (baseY0Offset * yAxisHeight);



            let rmin = Math.round(min / roundRange) * roundRange;
            let rmax = Math.round(max / roundRange) * roundRange;

            for (let y = rmin - roundedTickRange, i = -1; y <= rmax + roundedTickRange; y += roundedTickRange, i++) {

                let tickYPos = baseY - i * tickHeight * adRatio;
                let yValue = parseFloat(y).toFixed(0);

                if (y === 0) {
                    baseY0 = tickYPos;
                }

                // let yValue = parseFloat(scaleYValues(y)).toFixed(2);
                let ytext = ctx.measureText(yValue);
                let textWidth = Math.ceil(ytext.width) + 15;

                drawLine(ctx, [baseX - 10, tickYPos], [baseX, tickYPos], "red", 1);
                drawValue(ctx, baseX - textWidth, tickYPos, yValue);

                if (i >= ticks + 2) {
                    break;
                }

            }

            //Y axis caption
            ctx.save();
            ctx.rotate((3 * Math.PI) / 2);
            drawValue(
                ctx,
                -((yTop + baseY) / 2) - ctx.measureText(yAxisText).width / 2,
                25,
                yAxisText
            );

            ctx.restore();

            //X axis
            drawLine(ctx, [baseX, baseY0], [rightEdge, baseY0], "black", 2);
            drawValue(
                ctx,
                (baseX + rightEdge) / 2 - ctx.measureText(xAxisText).width / 2,
                baseY + 40,
                xAxisText
            );

            let barwidth = 5;
            const xAxisWidth = rightEdge - baseX;
            const totalBarWidth = points * barwidth;
            let gap = (xAxisWidth - totalBarWidth) / (parseInt(points) + 1);

            let positions = [];
            positions.push([baseX, baseY0]);

            for (let i = 0; i < lchart.length; i++) {
                const bar = lchart[i];
                let xpos = baseX + (i + 1) * gap + i * barwidth;

                let ypos = baseY - scaleYValues(bar.value) * yAxisHeight;
                let height = baseY0 - ypos;

                if (showPoints === true) {
                    drawRect(
                        ctx,
                        xpos - barwidth / 2,
                        ypos - barwidth / 2,
                        barwidth,
                        barwidth,
                        bar.fill
                    );
                }
                positions.push([xpos, ypos]);


                //X axis data label
                drawValue(ctx, xpos + 10, baseY0 + 15, bar.id);
            }

            if (type === "line") {
                drawLines(ctx, positions, "black", "round", 1);
            } else if (type === "spline") {
                drawSplines(ctx, positions, "blue", 2);
            } else if (type === "linearea") {
                drawLineArea(ctx, baseY0, positions, "black", "round", 1, "lightgray");
            }


        }
    }
}

const lineType = document.getElementById("type");

const control = document.getElementById("nodes");
let r = parseInt(control.value); // points

const showPoints = document.getElementById("showpoints");

const xAxisLabel = document.getElementById("xlabel");
xAxisLabel.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked);
};

lineType.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked, lineType.value);
};

const yAxisLabel = document.getElementById("ylabel");
yAxisLabel.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked, lineType.value);
};


showPoints.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked, lineType.value);
};


const controlOut = document.getElementById("nodes-output");
control.oninput = () => {
    controlOut.textContent = r = control.value;
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked, lineType.value);
};

window.onresize = () => {
    const canvas = document.querySelector("#canvas");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - headerHeight - 80;

    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked, lineType.value);
};

draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked, lineType.value);