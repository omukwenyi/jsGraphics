"use strict";

function draw(bars) {
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

    //Axiz
    let baseY = ch - 75;
    let baseX = 100;
    let rightEdge = cw - 50;
    let yTop = 50;
    drawLine(ctx, [baseX, yTop], [baseX, baseY], "black", 5);
    drawLine(ctx, [baseX, baseY], [rightEdge, baseY], "black", 5);

    if (bars > 0) {
      const bchart = getBarChart(bars);
      let barwidth = 50;
      const xAxisWidth = rightEdge - baseX;
      const totalBarWidth = bars * barwidth;
      let gap = (xAxisWidth - totalBarWidth) / (bars + 1);

      let max = bchart[0].value;

      bchart.forEach((item) => {
        if (item.value > max) {
          max = item.value;
        }
      });
      console.log("Max:", max);

      for (let i = 0; i < bchart.length; i++) {
        const bar = bchart[i];
        let xpos = baseX + (i + 1) * gap + i * barwidth;
        let height = bar.value * ((baseY - yTop) / max);
        let ypos = baseY - height;
        drawRect(ctx, xpos, ypos, barwidth, height, bar.fill);
      }
    }
  }
}

function drawRect(ctx, x, y, width, height, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);

  // ctx.font = "bold 12px serif";
  // ctx.fillStyle = labelFill;
  // ctx.fillText(label, x + width + 10, y + 0.8 * height);
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

const controlOut = document.getElementById("nodes-output");
const control = document.getElementById("nodes");
control.oninput = () => {
  controlOut.textContent = r = control.value;
  draw(parseInt(r));
};

window.onresize = () => {
  const canvas = document.querySelector("#canvas");
  const header = document.querySelector("#title");
  const headerHeight = header.scrollHeight;

  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - headerHeight - 80;

  draw(parseInt(r));
};

draw(r);
