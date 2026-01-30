<template>
    <tr :class="classes" :key="prop" :id="propDef.id+'_row'" v-show="showProperty(propDef, selected)">
        <!-- property name -->
        <td class= "propertyName">{{ prop }}</td>

        <!-- Input box -->
        <td className="propertyInput">
             <!-- Numeric -->
            <input 
            v-if="propDef.type === 'numeric' || propDef.type === 'numeric-integer'"
            :id="propDef.id" 
            @change="setNumericValue(propDef)"
            />
            
            <!-- Range slider -->
            <div v-else-if="propDef.type === 'numeric-range'" class="propertySliderDiv">
            <input 
                type="range" 
                :id="propDef.id"
                :min="propDef.range[0]"
                :max="propDef.range[1]"
                :step="(propDef.range[1] - propDef.range[0])/10"
                class="propertySlider"
                @change="setNumericValue(propDef)"
            />
            <div class="propertySliderMarks">
                <div style="margin: 0; float: left">{{ propDef.range[0] }}</div>
                <div style="margin: 0; float: right">{{ propDef.range[1] }}</div>
            </div>
            </div>
            
            <!-- Color -->
            <input 
            v-else-if="propDef.type === 'color'"
            :id="propDef.id"
            @click="setCurrentColorPropDef(propDef); $event.stopPropagation()"
            />
            
            <!-- Category select -->
            <select 
            v-else-if="propDef.type === 'categorical'"
            :id="propDef.id"
            @change="setCategoricalValue(propDef)"
            >
            <option 
                v-for="o in propDef.options" 
                :key="o.display"
                :value="o.value"
            >
                {{ o.display }}
            </option>
            </select>
            
            <!-- Boolean checkbox -->
            <input v-else-if="propDef.type === 'boolean'" type="checkbox" :id="propDef.id" @change="setBooleanValue(propDef)"/>
            
            <!-- String -->
            <input v-else-if="propDef.type === 'string'" type="text" :id="propDef.id" @input="setStringValue(propDef)" />
            
            <!-- Default: numeric -->
            <input v-else :id="propDef.id" @change="setNumericValue(propDef)" />
        </td>

        <!-- Button -->
        <!-- <button className="unencodeBtn" :id="`${propDef.id}UnencodeBtn`"></button> -->
        <td v-if="propDef.encodable">
            <div class="dropdown" :id="propDef.id + 'EncodeBtn'">
                <button class="encodeBtn" @click="toggleDropdown"></button>   
                    
                <ul class="dropdown-menu" :class="{ 'show': isOpen }">
                    <template v-if="currentDataTable">
                        <li 
                        v-for="f in currentDataTable.getEncodableFields(propDef.channel)"
                        :key="f"
                        >
                            <a class="dropdown-item" href="#" 
                                :key="f" @click.prevent="encode(f, propDef.channel)"
                            >{{ f }}</a>

                        </li>

                    </template>
                    
                </ul>
                
                
            </div>


        </td>


    </tr>
</template>

<script setup>

import { computed, defineProps, watch, ref, onMounted, onUnmounted} from 'vue';
import { storeToRefs } from 'pinia';
import { useSceneStore } from '@/stores/sceneStore.js';
import { getReusableScales } from '@/tools/Util.js';
import pipeService from '@/tools/pipeService.js';


const sceneStore = useSceneStore();
const { scene, selected, currentDataTable, datasets, directSelected} = storeToRefs(sceneStore);

const props = defineProps({
    prop: {
        type: String,
        required: true
    },
    propDef: {
        type: Object,
        required: true
    }
});


const classes = computed(() => {
    const result = "propertyRow " + props.propDef.class.join(" ");
    console.log("Computed classes:", result);
    return result;
});

const isOpen = ref(false);
function toggleDropdown() {
    isOpen.value = !isOpen.value;
}


function showProperty(propDef, item) {
    console.log("showProperty called with:", propDef, item);
    if (!item) return false;
    else 
        {
            const result = propDef.encodable && classes.value.includes(item.type);
            return result;
        }
}

function hasScales(f) {
    console.log(currentDataTable.value)
    if (!currentDataTable.value) {
        console.log("No current data table.", currentDataTable.value);
        return false
    };

    let scales = getReusableScales(currentDataTable.value.getFieldType(f), props.propDef.channel, scene.value);
    return Object.keys(scales).length > 0;
}

function menuItemGenerator() {
    let scales = getReusableScales(currentDataTable.getFieldType(f), propDef.channel, scene.value);
    if (Object.keys(scales).length === 0) {

    }
}

const encode = (f, c, scale) => {
    let item;
    if (selected.value.length >= 1) {
        item = scene.value.getItem(selected.value[0]);
    } else if (directSelected.value) {
        item = scene.value.getItem(directSelected.value);
    }

    if (!item) return;
    // addToStack(scene.value, datasets.value, undoStack.value);
    // if ((c === "x" || c === "y") && item.type !== "area" && item.parent.type === "collection" && item.parent.layout) {
    //     scene.value.setProperties(item.parent, {"layout": undefined});
    // }
    if ((c === "x" || c === "y") && item.parent.type === "collection" && item.parent.layout) {
        switch (item.parent.layout.type) {
            case "grid":
                if (c === "x" && item.parent.layout.numCols > 1)
                    scene.value.setProperties(item.parent, {"layout": undefined});
                else if (c === "y" && item.parent.layout.numRows > 1)
                    scene.value.setProperties(item.parent, {"layout": undefined});
                break;
            default:
                scene.value.setProperties(item.parent, {"layout": undefined});
                break;
        }
    }
    scene.value.encode(item, {field: f, channel: c, scale: scale});
    let guide;
    if (!scale) {
        if (c.indexOf("Color") > 0) {
            guide = scene.value.legend(c, f);
        } else if (c === "width" || c === "height" || c === "x" || c === "y") {
            guide = scene.value.axis(c, f, {item: item});
        }
    } else { //if merging scale, generate a new axis only when binding to line/path vertex, and the line/path orientation is orthogonal to the channel 
        if (item.type === "vertex" && ["path", "line"].indexOf(item.parent.type) >= 0 ) {
            let p = item.parent;
            let r = Math.abs((p.firstVertex.y - p.lastVertex.y + 1)/(p.firstVertex.x - p.lastVertex.x + 1));
            if ((r < 1 && c === "y") || (r > 1 && c === "x")) {
                guide = scene.value.axis(c, f, {item: item});
            }
        }
    }
    scene.value.reCreateRelatedAxes(item);
    sceneStore.renderer.render(scene.value);
    
    const o = {};
    o[c] = "encoded";
    pipeService.emitItemUpdated({id: item.id, type: item.type, properties: o});
    // store.dispatch(updateItem({id: item.id, type: item.type, properties: o}));
    // if (guide)
    //     store.dispatch(createNewItem(guide.id));
}

const highlightAxis = (scale, show) => {
    for (let c of scene.value.children) {
        if (c.type === "axis" && c.encoding) {
            if (c.encoding.scale === scale) {
                store.dispatch(toggleAxisHandle({axis: c.id, visible: show}));
                return;
            }
        }
    }
}





</script>