
export class MoveSet{
    constructor(actorForContext){
        this.propertiesThatShouldNotBeDisplayed=["propertiesThatShouldNotBeDisplayed","context"];
        this.context=actorForContext;
        this.moves=[];
    }
    add(moveToAdd){
        this.moves.push(new moveToAdd(this.context));
    }
}

//make sure you have an execute function in inheritees
export class Move{
    constructor(actorForContext, name){
        this.propertiesThatShouldNotBeDisplayed=["propertiesThatShouldNotBeDisplayed","context"];
        this.context=actorForContext;
        this.name=name || "Move";
        // this.display=false;
        this.enabled=true;
    }
    execute(){
        // Execute is what is called for children
        console.log(`Oy! The move ${this.name} should have it's own execute!`);
    }
}

export class TestMove extends Move{
    constructor(actorForContext){
        super(actorForContext,"TestMove");
        // this.display=true;

    }
    execute(){
        alert("TestMove worked!")
    }
}