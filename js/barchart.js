"use strict";

function draw(bars = 0, useColors = false) {
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
    // const cx = cw / 2;
    // const cy = ch / 2;

    drawGrid(ctx, cw, ch, 10, 0.2);

    if (bars > 0) {
      //Axis
      let baseY = ch - 50;
      let baseX = 100;
      let rightEdge = cw - 50;
      let yTop = 25;
      const bchart = getBarChart(bars, useColors);

      //X axis
      drawLine(ctx, [baseX, yTop], [baseX, baseY], "black", 2);

      //Y axis
      let max = bchart[0].value;
      bchart.forEach((item) => {
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

      //console.log("Max:", max, "R:", tickRange, "aR:", rt);

      for (let y = 0; y <= ticks; y++) {
        let tickYPos = baseY - y * majorYRange * adRatio;
        let yValue = parseInt(y * rt).toLocaleString();
        let ytext = ctx.measureText(yValue);
        let textWidth = Math.ceil(ytext.width) + 15;

        //console.log("yval:", yValue, "W:", textWidth);
        drawLine(ctx, [baseX - 10, tickYPos], [baseX, tickYPos], "red", 1);
        drawValue(ctx, baseX - textWidth, tickYPos, yValue);
      }

      let barwidth = 50;
      const xAxisWidth = rightEdge - baseX;
      const totalBarWidth = bars * barwidth;
      let gap = (xAxisWidth - totalBarWidth) / (parseInt(bars) + 1);

      console.log(
        "N:",
        bars + 1,
        "xw:",
        xAxisWidth,
        "tw:",
        totalBarWidth,
        "diff",
        xAxisWidth - totalBarWidth,
        "gap:",
        gap
      );
      for (let i = 0; i < bchart.length; i++) {
        const bar = bchart[i];
        let xpos = baseX + (i + 1) * gap + i * barwidth;
        let height = bar.value * (yAxisHeight / max);
        let ypos = baseY - height;
        drawRect(ctx, xpos, ypos, barwidth, height, bar.fill);
        drawValue(ctx, xpos + 3, ypos - 5, bar.value.toLocaleString());

        //X axis label
        drawValue(ctx, xpos + 10, baseY + 15, bar.id);
      }
    }
  }
}

function drawValue(ctx, x, y, value) {
  ctx.font = "bold 12px serif";
  ctx.fillStyle = "black";
  ctx.fillText(value, x, y);
}

function drawRect(ctx, x, y, width, height, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);
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

function drawGrid(ctx, width, height, gap, lineWidth) {
  for (let i = 0; i < width; i += gap) {
    drawLine(ctx, [i, 0], [i, height], "gray", lineWidth);
  }
  for (let i = 0; i < height; i += gap) {
    drawLine(ctx, [0, i], [width, i], "gray", lineWidth);
  }
}

let r = 1; // slices

const diffColors = document.getElementById("colors");
diffColors.onclick = () => {
  draw(parseInt(r), diffColors.checked);
};

const controlOut = document.getElementById("nodes-output");
const control = document.getElementById("nodes");
control.oninput = () => {
  controlOut.textContent = r = control.value;
  draw(parseInt(r), diffColors.checked);
};

window.onresize = () => {
  const canvas = document.querySelector("#canvas");
  const header = document.querySelector("#title");
  const headerHeight = header.scrollHeight;

  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - headerHeight - 80;

  draw(parseInt(r), diffColors.checked);
};

draw(parseInt(r), diffColors.checked);
