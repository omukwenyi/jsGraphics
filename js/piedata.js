"use strict";
class PieRecord {
  constructor(id, value, fill) {
    this.id = id;
    this.value = value;
    this.fill = fill;
  }
}
let names = [
  "Kenya",
  "Uganda",
  "Tanzania",
  "Rwanda",
  "Burundi",
  "S. Sudan",
  "Ethiopia",
  "Somalia",
  "DRC",
  "Congo",
  "Angola",
  "Namibia",
  "Mauritius",
  "Sudan",
  "Chad",
  "Mali",
  "Malawi",
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

function createPieData(n) {
  let pie = new Array(n);
  for (let index = 0; index < n; index++) {
    let nameIndex = parseInt((index + 1) % names.length);
    let colIndex = parseInt((index + 1) % colours.length);
    // console.log("colour", colIndex);
    let val = parseInt(Math.random() * 100);
    // let val = 100;
    pie[index] = new PieRecord(names[nameIndex], val, colours[colIndex]);
  }

  return pie;
}
