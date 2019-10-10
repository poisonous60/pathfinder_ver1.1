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
    console.log('q : redraw');
		/*
    for (var i = 0; i < uiElements.length; i++) {
      uiElements[i].mouseClick(mouseX, mouseY);
      drawed();
    }
		*/
		mapGraphic = [];
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
    if (__click_mode > 15) {
      __click_mode = 0;
    }
  }
	if (key === 'l') {
    console.log('l : __click_mode change');
    __click_mode = prompt("__click_mode : "+"");
  }
  if (key === 'd') {
    console.log('d : drawPath()');
	path_swi = !path_swi;
	console.log("path_swi " + path_swi); 
	for(let z in pathfinder.map) {
		for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					let node = pathfinder.map[z].grid[r][c];
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

}
var mode7_lock;
var mode7_node;
// 0 : 아무 효과 없다
// 1 : 출발 지정 (openSet에 이미 넣어진 건 안 없어짐)
// 2 : 도착 지정
// 3 : 벽 온오프
// 4 : openSet -> closeSet -> nothing -> openSet ...
// 5 : Bright값 true (아무 효과 없음. 그냥 클릭해볼 때 씀)
// 6 : 누르면 빨간원 생김
// 7 : 이웃노드 강제로 바꿈
// 8 : 계단 온오프(Bright = 2)
// 9 : 콘솔에 이웃노드 파바바바ㅏ밝
// 10 : 노드 강제탐색. g값 계산 안되더라
// 11 : 경로 보여줌(LastCheckedNode 바꿈)
// 12 : 
// 13 : 
// 14 :
// 15 :

function mouseClicked() {
  for (let i = 0; i < uiElements.length; i++) {
    uiElements[i].mouseClick(mouseX, mouseY);
  }
  if (__click_mode != 0) {
		for(let z in pathfinder.map) {
			for (let mapY = 0; mapY < pathfinder.map[z].rows; mapY++) {
				for (let mapX = 0; mapX < pathfinder.map[z].cols; mapX++) {
					let click_node = pathfinder.map[z].grid[mapY][mapX].mouseClick_spot(mouseX, mouseY);
					let click_node_info = {"mapY" : mapY, "mapX" : mapX}
					if (click_node != null) {
						if (__click_mode == 1) {
							console.log("출발 위치 재설정");
							for (var i = 0; i < pathfinder.openSet.length; i++) {
								let node = pathfinder.openSet[i];
								if (node === start) {
									console.log("open -> close")
									pathfinder.openSet.splice(i, 1);
									pathfinder.closedSet.push(node)
									swi = true;
									break;
								}
							}
							pathfinder.start = click_node;
							start = click_node;
							pathfinder.openSet.push(click_node)
						} else if (__click_mode == 2) {
							console.log("도착 위치 재설정");
							pathfinder.end = click_node;
							end = click_node;
						} else if (__click_mode == 3) {
							console.log("벽토글");
							pathfinder.map[z].grid[mapY][mapX].wall = !pathfinder.map[z].grid[mapY][mapX].wall;
							console.log(pathfinder.map[z].grid[mapY][mapX].wall);
							mapGraphic = [];
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
								console.log("nothing -> open")
								pathfinder.openSet.push(click_node)
							}

						} else if (__click_mode == 5) {
							console.log("B.")
							click_node.Bright = true;

						} else if (__click_mode == 6) {
							console.log("BBBBright!!!!")
							Bright2.push(click_node);

						} else if (__click_mode == 7) {
							//var mode7_node; 전역변수로...
							if(mode7_lock == undefined || mode7_lock == 1) mode7_lock = 0;
							else mode7_lock++;
							
							console.error("mode7_lock " + mode7_lock)
							switch (mode7_lock) {
								case 0:
									mode7_node = click_node;
									console.log("selected.");
									break;
								case 1:
									console.log("changing....");
									mode7_node.neighbors = click_node;
									console.log("Maybe Okay");
									break;
								default:
									console.error("어 뭔가 에러떴어요.")
								
							}
							
						} else if (__click_mode == 8) {
							if(click_node.Bright == 2) {
								console.log("bright -> 0");
							click_node.Bright = 0;
							} else {
							console.log("bright -> 2");
							click_node.Bright = 2;
							}
							mapGraphic = [];
						} else if (__click_mode == 9) {
							console.log("Show your neighbors!");
							//drawed 부분에서 if문으로 처리했습니다.
						}	else if (__click_mode == 10) {
							console.log("Search this.");
							__hard_search = click_node;
							click_node.previous = pathfinder.lastCheckedNode;
							step();
						}	else if (__click_mode == 11) {
							console.log("change lastCheckedNode.");
							pathfinder.lastCheckedNode = click_node;
						}	else if (__click_mode == 15) {
							console.log(".");
						}
						
					}
				}
			}
		}
  }
}

function mouseReleased() {
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
	for(let z in pathfinder.map) {
		for (let Row = 0; Row < pathfinder.map[z].rows; Row++) {
			for (let Col = 0; Col < pathfinder.map[z].cols; Col++) {
				let node = pathfinder.map[z].grid[Row][Col];
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
  }
  saveTable(map_saveFile, 'Maaap', 'csv');
}