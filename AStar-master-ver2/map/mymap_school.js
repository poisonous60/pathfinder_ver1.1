function MyMap_School(cols, rows, x, y, w, h, allowDiagonals, wallRatio, index) {
  this.cols = cols;
  this.rows = rows;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.allowDiagonals = allowDiagonals;

  this.grid = [];
  this.path = [];
	this.index = index;

  // Making a 2D array
  for (var i = 0; i < rows; i++) {
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
      }
    else if (value=="2"){
        isWall = false;
				Bright = 2;
    }	else if (value=="3"){
        isWall = false;
		    Bright = 3;
    } else if (value=="4"){
        isWall = false;
		    Bright = 4;
    } else {    
			isWall = true;
			//Bright = true;
    }
	  //let err = "Row " + Row + " Col " + Col + " x + Col * w / cols " + (x + Col * w / cols) + " y + Row * h / rows " + (y + Row * h / rows) + " w / cols " + (w / cols) + " h / rows " + (h / rows) + " isWall " + isWall + " Bright " + Bright;
		//console.error(err);
    this.grid[Row][Col] = new Spot(Row, Col, x + Col * w / cols, y + Row * h / rows, w / cols, h / rows, isWall, this.grid, Bright, index);
    }
  }

}