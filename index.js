document.addEventListener("DOMContentLoaded", main);

//TODOS IN COMMENTS
class Person {
    constructor () {
        this.alive=true;
    }
}
class Player {
    constructor(){

    }
}

var worldMap;

function main () {
    // console.log(new Person().alive);
    initializeWorldMap();
    document.getElementById("outerWrapper").append(createWorldMap());
}









function initializeWorldMap() {
    worldMap=[];
    for(let i=0; i<16; i++) {
        worldMap[i]= new Array(16).fill("",0,16);
    }
}

function createWorldMap() {
    let myTable=document.createElement("table");
    let myRows=new Array(16);
    for (let i=0;i<myRows.length;i++){
        myRows[i]=document.createElement("tr")
    }
    worldMap.forEach((subArray,subArrayIndex)=>{
        subArray.forEach((item,itemIndex)=>{
            let tempData=document.createElement("td");
            tempData.innerHTML=`(${subArrayIndex},${itemIndex})`;
            myRows[itemIndex].append(tempData);
        });
    });  
    myTable.append(...myRows)
    return myTable;
}

