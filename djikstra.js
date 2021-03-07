let running;

//doublePath is a boolean, false = from startnode, true = from both startnode and endnode
function djikstraPath(doublePath){
    let row = startNode[0];
    let col = startNode[1];
    let endrow = endField[0];
    let endcol = endField[1];

    let startSide = !maze[row][col].left ? [row, col-1] : 
    !maze[row][col].top ? [row-1, col] :  
    !maze[row][col].right ? [row, col+1] : 
    !maze[row][col].bottom ? [row+1, col] : 
    "error";
    
    let unexplored = [];
    let endUnexplored = [];
    for(let i = 0; i < maze.length; i++){
        for(let j = 0; j < maze[i].length; j++){
            if(!maze[i][j].startNode && !maze[i][j].blocked){
                maze[i][j].dist = Infinity;
                unexplored.push([[i],[j]]);
                if(doublePath){
                    endUnexplored.push([[i],[j]]);
                }
            }
        }
    }

    let endConnected = [];
    let endVisited = [];
    if(doublePath){
        endConnected = neighbours(0, endConnected, endrow, endcol, "end");
    }

    let connected = [];
    let visited = [];
    connected = neighbours(0, connected, row, col, "start");
    running = window.setInterval(function(){
        let endLowest;

        maze[connected[0][0]][connected[0][1]].backgroundColor = "green";
        maze[connected[0][0]][connected[0][1]].visited = true;
        visited.push([connected[0][0], connected[0][1]]);
        connected = neighbours(maze[connected[0][0]][connected[0][1]].dist, connected, connected[0][0], connected[0][1], "start");
        unexplored.splice(unexplored.indexOf(connected[0]), 1);

        let check = checkNeigbours(connected[0][0], connected[0][1], "start");

        repaintCell(connected[0][0], connected[0][1]);

        if(doublePath && check == false){
            maze[endConnected[0][0]][endConnected[0][1]].backgroundColor = "rgb(219, 111, 111)";
            maze[endConnected[0][0]][endConnected[0][1]].visited = true;
            endVisited.push([endConnected[0][0], endConnected[0][1]]);
            endConnected = neighbours(maze[endConnected[0][0]][endConnected[0][1]].dist, endConnected, endConnected[0][0], endConnected[0][1], "end");
            endUnexplored.splice(unexplored.indexOf(endConnected[0]), 1);
            let endCheck = checkNeigbours(endConnected[0][0], endConnected[0][1], "end")
            if(endCheck != false){
                clearInterval(running);
                doubleFound([endConnected[0][0], endConnected[0][1]], endCheck);
            }
            repaintCell(endConnected[0][0], endConnected[0][1]);
        } else if (doublePath && check != false){
            clearInterval(running);
            doubleFound([connected[0][0], connected[0][1]], check);
        }
        if(connected.length == 0 && !double || connected.length == 0 && endConnected.length == 0){
            clearInterval(running);
            if(maze[connected[0][0]][connected[0][1]].endNode){
                found(connected[0]);
            }
        } 
        //this is for soloDjikstra
        if(checkNeighboursEnd(connected[0][0], connected[0][1]) && !doublePath){
            clearInterval(running);
            found(connected[0]);
        }
        connected.shift();
        if(doublePath){
            endConnected.shift();
        }
    },secsBetweenTicks)
}

function checkNeighboursEnd(row, col){
    if(col > 0){
        if(maze[row][col-1].endNode){
            return true;
        }
    } 
    if(row > 0){
        if(maze[row-1][col].endNode){
            return true;
        } 
    }
    if(col < maze[0].length-1){
        if(maze[row][col+1].endNode){
            return true;
        }
    }
    if(row < maze.length-1){
        if(maze[row+1][col].endNode){
            return true;
        }
    }
    return false;
}


function checkNeigbours(row, col, current){
    if(current == "start"){
        if(col > 0){
            if(maze[row][col-1].connectedTo == "end" && maze[row][col-1].visited && !maze[row][col-1].blocked){
                return [row, col-1];
            }
        } 
        if(row > 0){
            if(maze[row-1][col].connectedTo == "end" && maze[row-1][col].visited && !maze[row-1][col].blocked){
                return [row-1, col];
            } 
        }
        if(col < maze[0].length-1){
            if(maze[row][col+1].connectedTo == "end" && maze[row][col+1].visited && !maze[row][col+1].blocked){
                return [row, col+1];
            }
        }
        if(row < maze.length-1){
            if(maze[row+1][col].connectedTo == "end" && maze[row+1][col].visited && !maze[row+1][col].blocked){
                return [row+1, col];
            }
        }
    } else if(current == "end"){
        if(col > 0){
            if(maze[row][col-1].connectedTo == "start" && maze[row][col-1].visited && !maze[row][col-1].blocked){
                return [row, col-1];
            }
        } 
        if(row > 0){
            if(maze[row-1][col].connectedTo == "start" && maze[row-1][col].visited && !maze[row-1][col].blocked){
                return [row-1, col];
            } 
        }
        if(col < maze[0].length-1){
            if(maze[row][col+1].connectedTo == "start" && maze[row][col+1].visited && !maze[row][col+1].blocked){
                return [row, col+1];
            }
        }
        if(row < maze.length-1){
            if(maze[row+1][col].connectedTo == "start" && maze[row+1][col].visited && !maze[row+1][col].blocked){
                return [row+1, col];
            }
        }
    } else {
        return false;
    }
    return false;
}


function neighbours(distance, connected, row, col, beginningNode){
    if(col > 0){
        if(!maze[row][col-1].blocked && !maze[row][col-1].startNode && !maze[row][col-1].endNode && !maze[row][col-1].visited && !maze[row][col-1].connected){
            connected.push([row, col-1]);
            maze[row][col-1].connected = true;
            maze[row][col-1].dist = distance+1;
            maze[row][col-1].prev = [row, col];
            maze[row][col-1].connectedTo = beginningNode;
        }
    }
    if(row > 0){
        if(!maze[row-1][col].blocked && !maze[row-1][col].startNode && !maze[row-1][col].endNode && !maze[row-1][col].visited && !maze[row-1][col].connected){
            connected.push([row-1, col]);
            maze[row-1][col].connected = true;
            maze[row-1][col].dist = distance+1;
            maze[row-1][col].prev = [row, col];
            maze[row-1][col].connectedTo = beginningNode;
        }
    }
    if(col < maze[0].length-1){
        if(!maze[row][col+1].blocked && !maze[row][col+1].startNode && !maze[row][col+1].endNode && !maze[row][col+1].visited && !maze[row][col+1].connected){
            connected.push([row, col+1]);
            maze[row][col+1].connected = true;
            maze[row][col+1].dist = distance+1;
            maze[row][col+1].prev = [row, col];
            maze[row][col+1].connectedTo = beginningNode;
        }
    }
    if(row < maze.length-1){
        if(!maze[row+1][col].blocked && !maze[row+1][col].startNode && !maze[row+1][col].endNode && !maze[row+1][col].visited && !maze[row+1][col].connected){
            connected.push([row+1, col]);
            maze[row+1][col].connected = true;
            maze[row+1][col].dist = distance+1;
            maze[row+1][col].prev = [row, col];
            maze[row+1][col].connectedTo = beginningNode;
        }
    }

    return connected;
}

function found(node){
    maze[node[0]][node[1]].backgroundColor = "yellow";
    repaintCell(node[0],node[1]);
    let ints = 0;
    let prev = maze[node[0]][node[1]].prev;
    while(prev[0] != null || prev[1] != null){
        if(!maze[prev[0]][prev[1]].startNode  && !maze[prev[0]][prev[1]].endNode){
            maze[prev[0]][prev[1]].backgroundColor = "yellow";
            repaintCell(prev[0], prev[1]);
        }
        prev = maze[prev[0]][prev[1]].prev;
    }
}

function doubleFound(node, endnode){
    found(node);
    let dist = maze[node[0]][node[1]].dist + 1;
    let prev = [endnode[0], endnode[1]];

    while(prev[0] != null || prev[1] != null){
        if(!maze[prev[0]][prev[1]].startNode  && !maze[prev[0]][prev[1]].endNode){
            maze[prev[0]][prev[1]].dist = dist;
            dist++;
            maze[prev[0]][prev[1]].backgroundColor = "yellow";
            repaintCell(prev[0], prev[1]);
        }
        prev = maze[prev[0]][prev[1]].prev;
    }
}