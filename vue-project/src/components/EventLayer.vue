<template>
    <svg ref="evtLayerRef" id="evtLayer" class="canvas" 
        @dblclick="handleDoubleClick" 
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove" 
        @mouseup="handleMouseUp" 
        @mouseleave="handleMouseLeave" 
        :class="getCursorClass()">

        <rect id="rectToolUI" style="stroke: #1592e6; stroke-width: 1.5px; fill-opacity: 0" :x="rectPreview.x"
            :y="rectPreview.y" :width="rectPreview.width" :height="rectPreview.height"
            :style="{ visibility: rectPreview.visible ? 'visible' : 'hidden' }"></rect>

        <ellipse id="ellipseToolUI" style="stroke: #1592e6; stroke-width: 1.5px; fill-opacity: 0"
            :cx="ellipsePreview.cx" :cy="ellipsePreview.cy" :rx="ellipsePreview.rx" :ry="ellipsePreview.ry"
            :style="{ visibility: ellipsePreview.visible ? 'visible' : 'hidden' }"></ellipse>

        <line id="lineToolUI" style="stroke: #1592e6; stroke-width: 1.5px;" :x1="linePreview.x1" :y1="linePreview.y1"
            :x2="linePreview.x2" :y2="linePreview.y2"
            :style="{ visibility: linePreview.visible ? 'visible' : 'hidden' }">
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
                    :height="selectedShape.height" fill="none" stroke="#1592e6" stroke-width="2">
                </rect>

                <circle v-for="(handle, idx) in getRectHandles(selectedShape)" :key="`corner-${idx}`" :cx="handle.x"
                    :cy="handle.y" r="6" fill="white" stroke="#1592e6" stroke-width="2" 
                    :class="['handle', `cursor-${handle.position}`]"
                    :data-handle="handle.position" @mousedown.stop="startResize($event, handle.position)"></circle>

                <circle v-for="(handle, idx) in getRectEdgeHandles(selectedShape)" :key="`edge-${idx}`" :cx="handle.x"
                    :cy="handle.y" r="5" fill="white" stroke="#1592e6" stroke-width="2" 
                    :class="['handle', `cursor-${handle.position}`]"
                    :data-handle="handle.position" @mousedown.stop="startResize($event, handle.position)"></circle>
            </g>

            <g v-if="selectedShape.type == 'ellipse'">
                <ellipse :cx="selectedShape.cx" :cy="selectedShape.cy" :rx="selectedShape.rx" :ry="selectedShape.ry"
                    fill="none" stroke="#1592e6" stroke-width="2" stroke-dasharray="5,5" />

                <circle v-for="(handle, idx) in getEllipseHandles(selectedShape)" :key="`ellipse-${idx}`" :cx="handle.x"
                    :cy="handle.y" r="6" fill="white" stroke="#1592e6" stroke-width="2" 
                    :class="['handle', `cursor-${handle.position}`]"
                    :data-handle="handle.position" @mousedown.stop="startResize($event, handle.position)" />
            </g>


            <g v-if="selectedShape.type == 'line'">
                <line :x1="selectedShape.x1" :y1="selectedShape.y1" :x2="selectedShape.x2" :y2="selectedShape.y2"
                    stroke="#1592e6" stroke-width="2" stroke-dasharray="5,5" />

                <circle :cx="selectedShape.x1" :cy="selectedShape.y1" r="6" fill="white" stroke="#1592e6"
                    stroke-width="2" class="handle cursor-move" data-handle="start"
                    @mousedown.stop="startResize($event, 'start')" />
                <circle :cx="selectedShape.x2" :cy="selectedShape.y2" r="6" fill="white" stroke="#1592e6"
                    stroke-width="2" class="handle cursor-move" data-handle="end" @mousedown.stop="startResize($event, 'end')" />
            </g>

            <g v-if="selectedShape.type === 'ring'">
                <circle :cx="selectedShape.cx" :cy="selectedShape.cy" :r="selectedShape.outerRadius" fill="none"
                    stroke="#1592e6" stroke-width="2" stroke-dasharray="5,5" />
                <circle :cx="selectedShape.cx" :cy="selectedShape.cy" :r="selectedShape.innerRadius" fill="none"
                    stroke="#1592e6" stroke-width="2" stroke-dasharray="5,5" />

                <circle :cx="selectedShape.cx + selectedShape.outerRadius" :cy="selectedShape.cy" r="6" fill="white"
                    stroke="#1592e6" stroke-width="2" class="handle cursor-ew-resize" data-handle="outer"
                    @mousedown.stop="startResize($event, 'outer')" />
                <circle :cx="selectedShape.cx + selectedShape.innerRadius" :cy="selectedShape.cy" r="6" fill="white"
                    stroke="#1592e6" stroke-width="2" class="handle cursor-ew-resize" data-handle="inner"
                    @mousedown.stop="startResize($event, 'inner')" />
            </g>

        </g>
    </svg>
</template>

<script setup>

import { ref, defineProps, defineEmits, onMounted, onUnmounted } from 'vue';

const props = defineProps({
    activeTool: String,
    shapes: Array
});

const emit = defineEmits(['shapeCreated', 'shapeModified', 'shapeSelected']);

const evtLayerRef = ref(null);
const isDrawing = ref(false);
const startPoint = ref({ x: 0, y: 0 });
const isResizing = ref(false);
const resizeHandle = ref(null);
const selectedShape = ref(null);
const originalShape = ref(null);

const rectPreview = ref({ x: 0, y: 0, width: 0, height: 0, visible: false });
const ellipsePreview = ref({ cx: 0, cy: 0, rx: 0, ry: 0, visible: false });
const linePreview = ref({ x1: 0, y1: 0, x2: 0, y2: 0, visible: false });
const ringPreview = ref({ cx: 0, cy: 0, outerRadius: 0, innerRadius: 0, visible: false });

onMounted(() => {
    document.addEventListener('mouseup', handleGlobalMouseUp);
    document.addEventListener('mousemove', handleGlobalMouseMove);
});

onUnmounted(() => {
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    document.removeEventListener('mousemove', handleGlobalMouseMove);
});

function handleGlobalMouseUp(event) {
    // Priority: Handle resize stop anywhere in the document
    if (isResizing.value) {
        console.log('Global mouse up - stopping resize');
        stopResize();
    } else if (isDrawing.value) {
        console.log('Global mouse up - stopping draw');
        handleMouseUp(event);
    }
}

function handleGlobalMouseMove(event) {
    // Consolidated resizing logic: Handles mouse movement anywhere once resizing starts.
    // This prevents "dead zones" if the mouse leaves the SVG during a drag.
    if (isResizing.value && selectedShape.value) {
        const svg = evtLayerRef.value || document.getElementById('evtLayer');
        if (svg) {
            // We pass the global event directly; getMousePosition uses clientX/Y
            const pt = getMousePosition(svg, event);
            
            resizeShape(pt);
            
            // Don't emit shapeModified during resize - only update the selection frame
            // The actual shape will be updated when resize ends (on mouse up)
            // This prevents the shape from disappearing and old marks from accumulating
        }
    }
}


function handleMouseLeave(event) {
    // Resizing is handled by global listener now, so we don't need logic here.
    // Log for debugging if needed: console.log('Mouse left SVG');
}


function getMousePosition(svg, event) {
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    return {
        x: (event.clientX - ctm.e) / ctm.a,
        y: (event.clientY - ctm.f) / ctm.d
    };
}


function selectShape(event, svg, pt) {
    if (props.activeTool != 'Select') return false;

    const clickedShape = findShapeAtPoint(pt);
    if (clickedShape) {
        // Ensure the shape has an ID for tracking
        if (!clickedShape.id) {
            clickedShape.id = `${clickedShape.type}_${Date.now()}_${Math.random()}`;
        }
        selectedShape.value = clickedShape;
        emit('shapeSelected', clickedShape);
        return true;
    }

    selectedShape.value = null;
    return false;
}

function findShapeAtPoint(pt) {
    if (!props.shapes) return null;

    for (let i = props.shapes.length - 1; i >= 0; i--) {
        const shape = props.shapes[i];
        if (shape.type == 'rect') {
            if (pt.x >= shape.x && pt.x <= shape.x + shape.width && pt.y >= shape.y && pt.y <= shape.y + shape.height) {
                return shape;
            }
        } else if (shape.type == 'ellipse') {
            const dx = (pt.x - shape.cx) / shape.rx;
            const dy = (pt.y - shape.cy) / shape.ry;
            if (dx * dx + dy * dy <= 1) {
                return shape;
            }
        } else if (shape.type == 'line') {
            const dist = distanceToLine(pt, shape.x1, shape.y1, shape.x2, shape.y2);
            if (dist < 10) {
                return shape;
            }
        } else if (shape.type == 'ring') {
            const dist = Math.sqrt(Math.pow(pt.x - shape.cx, 2) + Math.pow(pt.y - shape.cy, 2));
            if (dist <= shape.outerRadius && dist >= shape.innerRadius) {
                return shape;
            }
        }
    }

    return null;
}


function distanceToLine(pt, x1, y1, x2, y2) {
    const A = pt.x - x1;
    const B = pt.y - y1;
    const C = x2 - x1;
    const D = y2 - y1;

    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;

    if (lenSq != 0) {
        param = dot / lenSq;
    }

    let xx, yy;
    if (param < 0) {
        xx = x1;
        yy = y1;
    } else if (param > 1) {
        xx = x2;
        yy = y2;
    } else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }

    const dx = pt.x - xx;
    const dy = pt.y - yy;

    return Math.sqrt(dx * dx + dy * dy);
}


function startResize(event, handle) {
    event.stopPropagation();
    event.preventDefault();
    
    isResizing.value = true;
    resizeHandle.value = handle;

    // Use currentTarget (the handle) to get ownerSVGElement
    const svg = event.currentTarget.ownerSVGElement;
    startPoint.value = getMousePosition(svg, event);

    // Deep clone the original shape
    originalShape.value = JSON.parse(JSON.stringify(selectedShape.value));

    console.log('Start resize:', handle, 'Original:', originalShape.value);
}


function handleMouseDown(event) {
    if (event.button !== 0) return;
    
    // Don't start a new action if we're already resizing
    if (isResizing.value) {
        return;
    }
    
    const svg = event.currentTarget;
    const pt = getMousePosition(svg, event);

    // Check for selection mode
    if (props.activeTool === 'Select') {
        if (!selectShape(event, svg, pt)) {
            selectedShape.value = null;
        }
        return;
    }

    // Drawing mode
    if (!['Rect', 'Ellipse', 'Line', 'Ring'].includes(props.activeTool)) {
        return;
    }

    isDrawing.value = true;
    startPoint.value = { x: pt.x, y: pt.y };

    // Show preview
    if (props.activeTool === 'Rect') {
        rectPreview.value = { x: pt.x, y: pt.y, width: 0, height: 0, visible: true };
    } else if (props.activeTool === 'Ellipse') {
        ellipsePreview.value = { cx: pt.x, cy: pt.y, rx: 0, ry: 0, visible: true };
    } else if (props.activeTool === 'Line') {
        linePreview.value = { x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y, visible: true };
    } else if (props.activeTool === 'Ring') {
        ringPreview.value = { 
            cx: pt.x, cy: pt.y, 
            outerRadius: 0, innerRadius: 0, 
            visible: true 
        };
    }
}

function handleMouseMove(event) {
    const svg = event.currentTarget;
    const pt = getMousePosition(svg, event);

    // Resizing is handled EXCLUSIVELY by handleGlobalMouseMove now.
    // This prevents double-handling and conflicts.
    if (isResizing.value) {
        return;
    }

    if (isDrawing.value && ['Rect', 'Ellipse', 'Line', 'Ring'].includes(props.activeTool)) {
        if (props.activeTool === 'Rect') {
            const width = pt.x - startPoint.value.x;
            const height = pt.y - startPoint.value.y;
            rectPreview.value = {
                x: width < 0 ? pt.x : startPoint.value.x,
                y: height < 0 ? pt.y : startPoint.value.y,
                width: Math.abs(width),
                height: Math.abs(height),
                visible: true
            };
        } else if (props.activeTool === 'Ellipse') {
            const rx = Math.abs(pt.x - startPoint.value.x);
            const ry = Math.abs(pt.y - startPoint.value.y);
            ellipsePreview.value = {
                cx: startPoint.value.x, 
                cy: startPoint.value.y,
                rx: rx, 
                ry: ry,
                visible: true
            };
        } else if (props.activeTool === 'Line') {
            linePreview.value = {
                x1: startPoint.value.x, 
                y1: startPoint.value.y,
                x2: pt.x, 
                y2: pt.y,
                visible: true
            };
        } else if (props.activeTool === 'Ring') {
            const distance = Math.sqrt(
                Math.pow(pt.x - startPoint.value.x, 2) +
                Math.pow(pt.y - startPoint.value.y, 2)
            );
            ringPreview.value = {
                cx: startPoint.value.x, 
                cy: startPoint.value.y,
                outerRadius: distance, 
                innerRadius: distance * 0.6,
                visible: true
            };
        }
    }
}

function resizeShape(pt) {
    if (!selectedShape.value || !originalShape.value) return;

    const shape = selectedShape.value;
    const orig = originalShape.value;

    if (shape.type === 'rect') {
        const minSize = 5;
        
        switch (resizeHandle.value) {
            case 'nw':
                shape.x = Math.min(pt.x, orig.x + orig.width - minSize);
                shape.y = Math.min(pt.y, orig.y + orig.height - minSize);
                shape.width = Math.max(minSize, orig.x + orig.width - shape.x);
                shape.height = Math.max(minSize, orig.y + orig.height - shape.y);
                break;
            case 'ne':
                shape.y = Math.min(pt.y, orig.y + orig.height - minSize);
                shape.width = Math.max(minSize, pt.x - orig.x);
                shape.height = Math.max(minSize, orig.y + orig.height - shape.y);
                break;
            case 'sw':
                shape.x = Math.min(pt.x, orig.x + orig.width - minSize);
                shape.width = Math.max(minSize, orig.x + orig.width - shape.x);
                shape.height = Math.max(minSize, pt.y - orig.y);
                break;
            case 'se':
                shape.width = Math.max(minSize, pt.x - orig.x);
                shape.height = Math.max(minSize, pt.y - orig.y);
                break;
            case 'n':
                shape.y = Math.min(pt.y, orig.y + orig.height - minSize);
                shape.height = Math.max(minSize, orig.y + orig.height - shape.y);
                break;
            case 's':
                shape.height = Math.max(minSize, pt.y - orig.y);
                break;
            case 'w':
                shape.x = Math.min(pt.x, orig.x + orig.width - minSize);
                shape.width = Math.max(minSize, orig.x + orig.width - shape.x);
                break;
            case 'e':
                shape.width = Math.max(minSize, pt.x - orig.x);
                break;
        }
    }
    else if (shape.type === 'ellipse') {
        const minRadius = 5;
        
        switch (resizeHandle.value) {
            case 'right':
            case 'left':
                shape.rx = Math.max(minRadius, Math.abs(pt.x - orig.cx));
                break;
            case 'top':
            case 'bottom':
                shape.ry = Math.max(minRadius, Math.abs(pt.y - orig.cy));
                break;
        }
    }
    else if (shape.type === 'line') {
        if (resizeHandle.value === 'start') {
            shape.x1 = pt.x;
            shape.y1 = pt.y;
        } else if (resizeHandle.value === 'end') {
            shape.x2 = pt.x;
            shape.y2 = pt.y;
        }
    }
    else if (shape.type === 'ring') {
        const distance = Math.sqrt(
            Math.pow(pt.x - orig.cx, 2) + Math.pow(pt.y - orig.cy, 2)
        );
        
        if (resizeHandle.value === 'outer') {
            shape.outerRadius = Math.max(10, distance);
            if (shape.innerRadius >= shape.outerRadius) {
                shape.innerRadius = Math.max(5, shape.outerRadius - 5);
            }
        } else if (resizeHandle.value === 'inner') {
            shape.innerRadius = Math.max(5, Math.min(distance, shape.outerRadius - 5));
        }
    }
}

function handleMouseUp(event) {
    // Handle resize end (Locally)
    if (isResizing.value) {
        console.log('Local mouse up - stopping resize');
        stopResize();
        return;
    }

    // Handle drawing end
    if (isDrawing.value && ['Rect', 'Ellipse', 'Line', 'Ring'].includes(props.activeTool)) {
        isDrawing.value = false;
        
        // Hide previews
        rectPreview.value.visible = false;
        ellipsePreview.value.visible = false;
        linePreview.value.visible = false;
        ringPreview.value.visible = false;

        // Emit shape creation
        if (props.activeTool === 'Rect' && Math.abs(rectPreview.value.width) > 1 && Math.abs(rectPreview.value.height) > 1) {
            emit('shapeCreated', {
                type: 'rect',
                x: rectPreview.value.x,
                y: rectPreview.value.y,
                width: Math.max(5, Math.abs(rectPreview.value.width)),
                height: Math.max(5, Math.abs(rectPreview.value.height))
            });
        } else if (props.activeTool === 'Ellipse' && (Math.abs(ellipsePreview.value.rx) > 1 || Math.abs(ellipsePreview.value.ry) > 1)) {
            emit('shapeCreated', {
                type: 'ellipse',
                cx: ellipsePreview.value.cx,
                cy: ellipsePreview.value.cy,
                rx: Math.max(5, Math.abs(ellipsePreview.value.rx)),
                ry: Math.max(5, Math.abs(ellipsePreview.value.ry))
            });
        } else if (props.activeTool === 'Line') {
            emit('shapeCreated', {
                type: 'line',
                x1: linePreview.value.x1,
                y1: linePreview.value.y1,
                x2: linePreview.value.x2,
                y2: linePreview.value.y2
            });
        } else if (props.activeTool === 'Ring' && ringPreview.value.outerRadius > 1) {
            emit('shapeCreated', {
                type: 'ring',
                cx: ringPreview.value.cx,
                cy: ringPreview.value.cy,
                outerRadius: Math.max(10, ringPreview.value.outerRadius),
                innerRadius: Math.max(5, ringPreview.value.innerRadius)
            });
        }
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

function handleDoubleClick(event){
    if(selectedShape.value && props.activeTool == 'Select'){
        console.log('Double-clicked shape:', selectedShape.value);
    }
}

function stopResize() {
    console.log('Stopping resize for shape');
    
    // Capture data needed for emit
    const shapeToEmit = selectedShape.value ? { ...selectedShape.value } : null;

    // IMPORTANT: Reset state flags IMMEDIATELY to prevent getting stuck
    // This ensures drag mode is killed even if the emit causes an error
    isResizing.value = false;
    resizeHandle.value = null;
    originalShape.value = null;

    // Now safe to emit - update the actual shape only when resize ends
    // This ensures the shape is updated once with the final size, preventing
    // intermediate marks and shape disappearance issues
    if (shapeToEmit && shapeToEmit.id) {
        emit('shapeModified', shapeToEmit);
    }
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
    touch-action: none;
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

.handle {
    pointer-events: all;
}

.handle:hover {
    fill: #2196f3;
    stroke-width: 3px;
}

/* Resize cursors for rectangle handles */
.cursor-nw { cursor: nw-resize; }
.cursor-ne { cursor: ne-resize; }
.cursor-sw { cursor: sw-resize; }
.cursor-se { cursor: se-resize; }
.cursor-n { cursor: n-resize; }
.cursor-s { cursor: s-resize; }
.cursor-e { cursor: e-resize; }
.cursor-w { cursor: w-resize; }

/* Resize cursors for ellipse handles */
.cursor-right { cursor: ew-resize; }
.cursor-left { cursor: ew-resize; }
.cursor-top { cursor: ns-resize; }
.cursor-bottom { cursor: ns-resize; }

/* Move cursor for line and ring handles */
.cursor-move { cursor: move; }
.cursor-ew-resize { cursor: ew-resize; }
</style>