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
  "green",
  "AliceBlue",
  "blue",
  "indigo",
  "violet",
  "fuchsia",
  "Navy",
  "DarkGreen",
  "DarkSlateGray",
  "Purple",
  "Maroon",
  "Gray",
  "black",
];

function getChartData(n, useColors = false, numericXAxis = false) {
  const barchart = new Array(n);

  for (let bar = 0; bar < n; bar++) {
    let min = -10;
    let max = 100;
    let value = parseInt(Math.random() * (max - min) + min) + parseInt(Math.random() * (max - min) + min);
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