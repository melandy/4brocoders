"use strict";

class BrocComponent extends HTMLElement {

  constructor() {
    super();
    this.numRows = +this.getAttribute("rows") || 1;
    this.numCols = +this.getAttribute("cols") || 1;

    this.shadow = this.createShadowRoot();

    const localDocument = document.currentScript.ownerDocument;
    const tmpl = localDocument.getElementById("tmpl");
    this.shadow.appendChild(tmpl.content.cloneNode(true));

    this.rootDiv = this.shadow.querySelector(".broc__component");
    this.blueTbl = this.shadow.querySelector(".broco__table");
  }

  createTable() {
    for (let i = 0; i < this.numRows; i++) {
      this.makeRowForTable(this.numCols);
    }
    this.blueTbl.onmousemove = this.moveButton();
    this.blueTbl.onmouseenter = this.showDelButton(true);
    this.blueTbl.onmouseleave = this.showDelButton(false);
  }

  makeRowForTable(col) {
    let tr = this.blueTbl.appendChild(document.createElement("tr"));
    for (let i = 0; i < col; i++) {
      let td = tr.appendChild(document.createElement("td"));
      td.className = "broco__table-elem";
    }
  }

  addRow() {
    return ()=> {
      this.makeRowForTable(this.numCols);
      this.numRows++;
    }
  }

  deleteRow() {
    return ()=> {
      let tr = this.blueTbl.lastChild.rowIndex;
      if (tr > 0) {
        this.blueTbl.deleteRow(tr);
        this.numRows--;
        this.rootDiv.querySelector(".broco__button-del.row").classList.add("broco__button-del-hidden");
      }
    }
  }

  addCol() {
    return ()=> {
      let tr = this.blueTbl.querySelectorAll("tr");
      for (let i = 0; i < tr.length; i++) {
        let td = tr[i].appendChild(document.createElement("td"));
        td.className = "broco__table-elem";
      }
      this.numCols++;
    }
  }

  deleteCol() {
    return () => {
      let tr = this.blueTbl.querySelectorAll("tr");
      if (this.numCols > 1) {
        for (let i = 0; i < tr.length; i++) {
          tr[i].lastChild.remove();
        }
        this.numCols--;
        this.rootDiv.querySelector(".broco__button-del.col").classList.add("broco__button-del-hidden");
      }
    }
  }

  addEvent(arr) {
    for (let i = 0; i < arr.length; i++) {
      let btn = this.rootDiv.querySelector(arr[i].btn);
      btn[arr[i].event] = arr[i].cb;
    }
  }

  createButtonsEvents() {
    const buttons = [
      { btn: ".broco__button-del.col", event: "onclick",    cb: this.deleteCol() },
      { btn: ".broco__button-del.col", event: "onmouseenter", cb: this.showDelButton(true) },
      { btn: ".broco__button-del.col", event: "onmouseleave", cb: this.showDelButton(false) },
      { btn: ".broco__button-del.row", event: "onclick",    cb: this.deleteRow() },
      { btn: ".broco__button-del.row", event: "onmouseenter", cb: this.showDelButton(true) },
      { btn: ".broco__button-del.row", event: "onmouseleave", cb: this.showDelButton(false) },
      { btn: ".broco__button-add.col", event: "onclick",    cb: this.addCol() },
      { btn: ".broco__button-add.row", event: "onclick",    cb: this.addRow() }
    ];
    this.addEvent(buttons);
  }

  showDelButton(visible) {
    return (e) => {
      e.stopPropagation();
      const btnsDel = this.rootDiv.querySelectorAll(".broco__button-del");
      if (visible) {
        for (let btn of btnsDel) {
          if (
            (btn.classList.contains("row") && this.numRows > 1) ||
            (btn.classList.contains("col") && this.numCols > 1)
          ) {
            btn.classList.remove("broco__button-del-hidden");
          }
        }
      } else {
        for (let btn of btnsDel) {
          btn.classList.add("broco__button-del-hidden");
        }
      }
    }
  }

  moveButton() {
    return (e) => {
      e.stopPropagation();
      const btnDelRow = this.rootDiv.querySelector(".broco__button-del.row");
      const btnDelCol = this.rootDiv.querySelector(".broco__button-del.col");

      const startPositionLeft = this.blueTbl.getBoundingClientRect().left + 4;
      const startPositionTop = this.blueTbl.getBoundingClientRect().top + 4;

      const elemDelRow = parseInt((e.pageY - startPositionTop) / 52) * 52;
      const elemDelCol = parseInt((e.pageX - startPositionLeft) / 52) * 52;

      btnDelRow.style.transform = `translateY(${elemDelRow}px)`;
      btnDelCol.style.transform = `translateX(${elemDelCol}px)`;
    }
  }

  connectedCallback() {
    this.createTable();
    this.createButtonsEvents();
  }
}

customElements.define("broc-component", BrocComponent);
