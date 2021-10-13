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
    let graph = []; //new Array(nodes);

    for (let i = 0; i < nodes; i++) {
        const selfId = i + 1;
        //console.log("G[i]:",i,graph[i]);
        if (graph[i] === undefined) {
            graph[i] = new GraphNode(selfId, []);
            //console.log("G[i] after:",i, graph[i]);
        }

        const numNeighbours = getRandomIntInclusive(0, Math.min(maxDegree, nodes - 1));

        //console.log(selfId, "Neighbours Needed", numNeighbours);
        let j = 0;

        while (j < numNeighbours) {
            let neighbour = selfId;
            let tries = 0;

            while (neighbour === selfId || graph[i].neighbours.includes(neighbour) === true) {
                if (tries < 20) {
                    neighbour = getRandomIntInclusive(1, nodes);
                } else {
                    break;
                }
                tries++;
            }

            if (neighbour !== selfId) {
                //console.log("FOUND Neighbour after: ", tries, "tries");
                if (graph[i].neighbours.includes(neighbour) === false) {
                    graph[i].neighbours[j] = neighbour;
                }

                if (graph[neighbour - 1] === undefined) {
                    //console.log("undefined neighbour");
                    graph[neighbour - 1] = new GraphNode(neighbour, []);
                }
                if (graph[neighbour - 1].neighbours.includes(selfId) === false) {
                    //console.log(selfId, neighbour, "len:", graph[neighbour - 1].neighbours.length);
                    graph[neighbour - 1].neighbours[graph[neighbour - 1].neighbours.length] =
                        selfId;
                    //console.log(neighbour, "Reverse link:", graph[neighbour - 1].neighbours);
                }
                j++;
            }
        }

        graph[i].neighbours.sort((a, b) => a - b);
    }

    return graph;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
