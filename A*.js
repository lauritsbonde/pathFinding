
//should be a min-priority queue so that we can pop the closest to the endNode
//since they are sorted on the dist from start, and expected dist to endNode
let starConnected = [];
let starUnexplored = [];
let starRunning;
let lastField = [];
let lastDir = ""; //West, North, East, South

function aStar(){
    let row = startNode[0];
    let col = startNode[1];
    lastField = [row, col];
    
    for(let i = 0; i < maze.length; i++){
        for(let j = 0; j < maze[i].length; j++){
            if(!maze[i][j].startNode && !maze[i][j].blocked){
                maze[i][j].dist = Infinity;
                starUnexplored.push([[i,j]]);
            }
        }
    }

    let tester = 0;
    starRunning = window.setInterval(()=>{        
        //check the neighbours of the current node
        let state = findNeighbours(row, col);
        if(state == "done"){
            clearInterval(starRunning);
        } else {
            //deletemin - which is essentially pick the node with lowest dist to start combined with
            //lowest expected dist to endnode
            let field = move();

            row = field[0];
            col = field[1];
            lastField = [row, col];

            if(maze[row][col].endNode){
                clearInterval(starRunning);
            }
        }
        if(testMode){
            clearInterval(starRunning);
        }
    }, secsBetweenTicks)
}

function move(){
    let field = deleteMin();
    maze[field[0]][field[1]].backgroundColor = "green";
    maze[field[0]][field[1]].visited = true;
    maze[field[0]][field[1]].connected = true;
    repaintCell(field[0], field[1]);
    return field;
}

//currently using djikstra found function which does not highlight shortest route, but actual route
function findNeighbours(row, col){
    if(col > 0){
        if(!maze[row][col-1].startNode && !maze[row][col-1].endNode && !maze[row][col-1].blocked && !maze[row][col-1].visited && !maze[row][col-1].connected){
            maze[row][col-1].calcHeuristic(calcDirPen("W", [row, col-1]));
            maze[row][col-1].prev = lastField;
            if(!testMode) repaintCell(row,col-1);
            addToConnected(row, col-1);
            lastDir = "W";
        }  else if (maze[row][col-1].endNode){
            maze[row][col-1].prev = lastField;
            found([row, col]);
            return "done";
        }
    } 
    if(row > 0){
        if(!maze[row-1][col].startNode && !maze[row-1][col].endNode && !maze[row-1][col].blocked && !maze[row-1][col].visited && !maze[row-1][col].connected){
            maze[row-1][col].calcHeuristic(calcDirPen("N", [row-1,col]));
            maze[row-1][col].prev = lastField;
            if(!testMode) repaintCell(row-1,col);
            addToConnected(row-1, col);
            lastDir = "N";
        }  else if (maze[row-1][col].endNode){
            maze[row-1][col].prev = lastField;
            found([row,col]);
            return "done";
        }
    }
    if(col < maze[0].length-1){
        if(!maze[row][col+1].startNode && !maze[row][col+1].endNode && !maze[row][col+1].blocked && !maze[row][col+1].visited && !maze[row][col+1].connected){
            maze[row][col+1].calcHeuristic(calcDirPen("E", [row, col+1]));
            maze[row][col+1].prev = lastField;
            if(!testMode) repaintCell(row,col+1);
            addToConnected(row, col+1);
            lastDir = "E";
        } else if (maze[row][col+1].endNode){
            maze[row][col+1].prev = lastField;
            found([row, col]);
            return "done";
        }
    }
    if(row < maze.length-1){
        if(!maze[row+1][col].startNode && !maze[row+1][col].endNode && !maze[row+1][col].blocked && !maze[row+1][col].visited && !maze[row+1][col].connected){
            maze[row+1][col].calcHeuristic(calcDirPen("S", [row+1, col]));
            maze[row+1][col].prev = lastField;
            if(!testMode) repaintCell(row+1,col);
            addToConnected(row+1, col);
            lastDir = "S";
        } else if (maze[row+1][col].endNode){
            maze[row+1][col].prev = lastField;
            found([row, col]);
            return "done";
        }
    }
}

function calcDirPen(nextDir, nextNode){
    if(nextDir == lastDir){
        return 0;
    } else {
        //this is used to sort out ties of weights
        //i think this makes a "line" between the startfield and endfield, and then calculates how far off
        //that line the current node is, read more on:
        //http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
        dx1 = maze[nextNode[0]][nextNode[1]].pos[1] - endField[1];
        dy1 = maze[nextNode[0]][nextNode[1]].pos[0] - endField[0];
        dx2 = startNode[1] - endField[1];
        dy2 = startNode[0] - endField[0];
        cross = Math.abs(dx1*dy2 - dx2*dy1)
        return cross*0.001
    }
    return 0;
}

function addToConnected(row, col){
    starConnected.push([row, col]);
    maze[row][col].connected = true;
    floatUp(starConnected.length-1);
}

function deleteMin(){
    exchange(0, starConnected.length-1);
    let field = starConnected.splice(starConnected.length-1, 1);
    sinkDown(0);
    return field[0];
}

function exchange(first, second){
    let tempNode = starConnected[first];
    starConnected[first] = starConnected[second];
    starConnected[second] = tempNode;
}

function floatUp(index){
    while(index > 0 && maze[starConnected[index][0]][starConnected[index][1]].heuristic < maze[starConnected[Math.floor((index-1)/2)][0]][starConnected[Math.floor((index-1)/2)][1]].heuristic){
        exchange(index, Math.floor((index-1)/2));
        index = Math.floor((index-1) / 2);
    }
}

function sinkDown(index){
    while(index < starConnected.length){
        let left = starConnected[2*index+1];
        let right = starConnected[2*index+2];
        let smallestChild;
        if(left != undefined && right != undefined){
            smallestChild = 
            maze[left[0]][left[1]].heuristic > maze[right[0]][right[1]].heuristic ?
            2*index+2 : 2*index+1;
        } else if(left < starConnected.length){
            smallestChild = 2*index+1
        } else {
            break;
        }
        if(maze[starConnected[smallestChild][0]][starConnected[smallestChild][1]].heuristic >= maze[starConnected[index][0]][starConnected[index][1]].heuristic){
            break;
        }
        exchange(index, smallestChild);
        index = smallestChild;
    }
}


