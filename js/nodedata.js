"use strict";

class BMember {
  constructor(id, left, right) {
    this.id = id;
    this.left = left;
    this.right = right;
  }
}
class TMember {
  constructor(id, level, left, middle, right) {
    this.id = id;
    this.left = left;
    this.right = right;
    this.middle = middle;
    this.level = level;
  }
}

// let allmembers = [
//   1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
// ];

function binarytree(n, top) {
  if (n > top - 1) {
    return null;
  }

  //   console.log(n);
  var rootnode = new BMember(
    n + 1,
    binarytree(2 * n + 1, top),
    binarytree(2 * n + 2, top)
  );
  return rootnode;
}

function ternarytree(n, top) {
  if (n > top - 1) {
    return null;
  }

  let level = 0;
  if (n + 1 < 2) {
    level = 0;
  } else if (n + 1 < 5) {
    level = 1;
  } else if (n + 1 < 14) {
    level = 2;
  } else if (n + 1 < 41) {
    level = 3;
  } else if (n + 1 < 122) {
    level = 4;
  } else if (n + 1 < 365) {
    level = 5;
  }
  else{
      level = 0;
  }
   // console.log(n + 1, level);
  var rootnode = new TMember(
    n + 1,
    level,
    ternarytree(3 * n + 1, top),
    ternarytree(3 * n + 2, top),
    ternarytree(3 * n + 3, top)
  );
  return rootnode;
}
