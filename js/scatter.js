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

function draw(points = 0, xAxisText = "", yAxisText = "", showLine = false) {
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
            const lchart = getChartData(points, false, true);

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

            let barwidth = 6;
            const xAxisWidth = rightEdge - baseX;
            const totalBarWidth = points * barwidth;
            let gap = (xAxisWidth - totalBarWidth) / (parseInt(points) + 1);
            let yScale = yAxisHeight / max;

            for (let i = 0; i < lchart.length; i++) {
                const bar = lchart[i];
                bar.fill = "black";
                let xpos = baseX + (i + 1) * gap + i * barwidth;
                let height = bar.value * yScale;
                let ypos = baseY - height;

                bar.xpos = xpos;

                drawRect(
                    ctx,
                    xpos - barwidth / 2,
                    ypos - barwidth / 2,
                    barwidth,
                    barwidth,
                    bar.fill
                );

                //X axis data label
                drawValue(ctx, xpos, baseY + 15, bar.id);
            }

            if (showLine) {
                drawLineofBestFit(ctx, lchart, yScale, baseX, baseY, "red", 1);
            }
        }
    }
}

function drawLineofBestFit(ctx, data, yscale, basex, basey, stroke, width) {
    //Calculate the mean of the x values and the mean of the y values.
    const meanX = data.map(d => d.id).reduce((p, c) => p + c) / data.length;
    const meanY = data.map(d => d.value).reduce((p, c) => p + c) / data.length;

    //console.log(meanX, meanY);
    // drawValue(ctx, ctx.canvas.width - 100, 10, "Mean X: " + meanX);
    // drawValue(ctx, ctx.canvas.width - 100, 30, "Mean Y: " + meanY);

    //The slope of the line of best fit (m)
    //m = ∑(xi−X)(yi−Y)/∑(xi−X)2
    //m => Sum of (x variation * y variation) / Sum of squares of x variation
    const sumXVarYVar = data.map(d => (d.id - meanX) * (d.value - meanY)).reduce((p, c) => p + c);
    const sumSquareXVar = data.map(d => (d.id - meanX) * (d.id - meanX)).reduce((p, c) => p + c);

    const m = sumXVarYVar / sumSquareXVar;

    //Compute the y-intercept of the line
    //b = Y − mX
    //b => MeanY - m * MeanX

    const b = meanY - (m * meanX);

    //the equation of the line
    //y => mx + b
    let lineCoodinates = [];

    lineCoodinates.push([basex, basey - (yscale * b)]);

    for (let x = 0; x < data.length; x++) {
        let y = basey - (yscale * ((m * data[x].id) + b));
        lineCoodinates.push([data[x].xpos, y]);
    }

    //console.log(lineCoodinates);
    const equation = "y = " + m.toFixed(1) + "x " + ((b > 0) ? " + " : " ") + b.toFixed(1);
    drawValue(ctx, ctx.canvas.width - 150, 30, equation);
    drawLine(ctx, lineCoodinates[0], lineCoodinates[lineCoodinates.length - 1], stroke, width);

    // drawLines(ctx, lineCoodinates, stroke, "round", width);

}

const control = document.getElementById("nodes");
let r = parseInt(control.value); // points

const lineOption = document.getElementById("lineofbestfit");
lineOption.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, lineOption.checked);
}

const xAxisLabel = document.getElementById("xlabel");
xAxisLabel.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, lineOption.checked);
};

const yAxisLabel = document.getElementById("ylabel");
yAxisLabel.onchange = () => {
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, lineOption.checked);
};



const controlOut = document.getElementById("nodes-output");
control.oninput = () => {
    controlOut.textContent = r = control.value;
    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, lineOption.checked);
};

window.onresize = () => {
    const canvas = document.querySelector("#canvas");
    const header = document.querySelector("#title");
    const headerHeight = header.scrollHeight;

    canvas.width = window.innerWidth - 50;
    canvas.height = window.innerHeight - headerHeight - 80;

    draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, lineOption.checked);
};

draw(parseInt(r), xAxisLabel.value, yAxisLabel.value, lineOption.checked);