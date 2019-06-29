import {myActorHolder} from "./index.js"
import {actorPlace} from "./worldMap.js"
import {MoveSet, Move,TestMove,ShiftOneSpace} from "./actions.js"
//constructor parameters: worldMap, x value, y value, display priority, name, symbol
//modify displayString on inheritees(?) to change what is displayed in display window
export class Actor {
    constructor(worldMap,xSet, ySet, dispPrior = 0, myName, mySymbol) {
        //IMPORTANT: must push self-containing properties to this list or displaying of actor will lead to infinite recursion!
        this.propertiesThatShouldNotBeDisplayed=["location", "propertiesThatShouldNotBeDisplayed", "name", "displayString", "mapSymbol"]
        this.name = myName;
        this.mapSymbol = mySymbol;
        this.displayPriority = dispPrior;
        this.location;
        this.alive=true;
        this.displayString=`${this.name} (${this.mapSymbol})`
        myActorHolder.aliveActors.push(this);
        actorPlace(worldMap,this,xSet,ySet);
    }

}

export class ActorHolder {
    constructor() {
        this.aliveActors = [];
    }
}

export class Player extends Actor {
    constructor(setX, setY) {
        let dispPrior=2;
        super(setX, setY, dispPrior, "player", "P");
    }
}
//Goblins seek out goblins of opposing teams, and destroy themselves if they share a space in update OR preupdate
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
    }
}

export class TestObject extends Actor{
    constructor(worldMap,setX,setY){
        let dispPrior=2;
        super(worldMap,setX,setY,dispPrior,"testObject","tO");
        this.testProps={
            one:"one",
            two:true,
            three:3
        }
        this.moveSet=new MoveSet(this);
        this.moveSet.add(ShiftOneSpace);
    }
}
