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



      <div class="button-panel">
        <button @click="importData" class="import-button">Import Data</button>
      </div>


      <input type="file" ref="fileInput" accept=".csv" @change="handleFileSelect" style="display: none" />

      <div v-if="rows.length > 0" class="table-container">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in headers" :key="index">
                {{ header }}
              </th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(row, rowIndex) in rows" :key="rowIndex">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>


    <div class="side-panels">
      <div class="layers-section">
        Layers
      </div>


      <div class="canvas-section">
        Canvas
      </div>
    </div>
  </div>



</template>

<script setup>
import ToolBar from "./ToolBar.vue";
import Canvas from "./Canvas.vue";
import { ref } from 'vue';
import EventLayer from "./EventLayer.vue";

const fileInput = ref(null);
const rows = ref([]);
const headers = ref([]);
const previousRows = ref(5);

const activeTool = ref(null);

const shapes = ref({
  rectangles: []
});



function importData() {
  fileInput.value.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split("\n").filter(line => line.trim() != '');

    headers.value = lines[0].split(',').map(h => h.trim());

    // rows.value = lines.map(line => line.split(','));
    rows.value = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
    console.log(rows.value);
  }

  reader.readAsText(file);
}


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

.button-panel {
  background-color: #f5f5f5;
  padding: 10px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  /* height: 50px; */
  position: absolute;  
  bottom: 250px;       
  left: 0;
  right: 0;
  z-index: 10;
}

.import-button {
  padding: 5px 15px;
}

.table-container {
  height: 250px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid black;
  background-color: white;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  font-weight: bold;
  text-align: left;
  background-color: #f0f0f0;
}

td, th {
  border: 1px solid black;
  padding: 5px;
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