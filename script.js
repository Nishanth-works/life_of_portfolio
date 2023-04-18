const INITIAL_CELL_SIZE = 10;
const INITIAL_STATE_CHANCE = 0.3;
const CELL_SIZE_FACTOR = 0.05;
const MIN_CELL_SIZE = 1;
const MAX_CELL_SIZE = 50;
const AGE_LIMIT = 5;

let grid;
let cellSize = INITIAL_CELL_SIZE;
let numRows;
let numCols;
let bgColor = 0;
let cellColor;
let colorPalette;

function setup() {
  createCanvas(windowWidth, windowHeight);
  textContainer = select('#text-container');
  textContentElement = select('#text-content');
  

  // Set up the color palette
  colorPalette = [
    color(255, 0, 0),
    color(0, 255, 0),
    color(0, 0, 255),
    color(255, 255, 0),
    color(255, 0, 255),
    color(0, 255, 255),
    color(255, 255, 255)
  ];

  // Set the initial cell color to a random color from the palette
  const index = Math.floor(random(colorPalette.length));
  cellColor = colorPalette[index];

  // Set up the grid and background
  numRows = Math.floor(windowHeight / cellSize);
  numCols = Math.floor(windowWidth / cellSize);
  initializeGrid();
  background(bgColor);

  // Update the background animation every 50 milliseconds
  setInterval(updateBackground, 50);
}

const textContent = [
    {
      heading: "Heading 1",
      paragraph: "This is paragraph 1. You can add more content here."
    },
    {
      heading: "Heading 2",
      paragraph: "This is paragraph 2. You can add more content here."
    },
    {
      heading: "Heading 3",
      paragraph: "This is paragraph 3. You can add more content here."
    },
    {
      heading: "Heading 4",
      paragraph: "This is paragraph 4. You can add more content here."
    },
    {
      heading: "Heading 5",
      paragraph: "This is paragraph 5. You can add more content here."
    }
  ];
  
  let index = 0;
  const headingElement = document.getElementById("heading");
  const paragraphElement = document.getElementById("paragraph");
  
  function updateTextContent() {
    headingElement.textContent = textContent[index].heading;
    paragraphElement.textContent = textContent[index].paragraph;
  }
  updateTextContent();
  
  function scrollText() {
    let isScrolling = false;
  
    window.addEventListener("wheel", (event) => {
      if (isScrolling) return;
  
      isScrolling = true;
      headingElement.style.opacity = 0;
      paragraphElement.style.opacity = 0;
  
      setTimeout(() => {
        if (event.deltaY > 0) {
          index = (index + 1) % textContent.length;
        } else {
          index = (index - 1 + textContent.length) % textContent.length;
        }
        updateTextContent();
  
        headingElement.style.opacity = 1;
        paragraphElement.style.opacity = 1;
  
        setTimeout(() => {
          isScrolling = false;
        }, 500);
      }, 500);
    });
  }
  
  scrollText();
  
function updateBackground() {
  background(bgColor);

  // Calculate the offset needed to center the grid on the canvas
  const xOffset = (windowWidth - numCols * cellSize) / 2;
  const yOffset = (windowHeight - numRows * cellSize) / 2;

  // Draw the background cells
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if ((i + j) % 2 === 0) {
        fill(200);
      } else {
        fill(150);
      }

      rect(j * cellSize + xOffset, i * cellSize + yOffset, cellSize, cellSize);
    }
  }

  // Draw the foreground cells
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      if (grid[i][j] > 0) {
        const age = grid[i][j];

        // If the cell has reached the age limit, reset its age and change its color
        if (age >= AGE_LIMIT) {
          grid[i][j] = 1;
          const index = Math.floor(random(colorPalette.length));
          cellColor = colorPalette[index];
        } else {
          const alpha = map(age, 1, AGE_LIMIT, 50, 255);
          fill(red(cellColor), green(cellColor), blue(cellColor), alpha);
          grid[i][j]++;
        }
      } else {
        fill(0);
      }

      rect(j * cellSize + xOffset, i * cellSize + yOffset, cellSize, cellSize);
    }
  }

  // Update the grid
  updateGrid();

  // Wrap the grid around on itself
  wrapGrid();
}

function updateGrid() {
  let newGrid = [];

  for (let i = 0; i < numRows; i++) {
    newGrid[i] = [];

    for (let j = 0; j < numCols; j++) {
      const numNeighbors = countNeighbors(i, j);

      if (grid[i][j] > 0) {
        if (numNeighbors < 2 || numNeighbors > 3) {
			newGrid[i][j] = 0;
			} else {
			newGrid[i][j] = grid[i][j] + 1;
			}
			} else {
			if (numNeighbors === 3) {
			newGrid[i][j] = 1;
			} else {
			newGrid[i][j] = 0;
			}
			}
			}
			}
			
			grid = newGrid;
			}
			
			function countNeighbors(row, col) {
			let count = 0;
			
			for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
			if (i === 0 && j === 0) {
			continue;
			}
			
			let neighborRow = row + i;
			let neighborCol = col + j;
		  
			if (neighborRow < 0 || neighborCol < 0 || neighborRow >= numRows || neighborCol >= numCols) {
			  continue;
			}
		  
			count += grid[neighborRow][neighborCol] > 0 ? 1 : 0;
		  }
		  }
		  
		  return count;
		  }
		  
		  function wrapGrid() {
		  // Wrap the grid around on the X-axis
		  for (let i = 0; i < numRows; i++) {
		  let lastCol = numCols - 1;
		  if (grid[i][0] > 0) {
			grid[i][lastCol + 1] = 1;
		  } else {
			grid[i][lastCol + 1] = 0;
		  }
		  
		  if (grid[i][lastCol] > 0) {
			grid[i][0] = 1;
		  } else {
			grid[i][0] = 0;
		  }
		  }
		  
		  // Wrap the grid around on the Y-axis
		  for (let j = 0; j < numCols; j++) {
		  let lastRow = numRows - 1;
		  if (grid[0][j] > 0) {
			grid[lastRow + 1][j] = 1;
		  } else {
			grid[lastRow + 1][j] = 0;
		  }
		  
		  if (grid[lastRow][j] > 0) {
			grid[0][j] = 1;
		  } else {
			grid[0][j] = 0;
		  }
		  }
		  }
		  
		  function initializeGrid() {
		  grid = [];
		  
		  for (let i = 0; i < numRows; i++) {
		  grid[i] = [];
		  for (let j = 0; j < numCols; j++) {
			const x = map(j, 0, numCols, -2.5, 1.5);
			const y = map(i, 0, numRows, -1, 1);
			const c = new Complex(x, y);
			const isInSet = isMandelbrot(c, 100);
		  
			if (isInSet) {
			  grid[i][j] = 0;
			} else {
			  grid[i][j] = 1;
			}
		  }
		  }
		  }
		  
		  function isMandelbrot(c, maxIterations) {
		  let z = new Complex(0, 0);
		  
		  for (let i = 0; i < maxIterations; i++) {
		  z = z.multiply(z).add(c);
		  if (z.abs() > 2) {
			return false;
		  }
		  }
		  
		  return true;
		  }
		  
		  function Complex(real, imag) {
		  this.real = real;
		  this.imag = imag;
		  
		  this.add = function(other) {
		  return new Complex(this.real + other.real,this.imag + other.imag);
		}
		
		this.multiply = function(other) {
		const real = this.real * other.real - this.imag * other.imag;
		const imag = this.real * other.imag + this.imag * other.real;
		return new Complex(real, imag);
	}

	this.abs = function() {
	return Math.sqrt(this.real * this.real + this.imag * this.imag);
	}
	}
	
	function mouseWheel(event) {
	// Adjust the size of the cells based on the scroll direction
	if (event.deltaY > 0) {
	cellSize += cellSize * CELL_SIZE_FACTOR;
	if (cellSize > MAX_CELL_SIZE) {
		cellSize = MAX_CELL_SIZE;
	  }
	  } else {
	  cellSize -= cellSize * CELL_SIZE_FACTOR;
	  if (cellSize < MIN_CELL_SIZE) {
		cellSize = MIN_CELL_SIZE;
	  }
	  }
	  
	  // Update the number of rows and columns based on the new cell size
	  numRows = Math.floor(windowHeight / cellSize);
	  numCols = Math.floor(windowWidth / cellSize);
	  
	  // Reinitialize the grid with the new size
	  initializeGrid();
	  }
	  
	  let intervalId;
	  
	  
	  function resetGame() {
	  initializeGrid();
	  }
	  
	  document.getElementById('reset-button').addEventListener('click', resetGame);			