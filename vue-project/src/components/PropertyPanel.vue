<template>
    <div class="property-panel">
        
        <div className="propertyPanel" style="overflow: visible">
            
            <div v-for="g in Object.keys(properties)" :key="g">
                <span :class="headerClasses[g].concat(['propertyGroupHeader']).join(' ')" v-show="showHeader(g, selected)">{{g}}</span>
                <table>
                    <tbody v-for="p in Object.keys(properties[g])" :key="p">
                        <PropertyItems :prop="p" :propDef="properties[g][p]" />
                    </tbody>
                </table>
            </div>

        </div>

    </div>

</template>

<script setup>
    import PropertyItems from "./PropertyItems.vue";
    import { properties } from '@/tools/Def.js';
    import { storeToRefs } from 'pinia';
    import { useSceneStore } from '@/stores/sceneStore.js';
    import {ref, computed, watch, onMounted, onUnmounted} from 'vue';
    import pipeService from '@/tools/pipeService.js';
    import { getPropertyDef } from "@/tools/Util.js";
    import '@/css/Inspector.css';
    import * as d3 from "d3";
    

    const sceneStore = useSceneStore();
    const { scene, selected } = storeToRefs(sceneStore);

    const headerClasses = {};
    for (let g in properties) {
        let classes = [];
        for (let prop in properties[g]) {
            for (let c of properties[g][prop].class) {
                if (classes.indexOf(c) < 0)
                    classes.push(c);
            }
        }
        headerClasses[g] = classes;
        // console.log("Header classes for", classes);
    }

    watch(selected,(newSelected) => {
        if (!newSelected) return;

        // console.log("Selected item changed in PropertyPanel:", newSelected, newSelected.id);
        let selectedItemID = newSelected[0]
        handleItemSelected(selectedItemID);

        let selectedItem = scene.value.getItem(selectedItemID);
        updateProperty(selectedItem);
    });

    // const selectedItem = computed(() => {
    //     if (!selected.value) return null;
    //     return selected.value
    // });

    function handleItemSelected(itemId) {
        const item = scene.value.getItem(itemId);
        if (!item) return;

        let enc;

        let channel = "y";
        if (channel === "width" || channel === "height" || channel === "area" || channel === "radius") {
            enc = scene.value.sizeBound(item, channel);
        } else if (channel === "x" || channel === "y") {
            enc = scene.value.positionBound(item, channel);
        } else {
            enc = scene.value.getEncodingByItem(item, channel);
        }

        let encodable = item.type === "segment" ? item.parent.dataScope : item.type === "vertex" ? item.parent.dataScope || item.dataScope : item.dataScope;
        
        // console.log("item,type", item.type, encodable, enc, item);
    }

    function showHeader(group_header, selected) {
        if (!selected) return false;  // if selected is null

        const all_classes = headerClasses[group_header].join(" ")
        let selected_item = scene.value.getItem(selected[0]);

        return all_classes.includes(selected_item.type)
    }

    function updateProperty(selected_item) {
        if (!selected_item) return;   // if selected_item is null

        const type = selected_item.type;

        const panel = d3.select(".propertyPanel");
        panel.selectAll(".propertyGroupHeader").style("display", "none");
        panel.selectAll(".propertyRow").style("display", "none");
        
        panel.selectAll("." + type + "-prop").style("display", "inline-block");
        for (let g in properties) {
            for (let prop in properties[g]) {
                if (properties[g][prop].class.indexOf(type + "-prop") >= 0)
                    updatePropertyControl(properties[g][prop], selected_item, scene.value);
            }
        }
    }

    function updatePropertyControl(propDef, item, scene) {
        console.log("Updating property control for", propDef, propDef.id, item);

        d3.select("#" + propDef.id).style("padding-left", "3px");
        d3.select("#" + propDef.id + "ScaleBtn").style("display", "none");

        if (propDef.accessor) {
            let val = item;

            for (let a of propDef.accessor)
                val = val[a];

            if (propDef.type === "numeric")
                val = val.toFixed(1);

            if (propDef.id === "vxShape" && !val)
                val = "none";

            if (propDef.type === "color") {
                d3.select("#" + propDef.id).style("background", val).property("value", val);
            } else if (propDef.type === "boolean") {
                d3.select("#" + propDef.id).property("checked", val);    
            } else {
                d3.select("#" + propDef.id).property("value", val).property("disabled", propDef.channel === "area");
            }
        }

        //check if bound to data
        if (propDef.channel) {
            let enc;
            if (propDef.channel === "width" || propDef.channel === "height" || propDef.channel === "area" || propDef.channel === "radius") {
                enc = scene.sizeBound(item, propDef.channel);
            } else if (propDef.channel === "x" || propDef.channel === "y") {
                enc = scene.positionBound(item, propDef.channel);
            } else {
                enc = scene.getEncodingByItem(item, propDef.channel);
            }
            console.log("enc-test", enc);

            // console.log("enc-test", enc, item, propDef.channel);
            let encodable = item.type === "segment" ? item.parent.dataScope : item.type === "vertex" ? item.parent.dataScope || item.dataScope : item.dataScope;
            if (enc) {
                if (enc.channel === propDef.channel) {
                    d3.select("#" + propDef.id).property("value", enc.field).property("disabled", true).style("pointer-events", "none");
                    d3.select("#" + propDef.id + "UnencodeBtn").style("display", "inline-block")
                        .on("click", function(e){
                            scene.removeEncoding(enc);
                            let o = {};
                            o[enc.channel] = true;
                            store.dispatch(updateItem({id: item.id, type: item.type, properties: o}));
                        });
                    d3.select("#" + propDef.id + "EncodeBtn").style("display", "none");
                    let scaleCustomizable = (propDef.type === "numeric" && ["linear", "sqrt", "log", "power"].indexOf(enc.scale.type) >= 0) || 
                                                (propDef.type === "color" && ["sequentialColor", "divergingColor"].indexOf(enc.scale.type) >= 0);
                    if (scaleCustomizable) {
                        d3.select("#" + propDef.id).style("padding-left", "23px");
                        d3.select("#" + propDef.id + "ScaleBtn").style("display", "inline-block");
                    }
                } else {
                    let info = (enc.anyItem.type === "vertex" || enc.anyItem.type === "segment")? "[see " + enc.anyItem.type + "]" : "[see " + enc.channel + "]";
                    d3.select("#" + propDef.id).property("value", info).property("disabled", true).style("pointer-events", "none");
                    d3.select("#" + propDef.id + "UnencodeBtn").style("display", "none");
                    d3.select("#" + propDef.id + "EncodeBtn").style("display", "none");
                }
            } else if (encodable) {
                let disabled = (propDef.group === "Segment Position" || propDef.group === "Vertex Position");
                d3.select("#" + propDef.id).property("disabled", disabled).style("pointer-events", "all");
                d3.select("#" + propDef.id + "UnencodeBtn").style("display", "none");
                d3.select("#" + propDef.id + "EncodeBtn").style("display", "inline-block");
            } else {
                let disabled = (propDef.group === "Segment Position" || propDef.group === "Vertex Position");
                d3.select("#" + propDef.id).property("disabled", disabled).style("pointer-events", "all");
                d3.select("#" + propDef.id + "UnencodeBtn").style("display", "none");
                d3.select("#" + propDef.id + "EncodeBtn").style("display", "none");
            }
        }

        if (propDef.id === "layoutType") {
            // const layout = item.layout ? item.layout.type : "none";
            // d3.select("#" + propDef.id).property("value", layout);
            // d3.selectAll(".layout-prop").style("display", "none");
            // d3.selectAll("." + layout + "-prop").style("display", "inline-block");
            // let options = d3.select("#"+propDef.id).selectAll("option");
            // let ct = item.firstChild.type, na = [];
            // if (ct === "rect") {
            //     na.push("packing");
            //     if (!scene.getEncodingByItem(item.firstChild, "area")) {
            //         na.push("treemap");
            //     }
            // } else if (ct === "circle") {
            //     na.push("treemap");
            // } else if (ct === "collection") {
            //     na = na.concat(["packing", "treemap"]);
            // }
            // options.property("disabled", function(d, i) {
            //     const v = d3.select(this).property("value");
            //     return na.indexOf(v) >= 0;
            // })
            // const params = propDef.options.filter(d => d.value === layout)[0].parameters;
            // for (const p of params) {
            //     const paramDef = properties["Layout"][p];
            //     let v = item.layout[paramDef.accessor[0]];
            //     if (paramDef.type === "numeric-integer")
            //         v = v.toFixed(0);
            //     else if (paramDef.type === "numeric")
            //         v = v.toFixed(1);
            //     d3.select("#" + paramDef.id).property("value", v);
            //     d3.select("#" + paramDef.id + "ScaleBtn").style("display", "none");
            // }
        }

        if (propDef.id === "childrenOrder") {
            d3.select("#" + propDef.id).selectAll("option").remove();
            if (item.dataScope) {
                let options = item.dataScope.dataTable.fields;
                d3.select("#" + propDef.id).selectAll("option").data(options).enter().append("option")
                    .property("value", d => d).text(d => d === "atlas_rowId" ? "default" : d);
                d3.select("#" + propDef.id).property("value", item.childrenOrder.field);
            } //TODO: hide childrenOrder if item has no data scope
        }

        if (propDef.id === "axisOrientation") {
            let options = d3.select("#"+propDef.id).selectAll("option");
            if (item.channel === "x" || item.channel === "width") {
                options.property("disabled", function(d, i) {
                    const v = d3.select(this).property("value");
                    return v !== "top" && v !== "bottom";
                })
            } else if (item.channel === "y" || item.channel === "height") {
                options.property("disabled", function(d, i) {
                    const v = d3.select(this).property("value");
                    return v !== "left" && v !== "right";
                })
            } else {
                options.property("disabled", true);
            }
        }

        if (propDef.id === "includeZero") {
            if (item.channel !== "y") {
                d3.select("#" + propDef.id + "_row").style("display", "none");
            } else {
                d3.select("#" + propDef.id + "_row").style("display", "inline-block");
            }
        }

        if (propDef.id === "baseline") {
            let options = d3.select("#"+propDef.id).selectAll("option");
            let ori = item.orientation;
            if (ori === "horizontal") {
                options.property("disabled", function(d, i) {
                    const v = d3.select(this).property("value");
                    return v !== "top" && v!== "middle" && v !== "bottom";
                })
            } else if (ori === "vertical") {
                options.property("disabled", function(d, i) {
                    const v = d3.select(this).property("value");
                    return v !== "left" && v!== "center" && v !== "right";
                })
            } else {
                options.property("disabled", true);
            }
        }

        if (propDef.id === "vxShape") {
            vertexShapeUpdated();
        }

    }

    // Event listeners for item updates
    onMounted(() => {
        pipeService.onItemUpdated((itemUpdated) => {
            console.log("Item updated event received in PropertyPanel:", itemUpdated);
            if (!itemUpdated.id || itemUpdated.source === "inspector") return;
            const item = scene.value.getItem(itemUpdated.id);
            if (item === undefined) return;
            for (let prop in itemUpdated.properties) {
                const def = getPropertyDef(item.type, prop);
                if (def)
                    updatePropertyControl(def, item, scene.value);
            }   
        });
    });


</script>