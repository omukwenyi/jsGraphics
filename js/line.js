"use strict";

import {
    drawGrid,
    drawLine,
    drawValue,
    drawRect,
    drawLines
} from "./common.js";
import {
    getChartData
} from "./chartdata.js";

function draw(points = 0, xAxisText = "", yAxisText = "", showPoints = true) {
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
            let yTop = 25;
            const lchart = getChartData(points);

            //X axis
            drawLine(ctx, [baseX, yTop], [baseX, baseY], "black", 2);
            drawValue(
                ctx,
                (baseX + rightEdge) / 2 - ctx.measureText(xAxisText).width / 2,
                baseY + 40,
                xAxisText
            );

            //Y axis
            let max = lchart[0].value;
            lchart.forEach((item) => {
                if (item.value > max) {
                    max = item.value;
                }
            });

            drawLine(ctx, [baseX, baseY], [rightEdge, baseY], "black", 2);

            //Y axis ticks
            let yAxisHeight = baseY - yTop - 20;
            let ticks = 10;
            let majorYRange = yAxisHeight / ticks;
            let tickRange = max / ticks;

            let rfactor = max < 1000 ? 10 : max < 10000 ? 100 : 1000;

            let rt = Math.round(tickRange / rfactor) * rfactor;
            let adRatio = rt / tickRange;

            for (let y = 0; y <= ticks; y++) {
                let tickYPos = baseY - y * majorYRange * adRatio;
                let yValue = parseInt(y * rt).toLocaleString();
                let ytext = ctx.measureText(yValue);
                let textWidth = Math.ceil(ytext.width) + 15;

                drawLine(ctx, [baseX - 10, tickYPos], [baseX, tickYPos], "red", 1);
                drawValue(ctx, baseX - textWidth, tickYPos, yValue);
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

            let barwidth = 5;
            const xAxisWidth = rightEdge - baseX;
            const totalBarWidth = points * barwidth;
            let gap = (xAxisWidth - totalBarWidth) / (parseInt(points) + 1);

            let positions = [];
            positions.push([baseX, baseY]);

            for (let i = 0; i < lchart.length; i++) {
                const bar = lchart[i];
                let xpos = baseX + (i + 1) * gap + i * barwidth;
                let height = bar.value * (yAxisHeight / max);
                let ypos = baseY - height;

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
                drawValue(ctx, xpos + 10, baseY + 15, bar.id);
            }

            drawLines(ctx, positions, "black", "round", 1);
        }
    }
}

const control = document.getElementById("nodes");
let r = parseInt(control.value); // points

const showPoints = document.getElementById("showpoints");

const xAxisLabel = document.getElementById("xlabel");
xAxisLabel.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked);
};

const yAxisLabel = document.getElementById("ylabel");
yAxisLabel.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked);
};


showPoints.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked);
};


const controlOut = document.getElementById("nodes-output");
control.oninput = () => {
    controlOut.textContent = r = control.value;
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked);
};

window.onresize = () => {
    const canvas = document.querySelector("#canvas");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - headerHeight - 80;

    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked);
};

draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, showPoints.checked);