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

class GraphNode {
    constructor(id) {
        this.id = id;
    }
}

function binarytree(n, top) {
    if (n > top - 1) {
        return null;
    }
    var rootnode = new BMember(n + 1, binarytree(2 * n + 1, top), binarytree(2 * n + 2, top));
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
    } else {
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

function createGraph(n) {
    let graph = [n];

    for (let i = 0; i < n; i++) {
        graph[i] = new Array(n+1).fill(0);
        graph[i][0] = 1;
        
        const numNeighbours = Math.floor(Math.random() * (n + 1));

        for (let j = 0; j < numNeighbours; j++) {
            const neighbour = getRandomIntInclusive(1, n);
            graph[i][neighbour] = 1;

            if(graph[neighbour -1] === undefined){
              graph[neighbour -1] = new Array(n+1);
            }
            graph[neighbour - 1][i] = 1;
        }
        
    }

    return graph;
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
