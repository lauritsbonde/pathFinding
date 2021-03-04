
let maze = [];

let rows, cols;
let newMaze = true;

//true == wall;
let Node = class{
    constructor(state){
        //walls
        this.left = state;
        this.top = state;
        this.right = state;
        this.bottom = state;

        this.blocked = state;
        
        //start end
        this.startNode = false;
        this.endNode = false;

        //pathfinding
        this.prev = [null,null];
        this.dist = 0;
        this.visited = false;
        this.connected = false;
        this.connectedTo = "";

        //misc
        this.backgroundColor = "white";
    }
}

let startFieldPicked = false;
let startNode = null;

let pickEndfield = false;
let endfieldPicked = false;
let endField = null;

//how is either manual or automatic for generating maze
function makeMaze(how){
    document.getElementById("maze").innerHTML = "";

    let inrows = document.getElementById("rows").value;
    let incols = document.getElementById("cols").value;
    maze = [];
    rows = inrows;
    cols = incols;
    newMaze = true;
    
    if(newMaze){
        startFieldPicked = false;
        startNode = null;
        for(let i = 0; i < rows; i++){
            let mazeRow = [];
            for(let j = 0; j < cols; j++){
                if(how == "open"){
                    mazeRow.push(new Node(false));
                } else {
                    mazeRow.push(new Node(true));
                }
            }
            maze.push(mazeRow);
        }
        newMaze = false;
    }
    if(how == "closed" || how == "open"){
        createCheckList(0);
        repaint();  
    }
}

function automatic(){

}

let blockEdit = false;

function createCheckList(current){
    document.getElementById("checklistCon").innerHTML = "";
    let ul = document.createElement("ul");
    ul.setAttribute("id", "checklist");
    ul.setAttribute("style", "list-style-type: none;");
    let items = ["Choose startfield", "Edit blocks", "Choose endfield", "Finish"];
    for(let i = 0; i < items.length; i++){
        let li = document.createElement("li");
        let liTxt = document.createTextNode(items[i]);
        if(current == i){
            li.setAttribute("class", "activeStage");
        } else {
            li.setAttribute("class", "otherStage");
            li.setAttribute("onclick", "createCheckList("+i+")");
        }

        li.appendChild(liTxt);
        ul.appendChild(li);
    }
    document.getElementById("checklistCon").appendChild(ul);
    if(current == 0 && startNode != null){
        maze[startNode[0]][startNode[1]].startNode = false;
        startFieldPicked = false;
        startNode = null;
        blockEdit = false;
        pickEndfield = false;
        repaint();
    } else if(current == 1 && startNode != null){
        blockEdit = true;
        pickEndfield = false;
        repaint();
    } else if(current == 2 && startNode != null){
        blockEdit = false;
        pickEndfield = true;
        repaint();
    } else if(current == 3 && startNode != null && endField != null){
        blockEdit = false;
        pickEndfield = false;
        let buttons = ["Finish", "Edit"];
        for(let i = 0; i < buttons.length; i++){
            let but = document.createElement("button");
            if(buttons[i] == "Finish"){
                but.setAttribute("onclick", "finishMap()");
            } else {
                but.setAttribute("onclick", "createCheckList(1)");
            }
            let butTxt = document.createTextNode(buttons[i]);
            but.appendChild(butTxt);
            but.setAttribute("style", "display: inline-block;");
            document.getElementById("checklistCon").appendChild(but);
        }
        repaint();
    }
}


function repaint(){
    document.getElementById("maze").innerHTML = "";
    let table = document.createElement("table");
    table.setAttribute("style", "height: 100%; width: 100%; padding:0px; border-collapse: collapse; border: 2px solid black;");
    for(let i = 0; i < maze.length; i++){
        let row = document.createElement("tr");
        row.setAttribute("style", "width:100vw; heigth: "+100/cols+" vh");
        for(let j = 0; j < maze[i].length; j++){
            let td = document.createElement("td");
            td.setAttribute("id", ""+i+","+j+"");
            let style = "";
            if(!startFieldPicked && !maze[i][j].startNode){
                let button = document.createElement("button");
                button.setAttribute("style", "position: absolute; left: 10%; width: 80%; height: 80%; top: 10%;");
                button.setAttribute("class", "startFieldButtons");
                button.setAttribute("onclick", "setField('start',"+i+", "+j+")");
                td.appendChild(button);
            }
            if(pickEndfield && !maze[i][j].startNode){
                let button = document.createElement("button");
                button.setAttribute("style", "position: absolute; left: 10%; width: 80%; height: 80%; top: 10%;");
                button.setAttribute("class", "fieldButtons");
                button.setAttribute("onclick", "setField('end',"+i+", "+j+")");
                td.appendChild(button);
            }

            if(blockEdit){
                if(startFieldPicked && j < maze[i].length){
                    let button = document.createElement("button");
                    button.setAttribute("style", "position: absolute; left: 0.5%; width: 99%; height: 99%; top: .5%; z-index: 1;");
                    if(!maze[i][j].blocked){
                        button.setAttribute("class", "block");
                    } else {
                        button.setAttribute("class", "unblock");
                    }
                    button.setAttribute("onclick", "blockToggle("+i+", "+j+")");
                    td.appendChild(button);
                }
            }
            if(maze[i][j].dist != 0 && maze[i][j].dist != Infinity){
                let distHeader = document.createElement("h3");
                let distTxt = document.createTextNode(maze[i][j].dist);
                distHeader.appendChild(distTxt);
                distHeader.setAttribute("style", "font-size: 10%; margin: 0px; padding: 0px;");
                td.appendChild(distHeader);
            }

            style += "border: 2px solid rgba(29, 140, 204, 0.829);";
            style += "width: " + 100 / maze[i].length + "%;";
            style += "height: " + 100 / maze.length + "%;";
            style += "background-color: " + maze[i][j].backgroundColor + ";";
            style += "text-align: center;";
            style += "overflow: hidden;"
            td.setAttribute("style", style + "position: relative;");
            row.appendChild(td);
        }
        table.appendChild(row);
    }
    document.getElementById("maze").appendChild(table);
}

function repaintCell(row, col){
    let field = document.getElementById(""+row+","+col+"");
    field.innerHTML = "";
    let style = "";
    style += "border: 2px solid rgba(29, 140, 204, 0.829);";
    style += "width: " + 100 / maze[row].length + "%;";
    style += "height: " + 100 / maze.length + "%;";
    style += "background-color: " + maze[row][col].backgroundColor + ";";
    style += "text-align: center;";
    style += "position: relative;";
    style += "overflow: hidden;"
    field.style = style;
    if(maze[row][col].dist != 0 && maze[row][col].dist != Infinity){
        let distHeader = document.createElement("h5");
        distHeader.setAttribute("style", "font-size: 10%; margin: 0px; padding: 0px;");
        let distTxt = document.createTextNode(maze[row][col].dist);
        distHeader.appendChild(distTxt);
        distHeader.setAttribute("style", "color: black;");
        field.appendChild(distHeader);
    }
}


function blockToggle(row, col){
    maze[row][col].blocked = !maze[row][col].blocked;
    if(maze[row][col].blocked){
        maze[row][col].backgroundColor = "black";
    } else {
        maze[row][col].backgroundColor = "white";
    }
    repaintCell(row, col);
}

function setField(type, row, col){
    if(type == "start"){
        if(startNode == null){
            startNode = [row, col];
        } else {
            maze[startNode[0]][startNode[1]].startNode = false;
            maze[startNode[0]][startNode[1]].backgroundColor = "white";
            startNode = [row, col];
        }
        maze[row][col].startNode = true;
        maze[row][col].blocked = false;
        maze[row][col].backgroundColor = "rgb(60, 255, 0)";
        startFieldPicked = true;
        createCheckList(1);
    } else if(type == "end") {
        if(endField == null){
            endField = [row, col];
        } else {
            maze[endField[0]][endField[1]].endNode = false;
            maze[endField[0]][endField[1]].backgroundColor = "white";
            endField = [row, col];
        }
        maze[row][col].endNode = true;
        maze[row][col].blocked = false;
        maze[row][col].backgroundColor = "rgb(247, 70, 70)";
        endfieldPicked = true;
        createCheckList(3);
    } else {
        error("Wrong type of field");
    }
    repaintCell(row, col);
}

let pathFindings = ["Dijkstra", "Double Djikstra", "A*", "sample"];
let secsBetweenTicks = 250;
function finishMap(){
    let pathCon = document.createElement("div");
    for(let i = 0; i < pathFindings.length; i++){
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", pathFindings[i].replace(" ", ""));
        input.setAttribute("id", pathFindings[i].replace(" ", ""));
        
        let label = document.createElement("label");
        let labelTxt = document.createTextNode(pathFindings[i]);
        label.appendChild(labelTxt);
        label.setAttribute("for", pathFindings[i].replace(" ", ""));

        pathCon.append(input, label);
    }

    let range = document.createElement("input");
    range.setAttribute("type", "range");
    range.setAttribute("id", "speedRange");
    range.setAttribute("name", "speedRange");
    range.setAttribute("min", "50");
    range.setAttribute("max", "1000");
    range.setAttribute("onchange", "newSpeed()");
    range.setAttribute("value", secsBetweenTicks);
    range.setAttribute("style", "display: block;");
    let rangelbl = document.createElement("label");
    rangelbl.setAttribute("style", "display: block;");
    let rangeTxt = document.createTextNode("Milliseconds between ticks: ");
    let span = document.createElement("span");
    span.setAttribute("id", "secsBetween");
    let spanTxt = document.createTextNode(secsBetweenTicks)
    span.appendChild(spanTxt);
    rangelbl.appendChild(rangeTxt);
    rangelbl.appendChild(span);
    rangelbl.setAttribute("for", "speedRange");

    pathCon.append(rangelbl, range);

    
    let runbut = document.createElement("button");
    let runTxt = document.createTextNode("Run!");
    runbut.appendChild(runTxt);
    runbut.setAttribute("onclick", "runPath()");
    pathCon.appendChild(runbut);

    document.getElementById("checklistCon").appendChild(pathCon);
}

function newSpeed(){
    let speed = document.getElementById("speedRange").value;
    document.getElementById("secsBetween").innerHTML = speed;
    secsBetweenTicks = speed;
}

function runPath(){
    let runDjikstra = document.getElementById("Dijkstra").checked;
    let runDoubleDjikstra = document.getElementById("DoubleDjikstra").checked;
    let runAstart = document.getElementById("A*").checked;
    let runSample = document.getElementById("sample").checked;

    if(runDjikstra){
        djikstraPath(false);
    }
    if(runDoubleDjikstra){
        djikstraPath(true);
    }

}

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
        endConnected = neighbours(0, endConnected, endrow, endcol);
    }

    let connected = [];
    let visited = [];
    connected = neighbours(0, connected, row, col);
    running = window.setInterval(function(){
        let lowest = findLowestDist(connected); //returns object with all the information lowestdist, lowestdisnode and lowestdistindex
        let endLowest;

        maze[lowest.lowestDistNode[0]][lowest.lowestDistNode[1]].backgroundColor = "green";
        maze[lowest.lowestDistNode[0]][lowest.lowestDistNode[1]].dist = lowest.lowestDist;
        maze[lowest.lowestDistNode[0]][lowest.lowestDistNode[1]].visited = true;
        visited.push([lowest.lowestDistNode[0], lowest.lowestDistNode[1]]);
        connected.splice(lowest.lowestDistIndex, 1);
        connected = neighbours(maze[lowest.lowestDistNode[0]][lowest.lowestDistNode[1]].dist, connected, lowest.lowestDistNode[0], lowest.lowestDistNode[1], "start");
        unexplored.splice(unexplored.indexOf(lowest.lowestDistNode), 1);

        if(doublePath){
            endLowest = findLowestDist(endConnected);
            maze[endLowest.lowestDistNode[0]][endLowest.lowestDistNode[1]].backgroundColor = "rgb(219, 111, 111)";
            maze[endLowest.lowestDistNode[0]][endLowest.lowestDistNode[1]].dist = endLowest.lowestDist;
            maze[endLowest.lowestDistNode[0]][endLowest.lowestDistNode[1]].visited = true;
            endVisited.push([endLowest.lowestDistNode[0], endLowest.lowestDistNode[1]]);
            endConnected.splice(endLowest.lowestDistIndex, 1);
            endConnected = neighbours(maze[endLowest.lowestDistNode[0]][endLowest.lowestDistNode[1]].dist, endConnected, endLowest.lowestDistNode[0], endLowest.lowestDistNode[1], "end");
            endUnexplored.splice(unexplored.indexOf(endLowest.lowestDistNode), 1);
        }
        if(connected.length == 0 && !double || connected.length == 0 && endConnected.length == 0){
            clearInterval(running);
            if(maze[lowest.lowestDistNode[0]][lowest.lowestDistNode[1]].endNode){
                found(lowest.lowestDistNode);
            }
        } else if(maze[lowest.lowestDistNode[0]][lowest.lowestDistNode[1]].endNode){
            clearInterval(running);
            found(lowest.lowestDistNode);
        }

        repaintCell(lowest.lowestDistNode[0], lowest.lowestDistNode[1]);
        if(doublePath){
            repaintCell(endLowest.lowestDistNode[0], endLowest.lowestDistNode[1]);
        }
    },secsBetweenTicks)
}

function findLowestDist(connected){
    let lowestDist = Infinity;
    let lowestDistNode = undefined;
    let lowestDistIndex = undefined;
    for(let i = 0; i < connected.length; i++){
        //calculating the manhatten distance = the nondiagonal steps to the square
        if(maze[connected[i][0]][connected[i][1]].dist < lowestDist){
            lowestDist = maze[connected[i][0]][connected[i][1]].dist;
            lowestDistNode = connected[i];
            lowestDistIndex = i;
        }
    }
    return {lowestDist: lowestDist, lowestDistNode: lowestDistNode, lowestDistIndex: lowestDistIndex};
}

function neighbours(distance, connected, row, col, beginningNode){
    if(col > 0){
        if(!maze[row][col-1].blocked && !maze[row][col-1].startNode && !maze[row][col-1].endNode && !maze[row][col-1].visited && !maze[row][col-1].connected){
            connected.push([row, col-1]);
            maze[row][col-1].connected = true;
            maze[row][col-1].dist = distance+1;
            maze[row][col-1].prev = [row, col];
            maze[row][col-1].connectedTo = beginningNode;
        } else if(!maze[row][col-1].blocked && !maze[row][col-1].startNode && !maze[row][col-1].endNode && maze[row][col-1].visited && maze[row][col-1].connectedTo != beginningNode){
            if(beginningNode == "start" && maze[row][col-1].connectedTo == "end" || beginningNode == "end" && maze[row][col-1].connectedTo == "start"){
                clearInterval(running);
                found([row, col-1]);
                found([row, col]);
                console.log("1 " + beginningNode);
                return false;
            }
        }
    }
    if(row > 0){
        if(!maze[row-1][col].blocked && !maze[row-1][col].startNode && !maze[row-1][col].endNode && !maze[row-1][col].visited && !maze[row-1][col].connected){
            connected.push([row-1, col]);
            maze[row-1][col].connected = true;
            maze[row-1][col].dist = distance+1;
            maze[row-1][col].prev = [row, col];
            maze[row-1][col].connectedTo = beginningNode;
        } else if(!maze[row-1][col].blocked && !maze[row-1][col].startNode && !maze[row-1][col].endNode && maze[row-1][col].visited && maze[row-1][col].connectedTo != beginningNode){
            if(beginningNode == "start" && maze[row-1][col].connectedTo == "end" || beginningNode == "end" && maze[row-1][col].connectedTo == "start"){
                clearInterval(running);
                found([row-1, col]);
                found([row, col]);
                console.log("2 " + beginningNode);
                return false;
            }
        }
    }
    if(col < maze[0].length-1){
        if(!maze[row][col+1].blocked && !maze[row][col+1].startNode && !maze[row][col+1].endNode && !maze[row][col+1].visited && !maze[row][col+1].connected){
            connected.push([row, col+1]);
            maze[row][col+1].connected = true;
            maze[row][col+1].dist = distance+1;
            maze[row][col+1].prev = [row, col];
            maze[row][col+1].connectedTo = beginningNode;
        } else if(!maze[row][col+1].blocked && !maze[row][col+1].startNode && !maze[row][col+1].endNode && maze[row][col+1].visited && maze[row][col+1].connectedTo != beginningNode){
            if(beginningNode == "start" && maze[row][col+1].connectedTo == "end" || beginningNode == "end" && maze[row][col+1].connectedTo == "start"){
                clearInterval(running);
                found([row, col+1]);
                found([row, col]);
                console.log("3 " + beginningNode);
                return false;
            }
        }
    }
    if(row < maze.length-1){
        if(!maze[row+1][col].blocked && !maze[row+1][col].startNode && !maze[row+1][col].endNode && !maze[row+1][col].visited && !maze[row+1][col].connected){
            connected.push([row+1, col]);
            maze[row+1][col].connected = true;
            maze[row+1][col].dist = distance+1;
            maze[row+1][col].prev = [row, col];
            maze[row+1][col].connectedTo = beginningNode;
        } else if(!maze[row+1][col].blocked && !maze[row+1][col].startNode && !maze[row+1][col].endNode && maze[row+1][col].visited){
            if(beginningNode == "start" && maze[row+1][col].connectedTo == "end" || beginningNode == "end" && maze[row+1][col].connectedTo == "start"){
                clearInterval(running);
                found([row+1, col]);
                found([row, col]);
                console.log("4 " + beginningNode);
                return false;
            }
        }
    }

    return connected;
}

function found(node){
    maze[node[0]][node[1]].backgroundColor = "yellow";
    console.log(maze[node[0]][node[1]]);
    console.log(node)
    repaintCell(node[0],node[1]);
    let ints = 0;
    let prev = maze[node[0]][node[1]].prev;
    while(prev[0] != null || prev[1] != null){
        if(!maze[prev[0]][prev[1]].startNode  && !maze[prev[0]][prev[1]].endNode){
            console.log(node);
            maze[prev[0]][prev[1]].backgroundColor = "yellow";
            repaintCell(prev[0], prev[1]);
        }
        prev = maze[prev[0]][prev[1]].prev;
    }
}


function error(e){
    console.log("Error: " + e);
}