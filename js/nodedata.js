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
    constructor(id, neighbours = []) {
        this.id = id;
        this.neighbours = neighbours;
    }
}

class Graph {
    constructor(nodes) {
        this.Nodes = nodes;
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

function createGraph(nodes, maxDegree) {
    //Create the adjacency matrix
    let adjMAtrix = new Array(nodes).fill(0);

    for (let i = 0; i < nodes; i++) {
        adjMAtrix[i] = new Array(nodes).fill(0);

        for (let j = 0; j < nodes; j++) {
            if (i === j) {
                adjMAtrix[i][j] = 0;
            } else {
                let conValue = getRandomIntInclusive(0, 1);
                adjMAtrix[i][j] = conValue;
                if (adjMAtrix[j][i] == undefined) {
                    adjMAtrix[j] = new Array(nodes).fill(0);
                }
                adjMAtrix[j][i] = conValue;
            }
        }
    }

    console.log(adjMAtrix);

    let graph = [];

    for (let i = 0; i < nodes; i++) {
        const selfId = i + 1;

        if (graph[i] === undefined) {
            graph[i] = new GraphNode(selfId, []);
        }

        for (let j = 0; j < nodes; j++) {
            if (adjMAtrix[i][j] == 1) {
                graph[i].neighbours.push(j + 1);
            }
        }
        //graph[i].neighbours.sort((a, b) => a - b);
    }

    return graph;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
