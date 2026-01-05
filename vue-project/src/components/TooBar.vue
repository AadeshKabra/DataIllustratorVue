<template>
    <div>
        <div class="myToolBar">
            <div class="myBtnGroup">
                <button class="myTextBtn" id="openBtn">Open</button>
                <input type="file" id="scnFile" style="display:none" />
                <button class="myTextBtn" id="saveBtn">Save</button>
                <button class="myTextBtn" id="exportBtn">Export</button>
            </div>
            <div class="myBtnGroup">
                <button class="myTextBtn" id="undoBtn" @click="undo">Undo</button>
                <button class="myTextBtn" id="redoBtn" @click="redo">Redo</button>
            </div>
            <div class="myBtnGroup">
                <button v-for="tool in tools" :key="tool" type="button" class="iconBtn" :title="tool" :id="`${tool}Btn`" />
            </div>
            <div class="myBtnGroup">
                <button class="myTextBtn" id="repeatBtn">Repeat</button>
                <button class="myTextBtn" id="divideBtn">Divide</button>
                <button class="myTextBtn" id="densifyBtn">Densify</button>
                <button class="myTextBtn" id="classifyBtn">Classify</button>
            </div>
            <div class="myBtnGroup">
                <button v-for="t in arrangements" :key="t.replace(' ', '')" type="button" class="alignBtn" :dir="t.split(' ')[1].toLowerCase()" :title="t" :id="`${t.replace(' ', '')}Btn`" />
            </div>
        </div>
        
    </div>
</template>

<script setup>
import "../css/ToolBar.css";
import * as d3 from "d3";
import * as msc from "mascot-vis";
import {ref, onMounted} from "vue";

const tools = ref(["Select", "DirectSelect", "Line", "Rect", "Ellipse", "Ring", "Pen", "Text"]);
const arrangements = ref(["Align Top", "Align Middle", "Align Bottom", "Align Left", "Align Center", "Align Right"]);



</script>