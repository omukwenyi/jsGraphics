"use strict";

class ChartRecord {
  constructor(id, value, fill) {
    this.id = id;
    this.value = value;
    this.fill = fill;
    this.xpos = 0;
    this.ypos = 0;
  }
}

const years = [];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let colours = [
  "black",
  "OrangeRed",
  "Khaki",
  "orange",
  "Chocolate",
  "Green",
  "LightSteelBlue",
  "Blue",
  "Indigo",
  "Violet",
  "Fuchsia",
  "Navy",
  "DarkGreen",
  "DarkSlateGray",
  "Purple",
  "Maroon",
  "Gray",
  "Pink",
  "SaddleBrown",
  "MediumAquaMarine"
];

function getChartData(n, useColors = false, numericXAxis = false) {
  const barchart = new Array(n);

  for (let bar = 0; bar < n; bar++) {
    let min = -20000;
    let max = 10001;
    let value = parseInt(Math.random() * (max - min) + min);
    let colIndex = parseInt(bar % colours.length);
    let colour = "orangered";
    if (useColors) {
      colour = colours[colIndex];
    }
    if (numericXAxis) {
      barchart[bar] = new ChartRecord(bar + 1, value, colour);
    } else {
      barchart[bar] = new ChartRecord(months[bar % 12], value, colour);
    }
  }
  return barchart;
}


export {
  getChartData
};