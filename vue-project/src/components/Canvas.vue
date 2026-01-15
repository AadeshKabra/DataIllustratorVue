<template>
    <!-- <canvas v-if="type === 'canvas'" class="canvas" id="canvas"></canvas>
    <svg v-else class="canvas" id="canvas"></svg> -->
    <!-- <svg class="canvas" id="canvas"></svg> -->
    <svg class="canvas" id="canvas">
        <rect v-for="(rect, index) in rectangles"
        :key="index"
        :x="rect.x"
        :y="rect.y"
        :width="rect.width"
        :height="rect.height"
        fill="transparent"
        stroke="black"/>
    </svg>
</template>

<script setup>
    import { ref, watch, onMounted, onBeforeUnmount, defineEmits } from "vue";
    import "../css/Canvas.css";
    import * as d3 from "d3";

    const props = defineProps({
        rectangles: Array
    })


</script>

<style scoped>
    .canvas{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.5);

    }
</style>