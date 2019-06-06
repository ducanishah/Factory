document.addEventListener("DOMContentLoaded", main)

class Person {
    constructor () {
        this.alive=true;
    }
}

var worldMap;

function main () {
    // console.log(new Person().alive);
    initializeWorldMap();
    displayWorldMap();
}









function initializeWorldMap() {
    worldMap=[];
    for(var i=0; i<16; i++) {
        worldMap[i]= new Array(16);
    }
    // console.log(worldMap);
}

function displayWorldMap() {
    var myTable="<table><td>test</td></table>";
    document.getElementById("outerWrapper").innerHTML=myTable;
}
