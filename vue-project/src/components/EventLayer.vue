<template>
    <svg id="evtLayer" class="canvas" @dbclick="handleDoubleClick" @mousedown="handleMouseDown"
        @mousemove="handleMouseMove" @mouseup="handleMouseUp" :class="getCursorClass()">

        <rect id="rectToolUI" style="stroke: #1592e6; stroke-width: 1.5px; fill-opacity: 0" :x="rectPreview.x"
            :y="rectPreview.y" :width="rectPreview.width" :height="rectPreview.height"
            :style="{ visibility: rectPreview.visible ? 'visible' : 'hidden' }"></rect>

        <ellipse id="ellipseToolUI" style="stroke: #1592e6; stroke-width: 1.5px; fill-opacity: 0"
            :cx="ellipsePreview.cx" :cy="ellipsePreview.cy" :rx="ellipsePreview.rx" :ry="ellipsePreview.ry"
            :style="{ visibility: ellipsePreview.visible ? 'visible' : 'hidden' }"></ellipse>

        <line id="lineToolUI" style="stroke: #1592e6; stroke-width: 1.5px;" :x1="linePreview.x1" :y1="linePreview.y1"
            :x2="linePreview.x2" :y2="linePreview.y2" :style="{ visibility: linePreview.visible ? 'visible' : 'hidden' }">
        </line>

        <circle id="ringToolOuterUI" style="stroke: #1592e6; stroke-width: 1.5px; fill-opacity: 0;" :cx="ringPreview.cx"
            :cy="ringPreview.cy" :r="ringPreview.outerRadius"
            :style="{ visibility: ringPreview.visible ? 'visible' : 'hidden' }"></circle>
        <circle id="ringToolInnerUI" style="stroke: #1592e6; stroke-width: 1.5px; fill-opacity: 0;" :cx="ringPreview.cx"
            :cy="ringPreview.cy" :r="ringPreview.innerRadius"
            :style="{ visibility: ringPreview.visible ? 'visible' : 'hidden' }"></circle>


        <g v-if="selectedShape && !isDrawing">
            <g v-if="selectedShape.type == 'rect'">
                <rect :x="selectedShape.x" :y="selectedShape.y" :width="selectedShape.width"
                    :height="selectedShape.height" fill="none" stroke="#1592e6" stroke-width="2" stroke-dasharray="5,5">
                </rect>

                <!-- vertex -->
                <circle v-for="(handle, idx) in getRectHandles(selectedShape)" :key="`corner-${idx}`" :cx="handle.x"
                    :cy="handle.y" r="6" fill="white" stroke="#1592e6" stroke-width="2" class="handle"
                    :data-handle="handle.position" @mousedown.stop="startResize($event, handle.position)"></circle>

                <!-- edge -->
                <circle v-for="(handle, idx) in getRectEdgeHandles(selectedShape)" :key="`edge-${idx}`" :cx="handle.x"
                    :cy="handle.y" r="5" fill="white" stroke="#1592e6" stroke-width="2" class="handle"
                    :data-handle="handle.position" @mousedown.stop="startResize($event, handle.position)"></circle>
            </g>

            <g v-if="selectedShape.type == 'ellipse'">
                <ellipse :cx="selectedShape.cx" :cy="selectedShape.cy" :rx="selectedShape.rx" :ry="selectedShape.ry"
                    fill="none" stroke="#1592e6" stroke-width="2" stroke-dasharray="5,5" />

                <circle v-for="(handle, idx) in getEllipseHandles(selectedShape)" :key="`ellipse-${idx}`" :cx="handle.x"
                    :cy="handle.y" r="6" fill="white" stroke="#1592e6" stroke-width="2" class="handle"
                    :data-handle="handle.position" @mousedown.stop="startResize($event, handle.position)" />
            </g>


            <g v-if="selectedShape.type == 'line'">
                <line :x1="selectedShape.x1" :y1="selectedShape.y1" :x2="selectedShape.x2" :y2="selectedShape.y2"
                    stroke="#1592e6" stroke-width="2" stroke-dasharray="5,5" />

                <!-- endpoint -->
                <circle :cx="selectedShape.x1" :cy="selectedShape.y1" r="6" fill="white" stroke="#1592e6"
                    stroke-width="2" class="handle" data-handle="start"
                    @mousedown.stop="startResize($event, 'start')" />
                <circle :cx="selectedShape.x2" :cy="selectedShape.y2" r="6" fill="white" stroke="#1592e6"
                    stroke-width="2" class="handle" data-handle="end" @mousedown.stop="startResize($event, 'end')" />
            </g>

            <g v-if="selectedShape.type === 'ring'">
                <!-- selection -->
                <circle :cx="selectedShape.cx" :cy="selectedShape.cy" 
                    :r="selectedShape.outerRadius"
                    fill="none" stroke="#1592e6" stroke-width="2" stroke-dasharray="5,5"/>
                <circle :cx="selectedShape.cx" :cy="selectedShape.cy" 
                    :r="selectedShape.innerRadius"
                    fill="none" stroke="#1592e6" stroke-width="2" stroke-dasharray="5,5"/>
                
                <!-- radius -->
                <circle :cx="selectedShape.cx + selectedShape.outerRadius" :cy="selectedShape.cy" r="6"
                    fill="white" stroke="#1592e6" stroke-width="2"
                    class="handle" data-handle="outer"
                    @mousedown.stop="startResize($event, 'outer')"/>
                <circle :cx="selectedShape.cx + selectedShape.innerRadius" :cy="selectedShape.cy" r="6"
                    fill="white" stroke="#1592e6" stroke-width="2"
                    class="handle" data-handle="inner"
                    @mousedown.stop="startResize($event, 'inner')"/>
            </g>

        </g>
    </svg>
</template>

<script setup>

import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    activeTool: String,
    shapes: Array
});

const emit = defineEmits(['shapeCreated', 'shapeModified', 'shapeSelected']);

const isDrawing = ref(false);
const startPoint = ref({ x: 0, y: 0 });
const isResizing = ref(false);
const resizeHandle = ref(null);
const selectedShape = ref(null);

const rectPreview = ref({ x: 0, y: 0, width: 0, height: 0, visible: false });
const ellipsePreview = ref({ cx: 0, cy: 0, rx: 0, ry: 0, visible: false });
const linePreview = ref({ x1: 0, y1: 0, x2: 0, y2: 0, visible: false });
const ringPreview = ref({ cx: 0, cy: 0, outerRadius: 0, innerRadius: 0, visible: false });

function getMousePosition(svg, event) {
    const ctm = svg.getScreenCTM();
    return {
        x: (event.clientX - ctm.e) / ctm.a,
        y: (event.clientY - ctm.f) / ctm.d
    };
}


function selectShape(event, svg, pt){
    if(props.activeTool != 'Select') return false;

    const clickedShape = findShapeAtPoint(pt);
    if(clickedShape){
        selectedShape.value = clickedShape;
        emit('shapeSelected', clickedShape);
        return true;
    }

    selectedShape.value = null;
    return false;
}

function findShapeAtPoint(pt){
    if(!props.shapes) return null;

    for(let i=props.shapes.length - 1; i>=0; i--){
        const shape = props.shapes[i];
        if(shape.type == 'rect'){
            if(pt.x >= shape.x && pt.x <= shape.x + shape.width && pt.y >= shape.y && pt.y <= shape.y + shape.height){
                return shape;
            }
        }else if(shape.type == 'ellipse'){
            const dx = (pt.x - shape.cx) / shape.rx;
            const dy = (pt.y - shape.cy) / shape.ry;
            if(dx * dx + dy * dy <= 1){
                return shape;
            }
        }else if(shape.type == 'line'){
            const dist = distanceToLine(pt, shape.x1, shape.y1, shape.x2, shape.y2);
            if(dist < 10){
                return shape;
            }
        }else if(shape.type == 'ring'){
            const dist = Math.sqrt(Math.pow(pt.x - shape.cx, 2) + Math.pow(pt.y - shape.cy, 2));
            if(dist <= shape.outerRadius && dist >= shape.innerRadius){
                return shape;
            }
        }
    }

    return null;
}


function distanceToLine(pt, x1, y1, x2, y2){
    const A = pt.x - x1;
    const B = pt.y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if(lenSq!=0){
        param = dot / lenSq;
    }

    let xx, yy;
    if(param < 0){
        xx = x1;
        yy = y1;
    }else if(param > 1){
        xx = x2;
        yy = y2;
    }else{
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = pt.x - xx;
    const dy = pt.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
}


function startResize(event, handle){
    event.stopPropagation();
    isResizing.value = true;
    resizeHandle.value = handle;

    const svg = event.currentTarget.ownerSVGElement;
    startPoint.value = getMousePosition(svg, event);
}


function handleMouseDown(event){
    const svg = event.currentTarget;
    const pt = getMousePosition(svg, event);
    
    // Check for selection mode
    if (props.activeTool === 'Select') {
        selectShape(event, svg, pt);
        return;
    }
    
    // Drawing mode
    if(!['Rect', 'Ellipse', 'Line', 'Ring'].includes(props.activeTool)){
        return;
    }

    isDrawing.value = true;
    startPoint.value = { x: pt.x, y: pt.y };

    if(props.activeTool === 'Rect'){
        rectPreview.value = { x: pt.x, y: pt.y, width: 0, height: 0 };
    } else if(props.activeTool === 'Ellipse'){
        ellipsePreview.value = { cx: pt.x, cy: pt.y, rx: 0, ry: 0 };
    } else if(props.activeTool === 'Line'){
        linePreview.value = { x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y };
    } else if(props.activeTool === 'Ring'){
        ringPreview.value = { cx: pt.x, cy: pt.y, outerRadius: 0, innerRadius: 0 };
    }
}

function handleMouseMove(event){
    const svg = event.currentTarget;
    const pt = getMousePosition(svg, event);
    
    // Handle resizing
    if (isResizing.value && selectedShape.value) {
        resizeShape(pt);
        emit('shapeModified', selectedShape.value);
        return;
    }
    
    // Handle drawing
    if(!isDrawing.value || !['Rect', 'Ellipse', 'Line', 'Ring'].includes(props.activeTool)){
        return;
    }

    if(props.activeTool === 'Rect'){
        const width = pt.x - startPoint.value.x;
        const height = pt.y - startPoint.value.y;
        rectPreview.value = {
            x: width < 0 ? pt.x : startPoint.value.x,
            y: height < 0? pt.y : startPoint.value.y,
            width: Math.abs(width),
            height: Math.abs(height)
        };
    } else if(props.activeTool === 'Ellipse'){
        const rx = Math.abs(pt.x - startPoint.value.x);
        const ry = Math.abs(pt.y - startPoint.value.y);
        ellipsePreview.value = {
            cx: startPoint.value.x, cy: startPoint.value.y,
            rx: rx, ry: ry
        };
    } else if(props.activeTool === 'Line'){
        linePreview.value = {
            x1: startPoint.value.x, y1: startPoint.value.y,
            x2: pt.x, y2: pt.y
        };
    } else if(props.activeTool === 'Ring'){
        const distance = Math.sqrt(
            Math.pow(pt.x - startPoint.value.x, 2) + 
            Math.pow(pt.y - startPoint.value.y, 2)
        );
        ringPreview.value = {
            cx: startPoint.value.x, cy: startPoint.value.y,
            outerRadius: distance, innerRadius: distance * 0.6
        };
    }
}

function resizeShape(pt) {
    if (!selectedShape.value) return;
    
    const shape = selectedShape.value;
    
    if (shape.type === 'rect') {
        const newShape = {...shape};
        
        switch(resizeHandle.value) {
            case 'nw': // Top-left
                newShape.width = shape.x + shape.width - pt.x;
                newShape.height = shape.y + shape.height - pt.y;
                newShape.x = pt.x;
                newShape.y = pt.y;
                break;
            case 'ne': // Top-right
                newShape.width = pt.x - shape.x;
                newShape.height = shape.y + shape.height - pt.y;
                newShape.y = pt.y;
                break;
            case 'sw': // Bottom-left
                newShape.width = shape.x + shape.width - pt.x;
                newShape.height = pt.y - shape.y;
                newShape.x = pt.x;
                break;
            case 'se': // Bottom-right
                newShape.width = pt.x - shape.x;
                newShape.height = pt.y - shape.y;
                break;
            case 'n': // Top edge
                newShape.height = shape.y + shape.height - pt.y;
                newShape.y = pt.y;
                break;
            case 's': // Bottom edge
                newShape.height = pt.y - shape.y;
                break;
            case 'w': // Left edge
                newShape.width = shape.x + shape.width - pt.x;
                newShape.x = pt.x;
                break;
            case 'e': // Right edge
                newShape.width = pt.x - shape.x;
                break;
        }
        
        // Ensure positive dimensions
        if (newShape.width < 0) {
            newShape.x += newShape.width;
            newShape.width = Math.abs(newShape.width);
        }
        if (newShape.height < 0) {
            newShape.y += newShape.height;
            newShape.height = Math.abs(newShape.height);
        }
        
        selectedShape.value = newShape;
    }
    else if (shape.type === 'ellipse') {
        const newShape = {...shape};
        
        switch(resizeHandle.value) {
            case 'right':
                newShape.rx = Math.abs(pt.x - shape.cx);
                break;
            case 'left':
                newShape.rx = Math.abs(pt.x - shape.cx);
                break;
            case 'top':
                newShape.ry = Math.abs(pt.y - shape.cy);
                break;
            case 'bottom':
                newShape.ry = Math.abs(pt.y - shape.cy);
                break;
        }
        
        selectedShape.value = newShape;
    }
    else if (shape.type === 'line') {
        const newShape = {...shape};
        
        if (resizeHandle.value === 'start') {
            newShape.x1 = pt.x;
            newShape.y1 = pt.y;
        } else if (resizeHandle.value === 'end') {
            newShape.x2 = pt.x;
            newShape.y2 = pt.y;
        }
        
        selectedShape.value = newShape;
    }
    else if (shape.type === 'ring') {
        const newShape = {...shape};
        const distance = Math.sqrt(
            Math.pow(pt.x - shape.cx, 2) + 
            Math.pow(pt.y - shape.cy, 2)
        );
        
        if (resizeHandle.value === 'outer') {
            newShape.outerRadius = distance;
        } else if (resizeHandle.value === 'inner') {
            newShape.innerRadius = Math.min(distance, shape.outerRadius - 5);
        }
        
        selectedShape.value = newShape;
    }
}

function handleMouseUp(event){
    // Handle resize end
    if (isResizing.value) {
        isResizing.value = false;
        resizeHandle.value = null;
        return;
    }
    
    // Handle drawing end
    if(!isDrawing.value || !['Rect', 'Ellipse', 'Line', 'Ring'].includes(props.activeTool)){
        return;
    }

    isDrawing.value = false;

    if(props.activeTool === 'Rect' && rectPreview.value.width > 0 && rectPreview.value.height > 0){
        emit('shapeCreated', {
            type: 'rect',
            x: rectPreview.value.x,
            y: rectPreview.value.y,
            width: rectPreview.value.width,
            height: rectPreview.value.height
        });
    } else if(props.activeTool === 'Ellipse' && (ellipsePreview.value.rx > 0 || ellipsePreview.value.ry > 0)){
        emit('shapeCreated', {
            type: 'ellipse',
            cx: ellipsePreview.value.cx,
            cy: ellipsePreview.value.cy,
            rx: ellipsePreview.value.rx,
            ry: ellipsePreview.value.ry
        });
    } else if(props.activeTool === 'Line'){
        emit('shapeCreated', {
            type: 'line',
            x1: linePreview.value.x1,
            y1: linePreview.value.y1,
            x2: linePreview.value.x2,
            y2: linePreview.value.y2
        });
    } else if(props.activeTool === 'Ring' && ringPreview.value.outerRadius > 0){
        emit('shapeCreated', {
            type: 'ring',
            cx: ringPreview.value.cx,
            cy: ringPreview.value.cy,
            outerRadius: ringPreview.value.outerRadius,
            innerRadius: ringPreview.value.innerRadius
        });
    }
}

// Helper functions to get handle positions
function getRectHandles(shape) {
    return [
        { x: shape.x, y: shape.y, position: 'nw' },
        { x: shape.x + shape.width, y: shape.y, position: 'ne' },
        { x: shape.x, y: shape.y + shape.height, position: 'sw' },
        { x: shape.x + shape.width, y: shape.y + shape.height, position: 'se' }
    ];
}

function getRectEdgeHandles(shape) {
    return [
        { x: shape.x + shape.width / 2, y: shape.y, position: 'n' },
        { x: shape.x + shape.width / 2, y: shape.y + shape.height, position: 's' },
        { x: shape.x, y: shape.y + shape.height / 2, position: 'w' },
        { x: shape.x + shape.width, y: shape.y + shape.height / 2, position: 'e' }
    ];
}

function getEllipseHandles(shape) {
    return [
        { x: shape.cx + shape.rx, y: shape.cy, position: 'right' },
        { x: shape.cx - shape.rx, y: shape.cy, position: 'left' },
        { x: shape.cx, y: shape.cy - shape.ry, position: 'top' },
        { x: shape.cx, y: shape.cy + shape.ry, position: 'bottom' }
    ];
}

function getCursorClass() {
    if (['Rect', 'Ellipse', 'Line', 'Ring', 'Pen'].includes(props.activeTool)) {
        return "cursor-crosshair";
    } else if (['Select', 'DirectSelect'].includes(props.activeTool)) {
        return "cursor-pointer";
    } else if (props.activeTool == 'Text') {
        return "cursor-text";
    }

    return "cursor-default";
}

</script>


<style scoped>
.canvas {
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