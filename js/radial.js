"use strict";

function draw(nodes) {
  const canvas = document.querySelector("#canvas");
  const header = document.querySelector("#title");
  const headerHeight = header.scrollHeight;

  canvas.width = window.innerWidth - 20;
  canvas.height = window.innerHeight - headerHeight - 60;

  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    drawGrid(ctx, canvas.width, canvas.height, 10, 0.2);

    //const nodes = 5;
    if (nodes > 0) {
      //console.clear();
      const nodeSize = 40;
      const angleGap = (2 * Math.PI) / nodes;
      const lineLength = Math.min(cx, cy) - nodeSize;

      let i = 0;
      for (let angle = 0; angle < Math.PI * 2; angle += angleGap) {
        const x = lineLength * Math.cos(angle);
        const y = lineLength * Math.sin(angle);

        drawLine(ctx, [cx, cy], [cx + x, cy + y], "red", 2.5);
        //drawCircle(ctx, cx + x, cy + y);
        const ip = Math.ceil(angle * (180 / Math.PI) + 2);
        const type = getDeviceType();
        //console.log(angle, type, angleGap * (180 / Math.PI));
        i++;
        if (i <= nodes) {
          drawRect(ctx, cx + x, cy + y, nodeSize, nodeSize, type, i, cx);
        }
      }

      drawRect(
        ctx,
        cx,
        cy,
        nodeSize + 10,
        nodeSize + 10,
        "R",
        "192.168.0.1",
        cx
      );
      //drawCircle(ctx, cx, cy, 15);
    }
  }
}

function getDeviceType() {
  const tn = Math.round(getRandomIntInclusive(1, 5));
  switch (tn) {
    case 1:
      return "S";
    case 2:
      return "R";
    case 3:
      return "F";
    case 4:
      return "V";
    case 5:
      return "D";
    default:
      return "U";
  }
}

function drawRect(ctx, x, y, width, height, type, label, cx) {
  const img1 = new Image();
  let src = "";
  switch (type) {
    case "S":
      src = "./images/switch.svg";
      break;
    case "R":
      src = "./images/router.svg";
      break;
    case "F":
      src = "./images/firewall.svg";
      break;
    case "V":
      src = "./images/server.svg";
      break;
    case "D":
      src = "./images/database.svg";
      break;
      case "U":
      src = "./images/workstation.svg";
      break;
  }

  img1.src = src;

  img1.onload = function () {
    ctx.drawImage(this, x - width / 2, y - height / 2, width, height);
    ctx.font = "0.7em serif";

    if (x >= cx) {
      ctx.fillText(label, 5 + x + width / 2, y - 5, 100);
    } else {
      ctx.fillText(label, x - width / 2, y - height / 2 - 5, 100);
    }

    this.tag = label;
  };

  img1.onclick = function () {
    console.log(this.tag);
  };
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

function drawCircle(ctx, x, y, radius = 10, stroke = "black") {
  ctx.strokeStyle = stroke;
  ctx.fillStyle = "rgba(0,0,0,1)";
  ctx.lineWidth = 1;
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

function drawGrid(ctx, width, height, gap, lineWidth) {
  for (let i = 0; i < width; i += gap) {
    drawLine(ctx, [i, 0], [i, height], "gray", lineWidth);
  }
  for (let i = 0; i < height; i += gap) {
    drawLine(ctx, [0, i], [width, i], "gray", lineWidth);
  }
}

let r = 2; // nodes

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
