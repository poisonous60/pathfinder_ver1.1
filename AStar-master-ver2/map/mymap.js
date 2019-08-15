function MyMap(cols, rows, x, y, w, h, allowDiagonals, wallRatio ) {
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

  for (var i = 0; i < cols; i++) {
      for (var j = 0; j < rows; j++) {
          var isWall = (SSI[j][i] == '0' ? 0 : SSI[j][i] );
          console.log(SSI[0][0]);

          //문제는 이거지



          this.grid[i][j] = new Spot(i, j, x + i * w / cols, y + j * h / rows, w / cols, h / rows, isWall, this.grid);
      }
  }

}
