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
        
    </div>
</template>

<script setup>
import "../css/ToolBar.css";
import * as d3 from "d3";
import * as msc from "mascot-vis";
import {ref, onMounted, defineEmits} from "vue";
import EventLayer from "./EventLayer.vue";

const tools = ref(["Select", "DirectSelect", "Line", "Rect", "Ellipse", "Ring", "Pen", "Text"]);
const arrangements = ref(["Align Top", "Align Middle", "Align Bottom", "Align Left", "Align Center", "Align Right"]);

const activeTool = ref(null);

const emit = defineEmits(['toolSelected']);

function emitCommand(tool){
    activeTool.value = tool;
    console.log("Emitting toolSelected: ", tool);
    emit('toolSelected', tool);
}

// function setActiveTool(tool){
//     activeTool.value = tool;
//     emitCommand(tool);
//     console.log(activeTool.value);
// }

function undo(){
    emitCommand('Undo');
}

function redo(){
    emitCommand('Redo');
}

</script>