import { addableActorsList } from "../index.js";
import { WorldMap } from "../worldMap.js";

//VERY IMPORTANT: if any rows are longer than any row above them, it will mess up


export function checkFileReaderSupported() {
    if (window.File && window.FileReader && window.FileList) {
        //Yay it's supported!
        return true;
    } else {
        return false;
    }
}
//this function returns a promise that resolves as the map constructed from the file
export function handleFileInput(e) {
    return new Promise(resolve => {
        let output;
        let fileReader = new FileReader();
        let inputFile = e.target.files[0];
        if (!inputFile) {
            console.log("There's no file here!")
        }
        //set what happens when fileReader finishes reading
        fileReader.onload = function (event) {
            output = fileOutputToMap(event.target.result);
            resolve(output);
        }
        //set the fileReader to reading
        fileReader.readAsText(inputFile);

    })

}

function fileOutputToMap(fileOutput) {
    let map = [];
    //split on new row
    let rows = fileOutput.split(/\r?\n/);
    for (let i = 0; i < rows.length; i++) {
        rows[i] = rows[i].split(",")
    }

    for (let i = 0; i < rows.length; i++) {

        for (let j = 0; j < rows[i].length; j++) {
            if (i === 0) {
                map.push(new Array());
            }
            let content = rows[i][j] || "";
            map[j].push(content);
        }
    }
    map = createWorldMapFromInputMap(map);
    return map;
}


function createWorldMapFromInputMap(map) {
    let worldMap = new WorldMap(map.length);
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[i].length; j++) {
            //creates object from list based on text
            //format ObjName:prop1=prop1Value&prop2=prop2Value+Obj2Name...
            if (map[i][j]) {
                let givenContentString = map[i][j]
                if(givenContentString.includes("+")){
                    let actorStrings=givenContentString.split("+");
                    for(let l=0;l<actorStrings.length;l++){
                        createActorFromString(worldMap,actorStrings[l]);
                    }
                } else {
                    createActorFromString(worldMap,givenContentString)
                }
                function createActorFromString(worldMap,givenContentString){
                    //creates separate vars for actor and properties of actor, if property symbol exists
                if (givenContentString.includes(":")) {
                    var givenActorString = givenContentString.split(":")[0];
                    var givenActorProperties = givenContentString.split(":")[1];
                    //creates list of properties if multiple properties
                    if (givenActorProperties.includes("&")) {
                        givenActorProperties = givenActorProperties.split("&");
                    }
                }
                let chosenObj = addableActorsList[givenActorString];
                if (!chosenObj) {
                    alert("There is text in this map that is not a valid object!: " + map[i][j] + `(${i},${j})`)
                } else {
                    let unfinishedActor = new chosenObj(worldMap, i, j);
                    //if there are multiple properties
                    if (Array.isArray(givenActorProperties)) {
                        console.log("yes")
                        for (let k = 0; k < givenActorProperties.length;k++) {
                            //set the properties
                            unfinishedActor[givenActorProperties[k].split("=")[0]]=givenActorProperties[k].split("=")[1];
                        }
                    } else{
                        //single property
                        unfinishedActor[givenActorProperties.split("=")[0]]=givenActorProperties.split("=")[1];
                    }

                }
                }
                
            }

        }

    }
    return worldMap;
}