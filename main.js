
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

let pickStartField = false;
let startFieldPicked = false;
let startNode = null;

let pickEndfield = false;
let endfieldPicked = false;
let endField = null;

//how is either manual or automatic for generating maze
function makeMaze(how){
    document.getElementById("maze").innerHTML = "";

    maze = [];
    rows = 30;
    cols = 30;
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
        let randstart = [Math.floor(Math.random() * rows),Math.floor(Math.random() * cols)];
        maze[randstart[0]][randstart[1]].startNode = true;
        maze[randstart[0]][randstart[1]].backgroundColor = "rgb(60, 255, 0)";
        startFieldPicked = true;
        startNode = randstart;

        let randEnd = [Math.floor(Math.random() * rows),Math.floor(Math.random() * cols)]
        maze[randEnd[0]][randEnd[1]].endNode = true;
        maze[randEnd[0]][randEnd[1]].backgroundColor = "red";
        endfieldPicked = true;
        endField = randEnd;
        newMaze = false;
    }
    if(how == "closed" || how == "open"){
        createCheckList(1);
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
    let items = ["Choose startfield", "Edit blocks", "Choose endfield"];
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

    let butli = document.createElement("li");
    let finBut = document.createElement("button");
    finBut.setAttribute("type", "button");
    finBut.setAttribute("id", "finishbut");
    finBut.setAttribute("onclick", "finishMap()");
    let finTxt = document.createTextNode("Finish");
    finBut.appendChild(finTxt);

    let clearBut = document.createElement("button");
    clearBut.setAttribute("type", "button");
    clearBut.setAttribute("id", "clearBut");
    clearBut.setAttribute("onclick", "clearMap()");

    let clearTxt = document.createTextNode("Clear");
    clearBut.appendChild(clearTxt);

    ul.appendChild(finBut);
    ul.appendChild(clearBut);
    document.getElementById("checklistCon").appendChild(ul);

    if(current == 0 && startNode != null){
        maze[startNode[0]][startNode[1]].startNode = false;
        startFieldPicked = false;
        blockEdit = false;
        pickEndfield = false;
        pickStartField = true;
    } else if(current == 1 && startNode != null){
        pickStartField = false;
        blockEdit = true;
        pickEndfield = false;
    } else if(current == 2 && startNode != null){
        pickStartField = false;
        blockEdit = false;
        pickEndfield = true;
    } else if(current == 3 && startNode != null && endField != null){
        pickStartField = false;
        blockEdit = false;
        pickEndfield = false;
    }
}

let mouseDown = false;
function mouseDownToggle(row, col){
    mouseDown = !mouseDown;
    if(pickEndfield){
        setField("end", row, col);
    } else if (pickStartField){
        setField("start", row, col);
    } else {
        setField("block", row, col);
    }
}

function mouseDownFalse(){
    mouseDown = false;
}
function mouseOver(type, row, col){
    if(mouseDown){
        setField(type, row, col);
    }
}

function repaint(){
    document.getElementById("maze").innerHTML = "";
    let table = document.createElement("table");
    table.setAttribute("class", "table");
    table.setAttribute("onmouseleave", "mouseDownFalse()");
    for(let i = 0; i < maze.length; i++){
        let row = document.createElement("tr");
        for(let j = 0; j < maze[i].length; j++){
            let td = document.createElement("td");
            td.setAttribute("id", ""+i+","+j+"");
            td.setAttribute("onmousedown", "mouseDownToggle("+i+","+j+")");
            td.setAttribute("onmouseup", "mouseDownFalse()");
            td.setAttribute("onmouseover", "mouseOver('block', "+i+","+j+")");
            if(maze[i][j].startNode){
                td.setAttribute("class", "startNode");
            } else if (maze[i][j].endNode){
                td.setAttribute("class", "endNode");
            }
            td.setAttribute("style", "background-color:" +maze[i][j].backgroundColor+";");
            row.appendChild(td);
        }
        table.appendChild(row);
    }
    document.getElementById("maze").appendChild(table);
}

function repaintCell(row, col){
    let field = document.getElementById(""+row+","+col+"");
    field.innerHTML = "";
    if(maze[row][col].dist != 0 && maze[row][col].dist != Infinity){
        let distHeader = document.createElement("p");
        distHeader.setAttribute("class", "distTxt");
        let distTxt = document.createTextNode(maze[row][col].dist);
        distHeader.appendChild(distTxt);
        field.appendChild(distHeader);
    }
    field.setAttribute("style", "background-color:" +maze[row][col].backgroundColor+";");
}

function setField(type, row, col){
    if(type == "start"){
        if(startNode == null){
            startNode = [row, col];
        } else {
            maze[startNode[0]][startNode[1]].startNode = false;
            maze[startNode[0]][startNode[1]].backgroundColor = "white";
            repaintCell(startNode[0], startNode[1]);
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
            repaintCell(endField[0], endField[1]);
            endField = [row, col];
        }
        maze[row][col].endNode = true;
        maze[row][col].blocked = false;
        maze[row][col].backgroundColor = "rgb(247, 70, 70)";
        endfieldPicked = true;
        createCheckList(1);
    } else if(type == "block" && blockEdit && mouseDown && !maze[row][col].startNode && !maze[row][col].endNode){
        maze[row][col].blocked = !maze[row][col].blocked;
        if(maze[row][col].blocked){
            maze[row][col].backgroundColor = "black";
        } else {
            maze[row][col].backgroundColor = "white";
        }
    }  else if(type == "block" && !blockEdit && pickStartField){
        setField("start", row, col);
    } else if(type == "block" && !blockEdit && pickEndfield){
        setField("end", row, col);
    } else {
        error("Wrong type of field");
    }
    repaintCell(row, col);
}

let pathFindings = ["Dijkstra", "Double Djikstra", "A*"];
let secsBetweenTicks = 250;
let activePath = "Dijkstra";
let speedSelected = 4;
function finishMap(){
    let pathCon;
    if(document.getElementById("pathCon") == null){
        pathCon = document.createElement("div");
    } else {
        pathCon = document.getElementById("pathCon");
        pathCon.innerHTML = "";
    }
    pathCon.setAttribute("id", "pathCon");

    let paths = document.createElement("div");
    paths.setAttribute("id", "paths")
    for(let i = 0; i < pathFindings.length; i++){
        let path = document.createElement("p");
        path.setAttribute("onclick", "changePath("+i+")");
        if(activePath == pathFindings[i]){
            path.setAttribute("class", "activeStage");
        } else {
            path.setAttribute("class", "otherStage");
        }
        let labelTxt = document.createTextNode(pathFindings[i]);
        path.appendChild(labelTxt);
        paths.appendChild(path);
    }
    
    pathCon.append(paths);

    let speed = document.createElement("div");
    speed.setAttribute("id", "speed");
    let speedP = document.createElement("p");
    let speedTxt = document.createTextNode("Speed: ");
    speedP.appendChild(speedTxt);
    speed.appendChild(speedP);
    let speeds = ["Very slow", "Slow", "Medium", "High", "Very High"];
    let speedsValue = [400, 200, 100, 50, 25];
    let select = document.createElement("select");
    select.setAttribute("id", "speedSelector");
    select.setAttribute("onchange", "changeSpeedSelected()");
    for(let i = 0; i < speeds.length; i++){
        let option = document.createElement("option");
        option.setAttribute("value", speedsValue[i]);
        if(i == speedSelected){
            option.setAttribute("selected", "selected");
        }
        let fieldTxt = document.createTextNode(speeds[i]);
        option.appendChild(fieldTxt);
        select.appendChild(option);
    }
    speed.appendChild(select);

    document.getElementById("checklistCon").appendChild(pathCon);
    
    let runbut = document.createElement("button");
    runbut.setAttribute("id", "runBut");
    let runTxt = document.createTextNode("Run!");
    runbut.appendChild(runTxt);
    runbut.setAttribute("onclick", "runPath()");

    document.getElementById("pathCon").appendChild(speed);
    document.getElementById("pathCon").appendChild(runbut);
}

function changeSpeedSelected(){
    let val = document.getElementById("speedSelector").value;
    speedSelected = val == 400 ? 0 : val == 200 ? 1 : val == 100 ? 2 : val == 50 ? 3 : val == 25 ? 4 : 4;
}

function clearMap(){
    let loadImg = document.createElement("img");
    loadImg.setAttribute("src", "loader.gif");
    loadImg.setAttribute("style", "position: absolute; left: 45vh; top: 35vh; height: 200px; width: 200px; z-index: 3; border-radius: 4px;");
    loadImg.setAttribute("id", "loader");
    document.getElementById("maze").appendChild(loadImg);
    let loops = 0;
    var added = setInterval(function(){
        if(document.getElementById("loader") != null){
            loops++;
            if(loops > 5){
                for(let i = 0; i < maze.length; i++){
                    for(let j = 0; j < maze[i].length; j++){
                        if(!maze[i][j].startNode && !maze[i][j].endNode){
                            maze[i][j].blocked = false;
                            maze[i][j].backgroundColor = "white";
                            maze[i][j].dist = 0;
                            maze[i][j].prev = [null,null];
                            maze[i][j].dist = 0;
                            maze[i][j].visited = false;
                            maze[i][j].connected = false;
                            maze[i][j].connectedTo = "";
                            repaintCell(i, j);
                        }
                    }
                }
                clearInterval(added);
                document.getElementById("loader").remove();
            }
        }
    },10);
}

function changePath(id){
    if(id == 0) {
        activePath = "Dijkstra";
    } else if(id == 1){
        activePath = "Double Djikstra";
    } else if(id == 2){
        activePath = "A*";
    }
    finishMap();
}


function runPath(){
    blockEdit = false;
    if(activePath == "Dijkstra"){
        secsBetweenTicks = document.getElementById("speedSelector").value;
        djikstraPath(false);
    }
    if(activePath == "Double Djikstra"){
        secsBetweenTicks = document.getElementById("speedSelector").value;
        djikstraPath(true);
    }

}

function error(e){
    console.log("Error: " + e);
}