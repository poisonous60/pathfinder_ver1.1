function MyMap_School(cols, rows, x, y, w, h, allowDiagonals, wallRatio) {
  this.cols = cols;
  this.rows = rows;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.allowDiagonals = allowDiagonals;

  this.grid = [];
  this.path = [];


  // Making a 2D array
  for (var i = 0; i < cols; i++) {
    this.grid[i] = [];
  }

  {


  }
	
  for (let Row = 0; Row < mapData.getRowCount(); Row++) {
    for (let Col = 0; Col < mapData.getColumnCount(); Col++) {
      var Bright = false;
	  var isWall = false;
	  var value = mapData.get(Row, Col);
      if (value == "") {
		  isWall = false;
	  } 
	  else if (value == "1") {
        isWall = true;
      } else {
		isWall = true;
		Bright = true;
      }
	  
		// console.error("Row" + Row + " Col" + Col + " isWall" + isWall)
      this.grid[Row][Col] = new Spot(Row, Col, x + Col * w / cols, y + Row * h / rows, w / cols, h / rows, isWall, this.grid, Bright);
    }
  }

}