import {myActorHolder, sharesLocation, worldMap, playerChar} from "./index.js"
import {actorPlace} from "./worldMap.js"
//constructor parameters: x value, y value, display priority, name, symbol
//modify displayString on inheritees(?) to change what is displayed in display window
export class Actor {
    constructor(xSet, ySet, dispPrior = 0, myName, mySymbol) {
        this.name = myName;
        this.mapSymbol = mySymbol;
        this.displayPriority = dispPrior;
        this.location;
        this.alive=true;
        this.displayString=`${this.name} (${this.mapSymbol})`
        myActorHolder.aliveActors.push(this);
        actorPlace(this,xSet,ySet);
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
    constructor(setX, setY) {
        let dispPrior=1;
        super(setX, setY, dispPrior, "goblin", "g");

    }

}

export class Tree extends Actor {
    constructor(setX, setY) {
        let dispPrior=0
        super(setX, setY, dispPrior, "tree", "T");
    }
}
