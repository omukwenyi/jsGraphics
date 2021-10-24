"use strict";

import {
  ternarytree,
  binarytree,
  randomtree
} from "./nodedata.js";

function init(nodes, type) {
  console.clear();
  resize();

  const canvas = document.querySelector("#canvas");

  if (canvas.getContext) {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    drawGrid(ctx, canvas.width, canvas.height, 10, 0.2);
    drawLine(ctx, [cx, 0], [cx, canvas.height], "red", 1);
    drawLine(ctx, [0, cy], [canvas.width, cy], "red", 1);


    canvas.onwheel = (event) => {
      event.preventDefault();

      scale += event.deltaY * -0.001;
      scale = Math.min(Math.max(0.5, scale), 2);
      //   console.log("event scale", scale);
      init(nodes);
    };

    ctx.scale(scale, scale);


    let root;

    //
    switch (type) {
      case 1:
        root = binarytree(0, nodes);
        draw(ctx, root, cx, 50, null);
        break;
      case 2:
        root = ternarytree(0, nodes);
        drawT(ctx, root, cx, 50, null);
        break;
      case 3:
        root = randomtree(0, nodes);
        break;
      default:
        break;
    }
  }
}

function drawT(ctx, root, px, py, direction = null) {
  if (root === null) {
    return;
  }

  var canvas = ctx.canvas;
  let cx = canvas.width / 2;

  const radius = 15;

  const level = root.level;
  let angle = 0;
  const ypos =
    level <= 1 && direction !== "M" ? radius * 2 : level * 60 + radius * 2;
  const xpos = (px, direction) => {
    angle = ((150 - level * 40) / 2) * (Math.PI / 180);
    if (direction == "L") {
      if (level == 1) {
        return cx / 2;
      }
      return px - 100 * Math.tan(angle);
    } else if (direction == "M") {
      return px;
    } else if (direction == "R") {
      if (level == 1) {
        return cx + cx / 2;
      }
      return px + 100 * Math.tan(angle);
    } else {
      return cx;
    }
  };

  const ccx = xpos.call(null, px, direction);

  if (direction !== null) {
    let xoffset = radius * Math.sin(angle);
    let yoffset = radius * Math.cos(angle);

    if (level > 1) {
      if (direction == "L") {
        drawLine(ctx, [px, py + yoffset], [ccx, ypos - yoffset], "black", 1.5);
      } else if (direction == "R") {
        drawLine(
          ctx,
          [px + xoffset, py + yoffset],
          [ccx - xoffset, ypos - yoffset],
          "black",
          1.5
        );
      } else if (direction == "M") {
        drawLine(ctx, [px, py + yoffset], [ccx, ypos - yoffset], "black", 1.5);
      }
    } else {
      xoffset = direction === "L" ? -radius : direction === "R" ? radius : 0;
      yoffset = direction == "M" ? radius : 0;
      drawLine(ctx, [px + xoffset, py + yoffset], [ccx, ypos], "black", 1.5);
    }
  }

  //console.log(root.id, level, ypos, parseInt(ccx));
  //console.log(root.id, level);
  drawCircle(ctx, ccx, ypos, radius, "black", "rgb(0,0,0,0.9)");

  ctx.font = "bold 0.7em serif";
  ctx.fillStyle = "white";
  ctx.fillText(formatNum(root.id), ccx - 8, ypos + 5);

  if (root.left !== null) {
    drawT(ctx, root.left, ccx, ypos, "L");
  }
  if (root.middle !== null) {
    drawT(ctx, root.middle, ccx, ypos, "M");
  }
  if (root.right !== null) {
    drawT(ctx, root.right, ccx, ypos, "R");
  }
}

function draw(ctx, root, px, py, direction = null) {
  if (root === null) {
    return;
  }

  var canvas = ctx.canvas;
  let cx = canvas.width / 2;
  //const cy = canvas.height / 2;
  //let ccx = 0;
  const radius = 10;
  const level = parseInt(Math.log2(root.id));
  const ypos = level * 60 + radius * 2;
  const xpos = (px, direction) => {
    // let angle = ((180 - level * 30) / 2) * (Math.PI / 180);
    let displacement = canvas.width/Math.pow(2,level+1);
    if (direction == "L") {
      // return px - 100 * Math.tan(angle);
      return px - displacement;
    } else if (direction == "R") {
      // return px + 100 * Math.tan(angle);
      return px + displacement;
    } else {
      return cx;
    }
  };

  const ccx = xpos.call(null, px, direction);

  if (direction !== null) {
    drawLine(ctx, [px, py], [ccx, ypos], "black", 1.5);
  }

  console.log(root.id, level, ypos, parseInt(ccx));
  drawCircle(ctx, ccx, ypos, radius, "black", "rgb(0,0,0,0.9)");

  ctx.font = "bold 0.7em serif";
  ctx.fillStyle = "white";
  ctx.fillText(formatNum(root.id), ccx - 8, ypos + 5);

  if (root.left !== null) {
    draw(ctx, root.left, ccx, ypos, "L");
  }
  if (root.right !== null) {
    draw(ctx, root.right, ccx, ypos, "R");
  }
}

function formatNum(n) {
  if (n < 10) {
    return "0" + n;
  } else {
    return n;
  }
}


function drawCircle(ctx, x, y, radius = 10, stroke = "black", fill = "black") {
  ctx.strokeStyle = stroke;
  ctx.fillStyle = fill;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
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

function drawGrid(ctx, width, height, gap, lineWidth) {
  for (let i = 0; i < width; i += gap) {
    drawLine(ctx, [i, 0], [i, height], "gray", lineWidth);
  }
  for (let i = 0; i < height; i += gap) {
    drawLine(ctx, [0, i], [width, i], "gray", lineWidth);
  }
}

function resize() {
  const canvas = document.querySelector("#canvas");
  const header = document.querySelector("#title");
  const headerHeight = header.scrollHeight;

  canvas.width = window.innerWidth - 50;
  canvas.height = window.innerHeight - headerHeight - 80;
}

let r = 1; // nodes
let type = 1;

const treeType = document.getElementById("treetype");
treeType.onchange = (e) => {
  type = parseInt(e.target.value);
  init(r, type);
};

const controlOut = document.getElementById("nodes-output");
const control = document.getElementById("nodes");
control.oninput = () => {
  controlOut.textContent = r = control.value;
  init(r, type);
};

window.onresize = () => {
  //draw(parseInt(r));

  init(r, type);
};

//draw(r);
let scale = 1;
init(r, type);