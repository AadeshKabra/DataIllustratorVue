<template>
    <svg id="evtLayer" class="canvas" @dbclick="handleDoubleClick" @mousedown="handleMouseDown"
        @mousemove="handleMouseMove" @mouseup="handleMouseUp" :class="getCursorClass()">
        <!-- <SelectionUI scene={props.scene} renderer={props.renderer}></SelectionUI> -->
        <rect id="rectToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; fillOpacity: 0"
        :x="rectPreview.x" :y="rectPreview.y" :width="rectPreview.width" :height="rectPreview.height"
        :style="{visibility: rectPreview.visible ? 'visible' : 'hidden'}"></rect>

        <ellipse id="ellipseToolUI" style="stroke: #1592e6; stroke-width: 1.5px; fill-opacity: 0" :cx="ellipsePreview.cx" :cy="ellipsePreview.cy" :rx="ellipsePreview.rx" :ry="ellipsePreview.ry" :style="{visibility: ellipsePreview.visible ? 'visible' : 'hidden'}"></ellipse>

        <line id="lineToolUI" style="stroke: #1592e6; stroke-width: 1.5px;" :x1="linePreview.x1" :y1="linePreview.y1" :x2="linePreview.x2" :y2="linePreview.y2" :style="{visibility: linePreview.visible ? 'visible' : 'hidden'}"></line>
        
        <circle id="ringToolOuterUI" style="stroke: #1592e6; stroke-width: 1.5px; fill-opacity: 0;" :cx="ringPreview.cx" :cy="ringPreview.cy" :r="ringPreview.outerRadius" :style="{visibility: ringPreview.visible ? 'visible' : 'hidden'}"></circle>
        <circle id="ringToolInnerUI" style="stroke: #1592e6; stroke-width: 1.5px; fill-opacity: 0;" :cx="ringPreview.cx" :cy="ringPreview.cy" :r="ringPreview.innerRadius" :style="{visibility : ringPreview.visible ? 'visible' : 'hidden'}"></circle>

        <!-- <circle id="circleToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0">
        </circle>
        <line id="lineToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden"></line>
        <path id="polylineToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden"></path>
        <circle id="ringToolOuterUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0">
        </circle>
        <circle id="ringToolInnerUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0">
        </circle> -->
    </svg>
</template>

<script setup>  

import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    activeTool: String
});

const emit = defineEmits(['shapeCreated']);

const isDrawing = ref(false);
const startPoint = ref({x: 0, y: 0});

const rectPreview = ref({x: 0, y: 0, width: 0, height: 0, visible: false});
const ellipsePreview = ref({cx: 0, cy: 0, rx:0, ry:0, visible: false});
const linePreview = ref({x1: 0, y1: 0, x2: 0, y2: 0, visible: false});  
const ringPreview = ref({cx: 0, cy: 0, outerRadius: 0, innerRadius: 0, visible: false});

function getMousePosition(svg, event){
    const ctm = svg.getScreenCTM();
    return {
        x: (event.clientX - ctm.e) / ctm.a,
        y: (event.clientY - ctm.f) / ctm.d
    };
}

function handleMouseDown(event){
    if(!['Rect', 'Ellipse', 'Line', 'Ring'].includes(props.activeTool)){
        return;
    }

    const svg = event.currentTarget;
    const pt = getMousePosition(svg, event);

    isDrawing.value = true;
    startPoint.value = { x: pt.x, y: pt.y };

    if(props.activeTool == 'Rect'){
        rectPreview.value = {
            x: pt.x, 
            y: pt.y,
            width: 0,
            height: 0,
            visible: true
        };
    } else if(props.activeTool == 'Ellipse'){
        ellipsePreview.value = {
            cx: pt.x,
            cy: pt.y,
            rx: 0,
            ry: 0,
            visible: true
        };
    }else if(props.activeTool == 'Line'){
        linePreview.value = {
            x1: pt.x,
            y1: pt.y,
            x2: pt.x,
            y2: pt.y,
            visible: true
        };
    }else if(props.activeTool == 'Ring'){
        ringPreview.value = {
            cx: pt.x,
            cy: pt.y,
            outerRadius: 0,
            innerRadius: 0,
            visible: true
        }
    }
    

}

function handleMouseMove(event){
    if(!isDrawing.value || !['Rect', 'Ellipse', 'Line', 'Ring'].includes(props.activeTool)){
        return;
    }

    const svg = event.currentTarget;
    const pt = getMousePosition(svg, event);

    if(props.activeTool == 'Rect'){
        const width = pt.x - startPoint.value.x;
        const height = pt.y - startPoint.value.y;

        rectPreview.value = {
            x: width < 0 ? pt.x : startPoint.value.x,
            y: height < 0? pt.y : startPoint.value.y,
            width: Math.abs(width),
            height: Math.abs(height),
            visible: true
        }
    }else if(props.activeTool == 'Ellipse'){
        const rx = Math.abs(pt.x - startPoint.value.x);
        const ry = Math.abs(pt.y - startPoint.value.y);

        ellipsePreview.value = {
            cx: startPoint.value.x,
            cy: startPoint.value.y,
            rx: rx,
            ry: ry,
            visible: true
        };
    }else if(props.activeTool == 'Line'){
        linePreview.value = {
            x1: startPoint.value.x,
            y1: startPoint.value.y,
            x2: pt.x,
            y2: pt.y,
            visible: true
        };
    }else if(props.activeTool == 'Ring'){
        const distance = Math.sqrt(Math.pow(pt.x - startPoint.value.x, 2) + Math.pow(pt.y - startPoint.value.y,2));

        const outerRadius = distance;
        const innerRadius = distance * 0.6;

        ringPreview.value = {
            cx: startPoint.value.x,
            cy: startPoint.value.y,
            outerRadius: outerRadius,
            innerRadius: innerRadius,
            visible: true
        }
    }

    
}

function handleMouseUp(event){
    if(!isDrawing.value || !['Rect', 'Ellipse', 'Line', 'Ring'].includes(props.activeTool)){
        return;
    }

    isDrawing.value = false;


    if(props.activeTool == 'Rect' && rectPreview.value.width > 0 && rectPreview.value.height > 0){
        emit('shapeCreated', {
            type: 'rect',
            x: rectPreview.value.x,
            y: rectPreview.value.y,
            width: rectPreview.value.width,
            height: rectPreview.value.height
        });

        rectPreview.value.visible = false;
    }else if(props.activeTool == 'Ellipse' && ellipsePreview.value.rx > 0 && ellipsePreview.value.ry > 0){
        emit('shapeCreated', {
            type: 'ellipse',
            cx: ellipsePreview.value.cx,
            cy: ellipsePreview.value.cy,
            rx: ellipsePreview.value.rx,
            ry: ellipsePreview.value.ry
        });

        ellipsePreview.value.visible = false;
    }else if(props.activeTool == 'Line'){
        emit('shapeCreated', {
            type: 'line',
            x1: linePreview.value.x1,
            y1: linePreview.value.y1,
            x2: linePreview.value.x2,
            y2: linePreview.value.y2
        });
        linePreview.value.visible = false;
    }else if(props.activeTool == 'Ring' && ringPreview.value.outerRadius > 0){
        emit('shapeCreated', {
            type: 'ring',
            cx: ringPreview.value.cx,
            cy: ringPreview.value.cy,
            outerRadius: ringPreview.value.outerRadius,
            innerRadius: ringPreview.value.innerRadius
        });
        ringPreview.value.visible = false;
    }
        

    
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