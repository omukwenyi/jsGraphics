"use strict";

class BarRecord {
  constructor(id, value, fill) {
    this.id = id;
    this.value = value;
    this.fill = fill;
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
function getBarChart(n, useColors = false) {
  const barchart = new Array(n);

  for (let bar = 0; bar < n; bar++) {
    let min = 10000;
    let max = 1000000;
    let value = parseInt(Math.random() * (max - min) + min);
    let colIndex = parseInt(bar % colours.length);
    let colour = "orangered";
    if (useColors) {
        colour = colours[colIndex];
    }
    barchart[bar] = new BarRecord(months[bar % 12], value, colour);
  }
  return barchart;
}
