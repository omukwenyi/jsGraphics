"use strict";

class BarRecord {
    constructor(id, value, fill) {
      this.id = id;
      this.value = value;
      this.fill = fill;
    }
  }

function getBarChart(n){
    const barchart = new Array(n);

    for (let bar = 0; bar < n; bar++) {
        barchart[bar] = new BarRecord(bar + 1, (bar+1)*60, "orangered");
    }
    return barchart;
}


