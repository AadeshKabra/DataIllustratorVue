import * as msc from "mascot-vis";

const getDefaultCollectionLayout = (item, numItems) => {
    let ar = item.bounds.width/item.bounds.height,
        doubleGap = item.type === "collection" && item.layout && item.layout.type === "grid",
        rowGap = doubleGap ? item.layout.rowGap * 3 : 5,
        colGap = doubleGap ? item.layout.colGap * 3 : 5;
    // if (numItems > 50) {
    //     return msc.layout("grid", {"numRows": Math.floor(Math.sqrt(numItems)), "rowGap": rowGap, "colGap": colGap});
    // } else {
    if (ar > 2) {
        return msc.layout("grid", {"numCols": 1, "rowGap": rowGap});
    } else {
        return msc.layout("grid", {"numRows": 1, "colGap": colGap});
    }
    //}
}

export {getDefaultCollectionLayout};