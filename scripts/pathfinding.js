import { worldMap, testIsPassable } from "./index.js" 

//takes location and returns route to other location in form of list of locations to move to
export function breadthFirstPathfinding(startLocation, goalLocation) {
    let frontier = [startLocation];
    let visited = [];
    let breakOutOfLoop=false;
    while (frontier.length) {
        let currentNeighbors = getNeighborLocations(frontier[0]);
        for (let i = 0; i < currentNeighbors.length; i++) {
            if (
                visited.indexOf(currentNeighbors[i]) === -1 
                && frontier.indexOf(currentNeighbors[i]) === -1 
                && testIsPassable(currentNeighbors[i].x,currentNeighbors[i].y)
                ) {
                frontier.push(currentNeighbors[i]);
                currentNeighbors[i].cameFrom = frontier[0];
                if(currentNeighbors[i]===goalLocation){
                    breakOutOfLoop=true;
                    break;
                }
            }
        }
        if(breakOutOfLoop){
            console.log(visited);
            break;
        }
        visited.push(frontier.shift());
    }
    let path=[goalLocation];
    startLocation.cameFrom=[];

    //BEWARE INFINITE LOOP\
    let loopCount=0;

    while(true){
        loopCount++;
        if(loopCount>300){
            alert("infinite loop in pathfinding!")
            break;
        }
        if(path[path.length-1].cameFrom){
            path.push(path[path.length-1].cameFrom)
        } else { 
            path.reverse()
            path.shift()
            path.shift()
            return path;
        }
    }
}

//Accepts the location object, returns location objects
export function getNeighborLocations(location) {
    let coordsToTest = [
        [location.x + 1, location.y],
        [location.x - 1, location.y],
        [location.x, location.y + 1],
        [location.x, location.y - 1]
    ]
    let neighbors = [];
    for (let i = 0; i < coordsToTest.length; i++) {
        if (worldMap[coordsToTest[i][0]] && worldMap[coordsToTest[i][0]][coordsToTest[i][1]]) {
            neighbors.push(worldMap[coordsToTest[i][0]][coordsToTest[i][1]]);
        }
    }
    return neighbors;
}