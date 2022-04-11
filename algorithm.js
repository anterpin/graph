function selectNode() {
  const p = new Promise((resolve, reject) => {
    if (cy.$("node:selected").length !== 0) {
      resolve(cy.$("node:selected").id());
    }
    const handler = (evt, f, b) => {
      if (evt.target.isNode()) {
        cy.removeListener("select", handler);
        resolve(evt.target.id());
      }
    };
    cy.on("select", handler);
  });
  return p;
}
async function bellman_ford(nodes) {
  const updater = new Updater(["Distance", "Parent"], (node, col) => {
    if (col === "Parent") return -1;
    return 0;
  });
  window.updater = updater;
  updater.updateResult("Select starting node");
  const x = await selectNode();
  updater.init();

  if (!nodes.hasOwnProperty(x)) {
    updater.updateResult("There is no node " + x);
    updater.stop();
    return;
  }
  const distances = {};
  for (const n in nodes) {
    updater.updateCell(n, 1, Infinity);
    distances[n] = Infinity;
  }
  let edges = [];
  for (const n in nodes) {
    for (const e of nodes[n]) {
      edges.push({
        source: n,
        target: e.target,
        weight: e.weight,
      });
    }
  }

  distances[x] = 0;
  updater.updateCell(x, 1, 0);
  await updater.tick();
  for (let i = 0; i < Object.keys(nodes).length - 1; i++) {
    let u = false;
    for (const edge of edges) {
      updater.updateEdge(edge.source, edge.target, "looked");
      if (distances[edge.target] > distances[edge.source] + edge.weight) {
        distances[edge.target] = distances[edge.source] + edge.weight;
        updater.updateCell(edge.target, 2, edge.source);
        updater.updateCell(edge.target, 1, distances[edge.target]);
        u = true;
      }
      await updater.tick();
      updater.updateEdge(edge.source, edge.target);
    }
    if (!u) break;
  }
  for (const edge of edges) {
    if (distances[edge.target] > distances[edge.source] + edge.weight) {
      updater.updateResult("There is a negative cycle");
      updater.stop();
      return;
    }
  }
  updater.updateResult("Completed!");
  updater.stop();
}

async function spfa(nodes) {
  const updater = new Updater(["Distance", "Parent"], (node, col) => {
    if (col === "Parent") return -1;
    return 0;
  });
  window.updater = updater;
  updater.updateResult("Select starting node");
  const x = await selectNode();
  updater.init();

  if (!nodes.hasOwnProperty(x)) {
    updater.updateResult("There is no node " + x);
    updater.stop();
    return;
  }
  const distances = {};
  for (const n in nodes) {
    updater.updateCell(n, 1, Infinity);
    distances[n] = Infinity;
  }

  distances[x] = 0;
  updater.updateCell(x, 1, 0);
  await updater.tick();

  for (let i = 0; i < Object.keys(nodes).length; i++) {
    let u = false;
    const queue = new Queue();
    queue.enqueue(x);
    const visited = {};
    for (const n in nodes) {
      visited[n] = false;
    }
    while (!queue.isEmpty) {
      const node = queue.dequeue();
      if (visited[node]) continue;
      visited[node] = true;
      const last = [];
      for (const n of nodes[node]) {
        updater.updateEdge(node, n.target, "looked");
        if (distances[n.target] > distances[node] + n.weight) {
          if (i == Object.keys(nodes).length - 1) {
            // n times
            updater.updateResult("There is a negative cycle");
            updater.stop();
            return;
          }
          distances[n.target] = distances[node] + n.weight;
          updater.updateCell(n.target, 1, distances[n.target]);
          updater.updateCell(n.target, 2, node);
          u = true;
          queue.enqueue(n.target);
        } else {
          last.push(n.target);
        }
        await updater.tick();
        updater.updateEdge(node, n.target);
      }
      for (const l of last) {
        queue.enqueue(l);
      }
    }
    if (!u) break;
  }
  updater.updateResult("Completed!");
  updater.stop();
}

async function spfa(nodes) {
  const updater = new Updater(["Distance", "Parent"], (node, col) => {
    if (col === "Parent") return -1;
    return 0;
  });
  window.updater = updater;
  updater.updateResult("Select starting node");
  const x = await selectNode();
  updater.init();

  if (!nodes.hasOwnProperty(x)) {
    updater.updateResult("There is no node " + x);
    updater.stop();
    return;
  }
  const distances = {};
  for (const n in nodes) {
    updater.updateCell(n, 1, Infinity);
    distances[n] = Infinity;
  }

  distances[x] = 0;
  updater.updateCell(x, 1, 0);
  await updater.tick();

  for (let i = 0; i < Object.keys(nodes).length; i++) {
    let u = false;
    const queue = new Queue();
    queue.enqueue(x);
    const visited = {};
    for (const n in nodes) {
      visited[n] = false;
    }
    while (!queue.isEmpty) {
      const node = queue.dequeue();
      if (visited[node]) continue;
      visited[node] = true;
      const last = [];
      for (const n of nodes[node]) {
        updater.updateEdge(node, n.target, "looked");
        if (distances[n.target] > distances[node] + n.weight) {
          if (i == Object.keys(nodes).length - 1) {
            // n times
            updater.updateResult("There is a negative cycle");
            updater.stop();
            return;
          }
          distances[n.target] = distances[node] + n.weight;
          updater.updateCell(n.target, 1, distances[n.target]);
          updater.updateCell(n.target, 2, node);
          u = true;
          queue.enqueue(n.target);
        } else {
          last.push(n.target);
        }
        await updater.tick();
        updater.updateEdge(node, n.target);
      }
      for (const l of last) {
        queue.enqueue(l);
      }
    }
    if (!u) break;
  }
  updater.updateResult("Completed!");
  updater.stop();
}

async function dijkstra(nodes) {
  const updater = new Updater(["Distance", "Parent"], (node, col) => {
    if (col === "Parent") return -1;
    return 0;
  });
  window.updater = updater;
  updater.updateResult("Select starting node");
  const x = await selectNode();
  updater.init();

  if (!nodes.hasOwnProperty(x)) {
    updater.updateResult("There is no node " + x);
    updater.stop();
    return;
  }
  const distances = {};
  for (const n in nodes) {
    updater.updateCell(n, 1, Infinity);
    distances[n] = Infinity;
  }

  distances[x] = 0;
  updater.updateCell(x, 1, 0);
  await updater.tick();

  const queue = new PriorityQueue();
  queue.enqueue(x);
  const visited = {};
  for (const n in nodes) {
    visited[n] = false;
  }
  while (!queue.isEmpty) {
    const node = queue.dequeue();
    if (visited[node]) continue;
    visited[node] = true;
    for (const n of nodes[node]) {
      updater.updateEdge(node, n.target, "looked");
      if (distances[n.target] > distances[node] + n.weight) {
        distances[n.target] = distances[node] + n.weight;
        updater.updateCell(n.target, 1, distances[n.target]);
        updater.updateCell(n.target, 2, node);
        u = true;
        queue.enqueue(n.target);
      }
      await updater.tick();
      updater.updateEdge(node, n.target);
    }
  }
  updater.updateResult("Completed!");
  updater.stop();
}

async function _bipartiteness_check(node, nodes, updater, colors, color) {
  if (colors[0][node] !== 0) {
    if (colors[0][node] !== color) {
      return false;
    }
    return true;
  }
  colors[0][node] = color;
  updater.updateNode(node, "color" + color);
  const colorLabel = color == 1 ? "Red" : "Blue";
  updater.updateCell(node, 1, colorLabel);
  const c = color == 1 ? 2 : 1;
  await updater.tick();
  for (const n of nodes[node]) {
    updater.updateOnlyEdge(node, n.target, "looked");
    if (!(await _bipartiteness_check(n.target, nodes, updater, colors, c))) {
      return false;
    }
  }
  return true;
}
async function bipartiteness_check(nodes) {
  const updater = new Updater(["Color"], (node, col) => {
    return 0;
  });
  window.updater = updater;
  await updater.tick();
  updater.init();
  const visited = [{}];
  for (const n of Object.keys(nodes)) {
    updater.updateCell(n, 1, "Undef");
    visited[0][n] = 0;
  }
  for (const n of Object.keys(nodes)) {
    if (visited[0][n] !== 0) continue;
    if (!(await _bipartiteness_check(n, nodes, updater, visited, 1))) {
      updater.updateResult("The graph is not bipartite");
      updater.stop();
      return;
    }
  }
  updater.updateResult("The graph is bipartite");
  updater.stop();
}
