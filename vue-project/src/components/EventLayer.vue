<template>
    <svg
        id="evtLayer"
        class="canvas"
        @dbclick="handleDoubleClick"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
    >
        <!-- <SelectionUI scene={props.scene} renderer={props.renderer}></SelectionUI> -->
        <rect id="rectToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0"></rect>
        <circle id="circleToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0"></circle>
        <line id="lineToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden"></line>
        <path id="polylineToolUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden"></path>
        <circle id="ringToolOuterUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0"></circle>
        <circle id="ringToolInnerUI" style="stroke: #1592e6; strokeWidth: 1.5px; visibility: hidden; fillOpacity: 0"></circle>
    </svg>
</template>

<script setup>


</script>