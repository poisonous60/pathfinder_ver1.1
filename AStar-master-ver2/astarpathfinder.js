
function AStarPathFinder(map, start, end, allowDiagonals) {
    this.map = map;
    this.lastCheckedNode = start;
    this.openSet = [];
    // openSet starts with beginning node only
    this.openSet.push(start)
	
    this.closedSet = [];
    this.start = start;
    this.end = end;
    this.allowDiagonals = allowDiagonals;
    //This function returns a measure of aesthetic preference for
    //use when ordering the openSet. It is used to prioritise
    //between equal standard heuristic scores. It can therefore
    //be anything you like without affecting the ability to find
    //a minimum cost path.

    this.visualDist = function(a, b) {
        return dist(a.i, a.j, b.i, b.j);
    }

    // An educated guess of how far it is between two points

    this.heuristic = function(a, b) {
        var d;
        if (allowDiagonals) {
            d = dist(a.i, a.j, b.i, b.j);
        } else {
            d = abs(a.i - b.i) + abs(a.j - b.j);
        }
        return d;
    }
    this.Better_heuristic = function(a, b, bright) {
        var d;
        if (allowDiagonals) {
            d = dist(a.i, a.j, b.i, b.j);
        } else {
            d = abs(a.i - b.i) + abs(a.j - b.j);
        }
        if(bright == 4 && a.i - b.i > 0) d *= __down_slope_mul;
				if(bright == 4 && a.i - b.i < 0) d *= __up_slope_mul;
				if(bright == 3) d *= __stair_mul;
				if(bright == 2) d *= __stair_mul;
        return d;
    }
		this.node_heuristic = function(a, b) {
        var d;
				/*
        if (allowDiagonals) {
            d = dist(a.i, a.j, b.i, b.j);
        } else {
            d = abs(a.i - b.i) + abs(a.j - b.j);
        }
				*/
        return d;
    }

    // Function to delete element from the array
    this.removeFromArray = function(arr, elt) {
        // Could use indexOf here instead to be more efficient
        for (var i = arr.length - 1; i >= 0; i--) {
            if (arr[i] == elt) {
                arr.splice(i, 1);
            }
        }
    }

    //Run one finding step.
    //returns 0 if search ongoing
    //returns 1 if goal reached
    //returns -1 if no solution
    this.step = function() {
			//노드 탐색
				if(nodeSearch) {
					if (this.openSet.length > 0) {
						var current = null;
						//openSet 중 current 고르기(이건 그냥 완전탐색해도 시간 남아돌 것 같은데
						//지금은 A* 적용 안하고 그냥 합니다...
						var winner = 0;
						
						current = this.openSet[winner];
						this.lastCheckedNode = current;
						if (current === this.end) {
								console.log("DONE!");
								return 1;
						}
						//current를 closeSet에 넣기
						this.removeFromArray(this.openSet, current);
						this.closedSet.push(current);
						
						//current의 neighbors, g, h, f값 계산, openSet 넣고. g값 더 작으면 previous 바꾸기. return 0;
						var neighbors = current.getNodeNeighbors();
						for (var i = 0; i < neighbors.length; i++) {
							//neighbor[0]이 spot이고, neighbor[1]에는 거리값 숫자 들어있어요.
							var neighbor = neighbors[i];
							// Valid next spot?
							if (!this.closedSet.includes(neighbor[0])) {
									// Is this a better path than before?
									var tempG = current.g + parseInt(neighbor[1]);

									// Is this a better path than before?
									if (!this.openSet.includes(neighbor[0])) {
											this.openSet.push(neighbor[0]);
									} else if (tempG >= neighbor[0].g) {
											// No, it's not a better path
											continue;
									}
									
									neighbor[0].g = tempG;
									//neighbor.h = this.Better_heuristic(neighbor, this.end, false);
									neighbor[0].h = 0;
									neighbor[0].f = neighbor[0].g + neighbor[0].h;
									neighbor[0].previous = current;
							}
							
						}
						return 0;
						// Uh oh, no solution
					} else {
						console.log('no solution');
						return -1;
					}
					
				//맵 탐색
				} else {
						if (this.openSet.length > 0) {
						var current = null;
						
						if(__hard_search != null) {
							current = __hard_search;
							__hard_search = null;
						} else {
							// Best next option
							var winner = 0;
							for (var i = 1; i < this.openSet.length; i++) {
									if (this.openSet[i].f < this.openSet[winner].f) {
											winner = i;
									}
									//if we have a tie according to the standard heuristic
									if (this.openSet[i].f == this.openSet[winner].f) {
											//Prefer to explore options with longer known paths (closer to goal)
											if (this.openSet[i].g > this.openSet[winner].g) {
													winner = i;
											}
											//if we're using Manhattan distances then also break ties
											//of the known distance measure by using the visual heuristic.
											//This ensures that the search concentrates on routes that look
											//more direct. This makes no difference to the actual path distance
											//but improves the look for things like games or more closely
											//approximates the real shortest path if using grid sampled data for
											//planning natural paths.
											if (!this.allowDiagonals) {
													if (this.openSet[i].g == this.openSet[winner].g &&
															this.openSet[i].vh < this.openSet[winner].vh) {
															winner = i;
													}
											}
									}
							}
							current = this.openSet[winner];
						}						
						
						this.lastCheckedNode = current;

						// Did I finish?
						if (current === this.end) {
								console.log("DONE!");
								return 1;
						}

						// Best option moves from openSet to closedSet
						this.removeFromArray(this.openSet, current);
						this.closedSet.push(current);

						// Check all the neighbors
						var neighbors = current.getNeighbors();
						if(neighbors.length == undefined) {
							let temp_nei = neighbors;
							neighbors = [];
							neighbors.push(temp_nei);
						}
						for (var i = 0; i < neighbors.length; i++) {
								var neighbor = neighbors[i];

								// Valid next spot?
								if (!this.closedSet.includes(neighbor)) {
										// Is this a better path than before?
										var tempG = current.g + this.Better_heuristic(neighbor, current, neighbor.Bright);

										// Is this a better path than before?
										if (!this.openSet.includes(neighbor)) {
												this.openSet.push(neighbor);
										} else if (tempG >= neighbor.g) {
												// No, it's not a better path
												continue;
										}

										neighbor.g = tempG;
										neighbor.h = this.Better_heuristic(neighbor, this.end, false);
										if (!allowDiagonals) {
												neighbor.vh = this.visualDist(neighbor, this.end);
										}
										neighbor.f = neighbor.g + neighbor.h;
										neighbor.previous = current;
								}

						}
						return 0;
						// Uh oh, no solution
					} else {
							console.log('no solution');
							return -1;
					}

				}
    }
}
