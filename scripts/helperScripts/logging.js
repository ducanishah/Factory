
export class RoundLog{
    constructor(){
        this.lastRound=-1;
        this.logs=[];
    }
    newRound(){
        this.lastRound++;
        this.logs.push({roundNumber:this.lastRound,log:[]});
        this.currentRound=this.logs[this.lastRound]
        this.logToCurrentRound("Round begun")
    }
    logToCurrentRound(obj){
        this.logs[this.lastRound].log.push(obj);
    }
}

