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
  "Aug", "Sep","Oct","Nov", "Dec",
];

function getBarChart(n) {
  const barchart = new Array(n);

  for (let bar = 0; bar < n; bar++) {
    let min = 100;
    let max = 10000;
    let value = parseInt(Math.random() * (max - min) + min);
    let monIndex = 0;
    barchart[bar] = new BarRecord(months[bar % 12], value, "orangered");
  }
  return barchart;
}
