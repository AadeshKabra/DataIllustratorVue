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
        Canvas
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
import * as msc from 'mascot-vis';


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
  // console.log("Authoring component mounted.");
  // const sceneStore = useSceneStore();
  // const {scene, selectedItem} = storeToRefs(sceneStore);
  // scene.value.mark("circle", {x: 50, y: 50,
  //   radius: 50, fillColor: "none"
  // });
  // sceneStore.renderer.render(sceneStore.scene);

  // selectedItem.value = "circle0"

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
  console.log('handleShapeModified called with:', shape);
  
  // Find the index of the shape in the master list using the unique ID
  const index = allShapes.value.findIndex(s => s.id === shape.id);
  
  if(index !== -1){
    // Update the Vue state - merge the modified properties
    const updatedShape = allShapes.value[index];
    Object.assign(updatedShape, shape);
    
    console.log('Updated shape at index', index, ':', updatedShape);
    
    // Update the visual scene - use the index to find the corresponding mark
    updateShapeInScene(updatedShape, index);
  } else {
    console.warn("Could not find shape to update:", shape.id, shape);
    // Fallback: try to find by matching properties if ID is missing
    if (!shape.id) {
      const fallbackIndex = allShapes.value.findIndex(s => 
        s.type === shape.type && 
        ((s.type === 'rect' && s.x === shape.x && s.y === shape.y) ||
         (s.type === 'ellipse' && s.cx === shape.cx && s.cy === shape.cy) ||
         (s.type === 'line' && s.x1 === shape.x1 && s.y1 === shape.y1) ||
         (s.type === 'ring' && s.cx === shape.cx && s.cy === shape.cy))
      );
      if (fallbackIndex !== -1) {
        Object.assign(allShapes.value[fallbackIndex], shape);
        updateShapeInScene(allShapes.value[fallbackIndex], fallbackIndex);
      }
    }
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
  // Ensure scene is initialized
  if (!sceneStore.scene) {
    console.error('Scene not initialized');
    return;
  }
  
  let mark;
  const shapeId = shape.id || `${shape.type}_${Date.now()}_${Math.random()}`;
  
  try {
    if(shape.type === 'rect'){
      mark = sceneStore.scene.mark("rect", {
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
      mark = sceneStore.scene.mark("circle", {
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
      mark = sceneStore.scene.mark('line', {
        x1: shape.x1,
        y1: shape.y1,
        x2: shape.x2,
        y2: shape.y2,
        strokeWidth: 2,
        strokeColor: "black"
      });
    }
    else if(shape.type === 'ring'){
      mark = sceneStore.scene.mark('ring', {
        x: shape.cx,
        y: shape.cy,
        innerRadius: shape.innerRadius,
        outerRadius: shape.outerRadius,
        strokeWidth: 2,
        fillColor: "black",
        strokeColor: "black"
      });
    }
  } catch (error) {
    console.error('Error creating mark:', error);
    return;
  }

  // Store the mark reference directly with the shape for reliable lookup
  if (mark) {
    // Store shape ID on the mark for reverse lookup
    if (mark.setAttribute) {
      mark.setAttribute('data-shape-id', shapeId);
    } else {
      mark._shapeId = shapeId;
    }
    
    // Store the mark reference directly on the shape - this is the most reliable way
    const shapeIndex = allShapes.value.findIndex(s => s.id === shapeId);
    if (shapeIndex !== -1) {
      // Store direct reference to the mark object
      allShapes.value[shapeIndex]._markRef = mark;
      
      // Store original position for fallback lookup
      if (shape.type === 'rect') {
        allShapes.value[shapeIndex]._originalX = shape.x;
        allShapes.value[shapeIndex]._originalY = shape.y;
      } else if (shape.type === 'ellipse' || shape.type === 'ring') {
        allShapes.value[shapeIndex]._originalX = shape.cx;
        allShapes.value[shapeIndex]._originalY = shape.cy;
      } else if (shape.type === 'line') {
        allShapes.value[shapeIndex]._originalX = shape.x1;
        allShapes.value[shapeIndex]._originalY = shape.y1;
      }
    }
  }

  sceneStore.renderer.render(sceneStore.scene);
  sceneStore.addToStack("undo");
}


function updateShapeInScene(shape, index) {
  // Safety check: ensure scene exists
  if (!sceneStore.scene) {
    console.warn('Scene not available');
    return;
  }
  
  // First, try to use the stored mark reference (most reliable)
  let mark = shape._markRef;
  
  // Verify the mark reference is valid
  if (!mark || mark.type !== getMarkType(shape.type)) {
    mark = null;
  }
  
  // If no stored reference, try to find by shape ID stored on marks
  if (!mark && shape.id) {
    // Try accessing marks array if available
    if (sceneStore.scene.marks && Array.isArray(sceneStore.scene.marks)) {
      mark = sceneStore.scene.marks.find(m => {
        const markShapeId = m._shapeId || (m.getAttribute && m.getAttribute('data-shape-id'));
        return markShapeId === shape.id && m.type === getMarkType(shape.type);
      });
    }
    
    // If still not found, try to get mark by index if marks array exists
    if (!mark && sceneStore.scene.marks && Array.isArray(sceneStore.scene.marks) && sceneStore.scene.marks[index]) {
      const candidateMark = sceneStore.scene.marks[index];
      if (candidateMark.type === getMarkType(shape.type)) {
        mark = candidateMark;
      }
    }
  }
  
  if (!mark) {
    console.warn(`No mark found for shape:`, shape);
    console.log('Shape has _markRef:', !!shape._markRef);
    console.log('Shape ID:', shape.id);
    return;
  }
  
  console.log('Updating mark for shape:', shape.type, 'with properties:', {
    x: shape.x || shape.cx,
    y: shape.y || shape.cy,
    width: shape.width,
    height: shape.height
  });
  
  updateMarkProperties(mark, shape);
  // Don't render here - updateMarkProperties handles rendering
}

function getMarkType(shapeType) {
  // Convert shape type to mark type (ellipse -> circle)
  if (shapeType === 'ellipse') return 'circle';
  return shapeType;
}

function updateMarkProperties(mark, shape) {
  // Instead of trying to manipulate marks directly, create a completely new scene
  // This is the cleanest way to ensure no duplicates
  
  try {
    // First, clear the existing SVG by finding and clearing the canvas
    const canvasElement = document.getElementById('canvas');
    if (canvasElement) {
      // Clear the canvas by removing all child elements
      while (canvasElement.firstChild) {
        canvasElement.removeChild(canvasElement.firstChild);
      }
      
      // Also set innerHTML to empty to ensure no leftover SVG
      canvasElement.innerHTML = '';
    } else {
      console.warn('Canvas element not found with id "canvas"');
    }
    
    // Create a brand new scene
    const newScene = msc.scene();
    
    // Re-create all shapes in the new scene
    allShapes.value.forEach(s => {
      if(s.type === 'rect'){
        newScene.mark("rect", {
          left: Number(s.x),
          top: Number(s.y),
          width: Number(s.width),
          height: Number(s.height),
          strokeWidth: 2,
          fillColor: "transparent",
          strokeColor: "black"
        });
      }
      else if(s.type === 'ellipse'){
        newScene.mark("circle", {
          x: Number(s.cx),
          y: Number(s.cy),
          radius: Math.max(Number(s.rx), Number(s.ry)),
          radiusX: Number(s.rx),
          radiusY: Number(s.ry),
          strokeWidth: 2,
          fillColor: "transparent",
          strokeColor: "black"
        });
      }
      else if(s.type === 'line'){
        newScene.mark('line', {
          x1: Number(s.x1),
          y1: Number(s.y1),
          x2: Number(s.x2),
          y2: Number(s.y2),
          strokeWidth: 2,
          strokeColor: "black"
        });
      }
      else if(s.type === 'ring'){
        newScene.mark('ring', {
          x: Number(s.cx),
          y: Number(s.cy),
          innerRadius: Number(s.innerRadius),
          outerRadius: Number(s.outerRadius),
          strokeWidth: 2,
          fillColor: "transparent",
          strokeColor: "black"
        });
      }
    });
    
    // IMPORTANT: Replace the entire scene in the store
    sceneStore.scene = newScene;
    
    // Re-initialize the renderer to ensure it's fresh
    // This is crucial to prevent old SVG elements from persisting
    sceneStore.renderer = msc.renderer("svg", "canvas");
    
    // Render the new scene
    sceneStore.renderer.render(newScene);
    
    // Force a re-render to ensure everything updates
    setTimeout(() => {
      sceneStore.renderer.render(newScene);
    }, 10);
    
  } catch (error) {
    console.error('Error updating scene:', error);
  }
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
