<template>
    <!-- <canvas v-if="type === 'canvas'" class="canvas" id="canvas"></canvas>
    <svg v-else class="canvas" id="canvas"></svg> -->
    <svg class="canvas" id="canvas"></svg>
</template>

<script setup>
    import { ref, watch, onMounted, onBeforeUnmount } from "vue";
    import "../css/Canvas.css";
    import * as d3 from "d3";

</script>