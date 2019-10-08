//숫자-숫자-숫자; 형식을 [숫자, 숫자, 숫자] 로 바꾸기.
function refine_graph(txtarr) {
	let result = [];
	for(let i in txtarr) {
		let temp = txtarr[i]
		result[i] = temp.split(';')[0].split('-');
	}
	return result;
}

function node_connecting(routearr) {
	for(let i in routearr) {
		if(routearr[i].length == 3) {
			let start_num = routearr[i][0];
			let end_num = routearr[i][1];
			let g_num = routearr[i][2];
			let starts = [];
			let ends = [];
			
			for(let z in pathfinder.map) {
				for(let j in pathfinder.map[z].nodes) {
						let node = pathfinder.map[z].nodes[j];
						if(node.__node == start_num) starts.push(node);
						if(node.__node == end_num) ends.push(node);
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
	mapGraphic = null;
}

//콘솔에 치기 귀찮을 때 
var gamemap2;
function tempF() {
	gamemap2 = new MyMap_School(cols, rows, 10, 100 + 1098 * 0.5, 1498 * 0.5, 1098 * 0.5, allowDiagonals, percentWalls, restartIndex);
	pathfinder.map.push(gamemap2);
}