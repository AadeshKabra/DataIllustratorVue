<template>
    <div class="property-panel">
        
        <div className="propertyPanel" style="overflow: visible">
            
            <div v-for="g in Object.keys(properties)" :key="g">
                <span :class="headerClasses[g].concat(['propertyGroupHeader']).join(' ')">{{g}}</span>
                <table>
                    <tbody v-for="p in Object.keys(properties[g])" :key="p">
                        {{ createPropertyControl(p, properties[g][p]) }}
                    </tbody>
                </table>
            </div>

        </div>

    </div>

</template>

<script setup>
    import { useSceneStore } from '@/stores/sceneStore.js';
    import { properties } from '@/tools/Def.js';
    import { storeToRefs } from 'pinia';
    import {ref, computed, watch} from 'vue';

    const sceneStore = useSceneStore();
    const { scene, selectedItem } = storeToRefs(sceneStore);

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
    }

    watch(selectedItem,(newItem) => {
        if (newItem) {
            console.log("Selected item changed in PropertyPanel:", newItem);
            handleItemSelected(newItem);
        }
    });

    function handleItemSelected(itemId) {
        let item = scene.value.getItem(itemId);

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
        
        console.log("item,type", item.type, encodable, enc, item);
    }

    function createPropertyControl(propName, propDef) {
        // Placeholder for creating property controls based on propDef
        // return `<tr><td>${propName}</td><td>Control for ${propName}</td></tr>`;
        return `${propName} ${propDef}`
    }



</script>