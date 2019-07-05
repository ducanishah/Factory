import {testIsPassable, getNeighborLocations} from "./worldMap.js"

export function breadthFirstPathfindingToFrom(startLocation, goalLocation) {
    let frontier = [startLocation];
    let visited = [];
    let breakOutOfLoop = false;
    while (frontier.length) {
        let currentNeighbors = getNeighborLocations(frontier[0]);
        for (let i = 0; i < currentNeighbors.length; i++) {
            if (
                visited.indexOf(currentNeighbors[i]) === -1
                && frontier.indexOf(currentNeighbors[i]) === -1
                && testIsPassable(currentNeighbors[i])
            ) {
                frontier.push(currentNeighbors[i]);
                currentNeighbors[i].cameFrom = frontier[0];
                if (currentNeighbors[i] === goalLocation) {
                    breakOutOfLoop = true;
                    break;
                }
            }
        }
        if (breakOutOfLoop) {
            break;
        }
        visited.push(frontier.shift());
    }
    let path = [goalLocation];
    startLocation.cameFrom = [];

    //BEWARE INFINITE LOOP\
    let loopCount = 0;

    while (true) {
        loopCount++;
        if (loopCount > 300) {
            alert("infinite loop in pathfinding!")
            break;
        }
        if (path[path.length - 1].cameFrom) {
            path.push(path[path.length - 1].cameFrom)
        } else {
            path.reverse()
            path.shift()
            path.shift()
            return path;
        }
    }
}
