const fs = require("fs");

const NUMBER_OF_CUTS = 3;

const resultTest1 = solve(fs.readFileSync("./day-25-input-test.txt", "utf-8"));
console.log(`Solution to test 1: ${resultTest1}`);

// from graphviz we know that we want to remove these 3 edges
// qfj -- tbq
// xzn -- dsr
// xbl -- qqh
const resultFull = solve(fs.readFileSync("./day-25-input-full.txt", "utf-8"));
console.log(`Solution to full: ${resultFull}`);

function solve(input) {
  const edges = {};
  for (const line of input.split("\n")) {
    const parts = line.match(/(\w+): (.+)/);
    if (!parts) {
      continue;
    }

    const from = parts[1];
    const toList = parts[2].split(" ");

    if (!edges[from]) {
      edges[from] = [];
    }

    edges[from].push(...toList);

    for (const to of toList) {
      if (!edges[to]) {
        edges[to] = [];
      }

      edges[to].push(from);
    }
  }

  const nodes = Object.keys(edges);
  const ignoredPaths = [];
  do {
    const edgesToRemove = minimalCut(nodes, edges, ignoredPaths);
    const cluster1 = calculateCluster(edges, nodes, edgesToRemove);

    const result =
      cluster1.length * (Object.keys(nodes).length - cluster1.length);

    if (result !== 0) {
      return result;
    }

    // this is weird, for some reasons it finds invalid path first time
    // so if i find invalid solution i try to remove the first edge
    // but this workaround is also not very good, because the wrong edge could be the second or third
    ignoredPaths.push(edgesToRemove[0]);
  } while (true);
}

function minimalCut(nodes, edges, falsePositives) {
  const { nodes: nodePerCluster, paths } = getOneNodePerCluster(nodes, edges);
  const minimalCut = [];
  let numberOfPaths = 2;

  for (const path of paths) {
    for (let i = 0; i < path.length - 1; i++) {
      const ignoredPaths = {
        [path[i]]: [path[i + 1]],
        [path[i + 1]]: [path[i]],
      };

      let skip = false;
      for (const [from, to] of falsePositives) {
        if (path[i] === from && path[i + 1] === to) {
          skip = true;
          break;
        }
      }

      if (skip) {
        continue;
      }

      const { result } = existsPaths(
        edges,
        nodePerCluster[0],
        nodePerCluster[1],
        numberOfPaths,
        ignoredPaths
      );

      if (!result) {
        minimalCut.push([path[i], path[i + 1]]);
        break;
      }
    }
  }

  return minimalCut;
}

function calculateCluster(edges, nodes, edgesToRemove) {
  const ignoredPaths = {};
  for (const [from, to] of edgesToRemove) {
    if (!ignoredPaths[from]) {
      ignoredPaths[from] = [];
    }

    if (!ignoredPaths[to]) {
      ignoredPaths[to] = [];
    }

    ignoredPaths[from].push(to);
    ignoredPaths[to].push(from);
  }
  const cluster1 = getAllConnected(edges, nodes[0], ignoredPaths);

  return cluster1;
}

function getOneNodePerCluster(nodes, edges) {
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const { result, paths } = existsPaths(
        edges,
        nodes[i],
        nodes[j],
        NUMBER_OF_CUTS
      );
      if (!result) {
        return {
          nodes: [nodes[i], nodes[j]],
          paths,
        };
      }
    }
  }

  throw new Error("Could not find two nodes");
}

function existsPaths(edges, start, end, numberOfPaths, ignoredPaths) {
  const ignored = ignoredPaths || {};
  const resultPaths = [];
  for (let i = 0; i <= numberOfPaths; i++) {
    const path = findPath(edges, start, end, ignored);

    if (path.length === 0) {
      return { result: false, paths: resultPaths };
    } else {
      resultPaths.push(path);
    }

    for (let j = 0; j < path.length - 1; j++) {
      if (!ignored[path[j]]) {
        ignored[path[j]] = [];
      }

      if (!ignored[path[j + 1]]) {
        ignored[path[j + 1]] = [];
      }

      ignored[path[j]].push(path[j + 1]);
      ignored[path[j + 1]].push(path[j]);
    }
  }

  return { result: true };
}

function findPath(edges, start, end, ignoredEdges) {
  const toSearch = [
    {
      node: start,
      path: [start],
    },
  ];
  const visited = {
    [start]: true,
  };

  do {
    const { node: current, path } = toSearch.pop();

    if (current === end) {
      return path;
    }

    for (const newNode of edges[current]) {
      if (visited[newNode]) {
        continue;
      }

      if (ignoredEdges[current] && ignoredEdges[current].includes(newNode)) {
        continue;
      }

      toSearch.push({
        node: newNode,
        path: [...path, newNode],
      });
      visited[newNode] = true;
    }
  } while (toSearch.length);

  return [];
}

function getAllConnected(edges, start, ignoredEdges) {
  const toSearch = [start];
  const visited = { [start]: true };

  do {
    const current = toSearch.pop();

    for (const newNode of edges[current]) {
      if (visited[newNode]) {
        continue;
      }

      if (ignoredEdges[current] && ignoredEdges[current].includes(newNode)) {
        continue;
      }

      toSearch.push(newNode);
      visited[newNode] = true;
    }
  } while (toSearch.length);

  return Object.keys(visited);
}
