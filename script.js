var nodes = {};
function saveGraph() {
  localStorage.setItem("nodes", JSON.stringify(nodes));
}
function disable() {
  document.getElementById("add-node").disabled = 1;
  document.getElementById("add-edge").disabled = 1;
  document.getElementById("remove").disabled = 1;
  document.getElementById("weight").children[1].disabled = 1;
  eh.stop();
}
function enable() {
  document.getElementById("add-node").disabled = 0;
  document.getElementById("add-edge").disabled = 0;
  document.getElementById("remove").disabled = 0;
  document.getElementById("weight").children[1].disabled = 0;
}
function documentListeners() {
  document.getElementById("start").addEventListener("click", async function () {
    document.getElementById("start").style.setProperty("display", "none");
    document.getElementById("stop").style.removeProperty("display");
    if (window.updater !== undefined) {
      window.updater.abort();
      await window.updater.resetGraph();
    }
    disable();
    const algo = document.getElementById("algo").value;
    try {
      await window[algo](nodes);
    } catch (e) {}
  });
  document.getElementById("stop").addEventListener("click", async function () {
    document.getElementById("stop").style.setProperty("display", "none");
    document.getElementById("start").style.removeProperty("display");
    if (window.updater !== undefined) {
      window.updater.abort();
    }
    enable();
  });
  document.getElementById("algo").addEventListener("change", async function () {
    document.getElementById("stop").style.setProperty("display", "none");
    document.getElementById("start").style.removeProperty("display");
    if (window.updater !== undefined) {
      window.updater.abort();
      await window.updater.resetGraph();
      window.updater.resetTable();
    }
    enable();
  });
  document.querySelector("#remove").addEventListener("click", function () {
    const el = cy.$(":selected");
    const id = el.id();
    if (el.isNode()) {
      delete nodes[id];
      for (let e in nodes) {
        nodes[e] = nodes[e].filter((value, index, arr) => {
          return value.target != id;
        });
      }
      document.getElementById("add-edge").style.setProperty("display", "none");
    } else {
      const a = id.split("-")[0];
      const b = id.split("-")[1];
      nodes[a] = nodes[a].filter((value, index, arr) => {
        return value.target != b;
      });
      const w = document.getElementById("weight");
      w.style.setProperty("display", "none");
    }
    document.getElementById("remove").style.setProperty("display", "none");
    document
      .getElementById("type")
      .parentElement.style.setProperty("display", "none");
    saveGraph();
    cy.remove("#" + id);
  });
  document
    .querySelector("#weight>input")
    .addEventListener("change", function () {
      const v = parseInt(document.querySelector("#weight>input").value);
      const id = cy.$("edge:selected").id();
      cy.$("edge:selected").data("weight", v);
      const a = id.split("-")[0];
      const b = id.split("-")[1];
      for (let i = 0; i < nodes[a].length; i++) {
        if (nodes[a][i].target === b) {
          nodes[a][i].weight = v;
          break;
        }
      }
      saveGraph();
    });
  document.querySelector("#rearrange").addEventListener("click", function () {
    cy.layout(getLayout()).run();
  });
  document.querySelector("#add-edge").addEventListener("click", function () {
    eh.start(cy.$("node:selected"));
  });
  document.querySelector("#add-node").addEventListener("click", function () {
    const alphabet = "abcdefghijklmnopqrstuvwxyz";
    let id = undefined;
    for (const c of alphabet) {
      if (!nodes.hasOwnProperty(c)) {
        id = c;
        break;
      }
    }
    if (id === undefined) {
      return;
    }
    nodes[id] = [];
    cy.add({
      groupd: "nodes",
      data: {
        id,
        name: id,
      },
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
    });
    saveGraph();
  });
}
function defaultElements() {
  if (localStorage.getItem("nodes") != undefined) {
    nodes = JSON.parse(localStorage.getItem("nodes"));
    let elements = [];
    for (const n in nodes) {
      elements.push({
        group: "nodes",
        data: {
          id: n,
          name: n,
        },
      });
      for (const edge of nodes[n]) {
        elements.push({
          group: "edges",
          data: {
            id: n + "-" + edge.target,
            source: n,
            target: edge.target,
            weight: edge.weight,
          },
        });
      }
    }
    return elements;
  }
  nodes = {
    a: [
      { target: "b", weight: 4 },
      { target: "d", weight: 7 },
      { target: "i", weight: 4 },
    ],
    b: [
      { target: "c", weight: 2 },
      { target: "a", weight: 2 },
      { target: "d", weight: 2 },
      { target: "g", weight: 7 },
      { target: "i", weight: 1 },
    ],
    c: [
      { target: "g", weight: 3 },
      { target: "b", weight: 8 },
      { target: "h", weight: 10 },
      { target: "f", weight: 6 },
    ],
    d: [
      { target: "g", weight: 10 },
      { target: "a", weight: 1 },
      { target: "b", weight: 9 },
    ],
    g: [
      { target: "b", weight: 1 },
      { target: "c", weight: 6 },
      { target: "d", weight: 4 },
      { target: "h", weight: 3 },
      { target: "e", weight: 6 },
    ],
    h: [
      { target: "c", weight: 9 },
      { target: "g", weight: 6 },
    ],
    e: [
      { target: "f", weight: 2 },
      { target: "g", weight: 9 },
    ],
    f: [
      { target: "c", weight: 10 },
      { target: "e", weight: 7 },
    ],
    i: [
      { target: "b", weight: 1 },
      { target: "a", weight: 8 },
    ],
  };
  saveGraph();
  return defaultElements();
}
function getLayout() {
  return {
    name: "cose",
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0,
  };
}

function graphListeners() {
  cy.on("unselect", function (evt, f, b) {
    document.getElementById("remove").style.setProperty("display", "none");
    document
      .getElementById("type")
      .parentElement.style.setProperty("display", "none");
    if (!evt.target.isNode()) {
      const w = document.getElementById("weight");
      w.style.setProperty("display", "none");
      return;
    }
    document.getElementById("add-edge").style.setProperty("display", "none");
  });
  cy.on("select", function (evt, f, b) {
    document
      .getElementById("remove")
      .style.setProperty("display", "inline-block");
    document
      .getElementById("type")
      .parentElement.style.setProperty("display", "block");
    const type = evt.target.isNode() ? "node" : "edge";
    document.getElementById("type").innerText = "Type: " + type;
    if (!evt.target.isNode()) {
      const w = document.querySelector("#weight>input");
      w.value = evt.target.data("weight");
      document
        .getElementById("weight")
        .style.setProperty("display", "inline-block");
      return;
    }
    document
      .getElementById("add-edge")
      .style.setProperty("display", "inline-block");
  });
  cy.on("ehcomplete", function (e, source, target, edge) {
    cy.remove("#" + edge.id());
    const id = source.id() + "-" + target.id();
    const weight = Math.floor(Math.random() * 10 + 1);
    nodes[source.id()].push({
      target: target.id(),
      weight,
    });
    cy.add({
      group: "edges",
      data: {
        id,
        source: source.id(),
        target: target.id(),
        weight,
      },
    });
    saveGraph();
  });
}
function listeners() {
  documentListeners();
  graphListeners();
}

document.addEventListener("DOMContentLoaded", function () {
  window.cy = window.cy = cytoscape({
    container: document.getElementById("cy"),

    layout: getLayout(),

    style: [
      {
        selector: "node[name]",
        style: {
          content: "data(name)",
        },
      },
      {
        selector: "edge[weight]",
        style: {
          label: "data(weight)",
          "text-background-color": "white",
          "text-background-opacity": "1",
        },
      },

      {
        selector: "edge",
        style: {
          "curve-style": "bezier",
          "target-arrow-shape": "triangle",
        },
      },
      {
        selector: ".eh-handle",
        style: {
          "background-color": "red",
          width: 12,
          height: 12,
          shape: "ellipse",
          "overlay-opacity": 0,
          "border-width": 12, // makes the handle easier to hit
          "border-opacity": 0,
        },
      },

      {
        selector: ".eh-hover",
        style: {
          "background-color": "red",
        },
      },

      {
        selector: ".eh-source",
        style: {
          "border-width": 2,
          "border-color": "red",
        },
      },

      {
        selector: ".eh-target",
        style: {
          "border-width": 2,
          "border-color": "red",
        },
      },

      {
        selector: ".eh-preview, .eh-ghost-edge",
        style: {
          "background-color": "red",
          "line-color": "red",
          "target-arrow-color": "red",
          "source-arrow-color": "red",
        },
      },
      {
        selector: ".looked",
        style: {
          "background-color": "lightgreen",
          "line-color": "lightgreen",
          "target-arrow-color": "lightgreen",
          "source-arrow-color": "lightgreen",
        },
      },
      {
        selector: "node.color1",
        style: {
          "background-color": "red",
        },
      },
      {
        selector: "node.color2",
        style: {
          "background-color": "blue",
        },
      },
      {
        selector: ".eh-ghost-edge.eh-preview-active",
        style: {
          opacity: 0,
        },
      },
    ],

    elements: defaultElements(),
  });
  window.eh = cy.edgehandles({
    snap: false,
    canConnect: function (sourceNode, targetNode) {
      if (sourceNode.edgesTo(targetNode).length != 0) return false;
      return !sourceNode.same(targetNode);
    },
  });
  listeners();
});
