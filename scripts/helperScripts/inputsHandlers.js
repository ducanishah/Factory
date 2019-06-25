import {selectedCell, myWorldMap} from "../index.js"
import {displayCellContents} from "../worldMap.js"
//for clicking on table cells
//Used in worldMap
export function clickHandler(e) {
    //the displaying of a cell and messing with selectedCell value requires that there IS a cell clicked on
    if ((e.target.cellIndex||e.target.cellIndex===0) && (e.target.parentElement.rowIndex||e.target.parentElement.rowIndex===0)) {
        //clear tint from last selected cell (if one exists)
        if(selectedCell.length){
            let td=document.getElementById("tableWrapper").children[0].children[selectedCell[1]].children[selectedCell[0]];
            td.classList.remove("selectedCell");
        }
        selectedCell.length=0;
        selectedCell.push(e.target.cellIndex, e.target.parentElement.rowIndex);
        //Tint the selected cell border
        e.target.classList.add("selectedCell");
        displayCellContents(myWorldMap,...selectedCell);
    }
}