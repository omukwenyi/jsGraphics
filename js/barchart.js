"use strict";

import {
    drawGrid,
    drawLine,
    drawValue,
    drawRect, roundValues, scaleValues
} from "./common.js";
import {
    getChartData
} from "./chartdata.js";

function draw(bars = 0, useColors = false, showBarValues = false, xAxisText = "", yAxisText = "") {
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

        if (bars > 0) {
            //Axes
            let baseY = ch - 50;
            let baseX = 100;
            let rightEdge = cw - 50;
            let yTop = 35;
            const bchart = getChartData(bars, useColors);

            
            //Y axis
            let max = Math.max(...bchart.map(b => b.value));
            let min = Math.min(...bchart.map(b => b.value));

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

            console.log(range, roundRange, roundedTickRange);

            let baseY0Offset = scaleYValues(zero);
            let baseY0 = baseY - (baseY0Offset * yAxisHeight);

            

            let rmin = Math.round(min / roundRange) * roundRange;
            let rmax = Math.round(max / roundRange) * roundRange;

            //for (let y = min - tickRange, i = -1; y <= max + tickRange; y += tickRange, i++) {
            for (let y = rmin - roundedTickRange, i = -1;  y <= rmax + roundedTickRange; y += roundedTickRange, i++) {

                let tickYPos = baseY - i * tickHeight * adRatio;
                let yValue = parseFloat(y).toFixed(0);
                // console.log(baseY0, tickYPos, yValue);

                if (y === 0) {
                    baseY0 = tickYPos;
                }

                // let yValue = parseFloat(scaleYValues(y)).toFixed(2);
                let ytext = ctx.measureText(yValue);
                let textWidth = Math.ceil(ytext.width) + 15;

                drawLine(ctx, [baseX - 10, tickYPos], [baseX, tickYPos], "red", 1);
                drawValue(ctx, baseX - textWidth, tickYPos, yValue);

                if(i >= ticks + 2 ){
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


            let barwidth = 50;
            const xAxisWidth = rightEdge - baseX;
            const totalBarWidth = bars * barwidth;
            let gap = (xAxisWidth - totalBarWidth) / (parseInt(bars) + 1);



            for (let i = 0; i < bchart.length; i++) {
                const bar = bchart[i];
                let xpos = baseX + (i + 1) * gap + i * barwidth;

                let ypos = baseY - scaleYValues(bar.value) * yAxisHeight;
                let height = baseY0 - ypos;

                // console.log(bar.value, scaleYValues(bar.value));

                drawRect(ctx, xpos, ypos, barwidth, height, bar.fill);

                if (showBarValues) {
                    let textpos = xpos + (barwidth / 2) - (ctx.measureText(bar.value.toLocaleString()).width / 2);
                    let textYpos = ypos + (height > 0 ? -6 : 12);
                    drawValue(ctx, textpos, textYpos, bar.value.toLocaleString());
                }

                //X axis bar label
                let textXypos = baseY0 + (height > 0 ? 15 : -15);

                drawValue(ctx, xpos + 10, textXypos, bar.id);
            }
        }
    }
}


const control = document.getElementById("nodes");
let r = control.value; // bars

const xAxisLabel = document.getElementById("xlabel");
xAxisLabel.onchange = () => {
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

const yAxisLabel = document.getElementById("ylabel");
yAxisLabel.onchange = () => {
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

const diffColors = document.getElementById("colors");
diffColors.onclick = () => {
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

const showValues = document.getElementById("showvalues");
showValues.onclick = () => {
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

const controlOut = document.getElementById("nodes-output");

control.oninput = () => {
    controlOut.textContent = r = control.value;
    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

window.onresize = () => {
    const canvas = document.querySelector("#canvas");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - headerHeight - 80;

    draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);
};

draw(parseInt(r), diffColors.checked, showValues.checked, xAxisLabel.value, yAxisLabel.value);