
let maze = [];

let rows, cols;
let newMaze = true;

//true == wall;
function Node(state){
    this.left = state;
    this.top = state;
    this.right = state;
    this.bottom = state;
    this.startNode = false;
    this.endNode = false;
    this.next = [null,null];
    this.backgroundColor = white;
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

let wallEdit = false;

function createCheckList(current){
    document.getElementById("checklistCon").innerHTML = "";
    let ul = document.createElement("ul");
    ul.setAttribute("id", "checklist");
    ul.setAttribute("style", "list-style-type: none;");
    let items = ["Choose startfield", "Edit walls", "Choose endfield", "Finish"];
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
        wallEdit = false;
        pickEndfield = false;
        repaint();
    } else if(current == 1 && startNode != null){
        wallEdit = true;
        pickEndfield = false;
        repaint();
    } else if(current == 2 && startNode != null){
        wallEdit = false;
        pickEndfield = true;
        repaint();
    } else if(current == 3 && startNode != null && endField != null){
        wallEdit = false;
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
            if(maze[i][j].startNode){
                style += "background-color: rgb(60, 255, 0);";
            }
            if(maze[i][j].endNode){
                style += "background-color: rgb(247, 70, 70);";
            }
            if(maze[i][j].left){
                style += "border-left: 4px solid black; ";
            }
            if(maze[i][j].top){
                style += "border-top: 4px solid black; ";
            }
            if(maze[i][j].right){
                style += "border-right: 4px solid black; ";
            }
            if(maze[i][j].bottom){
                style += "border-bottom: 4px solid black; ";
            }
            if(wallEdit){
                if(startFieldPicked && j < maze[i].length-1){
                    let button = document.createElement("button");
                    button.setAttribute("style", "position: absolute; right: -11%; width: 20%; height: 90%; top: 5%; z-index: 3;");
                    if(maze[i][j].right){
                        button.setAttribute("class", "removeWall");
                    } else {
                        button.setAttribute("class", "addWall");
                    }
                    button.setAttribute("onclick", "toggleWall('right', "+i+", "+j+")");
                    td.appendChild(button);
                }
                if(startFieldPicked && i < maze.length-1){
                    let button = document.createElement("button");
                    button.setAttribute("style", "position: absolute; bottom: -10%; width: 90%; height: 20%; left: 5%; z-index: 3;");
                    if(maze[i][j].bottom){
                        button.setAttribute("class", "removeWall");
                    } else {
                        button.setAttribute("class", "addWall");
                    }
                    button.setAttribute("onclick", "toggleWall('bottom', "+i+", "+j+")");
                    td.appendChild(button);
                }
            }
            style += "width: " + 100 / maze[i].length + "%;";
            style += "height: " + 100 / maze.length + "%;";
            td.setAttribute("style", style + "position: relative;");
            row.appendChild(td);
        }
        table.appendChild(row);
    }
    document.getElementById("maze").appendChild(table);
}

function toggleWall(wall, row, col){
    if(wall == "right"){
        maze[row][col].right = !maze[row][col].right;
        maze[row][col+1].left = !maze[row][col+1].left;
    } else if(wall = "bottom"){
        maze[row][col].bottom = !maze[row][col].bottom;
        maze[row+1][col].top = !maze[row+1][col].top;
    } else {
        error("not valid side");
    }
    repaint();
}

function setField(type, row, col){
    if(type == "start"){
        if(startNode == null){
            startNode = [row, col];
        } else {
            maze[startNode[0]][startNode[1]].startNode = false;
            startNode = [row, col];
        }
        maze[row][col].startNode = true;
        startFieldPicked = true;
        createCheckList(1);
    } else if(type == "end") {
        if(endField == null){
            endField = [row, col];
        } else {
            maze[endField[0]][endField[1]].endNode = false;
            endField = [row, col];
        }
        maze[row][col].endNode = true;
        endfieldPicked = true;
        createCheckList(3);
    } else {
        error("Wrong type of field");
    }
    repaint();
}

let pathFindings = ["Dijkstra", "A*", "sample"];
function finishMap(){
    let pathCon = document.createElement("div");
    for(let i = 0; i < pathFindings.length; i++){
        let input = document.createElement("input");
        input.setAttribute("type", "checkbox");
        input.setAttribute("name", pathFindings[i]);
        input.setAttribute("id", pathFindings[i]);
        
        let label = document.createElement("label");
        let labelTxt = document.createTextNode(pathFindings[i]);
        label.appendChild(labelTxt);
        label.setAttribute("for", pathFindings[i]);

        pathCon.append(input, label);
    }
    
    let runbut = document.createElement("button");
    let runTxt = document.createTextNode("Run!");
    runbut.appendChild(runTxt);
    runbut.setAttribute("onclick", "runPath()");
    pathCon.appendChild(runbut);

    document.getElementById("checklistCon").appendChild(pathCon);
}

function runPath(){
    let runDjikstra = document.getElementById("Dijkstra").checked;
    let runAstart = document.getElementById("A*").checked;
    let runSample = document.getElementById("sample").checked;

    if(runDjikstra){
        djikstraPath();
    }

}

function djikstraPath(){
    let row = startNode[0];
    let col = startNode[1];
    let startSide = 
    !maze[row][col].left ? [row, col-1] : 
    !maze[row][col].top ? [row-1, col] :  
    !maze[row][col].right ? [row, col+1] : 
    !maze[row][col].bottom ? [row+1, col] : 
    "error";

    if(starteSide == "error"){
        error("Start is blocked");
    } else {

    }
    
}

function error(e){
    console.log("Error: " + e);
}