//숫자-숫자-숫자; 형식을 [숫자, 숫자, 숫자] 로 바꾸기.
function refine_graph(txtarr) {
	let result = [];
	for(let i in txtarr) {
		let temp = txtarr[i] // 'A-B-C:W;!@#$'
		result[i] = temp.split(';')[0].split(':'); // result[i] = ['A-B-C', '']
		result[i][0] = result[i][0].split('-'); // result[i][0] = ['A', 'B', 'C']
		//result[i][0][0] = result[i][0][0].substr(1); 
		//result[i][0][1] = result[i][0][1].substr(1);
		
	}
	return result;
}

function node_connecting(routearr) {
	for(let i in routearr) {
		if(routearr[i][0].length == 3) {
			let start_num = routearr[i][0][0];
			let end_num = routearr[i][0][1];
			let g_num = routearr[i][0][2];
			let isWarp = false;
			if(routearr[i][1] == 'w') isWarp = true;
			
			let starts = [];
			let ends = [];
			
			
			
			for(let z in pathfinder.map) {
				for(let j in pathfinder.map[z].nodes) {
						let node = pathfinder.map[z].nodes[j];
						if(node.__node == start_num) starts.push(node);
						if(node.__node == end_num) {
							ends.push(node);
							node.warp = isWarp;
						}
				}
				
				for(let j in starts) {
					for(let k in ends) {
						starts[j].node_neighbors.push([ends[k], g_num]);
					}
				}
			}
			
		} else {
			console.error("routearr 에러남! " + routearr[i]);
		}
		
	}
}

function toggleNodeSearch() {
  nodeSearch = !nodeSearch;
	mapGraphic = [];
}

//콘솔에 치기 귀찮을 때 
//var gamemap2;
function tempF() {
	gamemap2 = new MyMap_School(map2, map2.getColumnCount(), map2.getRowCount(), 10, 100 + 730 * 1, 1000 * 0.4, 730 * 0.4, allowDiagonals, percentWalls, restartIndex);
	gamemaparr.push(gamemap2);
}

function neighborsChecked(C, P) {
	var neighbors = C.getNeighbors();
	if(neighbors.length == undefined) {
		let temp_nei = neighbors;
		neighbors = [];
		neighbors.push(temp_nei);
	}
	for (var i = 0; i < neighbors.length; i++) {
			var neighbor = neighbors[i];

			// Valid next spot?
			if (!P.closedSet.includes(neighbor)) {
					// Is this a better path than before?
					var tempG = C.g + P.Better_heuristic(neighbor, C, neighbor.Bright);

					// Is this a better path than before?
					if (!P.openSet.includes(neighbor)) {
							P.openSet.push(neighbor);
					} else if (tempG >= neighbor.g) {
							// No, it's not a better path
							continue;
					}

					neighbor.g = tempG;
					neighbor.h = P.Better_heuristic(neighbor, P.end, false);
					if (!allowDiagonals) {
							neighbor.vh = P.visualDist(neighbor, P.end);
					}
					neighbor.f = neighbor.g + neighbor.h;
					neighbor.previous = C;
			}
	}
}