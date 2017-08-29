"use strict";

class BrocComponent extends HTMLElement {

  constructor() {
    super();
    const rows = +this.getAttribute("rows");
    const cols = +this.getAttribute("cols");
    this.numRows = rows && typeof rows === "number" ? rows : 1;
    this.numCols = cols && typeof cols === "number" ? cols : 1;

    const shadow = this.createShadowRoot();
  
    const localDocument = document.currentScript.ownerDocument;
    const tmpl = localDocument.getElementById("broc_tmpl");
    shadow.appendChild(tmpl.content.cloneNode(true));
  
    this.rootDiv = shadow.querySelector(".broc__component");
    this.blueTbl = shadow.querySelector(".broco__table");
  
    this.deleteRowButton = this.rootDiv.querySelector(".broco__button-delrow");
    this.deleteColumnButton = this.rootDiv.querySelector(".broco__button-delcol");

    this.addRowButton = this.rootDiv.querySelector(".broco__button-addrow");
    this.addColumnButton = this.rootDiv.querySelector(".broco__button-addcol");
  }

  createTable() {
    const tbody = document.createElement("tbody");
    for (let i = 0; i < this.numRows; i++) {
      const trow = this.makeRowForTable(this.numCols);
      tbody.appendChild(trow);
    }
    this.blueTbl.appendChild(tbody);

    this.blueTbl.onmouseenter = this.showDelButton();
    this.blueTbl.onmouseleave = this.hideDelButton();
  }

  makeRowForTable(col) {
    const tr = document.createElement("tr");
    for (let i = 0; i < col; i++) {
      let td = tr.appendChild(document.createElement("td"));
      td.className = "broco__table-elem";
      td.onmousemove = this.moveButton();
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
        td.onmousemove = this.moveButton();
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

      const indexRow = e.target.parentNode.rowIndex;
      const indexCol = e.target.cellIndex;
      const elemDelRow = indexRow * 50;
      const elemDelCol = indexCol * 50;
      
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
