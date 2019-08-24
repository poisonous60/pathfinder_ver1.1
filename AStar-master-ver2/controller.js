let save_openSet = [];
let save_closedSet = [];
var Bright2 = [];


function keyTyped() {
  if (key === 'a') {
    console.log("a : noLoop()");
    noLoop();
  } else if (key === 'b') {
    console.log("b : loop()");
    loop();
  }
  if (key === 'c') {
    rect(mouseX, mouseY, 200, 200);
  }
  if (key === 's') { //Show the statue
    console.log("s");
    console.log("uiElement ->");
    console.log(uiElements);
    console.log("pathfinder.openSet ->");
    console.log(pathfinder.openSet);
    console.log("pathfinder.closedSet ->");
    console.log(pathfinder.closedSet);
    console.log("gamemap ->");
    console.log(gamemap);
  }
  if (key === 'q') {
    console.log('q');
    for (var i = 0; i < uiElements.length; i++) {
      uiElements[i].mouseClick(mouseX, mouseY);
      drawed();
    }
  }
  if (key === 'r') {
    console.log('세이브했어요!');
    saveMap();

  }
  if (key === 't') {
    console.log('t');
    loadMap();
  }
  if (key === 'y') {
    console.log('y : pathfinder.set = save_file');
    pathfinder.openSet = [];
    pathfinder.openSet = save_openSet;
    // save_openSet = [];

    pathfinder.closedSet = [];
    pathfinder.closedSet = save_closedSet;
    // save_closedSet = [];
  }
  if (key === 'k') {
    console.log('k : __click_mode change');
    __click_mode++;
    if (__click_mode > 9) {
      __click_mode = 0;
    }
  }
  if (key === 'd') {
    console.log('d : drawPath()');
	path_swi = !path_swi;
	console.log("path_swi " + path_swi); 
	for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let node = pathfinder.map.grid[r][c];
        if (mouseInNode(node)) {
          path_d = calcPath(node);
		  console.log("node.previous");
		  console.log(node.previous);
		  console.log("path_d");
		  console.log(calcPath(node));
          break;
        }
      }
    }
    
  }

}

function mouseClicked() {
  for (let i = 0; i < uiElements.length; i++) {
    uiElements[i].mouseClick(mouseX, mouseY);
  }
  if (__click_mode != 0) {
    for (let mapY = 0; mapY < mapData.getRowCount(); mapY++) {
      for (let mapX = 0; mapX < mapData.getColumnCount(); mapX++) {

        let click_node = pathfinder.map.grid[mapY][mapX].mouseClick_spot(mouseX, mouseY);
        if (click_node != null) {
          if (__click_mode == 1) {
            console.log("출발 위치 재설정");
            pathfinder.start = click_node;
            start = click_node;
          } else if (__click_mode == 2) {
            console.log("도착 위치 재설정");
            pathfinder.end = click_node;
            end = click_node;
          } else if (__click_mode == 3) {
            console.log("벽토글");
            pathfinder.map.grid[mapY][mapX].wall = !pathfinder.map.grid[mapY][mapX].wall;
            console.log(pathfinder.map.grid[mapY][mapX].wall);
            mapGraphic = null;
          } else if (__click_mode == 4) {
            let swi = false;
			
            for (var i = 0; i < pathfinder.closedSet.length; i++) {
              let node = pathfinder.closedSet[i];
              if (node === click_node) {
                console.log("close -> nothing")
                pathfinder.closedSet.splice(i, 1);
                swi = true;
				break;
              }
			  
            }
			if(swi == false) {
				for (var i = 0; i < pathfinder.openSet.length; i++) {
				  let node = pathfinder.openSet[i];
				  if (node === click_node) {
					console.log("open -> close")
					pathfinder.openSet.splice(i, 1);
					pathfinder.closedSet.push(node)
					swi = true;
					break;
				  }
				  
				}
			}
            if (swi == false) {
              console.log("nothing -> nothing")
              //pathfinder.openSet.push(click_node)
            }

          } else if (__click_mode == 5) {
            console.log("B.")
            click_node.Bright = true;

          } else if (__click_mode == 6) {
            console.log("BBBBright!!!!")
            Bright2.push(click_node);

          }
        }


      }
    }

  }
}

function saveMap() {
  //let openSet = pathfinder.openSet;
  let openSet_saveFile = new p5.Table();
  let closedSet_saveFile = new p5.Table();
  let setting_saveFile = new p5.Table();


  openSet_saveFile.addColumn('openset_i');
  openSet_saveFile.addColumn('openset_j');
  closedSet_saveFile.addColumn('closedset_i');
  closedSet_saveFile.addColumn('closedset_j');
  setting_saveFile.addColumn('id');
  setting_saveFile.addColumn('set_i');
  setting_saveFile.addColumn('set_j');
  // console.log("getRowCount() : " + openSet_saveFile.getRowCount());
  // console.log("getColumnCount() : " + openSet_saveFile.getColumnCount());


  for (let n = 0; n < pathfinder.openSet.length; n++) {
    openSet_saveFile.addRow();
    openSet_saveFile.setNum(n, 'openset_i', pathfinder.openSet[n].i);
    openSet_saveFile.setNum(n, 'openset_j', pathfinder.openSet[n].j);
    // console.log("getRowCount() : " + openSet_saveFile.getRowCount());
    // console.log("getColumnCount() : " + openSet_saveFile.getColumnCount());
  }
  for (let n = 0; n < pathfinder.closedSet.length; n++) {
    closedSet_saveFile.addRow();
    closedSet_saveFile.setNum(n, 'closedset_i', pathfinder.closedSet[n].i);
    closedSet_saveFile.setNum(n, 'closedset_j', pathfinder.closedSet[n].j);
  }

  let newRow = setting_saveFile.addRow();
  newRow.setString('id', 'lastCheckedNode');
  newRow.setString('set_i', lastCheckedNode.i);
  newRow.setString('set_j', lastCheckedNode.j);

  saveTable(openSet_saveFile, 'openSet', 'csv');
  saveTable(closedSet_saveFile, 'closedSet', 'csv');
  saveTable(setting_saveFile, 'setSet', 'csv');
  console.log(setting_saveFile);
}


function loadMap() {
  //openSet
  console.log("openSet");
  console.log(openSet_saveFile);
  console.log(openSet_saveFile.getRowCount());
  for (let n = 0; n < openSet_saveFile.getRowCount(); n++) {
    let openset_i = openSet_saveFile.getNum(n, 'openset_i');
    let openset_j = openSet_saveFile.getNum(n, 'openset_j');
    // console.log("[" + n + "] : i " + i + ", j " + j);
    save_openSet[n] = gamemap.grid[openset_i][openset_j];
  }
  //closedSet
  console.log("closedSet");
  console.log(closedSet_saveFile);
  console.log(closedSet_saveFile.getRowCount());
  for (let n = 0; n < closedSet_saveFile.getRowCount(); n++) {
    let closedset_i = closedSet_saveFile.getNum(n, 'closedset_i');
    let closedset_j = closedSet_saveFile.getNum(n, 'closedset_j');
    save_closedSet[n] = gamemap.grid[closedset_i][closedset_j];
  }
}


function brightSaved() {
  console.log("brightSaved");
  if (Bright2 != "") {
    let bright2_saveFile = new p5.Table();

    bright2_saveFile.addColumn('bright2_i');
    bright2_saveFile.addColumn('bright2_j');

    for (let n = 0; n < Bright2.length; n++) {
      bright2_saveFile.addRow();
      bright2_saveFile.setNum(n, 'bright2_i', Bright2[n].i);
      bright2_saveFile.setNum(n, 'bright2_j', Bright2[n].j);
    }

    saveTable(bright2_saveFile, 'bright', 'csv');
  } else console.log("Bright 없쯤.")
}

function mapSaved() {
  let map_saveFile = new p5.Table();

  map_saveFile.addColumn('map_i');
  map_saveFile.addColumn('map_j');
  map_saveFile.addColumn('previous_i');
  map_saveFile.addColumn('previous_j');

  let count = 0;
  for (let Row = 0; Row < mapData.getRowCount(); Row++) {
    for (let Col = 0; Col < mapData.getColumnCount(); Col++) {
      let node = pathfinder.map.grid[Row][Col];
      let previous_i = -1;
      let previous_j = -1;
      map_saveFile.addRow();
      map_saveFile.setNum(count, 'map_i', node.i);
      map_saveFile.setNum(count, 'map_j', node.j);
      if (node.previous != undefined) {
        previous_i = node.previous.i
        previous_j = node.previous.j
      }
      map_saveFile.setNum(count, 'previous_i', previous_i);
      map_saveFile.setNum(count, 'previous_j', previous_j);

      count++;
    }
  }
  saveTable(map_saveFile, 'Maaap', 'csv');
}