<template>
    <svg id="evtLayer" class="canvas" @dbclick="handleDoubleClick" @mousedown="handleMouseDown"
        @mousemove="handleMouseMove" @mouseup="handleMouseUp" :class="getCursorClass()">
        <!-- <SelectionUI scene={props.scene} renderer={props.renderer}></SelectionUI> -->
        <rect id="rectToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; fillOpacity: 0"
        :x="rectPreview.x" :y="rectPreview.y" :width="rectPreview.width" :height="rectPreview.height"
        :style="{visibility: rectPreview.visible ? 'visible' : 'hidden'}"></rect>
        
        <circle id="circleToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0">
        </circle>
        <line id="lineToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden"></line>
        <path id="polylineToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden"></path>
        <circle id="ringToolOuterUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0">
        </circle>
        <circle id="ringToolInnerUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0">
        </circle>
    </svg>
</template>

<script setup>  

import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    activeTool: String
});

const emit = defineEmits(['shapecreated']);

const isDrawing = ref(false);
const startPoint = ref({x: 0, y: 0});

const rectPreview = ref({x: 0, y: 0, width: 0, height: 0, visible: false});

function getMousePosition(svg, event){
    const ctm = svg.getScreenCTM();
    return {
        x: (event.clientX - ctm.e) / ctm.a,
        y: (event.clientY - ctm.f) / ctm.d
    };
}

function handleMouseDown(event){
    if(props.activeTool != 'Rect'){
        return;
    }

    const svg = event.currentTarget;
    const pt = getMousePosition(svg, event);

    isDrawing.value = true;
    startPoint.value = { x: pt.x, y: pt.y };

    rectPreview.value = {
        x: pt.x, 
        y: pt.y,
        width: 0,
        height: 0,
        visible: true
    };

}

function handleMouseMove(event){
    if(!isDrawing.value || props.activeTool != 'Rect'){
        return;
    }

    const svg = event.currentTarget;
    const pt = getMousePosition(svg, event);

    const width = pt.x - startPoint.value.x;
    const height = pt.y - startPoint.value.y;

    rectPreview.value = {
        x: width < 0 ? pt.x : startPoint.value.x,
        y: height < 0? pt.y : startPoint.value.y,
        width: Math.abs(width),
        height: Math.abs(height),
        visible: true
    }
}

function handleMouseUp(event){
    if(!isDrawing.value || props.activeTool != 'Rect'){
        return;
    }

    isDrawing.value = false;

    if(rectPreview.value.width > 0 && rectPreview.value.height > 0){
        emit('shapeCreated', {
            type: 'rect',
            x: rectPreview.value.x,
            y: rectPreview.value.y,
            width: rectPreview.value.width,
            height: rectPreview.value.height
        });
    }

    rectPreview.value.visible = false;
}


function getCursorClass(){
    if(['Rect', 'Ellipse', 'Line', 'Ring', 'Pen'].includes(props.activeTool)){
        return "cursor-crosshair";
    }else if(['Select', 'DirectSelect'].includes(props.activeTool)){
        return "cursor-pointer";
    }else if(props.activeTool == 'Text'){
        return "cursor-text";
    }

    return "cursor-default";
}

</script>


<style scoped>
    .canvas{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: auto;
    }

    .cursor-crosshair {
        cursor: crosshair;
    }
    .cursor-pointer {
        cursor: pointer;
    }
    .cursor-text {
        cursor: text;
    }
    .cursor-default {
        cursor: default;
    }

</style>