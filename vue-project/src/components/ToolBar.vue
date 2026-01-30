<template>
    <div>
        <div class="myToolBar">
            <div class="myBtnGroup">
                <button class="myTextBtn" id="openBtn" @click="emitCommand('Open')">Open</button>
                <input type="file" id="scnFile" style="display:none" />
                <button class="myTextBtn" id="saveBtn" @click="emitCommand('Save')">Save</button>
                <button class="myTextBtn" id="exportBtn" @click="emitCommand('Export')">Export</button>
            </div>
            <div class="myBtnGroup">
                <button class="myTextBtn" id="undoBtn" @click="undo">Undo</button>
                <button class="myTextBtn" id="redoBtn" @click="redo">Redo</button>
            </div>
            <div class="myBtnGroup">
                <button v-for="tool in tools" :key="tool" type="button" class="iconBtn" :title="tool" :id="`${tool}Btn`" @click="setActiveTool(tool)" :class="{ active: activeTool == tool }" />
            </div>  
            <!-- <EventLayer></EventLayer> -->

            <div class="myBtnGroup">
                <button class="myTextBtn" id="repeatBtn" @click="emitCommand('Repeat')">Repeat</button>
                <button class="myTextBtn" id="divideBtn" @click="emitCommand('Divide')">Divide</button>
                <button class="myTextBtn" id="densifyBtn" @click="emitCommand('Densify')">Densify</button>
                <button class="myTextBtn" id="classifyBtn" @click="emitCommand('Classify')">Classify</button>
            </div>
            <div class="myBtnGroup">
                <button v-for="t in arrangements" :key="t.replace(' ', '')" type="button" class="alignBtn" :dir="t.split(' ')[1].toLowerCase()" :title="t" :id="`${t.replace(' ', '')}Btn`" @click="emitCommand(t)" />
            </div>
        </div>



        <div
            class="modal fade"
            ref="modalEl"
            tabindex="-1"
            aria-hidden="true"
            >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Repeat Settings</h5>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <p class="mb-2">{{ repeatNum }} circles will be repeated</p>

                      <!-- Selection -->
                    <div class="mb-3">

                        <label class="form-label">Repeat based on</label>
                        <select class="form-select" v-model="selectedField">
                        <!-- <option disabled value="">Please select an option</option> -->
                        <option v-for="option in options" :key="option" :value="option === 'row of data' ? 'atlas_rowId' : option">{{ option }}</option>
                        </select>

                    </div>

                </div>

                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="closeModal">Close</button>
                    <button class="btn btn-success" @click="doRepeat">Repeat</button>
                </div>
                </div>
            </div>
        </div>
        
    </div>
</template>

<script setup>
import "../css/ToolBar.css";
import * as d3 from "d3";
import * as msc from "mascot-vis";
import {getDefaultCollectionLayout} from "../tools/Util.js";
import {ref, onMounted, defineEmits, nextTick, watch} from "vue";
import EventLayer from "./EventLayer.vue";
import { useSceneStore } from '../stores/sceneStore.js';
import { storeToRefs } from "pinia";

const tools = ref(["Select", "DirectSelect", "Line", "Rect", "Ellipse", "Ring", "Pen", "Text"]);
const arrangements = ref(["Align Top", "Align Middle", "Align Bottom", "Align Left", "Align Center", "Align Right"]);

const activeTool = ref(null);
const sceneStore = useSceneStore();
const {readCSV, datasets, scene, selected} = storeToRefs(sceneStore);
const modalEl = ref(null);
let bootstrapModal = null;
const options = ref(null);
const selectedField = ref("");
const repeatNum = ref(0);

const emit = defineEmits(['toolSelected']);

function emitCommand(tool){
    activeTool.value = tool;
    // console.log("Emitting toolSelected: ", tool);
    emit('toolSelected', tool);

    // console.log('test boostrap', window.bootstrap);
    if(tool == 'Repeat'){
        nextTick(() => {
            if (readCSV.value) {
                if (!bootstrapModal && modalEl.value) {
                    bootstrapModal = new window.bootstrap.Modal(modalEl.value);
                }
                bootstrapModal?.show();
                console.log("Opening modal for Repeat.");
            }
        })
    }

}

function closeModal() {
    bootstrapModal?.hide();
}

function doRepeat() {

    let item = scene.value.getItem("circle0");

    let layout = getDefaultCollectionLayout(item, datasets.value.getUniqueFieldValues(selectedField.value).length);
    let coll = scene.value.repeat(item, datasets.value, {field: selectedField.value, layout: layout});

    // console.log("test", layout, coll)  It:layout, le: coll
    if (coll.children.length < 25) {
        if (layout.numCols === 1) {
            scene.value.axis("y", selectedField.value, {item: item});
        } else if (layout.numRows === 1) {
            scene.value.axis("x", selectedField.value, {item: item});
        }
    }
    scene.value.reCreateRelatedAxes(coll);
    sceneStore.renderer.render(scene.value);

    // clean then update
    selected.value = null
    nextTick(() => {
        selected.value = ["circle0"];
    });

    closeModal();
}

function setActiveTool(tool){
    activeTool.value = tool;
    emitCommand(tool);
    console.log(activeTool.value);
}

function undo(){
    emitCommand('Undo');
}

function redo(){
    emitCommand('Redo');
}

// watch
watch(datasets, (newDatasets) => {
    options.value = [...newDatasets.nonNumericFields, "row of data"]
    // console.log("Active tool changed to: ", newDatasets, newDatasets.fields);
},{deep: true});

watch(selectedField, (newField) => {
    if(newField == "row of data"){
        repeatNum.value = datasets.value.data.length;
    } else {
        repeatNum.value = datasets.value.getUniqueFieldValues(newField).length;
    }
});

</script>