"use strict";

const tbodyEl = document.querySelector("tbody");
// const theadEl = document.querySelector("thead");
// const tfootEl = document.querySelector("tfoot");

class Table {
  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
  }
  
  get addColEl() {
    return document.querySelector("tr:first-child td.add-col");
  }
  
  get tdBlueEls() {
    return document.querySelectorAll("td.td-blue");
  }
  
  get tdDelBtn() {
    return document.querySelectorAll("td.del-row");
  }
  
  createRow(numCols) {
    let tr = "<tr><td class='del-row'>-</td>";
    for (let i = 0; i < numCols; i++) {
      tr += "<td class='td-blue'></td>"
    }
    tr += "<td class='add-col'>+</td></tr>";
    return tr
  }

  appendRows() {
    let rows = "";
    for (let i = 0; i < this.numRows; i++) {
      rows += `${this.createRow(this.numCols)}`;
    }
    return rows
  }
  
  addTableRow() {
    this.numRows++;
    const btnDelRow = document.querySelector("#btnDelRow");
    if (this.numRows > 1) {
      btnDelRow.style.display = "";
    }
    this.tableInit();
  }
  
  addTableCol() {
    this.numCols++;
    const btnDelCol = document.querySelector("#btnDelCol");
    if (this.numCols > 1) {
      btnDelCol.style.display = "";
    }
    this.tableInit();
  }
  
  delTableRow() {
    this.numRows--;
    this.tableInit();
  }
  
  delTableCol(e) {
    this.numCols--;
    if (this.numCols <= 1) {
      e.target.style.display = "none";
    }
    this.tableInit();
  }
 
  hideDelTdRow(el) {
    const row = el.parentNode;
    const delBtn = row.querySelector('.del-row');
    delBtn.style.backgroundColor = 'white';
    delBtn.style.cursor = 'default';
  }
  
  showDelTdRow(el) {
    const row = el.parentNode;
    const delBtn = row.querySelector('.del-row');
    delBtn.style.backgroundColor = '#ae0309';
    delBtn.style.cursor = 'pointer';
  }
  
  evMouseDelBtn() {
    this.tdDelBtn.forEach((curr) => {
      curr.addEventListener('mouseenter', (e) => {
        if (this.numRows > 1) {
          this.showDelTdRow(e.target)
        }
      });
      curr.addEventListener('click', () => {
        if (this.numRows > 1) {
          this.delTableRow(), {once: true}
        }
      });
      curr.addEventListener('mouseout', (e) => this.hideDelTdRow(e.target));
    })
  }

  evMouseTdsBlue() {
    this.tdBlueEls.forEach((curr) => {
      curr.addEventListener('mouseenter', (e) => {
        if (this.numRows > 1) {
          this.showDelTdRow(e.target)
        }
      });
      curr.addEventListener('mouseout', (e) => this.hideDelTdRow(e.target));
    });
  }
  
  evClickAddTblCol() {
    this.addColEl.addEventListener('click', () => this.addTableCol(), {once: true});
  }
  
  evStart() {
    this.evClickAddTblCol();
    this.evMouseTdsBlue();
    this.evMouseDelBtn();
  }
  
  tableInit() {
    tbodyEl.innerHTML = this.appendRows();
    this.evStart();
  }
}

const a = new Table(3, 3);
a.tableInit();


