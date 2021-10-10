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
    ctx.clearRect(0, 0, cw, ch);
    const cx = cw / 2;
    const cy = ch / 2;

    drawGrid(ctx, cw, ch, 10, 0.2);
    drawLine(ctx, [cx, 0], [cx, ch], "red", 2);

    let radius = Math.min(ch / 2, cw / 2) - 20;

    if (nodes > 0) {
      let pie = createPieData(nodes);

      pie.sort((a, b) => b.value - a.value);

      //   console.log(pie);

      let sum = 0;
      pie.forEach((item) => {
        sum += item.value;
      });

      let startAngle = 0;
      for (let i = 0; i < nodes; i++) {
        const p = pie[i];
        const ratio = p.value / sum;
        const angle = ratio * (Math.PI * 2);
        const xpos = cx;
        // const degStart = (startAngle * 180) / Math.PI;
        // const degEnd = ((startAngle + angle) * 180) / Math.PI;
        const radEnd = angle + startAngle;

        // console.log(degStart, degEnd);

        let x1 = radius * Math.cos(startAngle);
        let y1 = radius * Math.sin(startAngle);
        let x2 = radius * Math.cos(radEnd);
        let y2 = radius * Math.sin(radEnd);

        drawTriangle(
          ctx,
          [cx, cy],
          [cx + x1, cy + y1],
          [cx + x2, cy + y2],
          p.fill
        );

        drawSector(ctx, xpos, cy, radius, startAngle, radEnd, p.fill, p.fill);
        //console.log([x1, y1], [x2, y2]);
        //drawCircle(ctx, (cx + (cx + x1 + cx + x2) / 2)/2, (cy + (cy + y1 + cy + y2) / 2)/2, 1);
        let percent = parseFloat(ratio * 100).toFixed(1) + "%";
        let valueXpos = (cx + (2 * cx + x1 + x2) / 2) / 2;
        let valueYpos = (cy + (2 * cy + y1 + y2) / 2) / 2;

        if (nodes == 2 && i == 0 && ratio > 0.5) {
          drawValue(ctx, 2 * cx - valueXpos, 2 * cy - valueYpos, percent);
        } else {
          drawValue(ctx, valueXpos, valueYpos, percent);
        }
        drawLegend(ctx, cw - 150, 55 + i * 20, 50, 22, p.fill, p.id, "black");

        startAngle += angle;
      }
    }
    //drawCircle(ctx, cx, cy, 1, "white", "white");
  }
}

function drawValue(ctx, x, y, value) {
  ctx.font = "bold 12px serif";
  ctx.fillStyle = "black";
  ctx.fillText(value, x, y);
}
function drawLegend(ctx, x, y, width, height, fill, label, labelFill) {
  //   console.log(x, y, x + width, y + height);
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, width, height);

  ctx.font = "bold 12px serif";
  ctx.fillStyle = labelFill;
  ctx.fillText(label, x + width + 10, y + 0.8 * height);
}

function drawTriangle(ctx, pointA, pointB, pointC, fill, width = 1) {
  ctx.beginPath();
  ctx.moveTo(...pointA);
  ctx.lineTo(...pointB);
  ctx.lineTo(...pointC);
  ctx.fillStyle = fill;
  ctx.lineWidth = width;
  ctx.strokeStyle = fill;
  ctx.stroke();
  ctx.fill();
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

function drawCircle(
  ctx,
  x,
  y,
  radius = 10,
  stroke = "black",
  fillStyle = "green"
) {
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fillStyle;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
  ctx.stroke();
  ctx.fill();
}

function drawSector(
  ctx,
  x,
  y,
  radius,
  start = 0,
  end = 0,
  stroke = "black",
  fill = "green"
) {
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  //   ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, start, end, false);
  //ctx.stroke();
  ctx.fill();
}

function drawGrid(ctx, width, height, gap, lineWidth) {
  for (let i = 0; i < width; i += gap) {
    drawLine(ctx, [i, 0], [i, height], "gray", lineWidth);
  }
  for (let i = 0; i < height; i += gap) {
    drawLine(ctx, [0, i], [width, i], "gray", lineWidth);
  }
}

let r = 2; // slices

const controlOut = document.getElementById("nodes-output");
const control = document.getElementById("nodes");
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
