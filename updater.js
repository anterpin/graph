class Updater {
  constructor(cols, defaultValues) {
    this.tableId = "table";
    this.resultId = "result";
    this.cols = cols;
    this.defaultValues = defaultValues;
    this.aborting = false;
    this.resetTable();
    this.resetGraph();
  }
  init() {
    const table = document.getElementById(this.tableId);
    table.innerHTML = "";
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.innerText = "ID";
    tr.appendChild(th);
    for (const c of this.cols) {
      const th = document.createElement("th");
      th.innerText = c;
      tr.appendChild(th);
    }
    table.appendChild(tr);
    for (const n in nodes) {
      const tr = document.createElement("tr");
      tr.id = this.tableId + "-" + n;
      const td = document.createElement("td");
      td.innerText = n;
      tr.appendChild(td);
      for (const c of this.cols) {
        const td = document.createElement("td");
        td.innerText = this.defaultValues(n, c);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    document.getElementById(this.resultId).innerText = "";
  }
  abort() {
    this.aborting = true;
  }
  stop() {
    document.getElementById("stop").click();
  }
  async removeColor(node, col) {
    await this.sleep(400);
    const tr = document.getElementById(this.tableId + "-" + node);
    if (tr === undefined) return;
    tr.children[col].style.removeProperty("color");
  }
  updateCell(node, col, value) {
    const tr = document.getElementById(this.tableId + "-" + node);
    tr.children[col].innerText = value;
    tr.children[col].style.setProperty("color", "lightgreen");
    this.removeColor(node, col);
  }
  updateResult(str) {
    document.getElementById(this.resultId).innerText = str;
  }
  sleep(time) {
    const p = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
    return p;
  }
  async resetGraph() {
    await this.sleep(200);
    cy.$("*").classes([]);
  }
  resetTable() {
    document.getElementById(this.tableId).innerHTML = "";
    document.getElementById(this.resultId).innerHTML = "";
  }
  async tick() {
    await this.sleep(200);
    if (this.aborting) {
      throw new Error("aborting");
    }
  }
  updateOnlyEdge(source, target, type) {
    const id = source + "-" + target;
    if (type === undefined) {
      cy.$("#" + id).classes([]);
      return;
    }
    cy.$("#" + id).addClass(type);
  }
  updateEdge(source, target, type) {
    const id = source + "-" + target;
    if (type === undefined) {
      cy.$("#" + source).classes([]);
      cy.$("#" + target).classes([]);
      cy.$("#" + id).classes([]);
      return;
    }
    cy.$("#" + id).addClass(type);
    cy.$("#" + source).addClass(type);
    cy.$("#" + target).addClass(type);
  }
  updateNode(node, type) {
    if (type === undefined) {
      cy.$("#" + node).classes([]);
      return;
    }
    cy.$("#" + node).classes([type]);
  }
}
