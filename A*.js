

let starConnected = [];
let starRunning;

function aStar(){
    let row = startNode[0];
    let col = startNode[1];

    findNeighbours(row,col);
    print();
    starRunning = window.setInterval(()=>{
        move();
    },secsBetweenTicks)
}

function print(){
    console.log("\n --- new --- ");
    let string = "";
    for(let i = 0; i < starConnected.length; i++){
        string += starConnected[i].pos  + " " + starConnected[i].heuristic + " | ";
    }
    console.log(string);
}

function move(){
    let node = popMin();
    node.backgroundColor = "green";
    node.visitied = true;
    repaintCell(node.pos[0], node.pos[1]);
    if(findNeighbours(node.pos[0], node.pos[1])){
        clearInterval(starRunning);
    }
}

function findNeighbours(row, col){
    if(col > 0){
        let west = maze[row][col-1];
        if(!west.blocked && !west.connected && !west.startNode && !west.endNode){
            starConnected.push(west);
            floatUp(starConnected.length-1);
        } else if(west.endNode){
            return true;
        }
    } 
    if(row > 0){
        let north = maze[row-1][col];
        if(!north.blocked && !north.connected && !north.startNode && !north.endNode){
            starConnected.push(north);
            floatUp(starConnected.length-1);
        } else if(north.endNode){
            return true;
        }
    }
    if(col < maze[0].length-1){
        let east = maze[row][col+1];
        if(!east.blocked && !east.connected && !east.startNode && !east.endNode){
            starConnected.push(east);
            floatUp(starConnected.length-1);
        } else if(east.endNode){
            return true;
        }
    }
    if(row < maze.length-1){
        let south = maze[row+1][col];
        if(!south.blocked && !south.connected && !south.startNode && !south.endNode){
            starConnected.push(south);
            floatUp(starConnected.length-1);
        } else if(south.endNode){
            return true;
        }
    }
}

function floatUp(index){
    starConnected[index].connected = true;
    starConnected[index].calcTieHeuristic(calcDirPen(starConnected[index].pos));
    while(index > 0 && starConnected[index].heuristic <= starConnected[Math.floor((index-1)/2)].heuristic){
        if(starConnected[index].heuristic == starConnected[Math.floor((index-1)/2)].heuristic){
            starConnected[index].calcTieHeuristic(calcDirPen(starConnected[index].pos));
            //starConnected[Math.floor((index-1)/2)].calcTieHeuristic(calcDirPen(starConnected[Math.floor((index-1)/2)].pos));
        }
        if(starConnected[index].heuristic < starConnected[Math.floor((index-1)/2)].heuristic){
            exchange(index, Math.floor((index-1)/2));
            index = Math.floor((index-1)/2);
        } else {
            break;
        }
    }
}

function exchange(first, second){
    let temp = starConnected[first];
    starConnected[first] = starConnected[second];
    starConnected[second] = temp;
}

function popMin(){
    let min = starConnected[0];
    exchange(0, starConnected.length-1);
    starConnected.splice(starConnected.length-1);
    sinkDown(0);
    return min;
}

function sinkDown(index){
    while(index < starConnected.length){
        let leftChild = index*2+1;
        let rightChild = index*2+2;
        let lowestChild;
        if(leftChild < starConnected.length && rightChild < starConnected.length){
            if(starConnected[leftChild].heuristic == starConnected[rightChild].heuristic){
                starConnected[leftChild].calcTieHeuristic(calcDirPen(starConnected[leftChild].pos));
                starConnected[rightChild].calcTieHeuristic(calcDirPen(starConnected[rightChild].pos));
            }
            lowestChild = starConnected[leftChild].heuristic < starConnected[rightChild].heuristic ? leftChild : rightChild;
        } else if(leftChild < starConnected.length && rightChild >= starConnected.length){
            lowestChild = leftChild;
        } else {
            break;
        }
        exchange(index, lowestChild);
        index = lowestChild;
    }
}



function calcDirPen(nextNode){
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