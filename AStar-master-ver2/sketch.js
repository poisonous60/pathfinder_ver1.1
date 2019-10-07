var __stair_mul = 2;

var img1;
var graph;
var mapData; //aFinal.csv 받기
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
var uiElements = [];
var paused = true;
var pathfinder;
var status = "";
var stepsAllowed = 0;
var runPauseButton;

var start;
var end;
var restartIndex = 0;


function initaliseSearchExample() {
	
  mapGraphic = null;
  //gamemap = new MapFactory().getMap(cols, rows, 10, 100, 1498, 1098, allowDiagonals, percentWalls); /////***** y 값 10->100
	
	if(restartIndex == 0) {
		gamemap = new MyMap_School(cols, rows, 10, 100, 1498, 1098, allowDiagonals, percentWalls, restartIndex);
		start = gamemap.grid[1][1];
		end = gamemap.grid[rows - 2][cols - 3];
		start.wall = false;
		end.wall = false;

		pathfinder = new AStarPathFinder(gamemap, start, end, allowDiagonals);
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
  if (__mapOn == true) img1 = loadImage('https://i.imgur.com/43qqEFX.png');
  mapData = loadTable('map/data/mapdata_school/aFinal.csv', 'csv');
  if (__saveOn == true) openSet_saveFile = loadTable('saveFile/openSet.csv', 'csv', 'header');
  if (__saveOn == true) closedSet_saveFile = loadTable('saveFile/closedSet.csv', 'csv', 'header');
  if (__saveOn == true) map_saveFile = loadTable('saveFile/Maaap.csv', 'csv', 'header');
	graph = loadStrings('map/data/mapdata_school/graph.txt');
}

function setup() {

  if (__mapOn == true) console.log("mapData.length : " + mapData.length);


  startTime();
  createCanvas(1600, 1300);
  console.log('A*');

  rows = mapData.getRowCount();
  cols = mapData.getColumnCount();
  console.error("rows " + rows + "cols " + cols);
  initaliseSearchExample();

  runPauseButton = new Button("run", 10, 10, 50, 30, runpause);
  uiElements.push(runPauseButton);
  uiElements.push(new Button("step", 70, 10, 50, 30, step));
  uiElements.push(new Button("restart", 130, 10, 50, 30, restart));
  uiElements.push(new SettingBox("AllowDiag", 200, 20, allowDiagonals, toggleDiagonals));
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

