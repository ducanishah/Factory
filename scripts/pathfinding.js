import { testIsPassable, getNeighborLocations } from "./worldMap.js"

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
                
            ) {
                currentNeighbors[i].cameFrom=undefined;
                if(testIsPassable(currentNeighbors[i])){
                    frontier.push(currentNeighbors[i]);
                    currentNeighbors[i].cameFrom = frontier[0];
                    if (currentNeighbors[i] === goalLocation) {
                        breakOutOfLoop = true;
                        break;
                    }
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
            if (path.indexOf(startLocation) !== -1) {
                path.reverse()
                path.shift()
                path.shift()
                return path;
            } else {
                return false;
            }
        }
    }
}

export function getAllActorsPathableToFrom(actor) {
    let frontier = [actor.location];
    let visited = [];
    let actorList=[];
    while (frontier.length) {
        actorList.push(...frontier[0].presentActors);
        let currentNeighbors = getNeighborLocations(frontier[0]);
        for (let i = 0; i < currentNeighbors.length; i++) {
            if (
                visited.indexOf(currentNeighbors[i]) === -1
                && frontier.indexOf(currentNeighbors[i]) === -1
                
            ) {
                currentNeighbors[i].cameFrom=undefined;
                if(testIsPassable(currentNeighbors[i])){
                    frontier.push(currentNeighbors[i]);
                }
            }
        }
        visited.push(frontier.shift());
    }
    if(actorList.indexOf(actor)===-1){
        alert("The actor searching did not include origin actor! something is fucky!")
    }
    actorList.splice(actorList.indexOf(actor),1);
    return actorList;
}
//returns closest actor from list. if multiple, returns a random one
export function getClosestActorOfFrom(listOfActors,actor){
    let actorCoords=[actor.location.x,actor.location.y]
    let closestActors=[];
    let distToClosestActors=undefined;
    
    for(let i=0;i<listOfActors.length;i++){
        let currentCoords=[listOfActors[i].location.x,listOfActors[i].location.y];
        let distToActor=Math.abs(actorCoords[0]-currentCoords[0])+Math.abs(actorCoords[1]-currentCoords[1]);
        if(!distToClosestActors){
            closestActors.push(listOfActors[i]);
            distToClosestActors=distToActor;
        } else {
            if(distToActor<distToClosestActors){
                closestActors=[listOfActors[i]];
                distToClosestActors=distToActor;
            }
        }

    }
    if(closestActors.length=1){
        return closestActors[0];
    } else {
        return closestActors[Math.floor(Math.random()*closestActors.length)];
    }
}