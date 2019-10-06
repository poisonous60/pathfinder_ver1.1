function clearTimings() {
  timings = {};
}

function mouseInNode(Node) {
	if (mouseX > Node.x && mouseX < Node.x + Node.width &&
      mouseY > Node.y && mouseY < Node.y + Node.height) return true;
	else return false;
	
}

function startTime() {
  t = millis();
}

function recordTime(n) {
  if (!timings[n]) {
    timings[n] = {
      sum: millis() - t,
      count: 1
    };
  } else {
    timings[n].sum = timings[n].sum + millis() - t;
    timings[n].count = timings[n].count + 1;
  }
}

function logTimings() {
  for (var prop in timings) {
    if (timings.hasOwnProperty(prop)) {
      console.log(prop + " = " + (timings[prop].sum / timings[prop].count).toString() + " ms");
    }
  }
}

function SettingBox(label, x, y, isSet, callback) {
  this.label = label;
  this.x = x;
  this.y = y;
  this.isSet = isSet;
  this.callback = callback;

  this.show = function() {
    //noFill();
    strokeWeight(1);
    stroke(0);
    noFill();
    ellipse(this.x + 10, this.y + 10, 20, 20);
    if (this.isSet) {
      fill(0);
      ellipse(this.x + 10, this.y + 10, 3, 3);
    }
    fill(0);
    noStroke();
    text(label, this.x + 25, this.y + 15);
  }

  this.mouseClick = function(x, y) {
    if (x > this.x && x <= this.x + 20 &&
      y > this.y && y <= this.y + 20) {
      this.isSet = !this.isSet;
      if (this.callback != null)
        this.callback(this);
    }
  }
}

function Button(label, x, y, w, h, callback) {
  this.label = label;
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.callback = callback;

  this.show = function() {
    stroke(0);
    strokeWeight(1);
    noFill();
    rect(this.x, this.y, this.w, this.h);
    fill(0);
    noStroke();
    text(this.label, this.x + 5, this.y + 5, this.w - 10, this.h - 10);
  }

  this.mouseClick = function(x, y) {
    if (this.callback != null &&
      x > this.x && x <= this.x + this.w &&
      y > this.y && y <= this.y + this.h) {
      this.callback(this);
    }
  }
}


//var __hard_search = null;
var __hard_search;
function step(button) {
  pauseUnpause(true);
  stepsAllowed = 1;
}



function pauseUnpause(pause) {
  paused = pause;
  runPauseButton.label = paused ? "run" : "pause";
}

function runpause(button) {
  pauseUnpause(!paused);
}

function restart(button) {
  logTimings();
  clearTimings();
  rows = mapData.getRowCount();
  cols = mapData.getColumnCount();
  initaliseSearchExample();
  pauseUnpause(true);
}

function saved(button) {
  saveMap();
} //controllor.js에 만들고 붙일거임.

function toggleDiagonals() {
  allowDiagonals = !allowDiagonals;
}



function doGUI() {
  for (var i = 0; i < uiElements.length; i++) {
    uiElements[i].show();
  }
}


function searchStep() {
  if (!paused || stepsAllowed > 0) {
    startTime();
    var result = pathfinder.step();
    recordTime("AStar Iteration");
    stepsAllowed--;

    switch (result) {
      case -1:
        status = "No Solution";
        logTimings();
        pauseUnpause(true);
        break;
      case 1:
        status = "Goal Reached!";
        logTimings();
        pauseUnpause(true);
        break;
      case 0:
        status = "Still Searching"
        break;
    }
  }
}

var path;
var path_d;
var path_swi = false;
function drawed() {
  background(245);

  doGUI();

  text("Search status - " + status, 10, 70);

  startTime();

  drawMap();

  for (var i = 0; i < pathfinder.closedSet.length; i++) {
    pathfinder.closedSet[i].show(color(255, 0, 0, 50));
  }
  infoNode = null;
  infoNode = infoNode_check();
  pathfinder.start.show(color(255, 0, 255));
  pathfinder.end.show(color(0, 100, 255, 100));

  recordTime("Draw Grid");

  fill(0);
  
  
  if (infoNode == null) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let node = pathfinder.map.grid[r][c];
        if (mouseInNode(node)) {
          infoNode = node;
          infoNode.show(color(0, 0, 0, 255));
          if (infoNode.wall == true) {
            text("status = wall", 730, 30);
          } else {
            text("status = nothing", 730, 30);
          }
					
          break;
        }
      }
    }
  }
  
  if (infoNode != null) {
    text("f = " + infoNode.f, 430, 30);
    text("g = " + infoNode.g, 430, 50);
    text("h = " + infoNode.h, 430, 70);
    text("vh = " + infoNode.vh, 430, 90);
    text("x = " + infoNode.x, 580, 30);
    text("y = " + infoNode.y, 580, 50);
    text("width = " + infoNode.width, 580, 70);
    text("height = " + infoNode.height, 580, 90);
    text("i = " + infoNode.i, 730, 50);
    text("j = " + infoNode.j, 730, 70);
		text("previous = " + infoNode.previous, 900, 30);
    // text("status = ", 730, 30);

    text("__click_mode = " + __click_mode, 730, 90);
		text("status2 = " + infoNode.stats, 900, 50);
    text("Bright = " + infoNode.Bright, 900, 70);
		text("index = " + infoNode.index, 900, 90);
	
	//궤적 나오게 하는거. 하얀색 그거.
	let pre_arr = [];
	let pre_index = 155;
	let info_pre = infoNode.previous;
	
	while (info_pre) {
		pre_arr.push(info_pre);
		info_pre = info_pre.previous;
	}
	//if(infoNode.previous != undefined) infoNode.previous.show(color(55));
	for(let i in pre_arr) {
		pre_arr[i].show(color(pre_index -= 1));
	}		
  }
  
  path = calcPath(pathfinder.lastCheckedNode);
  
  if(path_swi) drawPath(path_d) 
  else drawPath(path);
  
	//6번 빨간공
  for (let i = 0; i < Bright2.length; i++) {
		push();
		let node = Bright2[i];
		noStroke();
		ellipseMode(CORNER);
    fill(255, 0, 0);
    ellipse(node.x, node.y, node.width * 2, node.height * 2);
		pop();
	}
	
	if(infoNode != undefined) {
		if(__click_mode == 9) {
			if(infoNode.neighbors == undefined) {
				infoNode.show(255, 255, 0, 40);
				console.log(infoNode.getNeighbors());
			} else {
				console.log("infoNode.neighbors.length " + infoNode.neighbors.length)
				//for(let i = 0; i < infoNode.neighbors.length; i++) {
				//}
			}
		}
	}
	
}

var mapGraphic = null;
function drawMap() {
  if (__mapOn == true) image(img1, gamemap.x, gamemap.y);
  if (mapGraphic == null) {
    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < cols; j++) {
        if (pathfinder.map.grid[i][j].wall) {
          pathfinder.map.grid[i][j].show(color(255));
        }
				if (pathfinder.map.grid[i][j].Bright > 1) pathfinder.map.grid[i][j].show(color(255));
      }
    }
    mapGraphic = get(gamemap.x, gamemap.y, gamemap.w, gamemap.h);
  }

  image(mapGraphic, gamemap.x, gamemap.y);
  // image(img1, gamemap.x, gamemap.y);
  //    console.log('mapGrapic');
  text("He! ", 10, 90);
}

var infoNode = null;
function infoNode_check() {
  for (var i = 0; i < pathfinder.openSet.length; i++) {
    let node = pathfinder.openSet[i];
    node.show(color(0, 255, 0, 50));
    if (mouseInNode(node)) {
      //infoNode = node;
      //infoNode.show(color(50, 255, 0, 90));
			node.show(color(50, 255, 0, 90));
      text("status = openSet", 730, 30);
			return node;
    }
  }
  if (pathfinder.closedSet != null) {
    for (var i = 0; i < pathfinder.closedSet.length; i++) {
      let node = pathfinder.closedSet[i];
      // node.show(color(255, 0, 0, 50));
      if (mouseInNode(node)) {
        //infoNode = node;
        //infoNode.show(color(255, 20, 0, 90));
				node.show(color(255, 20, 0, 90));
        text("status = closedSet", 730, 30);
				return node;
      }
    }
  }
}



function calcPath(endNode) {
  startTime();
  // Find the path by working backwards
  var Path = [];
  var temp = endNode;
  Path.push(temp);
  while (temp.previous) {
    Path.push(temp.previous);
    temp = temp.previous;
  }
  recordTime("Calc Path");
  return Path
}

function drawPath(path) {
  // Drawing path as continuous line
  noFill();
  stroke(255, 0, 200);
  strokeWeight(gamemap.w / gamemap.cols / 2);
  beginShape();
  for (var i = 0; i < path.length; i++) {
    vertex(path[i].x + path[i].width / 2, path[i].y + path[i].height / 2);
  }
  endShape();
}

