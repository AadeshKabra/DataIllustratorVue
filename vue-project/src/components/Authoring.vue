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
         
        <EventLayer :activeTool="activeTool" :shapes="allShapes" @shapeCreated="handleShapeCreated" @shapeModified="handleShapeModified"
        @shapeSelected="handleShapeSelected" />
      </div>

      <div class="data-panel-container">  
        <DataPanel></DataPanel>
      </div>

    </div>


    <div class="side-panels">
      <div class="layers-section">
        Layers
        <div v-if="allShapes.length > 0" style="padding: 10px;">
          <div v-for="(shape, index) in allShapes" :key="index" style="padding: 5px; cursor: pointer; border-bottom: 1px solid #ddd;" :style="{backgroundColor: selectedShapeIndex == index ? '#e3f2fd' : 'transparent'}" @click="selectShapeByIndex(index)">
            {{ shape.type }} {{ index + 1 }}
          </div>
        </div>
      </div>


      <div class="canvas-section">
        <PropertyPanel></PropertyPanel>
        <!-- Canvas -->
        <div v-if="selectedShapeIndex != null && allShapes[selectedShapeIndex]" style="padding: 10px;" >
          <h6>Shape Properties</h6>
          <div v-if="allShapes[selectedShapeIndex].type == 'rect'">
            <label>X: <input type="number" v-model.number="allShapes[selectedShapeIndex].x" @change="updateShape"></label><br>
            <label>Y: <input type="number" v-model.number="allShapes[selectedShapeIndex].y" @change="updateShape"></label><br>
            <label>Width: <input type="number" v-model.number="allShapes[selectedShapeIndex].width" @change="updateShape"></label><br>
            <label>Height: <input type="number" v-model.number="allShapes[selectedShapeIndex].height" @change="updateShape"></label>
          </div>

          <div v-if="allShapes[selectedShapeIndex].type == 'ellipse'">
            <label>CX: <input type="number" v-model.number="allShapes[selectedShapeIndex].cx" @change="updateShape"></label><br>
            <label>CY: <input type="number" v-model.number="allShapes[selectedShapeIndex].cy" @change="updateShape"></label><br>
            <label>RX: <input type="number" v-model.number="allShapes[selectedShapeIndex].rx" @change="updateShape"></label><br>
            <label>RY: <input type="number" v-model.number="allShapes[selectedShapeIndex].ry" @change="updateShape"></label>
          </div>

          <div v-if="allShapes[selectedShapeIndex].type == 'line'">
            <label>X1: <input type="number" v-model.number="allShapes[selectedShapeIndex].x1" @change="updateShape"></label><br>
            <label>Y1: <input type="number" v-model.number="allShapes[selectedShapeIndex].y1" @change="updateShape"></label><br>
            <label>X2: <input type="number" v-model.number="allShapes[selectedShapeIndex].x2" @change="updateShape"></label><br>
            <label>Y2: <input type="number" v-model.number="allShapes[selectedShapeIndex].y2" @change="updateShape"></label>
          </div>

          <div v-if="allShapes[selectedShapeIndex].type == 'ring'">
            <label>CX: <input type="number" v-model.number="allShapes[selectedShapeIndex].cx" @change="updateShape"></label><br>
            <label>CY: <input type="number" v-model.number="allShapes[selectedShapeIndex].cy" @change="updateShape"></label><br>
            <label>Outer Radius: <input type="number" v-model.number="allShapes[selectedShapeIndex].outerRadius" @change="updateShape"></label><br>
            <label>Inner Radius: <input type="number" v-model.number="allShapes[selectedShapeIndex].innerRadius" @change="updateShape"></label>

          </div>
        </div>
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
import { ref, onMounted, defineEmits, computed } from 'vue';
import { storeToRefs } from "pinia";


const activeTool = ref(null);
const sceneStore = useSceneStore();
const allShapes = ref([]);
const selectedShapeIndex = ref(null);

const shapes = computed(() =>{
  return {rectangles: sceneStore.scene.marks?.filter(m => m.type == 'rect') || []};
})


function handleToolSelected(tool){
  activeTool.value = tool;
  console.log("Active tool from Authoring: ", activeTool.value);
}

// function head(n = previousRows.value) {
//   return rows.value.slice(0, n)
// }

// function handleShapeCreated(shape){
//   if(shape.type == 'rect'){

//     sceneStore.scene.mark("rect", {
//       left: shape.x,
//       top: shape.y,
//       width: shape.width,
//       height: shape.height,
//       strokeWidth: 2,
//       fillColor: "transparent",
//       strokeColor: "black"
//     });

//   }else if(shape.type == 'ellipse'){
//     sceneStore.scene.mark("circle", {
//       x: shape.cx,
//       y: shape.cy,
//       radius: Math.max(shape.rx, shape.ry),
//       radiusX: shape.rx,
//       radiusY: shape.ry,
//       strokeWidth: 2,
//       fillColor: "transparent",
//       strokeColor: "black"
//     });
//   }else if(shape.type == 'line'){
//     sceneStore.scene.mark('line', {
//       x1: shape.x1,
//       y1: shape.y1,
//       x2: shape.x2,
//       y2: shape.y2,
//       strokeWidth: 2,
//       strokeColor: "black"
//     });
//   }else if(shape.type == 'ring'){
//     sceneStore.scene.mark('ring', {
//       x: shape.cx,
//       y: shape.cy,
//       innerRadius: shape.innerRadius,
//       outerRadius: shape.outerRadius,
//       strokeWidth: 2,
//       fillColor: "black",
//       strokeColor: "transparent"
//     })
//   }
//   sceneStore.renderer.render(sceneStore.scene);
//   sceneStore.addToStack("undo");
// }

function handleShapeCreated(shape){
  // Add unique ID to shape
  const shapeWithId = {
    ...shape,
    id: `${shape.type}_${Date.now()}_${Math.random()}`
  };
  
  // Add to local shapes array for tracking
  allShapes.value.push(shapeWithId);
  
  // Add to mascot-vis scene
  addShapeToScene(shapeWithId);
  
  console.log(`${shape.type} created:`, shapeWithId);
}

// test shape creation using mascot-vis
const emit = defineEmits(['itemSelected']);
onMounted(() => {
  console.log("Authoring component mounted.");
  const sceneStore = useSceneStore();
  const {scene, selected} = storeToRefs(sceneStore);
  scene.value.mark("circle", {x: 50, y: 50,
    radius: 50, fillColor: "none"
  });
  sceneStore.renderer.render(sceneStore.scene);

  // selected.value = "circle0"

  // let item = scene.value.getItem("circle0")
  // console.log("scene", item);

});
// onMounted(() => {
//   console.log("Authoring component mounted.");
//   const sceneStore = useSceneStore();
//   sceneStore.scene.mark("circle", {x: 50, y: 50,
//     radius: 50, fillColor: "none"
//   });
//   sceneStore.renderer.render(sceneStore.scene);
// });

function handleShapeModified(shape){
  const index = allShapes.value.findIndex(s => s.id === shape.id);
  if(index != -1){
    allShapes.value[index] = shape;
    updateShapeInScene(shape, index);
    // Object.assign(allShapes.value[index], shape);
    // updateShapeInScene(allShapes.value[index], index);
  }
}


function handleShapeSelected(shape){
  const index = allShapes.value.findIndex(s => s.id === shape.id);
  selectedShapeIndex.value = index;
}


function selectShapeByIndex(index){
  selectedShapeIndex.value = index;
}

function updateShape(){
  if(selectedShapeIndex.value != null){
    const shape = allShapes.value[selectedShapeIndex.value];
    updateShapeInScene(shape, selectedShapeIndex.value);
  }
}


function addShapeToScene(shape) {
  if(shape.type === 'rect'){
    sceneStore.scene.mark("rect", {
      left: shape.x,
      top: shape.y,
      width: shape.width,
      height: shape.height,
      strokeWidth: 2,
      fillColor: "transparent",
      strokeColor: "black"
    });
  } 
  else if(shape.type === 'ellipse'){
    sceneStore.scene.mark("circle", {
      x: shape.cx,
      y: shape.cy,
      radius: Math.max(shape.rx, shape.ry),
      radiusX: shape.rx,
      radiusY: shape.ry,
      strokeWidth: 2,
      fillColor: "transparent",
      strokeColor: "black"
    });
  }
  else if(shape.type === 'line'){
    sceneStore.scene.mark('line', {
      x1: shape.x1,
      y1: shape.y1,
      x2: shape.x2,
      y2: shape.y2,
      strokeWidth: 2,
      strokeColor: "black"
    });
  }
  else if(shape.type === 'ring'){
    sceneStore.scene.mark('ring', {
      x: shape.cx,
      y: shape.cy,
      innerRadius: shape.innerRadius,
      outerRadius: shape.outerRadius,
      strokeWidth: 2,
      fillColor: "black",
      strokeColor: "black"
    });
  }

  sceneStore.renderer.render(sceneStore.scene);
  sceneStore.addToStack("undo");
}


function updateShapeInScene(shape, index) {
  // Get the corresponding mark from the scene
  const mark = sceneStore.scene.marks[index];
  
  if (!mark) return;
  
  if(shape.type === 'rect'){
    mark.left = shape.x;
    mark.top = shape.y;
    mark.width = shape.width;
    mark.height = shape.height;
  }
  else if(shape.type === 'ellipse'){
    mark.x = shape.cx;
    mark.y = shape.cy;
    mark.radius = Math.max(shape.rx, shape.ry);
    mark.radiusX = shape.rx;
    mark.radiusY = shape.ry;
  }
  else if(shape.type === 'line'){
    mark.x1 = shape.x1;
    mark.y1 = shape.y1;
    mark.x2 = shape.x2;
    mark.y2 = shape.y2;
  }
  else if(shape.type === 'ring'){
    mark.x = shape.cx;
    mark.y = shape.cy;
    mark.innerRadius = shape.innerRadius;
    mark.outerRadius = shape.outerRadius;
  }
  
  sceneStore.renderer.render(sceneStore.scene);
  sceneStore.addToStack("undo");
}

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