const MIN_ROWS = 2;
const MAX_ROWS = 8;
const MIN_COLS = 3;
const MAX_COLS = 10;

const rows = Math.floor(Math.random() * (MAX_ROWS - MIN_ROWS)) + MIN_ROWS;
const cols = Math.floor(Math.random() * (MAX_COLS - MIN_COLS)) + MIN_COLS;

let crawler = new SpiralMatrixCrawler(rows, cols)[Symbol.iterator]();

drawMatrix(rows, cols);
display(crawler, 1);

function SpiralMatrixCrawler(rows, columns) {
  this.cellsToVisit = rows * columns;
  this.currentPosition = { row: 0, col: -1 };
  this.minRow = -1;
  this.maxRow = rows;
  this.minCol = -1;
  this.maxCol = columns;
  this.directions = [
    (right = () => traverseRow()),
    (down = () => traverseColumn()),
    (left = () => traverseRow(true)),
    (up = () => traverseColumn(true)),
  ];

  let traverseRow = (backwards = false) => {
    let increment = backwards ? -1 : 1;
    let newPosition = null;
    let newColumn = this.currentPosition.col + increment;
    if (newColumn < this.maxCol && newColumn > this.minCol) {
      newPosition = { ...this.currentPosition, col: newColumn };
      this.currentPosition = newPosition;
      this.cellsToVisit--;
    } else {
      backwards ? this.maxRow-- : this.minRow++;
    }
    return newPosition;
  };

  let traverseColumn = (backwards = false) => {
    let increment = backwards ? -1 : 1;
    let newPosition = null;
    let newRow = this.currentPosition.row + increment;
    if (newRow < this.maxRow && newRow > this.minRow) {
      newPosition = { ...this.currentPosition, row: newRow };
      this.currentPosition = newPosition;
      this.cellsToVisit--;
    } else {
      backwards ? this.minCol++ : this.maxCol--;
    }
    return newPosition;
  };

  this[Symbol.iterator] = () => {
    let currentDirection = 0;
    return {
      next: () => {
        if (this.cellsToVisit > 0) {
          let newPosition = this.directions[currentDirection]();
          if (!newPosition) {
            currentDirection = (currentDirection + 1) % this.directions.length;
            newPosition = this.directions[currentDirection]();
          }
          return { done: false, value: newPosition };
        } else {
          return { done: true };
        }
      },
    };
  };
}

function drawMatrix(rows, columns) {
  let matrix = document.querySelector('.matrix');
  matrix.innerHTML = '';
  for (let rowIndex = 0; rowIndex < rows; rowIndex++) {
    let row = document.createElement('div');
    row.classList.add('row', `row_${rowIndex}`);

    for (let colIndex = 0; colIndex < columns; colIndex++) {
      let col = document.createElement('div');
      col.classList.add('col', `col_${colIndex}`);
      row.appendChild(col);
    }

    matrix.appendChild(row);
  }
}

function display(crawler, counter) {
  let position = crawler.next();
  if (!position.done) {
    let { row, col } = position.value;
    let cell = document.querySelector(`.row_${row} .col_${col}`);
    cell && (cell.innerHTML = counter);

    setTimeout(() => {
      display(crawler, counter + 1);
    }, 500);
  }
}
