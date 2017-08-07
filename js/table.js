"use strict";

const divApp = document.querySelector("div#app");

class Table {

  constructor(numRows, numCols) {
    this.numRows = numRows;
    this.numCols = numCols;
    this.allTds = [];
    this.blueEls = [];
    this.rightAddEl = '';
    this.footAddEl = '';
    this.headDelEls = [];
    this.leftDelEls = [];
  }
  
  selectorTds() {
    this.blueEls = [];
    this.headDelEls = [];
    this.leftDelEls = [];
  
    this.allTds.forEach((td) => {
      switch (td.className) {
        case "td-blue": this.blueEls.push(td); break;
        case "add-row": this.rightAddEl = td; break;
        case "add-col": this.footAddEl = td; break;
        case "del-row": this.leftDelEls.push(td); break;
        case "del-col": this.headDelEls.push(td); break;
      }
    });
  }
  
  createHeadFootRows(num) {
    const trBegin = "<tr>";
    const trEnd = "</tr>";
    let trHead = trBegin;
    let trFoot = trBegin;
    
    for (let i = 0; i < num; i++) {
      trFoot += (i === 0) ? "<td class = 'add-row'>+</td>" : "<td></td>";
      trHead += "<td class = 'del-col'></td>";
  
    }
    trFoot += trEnd;
    trHead += trEnd;
    
    return {rowHead: trHead, rowFoot: trFoot}
  }
  
  createLeftRightCols(num) {
    const trStr = "<tr><td></td></tr>";
    let trLeft = trStr;
    let trRight = trStr;
    
    for (let i = 0; i < num; i++) {
      trLeft += "<tr><td class = 'del-row'></td></tr>";
      trRight += (i === 0) ? "<tr><td class = 'add-col'>+</td></tr>" : "<tr><td></td></tr>";
    }
    trLeft += trStr;
    trRight += trStr;
    
    return {colLeft: trLeft, colRight: trRight}
  }

  createBlueRow(num) {
    let tr = "<tr>";
    for (let i = 0; i < num; i++) {
      tr += "<td class = 'td-blue'></td>"
    }
    tr += "</tr>";
    return tr
  }
  
  createBlueTable() {
    let rows = "";
    for (let i = 0; i < this.numRows; i++) {
      rows += `${this.createBlueRow(this.numCols)}`;
    }
    return rows
  }
  
  showDelElements(el, show) {
    const cr = el.className.slice(-3);
    if (cr === 'row') {
      const delRow = this.leftDelEls[el.parentNode.rowIndex-1];
      this.styleDelBtn(delRow, show, this.numRows);
    }
    if (cr === 'lue') {
      const delRow = this.leftDelEls[el.parentNode.rowIndex];
      this.styleDelBtn(delRow, show, this.numRows);
    }
    
    if (cr === 'col' || cr === 'lue') {
      const delCol = this.headDelEls[el.cellIndex];
      this.styleDelBtn(delCol, show, this.numCols);
    }
  }
  
  styleDelBtn(el, operation, num) { // operation = true - show BTN, operation = false - hide BTN
    if (el) {
      if (operation && num > 1) {
        el.style.cursor = 'pointer';
        el.style.backgroundColor = '#ae0309';
        el.textContent = '-';
      } else {
        el.style.backgroundColor = 'white';
        el.style.cursor = 'default';
        el.textContent = '';
      }
    }
  }
  
  evMouseBlueHover() {
    this.blueEls.forEach((curr) => {
      curr.addEventListener('mouseenter', (e) => this.showDelElements(e.target, true));
      curr.addEventListener('mouseout', (e) => this.showDelElements(e.target, false));
    });
  }
  
  evAddElement(element) {
    const cr = element.className.slice(-3);
    element.addEventListener('click', () => {
      cr === 'row' ? this.numRows++ : this.numCols++;
      this.tableInit();
    }, { once: true })
  }
  
  evDelElements(element) {
    element.forEach((curr) => {
      const cr = curr.className.slice(-3);
      const num = (cr === 'row') ? this.numRows : this.numCols;
      if (num > 1) {
        curr.addEventListener('mouseenter', (e) => this.showDelElements(e.target, true));
        curr.addEventListener('click', () => {
          cr === 'row' ? this.numRows-- : this.numCols--;
          this.tableInit();
        }, {once: true});
      }
      curr.addEventListener('mouseout', (e) => this.showDelElements(e.target, false));
    })
  }
  
  eventLisenerStart() {
    this.evMouseBlueHover();
    this.evAddElement(this.rightAddEl);
    this.evAddElement(this.footAddEl);
    this.evDelElements(this.leftDelEls);
    this.evDelElements(this.headDelEls);
  }
  
  tableInit() {
    let table = "";
    divApp.innerHTML = table;
    const cols = this.createLeftRightCols(this.numRows);
    const rows = this.createHeadFootRows(this.numCols);
    
    table = `<table class="left-col">${cols.colLeft}</table>
             <div class="center">
               <table class="head">${rows.rowHead}</table>
               <table class="main">${this.createBlueTable()}</table>
               <table class="foot">${rows.rowFoot}</table>
             </div>
             <table class="right-col">${cols.colRight}</table>
    `;
    
    divApp.innerHTML = table;
    this.allTds = divApp.querySelectorAll('td');
    this.selectorTds();
    this.eventLisenerStart();
  }
}