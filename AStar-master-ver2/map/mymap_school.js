function MyMap_School(mapData, cols, rows, x, y, w, h, allowDiagonals, wallRatio, index) {
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
	
	this.nodes = [];

  // Making a 2D array
  for (var i = 0; i < rows; i++) {
    this.grid[i] = [];
  }
	
  for (let Row = 0; Row < mapData.getRowCount(); Row++) {
    for (let Col = 0; Col < mapData.getColumnCount(); Col++) {
			var Bright = false;
			var isWall = false;
			var value = mapData.get(Row, Col);
			var isNode = undefined;
			
			if (value == "") {
				isWall = false;
				isNode = undefined;
			} 
			else if (value == "1") {
					isWall = true;
					isNode = undefined;
					Bright = false;	
				}
			else if (value=="2"){
					isWall = false;
					Bright = 2;
					isNode = undefined;
			}	else if (value=="3"){
					isWall = false;
					Bright = 3;
					isNode = undefined;
			} else if (value=="4"){
					isWall = false;
					Bright = 4;
					isNode = undefined;
			} else if(value.match('n')) {
				isNode = parseInt(value.substr(1));
				isWall = false;
				Bright = false;
			} else {
				isWall = true;
				isNode = undefined;
				//Bright = true;
			}
			//let err = "Row " + Row + " Col " + Col + " x + Col * w / cols " + (x + Col * w / cols) + " y + Row * h / rows " + (y + Row * h / rows) + " w / cols " + (w / cols) + " h / rows " + (h / rows) + " isWall " + isWall + " Bright " + Bright + "isNode " + isNode;
			//console.error(err);
			this.grid[Row][Col] = new Spot(Row, Col, x + Col * w / cols, y + Row * h / rows, w / cols, h / rows, isWall, this.grid, Bright, index, isNode);
			
			if(isNode != undefined) this.nodes.push(this.grid[Row][Col]);
		}
  }

}