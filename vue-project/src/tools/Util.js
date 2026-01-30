import * as msc from "mascot-vis";
import { properties } from '@/tools/Def.js';

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

const getReusableScales = (fieldType, channel, scene) => {
    let r = {};
    for (let itmKey in scene.encodings) {
        let encs = scene.encodings[itmKey];
        for (let c in encs) {
            let enc = encs[c];
            if (canShareScale(c, channel) && enc.dataTable.getFieldType(enc.field) === fieldType) {
                if (!(enc.scale.id in r))
                    r[enc.scale.id] = [];
                r[enc.scale.id].push(enc);
            }   
        }
    }
    return r;
}

const getPropertyID = (itemType, prop) => {
    switch (itemType) {
        case "vertex":
            return "vx" + prop.replace(/^\w/, c => c.toUpperCase());;
        case "scene":
            return "canvas" + prop.replace(/^\w/, c => c.toUpperCase());;
        case "collection": 
        case "segment":
        case "legend":
            return itemType + prop.replace(/^\w/, c => c.toUpperCase());
        default:
            return prop;
    }
}

const getPropertyDef = (itemType, prop) => {
    const id = getPropertyID(itemType, prop);
    for (let g in properties) {
        for (let p in properties[g]) {
            if (properties[g][p].id === id)
                return properties[g][p];
        }
    }
    return null;
}


export {getDefaultCollectionLayout, getReusableScales, getPropertyDef};