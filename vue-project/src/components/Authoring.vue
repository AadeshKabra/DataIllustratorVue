<template>
  <!-- <div class="authoring-panel">
      <button>Static Authoring</button>
      <button>Interaction Authoring</button>
  </div> -->
  <div class="main-layout">

    <div class="data-section">
      <ToolBar @toolSelected="handleToolSelected"></ToolBar>

      <div class="canvas-container">
        <Canvas :rectangles="shapes.rectangles"></Canvas>
         
        <EventLayer :activeTool="activeTool" @shapeCreated="handleShapeCreated" />
      </div>

      <div class="data-panel-container">
        <DataPanel></DataPanel>
      </div>

    </div>


    <div class="side-panels">
      <div class="layers-section">
        Layers
      </div>


      <div class="canvas-section">
        <PropertyPanel></PropertyPanel>
      </div>
    </div>
  </div>



</template>

<script setup>
import ToolBar from "./ToolBar.vue";
import Canvas from "./Canvas.vue";
import EventLayer from "./EventLayer.vue";
import DataPanel from "./DataPanel.vue";
import PropertyPanel from "./PropertyPanel.vue";
import { useSceneStore } from '../stores/sceneStore.js';
import { ref, onMounted, defineEmits } from 'vue';
import { storeToRefs } from "pinia";


const activeTool = ref(null);

const shapes = ref({
  rectangles: []
});


function handleToolSelected(tool){
  activeTool.value = tool;
  console.log("Active tool from Authoring: ", activeTool.value);
}

// function head(n = previousRows.value) {
//   return rows.value.slice(0, n)
// }

function handleShapeCreated(shape){
  if(shape.type == 'rect'){
    shapes.value.rectangles.push({
      x: shape.x,
      y: shape.y,
      width: shape.width,
      height: shape.height
    });
    console.log('Rectangle created', shape);
  }
}

// test shape creation using mascot-vis
const emit = defineEmits(['itemSelected']);
onMounted(() => {
  console.log("Authoring component mounted.");
  const sceneStore = useSceneStore();
  const {scene, selectedItem} = storeToRefs(sceneStore);
  scene.value.mark("circle", {x: 50, y: 50,
    radius: 50, fillColor: "none"
  });
  sceneStore.renderer.render(sceneStore.scene);

  selectedItem.value = "circle0"

  // let item = scene.value.getItem("circle0")
  // console.log("scene", item);

});

</script>



<style scoped>
.main-layout {
  display: flex;
  height: 100vh;
  width: 100%;
}

.data-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.canvas-container {
  position: relative;
  flex: 1;
  width: 100%;
  margin-top: 45px;
  margin-bottom: 300px;  
  overflow: hidden;
  background-color: #f9f9f9;
}


.side-panels {
  width: 200px;
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #ddd;
}

.layers-section {
  flex: 2;
  border: 2px solid black;
  margin-top: 45px;
  overflow: auto;
}

.canvas-section {
  flex: 3;
  border: 2px solid black;
  overflow: auto;
}
</style>