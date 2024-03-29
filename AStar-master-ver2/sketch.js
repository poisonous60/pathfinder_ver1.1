var __stair_mul = 2;
var __up_slope_mul = 1.3;
var __down_slope_mul = 1.1;

var img1;
var graph;
var map1; //school_outdoor.csv 받기
var map2; //school_main.csv 받기
// var file;
var openSet_saveFile;
var closedSet_saveFile;
var setting_saveFile;
var map_saveFile;
var bright2_saveFile;

var __mapOn = false;
var __saveOn = false;
var __errorOn = false;
var __click_mode = 0; //0 : 아무것도 안함, 1 : 출발점수정, 2: 도착점수정,  3: 벽 지우기/만들기, 4: 오픈셋, 클로즈셋, 보통 체인지, 5:Bright(안됨)


// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Part 1: https://youtu.be/aKYlikFAV4k
// Part 2: https://youtu.be/EaZxUCWAjb0
// Part 3: https://youtu.be/jwRT4PCT6RU

// 2 options for drawing the walls
// option 0 = corn maze
// option 1 = castle
// (Both look cool)
var drawingOption = 1;

//Set to true to allow diagonal moves
//This will also switch from Manhattan to Euclidean distance measures
var allowDiagonals = false;

// can the path go between the corners of two
// walls located diagonally next to each other
var canPassThroughCorners = true;

var cols = 200;
var rows = 200;

// % of cells that are walls
var percentWalls = (allowDiagonals ? (canPassThroughCorners ? 0.4 : 0.3) : 0.2);

// Timer
var t;
var timings = {};


var gamemap;
var gamemap2;
var uiElements = [];
var paused = true;
var pathfinder;
var status = "";
var stepsAllowed = 0;
var runPauseButton;

var start;
var end;
var restartIndex = 0;
var nodeSearch = false;


function initaliseSearchExample() {
	
  mapGraphic = [];
  //gamemap = new MapFactory().getMap(cols, rows, 10, 100, 1498, 1098, allowDiagonals, percentWalls); /////***** y 값 10->100
	
	if(restartIndex == 0) {
		let gamemaparr = [];
		gamemap = new MyMap_School(map1, cols, rows, 10, 100, 1000 * 1, 730 * 1, allowDiagonals, percentWalls, restartIndex++);
		gamemaparr.push(gamemap);
		
		gamemap2 = new MyMap_School(map2, map2.getColumnCount(), map2.getRowCount(), 10, 100 + 730 * 1, 1000 * 0.4, 730 * 0.4, allowDiagonals, percentWalls, restartIndex++);
		gamemaparr.push(gamemap2);
		
		
		start = gamemap.grid[1][1];
		end = gamemap.grid[rows - 2][cols - 3];
		start.wall = false;
		end.wall = false;
		
		pathfinder = new AStarPathFinder(gamemaparr, start, end, allowDiagonals);
	} else {
		pathfinder.openSet = [];
		pathfinder.closedSet = [];
		pathfinder.start = start;
		pathfinder.end = end;
		pathfinder.openSet.push(start)
		pathfinder.lastCheckedNode = start;
	}

	restartIndex++;
}

function preload() {
  if (__mapOn == true) img1 = loadImage('https://i.imgur.com/8YN5Dmi.png');
  map1 = loadTable('map/data/mapdata_school/school_outdoor.csv', 'csv');
	map2 = loadTable('map/data/mapdata_school/school_main.csv', 'csv');
  if (__saveOn == true) openSet_saveFile = loadTable('saveFile/openSet.csv', 'csv', 'header');
  if (__saveOn == true) closedSet_saveFile = loadTable('saveFile/closedSet.csv', 'csv', 'header');
  if (__saveOn == true) map_saveFile = loadTable('saveFile/Maaap.csv', 'csv', 'header');
	graph = loadStrings('map/data/mapdata_school/school_outdoor.txt');
}

function setup() {

  if (__mapOn == true) console.log("map1.length : " + map1.length);


  startTime();
  createCanvas(1600, 2000);
  console.log('A*');

  rows = map1.getRowCount();
  cols = map1.getColumnCount();
  console.error("rows " + rows + "cols " + cols);
	console.error("rows " + map2.getRowCount() + "cols " + map2.getColumnCount());
  initaliseSearchExample();
	
	runPauseButton = new Button("run", 10, 10, 50, 30, runpause);
	uiElements.push(runPauseButton);
	uiElements.push(new Button("step", 70, 10, 50, 30, step));
	uiElements.push(new Button("restart", 130, 10, 50, 30, restart));
	uiElements.push(new SettingBox("AllowDiag", 200, 20, allowDiagonals, toggleDiagonals));
	uiElements.push(new SettingBox("nodeSearch", 150, 75, nodeSearch, toggleNodeSearch));
	uiElements.push(new Button("saved", 250, 60, 50, 30, saved));
	uiElements.push(new Button("brightSaved", 300, 60, 80, 30, brightSaved));
	uiElements.push(new Button("mapSaved", 300, 30, 70, 30, mapSaved)) //전체맵의 previous 포함.		
	
	
	graph = refine_graph(graph);
	console.error(graph);
	node_connecting(graph);
	
	
	
  recordTime("Setup");
  
}

function draw() {

  searchStep();
	
  drawed();
}

