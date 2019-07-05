import {selectedActor, myWorldMap} from "./index.js"
import {actorPlace, updateWorldTable} from "./worldMap.js"
import {MoveSet, Move,TestMove,ShiftOneSpace} from "./moves.js"
import { displaySelectedActor } from "./helperScripts/inputsHandlers.js";
import {breadthFirstPathfindingToFrom,getAllActorsPathableToFrom} from "./pathfinding.js"
//constructor parameters: worldMap, x value, y value, display priority, name, symbol
//modify displayString on inheritees(?) to change what is displayed in display window
export class Actor {
    constructor(worldMap,xSet, ySet, dispPrior = 0, myName, mySymbol) {
        //IMPORTANT: must push self-containing properties to this list or displaying of actor will lead to infinite recursion!
        this.propertiesThatShouldNotBeDisplayed=["location", "mapParent", "propertiesThatShouldNotBeDisplayed", "name", "displayString", "mapSymbol"]
        this.name = myName;
        this.mapSymbol = mySymbol;
        this.displayPriority = dispPrior;
        this.location;
        this.alive=true;
        this.mapParent=worldMap;
        this.moveSet=new MoveSet(this);
        this.displayString=`${this.name} (${this.mapSymbol})`
        worldMap.actorHolder.aliveActors.push(this);
        actorPlace(worldMap,this,xSet,ySet);
    }
    //should be replaced in inheritees!
    autoQueue(){

    }
    destroy(){
        this.alive=false;
        if(this.location){
            if(selectedActor[0]===this){
                displaySelectedActor();
            }
            this.mapParent.actorHolder.aliveActors.splice(this.mapParent.actorHolder.aliveActors.indexOf(this),1);
            this.location.presentActors.splice(this.location.presentActors.indexOf(this),1);
            updateWorldTable(myWorldMap);
        }
    }
}
//autoQueue called here
export class ActorHolder {
    constructor() {
        this.aliveActors = [];
    }
    autoQueueMoves(){
        for(let i=0;i<this.aliveActors.length;i++){
            this.aliveActors[i].autoQueue();
        }
    }
}

export class Player extends Actor {
    constructor(setX, setY) {
        let dispPrior=2;
        super(setX, setY, dispPrior, "player", "P");
    }
}

export class Goblin extends Actor {
    constructor(worldMap, setX, setY) {
        let dispPrior=1;
        super(worldMap, setX, setY, dispPrior, "goblin", "g");

    }

}

export class Tree extends Actor {
    constructor(worldMap, setX, setY) {
        let dispPrior=0
        super(worldMap, setX, setY, dispPrior, "tree", "T");
        this.moveSet.add(TestMove)
    }
}

export class TestObject extends Actor{
    constructor(worldMap,setX,setY){
        let dispPrior=2;
        super(worldMap,setX,setY,dispPrior,"testObject","tO");
        this.moveSet.add(ShiftOneSpace);
        this.moveSet.add(TestMove);
    }
    autoQueue(){
        console.log(getAllActorsPathableToFrom(this))
        let firstStepOnPath=breadthFirstPathfindingToFrom(this.location,this.mapParent.map[0][0])[0];
        if(firstStepOnPath){
            this.moveSet.queue("Shift",{target:firstStepOnPath});
        }
    }
}

export class Wall extends Actor{
    constructor(worldMap,setX,setY){
        let dispPrior=-1;
        super(worldMap,setX,setY,dispPrior,"wall","W");
        this.isPassable=false;
    }
}