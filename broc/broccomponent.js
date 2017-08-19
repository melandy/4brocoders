"use strict";

class BrocComponent extends HTMLElement {

  constructor() {
    super();
    this.numRows = +this.getAttribute("rows") || 1;
    this.numCols = +this.getAttribute("cols") || 1;

    const shadow = this.createShadowRoot();
  
    const localDocument = document.currentScript.ownerDocument;
    const tmpl = localDocument.getElementById("tmpl");
    shadow.appendChild(tmpl.content.cloneNode(true));
  
    this.rootDiv = shadow.querySelector(".broc__component");
    this.blueTbl = shadow.querySelector(".broco__table");
  
    this.deleteRowButton = this.rootDiv.querySelector(".broco__button-del.row");
    this.deleteColumnButton = this.rootDiv.querySelector(".broco__button-del.col");

    this.addRowButton = this.rootDiv.querySelector(".broco__button-add.row");
    this.addColumnButton = this.rootDiv.querySelector(".broco__button-add.col");
  }

  createTable() {
    const tbody = document.createElement("tbody");
    for (let i = 0; i < this.numRows; i++) {
      const trow = this.makeRowForTable(this.numCols);
      tbody.appendChild(trow);
    }
    this.blueTbl.appendChild(tbody);

    this.blueTbl.onmousemove = this.moveButton();
    this.blueTbl.onmouseenter = this.showDelButton();
    this.blueTbl.onmouseleave = this.hideDelButton();
  }

  makeRowForTable(col) {
    const tr = document.createElement("tr");
    for (let i = 0; i < col; i++) {
      let td = tr.appendChild(document.createElement("td"));
      td.className = "broco__table-elem";
    }
    return tr
  }

  addRow() {
    return ()=> {
      const tbody = this.blueTbl.querySelector("tbody");
      const trow = this.makeRowForTable(this.numCols);
      tbody.appendChild(trow);
      this.numRows++;
    }
  }

  deleteRow() {
    return ()=> {
      const tbody = this.blueTbl.querySelector("tbody");
      const tr = tbody.lastChild.rowIndex;
      if (tr > 0) {
        tbody.deleteRow(tr);
        this.numRows--;
        this.deleteRowButton.classList.add("broco__button-del-hidden");
      }
    }
  }

  addCol() {
    return ()=> {
      let trs = this.blueTbl.querySelectorAll("tr");
      for (let tr of trs) {
        let td = tr.appendChild(document.createElement("td"));
        td.className = "broco__table-elem";
      }
      this.numCols++;
    }
  }

  deleteCol() {
    return () => {
      let trs = this.blueTbl.querySelectorAll("tr");
      if (this.numCols > 1) {
        for (let tr of trs) {
          tr.lastChild.remove();
        }
        this.numCols--;
        this.deleteColumnButton.classList.add("broco__button-del-hidden");
      }
    }
  }

  addEvent(arr) {
    arr.map(item => {
      const btn = item.btn;
      if (btn) btn[item.event] = item.cb;
    });
  }

  createButtonsEvents() {
    const buttons = [
      { btn: this.deleteColumnButton, event: "onclick",      cb: this.deleteCol() },
      { btn: this.deleteColumnButton, event: "onmouseenter", cb: this.showDelButton() },
      { btn: this.deleteColumnButton, event: "onmouseleave", cb: this.hideDelButton() },
      { btn: this.deleteRowButton,    event: "onclick",      cb: this.deleteRow() },
      { btn: this.deleteRowButton,    event: "onmouseenter", cb: this.showDelButton() },
      { btn: this.deleteRowButton,    event: "onmouseleave", cb: this.hideDelButton() },
      { btn: this.addColumnButton,    event: "onclick",      cb: this.addCol() },
      { btn: this.addRowButton,       event: "onclick",      cb: this.addRow() }
    ];
    this.addEvent(buttons);
  }

  showDelButton() {
    return (e) => {
      e.stopPropagation();
      if (this.numCols > 1) {
        this.deleteColumnButton.classList.remove("broco__button-del-hidden");
      }
      if (this.numRows > 1) {
        this.deleteRowButton.classList.remove("broco__button-del-hidden");
      }
    }
  }

  hideDelButton() {
    return (e) => {
      e.stopPropagation();
      this.deleteColumnButton.classList.add("broco__button-del-hidden");
      this.deleteRowButton.classList.add("broco__button-del-hidden");
    }
  }
  
  moveButton() {
    return (e) => {
      e.stopPropagation();

      const startPositionLeft = this.blueTbl.getBoundingClientRect().left;
      const startPositionTop = this.blueTbl.getBoundingClientRect().top;

      const elemDelRow = parseInt((e.pageY - startPositionTop - 4) / 52) * 52;
      const elemDelCol = parseInt((e.pageX - startPositionLeft - 4) / 52) * 52;

      this.deleteRowButton.style.transform = `translateY(${elemDelRow}px)`;
      this.deleteColumnButton.style.transform = `translateX(${elemDelCol}px)`;
    }
  }

  connectedCallback() {
    this.createTable();
    this.createButtonsEvents();
  }
}

customElements.define("broc-component", BrocComponent);
