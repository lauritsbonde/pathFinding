
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
    rows = 40;
    cols = 40;
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
    ul.setAttribute("style", "list-style-type: none; display: inline-block;");
    let items = ["Choose startfield", "Edit blocks", "Choose endfield"];
    for(let i = 0; i < items.length; i++){
        let li = document.createElement("li");
        let liTxt = document.createTextNode(items[i]);
        if(current == i){
            li.setAttribute("class", "activeStage card-text");
        } else {
            li.setAttribute("class", "otherStage card-text");
            li.setAttribute("onclick", "createCheckList("+i+")");
        }
        li.appendChild(liTxt);
        ul.appendChild(li);
    }
    document.getElementById("checklistCon").appendChild(ul);

    let finBut = document.createElement("button");
    finBut.setAttribute("type", "button");
    finBut.setAttribute("class", "btn btn-success");
    finBut.setAttribute("onclick", "finishMap()");
    let finTxt = document.createTextNode("Finish");
    finBut.appendChild(finTxt);

    document.getElementById("checklistCon").appendChild(finBut);

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


function repaint(){
    document.getElementById("maze").innerHTML = "";
    let table = document.createElement("table");
    table.setAttribute("class", "table");
    for(let i = 0; i < maze.length; i++){
        let row = document.createElement("tr");
        for(let j = 0; j < maze[i].length; j++){
            let td = document.createElement("td");
            td.setAttribute("id", ""+i+","+j+"");
            let style = "";
            if(!startFieldPicked && !maze[i][j].startNode){
                td.setAttribute("onclick", "setField('start',"+i+", "+j+")")
            } else if(pickEndfield && !maze[i][j].startNode){
                td.setAttribute("onclick", "setField('end',"+i+", "+j+")");
            } else {
                td.setAttribute("onclick", "setField('block', "+i+","+j+")");
            }

            style += "border: 2px solid rgba(29, 140, 204, 0.829);";
            style += "width: " + Math.round(document.getElementById("maze").offsetWidth / 30) + "px;";
            style += "height: " + Math.round(document.getElementById("maze").offsetHeight / 42) + "px;";
            style += "background-color: " + maze[i][j].backgroundColor + ";";
            style += "text-align: center;";
            style += "overflow: hidden;"
            style += "padding: 0px;";
            style += "margin: 0px;";
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
    style += "padding: 0px;";
    style += "margin: 0px;";
    field.style = style;
    if(maze[row][col].dist != 0 && maze[row][col].dist != Infinity){
        let distHeader = document.createElement("p");
        distHeader.setAttribute("style", "font-size: "+Math.floor(field.offsetHeight/3)+"px; margin: 0px; padding: 0px; vertical-align: middle;");
        let distTxt = document.createTextNode(maze[row][col].dist);
        distHeader.appendChild(distTxt);
        field.appendChild(distHeader);
    }
}

function setField(type, row, col){
    console.log(startNode + " " + endField);
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
    } else if(type == "block" && blockEdit){
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

let pathFindings = ["Dijkstra", "Double Djikstra", "A*", "sample"];
let secsBetweenTicks = 250;
function finishMap(){
    let pathCon;
    if(document.getElementById("pathCon") == null){
        pathCon = document.createElement("div");
    } else {
        pathCon = document.getElementById("pathCon");
        pathCon.innerHTML = "";
    }
    pathCon.setAttribute("id", "pathCon");
    pathCon.setAttribute("style", "display: inline-block; float: right;");
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


    document.getElementById("checklistCon").appendChild(pathCon);
    
    let runbut = document.createElement("button");
    let runTxt = document.createTextNode("Run!");
    runbut.appendChild(runTxt);
    runbut.setAttribute("onclick", "runPath()");
    runbut.setAttribute("style", "float: right; margin-right: 5%; display: inline-block;")
    document.getElementById("checklistCon").appendChild(runbut);

}
/* this does not work for zoomin and panning
let scrolling = false;
let scale = 1;
let side = 0;
function zoom(event){
    event.preventDefault();
    event.stopPropagation();
    //these two lines sets the boundries of the zoom
    let newscale = scale + event.wheelDeltaY/100;
    scale = Math.min(Math.max(1, newscale), 4);
    let style = document.getElementById("maze").style.transform;
    console.log(event.clientX + " " + event.clientY);
    if(event.wheelDeltaY != 0){
        document.getElementById("maze").style = "transform: scale("+scale+") translate("+-event.clientX/5+"px, "+-event.clientY/5+"px)";
    } else if (event.wheelDeltaX != 0 && scale > 1){
        let newSide = side + (event.wheelDeltaX/5);
        side = Math.min(Math.max(-scale*25, newSide), scale*25);
        document.getElementById("maze").style = "transform: translate("+side+", 0px) scale("+scale+")";
    }
}

const el = document.querySelector("#maze");
el.onwheel = zoom;
*/

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

function error(e){
    console.log("Error: " + e);
}