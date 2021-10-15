"use strict";

import {getRandomIntInclusive} from './common.js';
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
        this.degreeCentrality = 0.0;
        this.closenessCentrality = 0.0;
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
    let adjMatrix = new Array(nodes).fill(0);

    for (let i = 0; i < nodes; i++) {
        adjMatrix[i] = new Array(nodes).fill(0);

        for (let j = 0; j < nodes; j++) {
            if (i === j) {
                adjMatrix[i][j] = 0;
            } else {
                let conValue = getRandomIntInclusive(0, 1);
                adjMatrix[i][j] = conValue;
                if (adjMatrix[j][i] == undefined) {
                    adjMatrix[j] = new Array(nodes).fill(0);
                }
                adjMatrix[j][i] = conValue;
            }
        }
    }

    //console.log(adjMAtrix);

    let graph = [];

    for (let i = 0; i < nodes; i++) {
        const selfId = i + 1;

        if (graph[i] === undefined) {
            graph[i] = new GraphNode(selfId, []);
        }

        for (let j = 0; j < nodes; j++) {
            if (adjMatrix[i][j] == 1) {
                graph[i].neighbours.push(j + 1);
            }
        }
    }

    //Calculate degree centrality
    for (const node of graph) {
        node.degreeCentrality = node.neighbours.length / nodes;
    }

    //calculate closeness centrality
    let distMatrix = new Array(nodes).fill(0);

    for (let i = 0; i < nodes; i++) {
        distMatrix[i] = new Array(nodes).fill(0);
        const node = graph[i];

        for (let j = 0; j < nodes; j++) {
            let visited = [];
            if (i === j) {
                distMatrix[i][j] = 0;
            } else if (node.neighbours.includes(j + 1)) {
                distMatrix[i][j] = 1;
            } else {
                distMatrix[i][j] = distanceToNode(graph, node, j + 1, visited);
            }
        }

        const sum = distMatrix[i].reduce((pv,cv)=>pv + cv);
        const score = (sum == 0) ? 0 : (nodes-1)/sum;
        graph[i].closenessCentrality = score;
    }
    
    //console.log(distMatrix);
    //console.log(scores);
    return graph;
}

function distanceToNode(graph, node, destId, visited) {
    let distance = 0;

    if (visited.length > 0 && visited.includes(node.id)) return distance;
    visited.push(node.id);

    for (const child of node.neighbours) {
        if (visited.includes(child) === false) {
            if (graph[child - 1].neighbours.includes(destId)) {
                return visited.length + 1;                
            } else {
                return distanceToNode(graph, graph[child - 1], destId, visited);
            }
        }
    }
    return distance;
}

export {createGraph, binarytree, ternarytree};
