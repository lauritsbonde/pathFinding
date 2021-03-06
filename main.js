
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

    maze = [];
    rows = 10;
    cols = 10;
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
    setField("start", Math.floor(Math.random() * rows), Math.floor(Math.random() * cols));
    setField("end", Math.floor(Math.random() * rows), Math.floor(Math.random() * cols));
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
    let items = ["Choose startfield", "Edit blocks", "Choose endfield", "Finish"];
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
    if(current == 0 && startNode != null){
        maze[startNode[0]][startNode[1]].startNode = false;
        startFieldPicked = false;
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
            but.setAttribute("type", "button");
            if(buttons[i] == "Finish"){
                but.setAttribute("onclick", "finishMap()");
                but.setAttribute("class", "btn btn-success");
            } else {
                but.setAttribute("onclick", "createCheckList(1)");
                but.setAttribute("class", "btn btn-danger");
            }
            let butTxt = document.createTextNode(buttons[i]);
            but.appendChild(butTxt);
            but.setAttribute("style", "display: inline-block; vertical-align: middle;");
            document.getElementById("checklistCon").appendChild(but);
        }
        repaint();
    }
}


function repaint(){
    document.getElementById("maze").innerHTML = "";
    let table = document.createElement("table");
    table.setAttribute("style", "height: 100%; width: 100%; padding:0px; border-collapse: collapse; border: 2px solid black;");
    table.setAttribute("class", "table");
    for(let i = 0; i < maze.length; i++){
        let row = document.createElement("tr");
        row.setAttribute("style", "width:100vw; heigth: "+100/cols+" vh");
        for(let j = 0; j < maze[i].length; j++){
            let td = document.createElement("td");
            td.setAttribute("id", ""+i+","+j+"");
            let style = "";
            if(!startFieldPicked && !maze[i][j].startNode){
                td.setAttribute("onclick", "setField('start',"+i+", "+j+")")
            } else if(pickEndfield && !maze[i][j].startNode){
                td.setAttribute("onclick", "setField('end',"+i+", "+j+")");
            } else {
                td.setAttribute("onclick", "blockToggle("+i+","+j+")");
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
        let distHeader = document.createElement("p");
        distHeader.setAttribute("style", "font-size: 10%; margin: 0px; padding: 0px;");
        let distTxt = document.createTextNode(maze[row][col].dist);
        distHeader.appendChild(distTxt);
        distHeader.setAttribute("style", "color: black;");
        field.appendChild(distHeader);
    }
}


function blockToggle(row, col){
    if(blockEdit){
        maze[row][col].blocked = !maze[row][col].blocked;
        if(maze[row][col].blocked){
            maze[row][col].backgroundColor = "black";
        } else {
            maze[row][col].backgroundColor = "white";
        }
        repaintCell(row, col);
    }
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

function newSpeed(){
    let speed = document.getElementById("speedRange").value;
    document.getElementById("secsBetween").innerHTML = speed;
    secsBetweenTicks = speed;
}


function error(e){
    console.log("Error: " + e);
}