const fs = require("fs");

const FOREST = "#";
const DIRECTIONS = [
    {
        offsetX: -1,
        offsetY: 0,
    },
    {
        offsetX: 1,
        offsetY: 0,
    },
    {
        offsetX: 0,
        offsetY: -1,
    },
    {
        offsetX: 0,
        offsetY: 1,
    },
];

const resultTest1 = solve(fs.readFileSync("./day-23-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

const resultFull = solve(fs.readFileSync("./day-23-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
    const matrix = input.split("\n").map((x) => x.split(""));
    const {start, end} = getStartAndEnd(matrix);

    const graph = createGraph(matrix);
    compressGraph(graph, createKey(start));
    const result = calculateResult(graph, createKey(start), createKey(end));

    return result;
}

function createGraph(matrix) {
    const graph = {};
    for (let y = 0; y < matrix.length; y++) {
        for (let x = 0; x < matrix[y].length; x++) {
            const tile = matrix[y][x];
            if (tile !== FOREST) {
                const key = `${x}-${y}`;
                graph[key] = generateEdges(matrix, {x, y});
            }
        }
    }
    return graph;
}

function compressGraph(graph, startKey) {
    const toSearch = [startKey];
    const visited = new Map();
    do {
        const current = toSearch.pop();
        if (visited.get(current)) {
            continue;
        }
        const edges = graph[current];

        if (!edges) {
            continue;
        }

        if (edges.length === 2) {
            delete graph[current];
            const left = edges[0];
            const leftKey = createKey(left);
            const right = edges[1];
            const rightKey = createKey(right);
            const newScore = left.score + right.score + 1;
            graph[leftKey] = graph[leftKey].filter(x => createKey(x) !== current).concat([{
                ...right,
                score: newScore
            }]);
            graph[rightKey] = graph[rightKey].filter(x => createKey(x) !== current).concat([{
                ...left,
                score: newScore
            }]);
            toSearch.push(leftKey, rightKey);
        } else {
            visited.set(current, true);
            toSearch.push(...edges.map(x => createKey(x)));
        }
    } while (toSearch.length);
}

function createKey({x, y}) {
    return `${x}-${y}`;
}

function calculateResult(graph, startKey, endKey) {
    const toSearch = [{
        key: startKey,
        score: 0,
        visited: [startKey],
    }];

    const endScores = [];

    do {
        const {key, score, visited} = toSearch.pop();
        for (const edge of graph[key]) {
            const edgeKey = createKey(edge);
            if (visited.includes(edgeKey)) {
                continue;
            }

            const endScore = score + edge.score + 1;
            if (edgeKey === endKey) {
                endScores.push(endScore);
                continue;
            }

            toSearch.push({
                key: edgeKey,
                score: endScore,
                visited: [
                    ...visited,
                    edgeKey,
                ],
            });
        }

    } while (toSearch.length);

    let max = 0;
    for (const localMax of endScores) {
        max = Math.max(localMax, max);
    }

    return max;
}

function getStartAndEnd(matrix) {
    const start = matrix[0].findIndex((x) => x !== FOREST);
    const end = matrix.at(-1).findIndex((x) => x !== FOREST);

    return {
        start: {
            x: start,
            y: 0,
        },
        end: {
            x: end,
            y: matrix.length - 1,
        },
    };
}

function generateEdges(matrix, currentNode) {
    const {
        x: currentX,
        y: currentY,
    } = currentNode;

    const validSteps = [];
    for (const {offsetX, offsetY} of DIRECTIONS) {
        const newX = currentX + offsetX;
        const newY = currentY + offsetY;
        const newTile = matrix[newY]?.[newX];
        if (!newTile || newTile === FOREST) {
            continue;
        }

        validSteps.push({
            x: newX,
            y: newY,
            score: 0,
        });
    }

    return validSteps;
}
