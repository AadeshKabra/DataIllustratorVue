<template>
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

</template>

<script setup>
import { ref } from 'vue';
import {useSceneStore} from '../stores/sceneStore.js';
import { csvFromString } from "mascot-vis";
// import pipeService from '../tools/pipeService.js';

const fileInput = ref(null);
const rows = ref([]);
const headers = ref([]);
const previousRows = ref(5);

function importData() {
  fileInput.value.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];

  if (!file) return;

  const reader = new FileReader();
  const sceneStore = useSceneStore();

  reader.onload = (e) => {
    const text = e.target.result;
    const lines = text.split("\n").filter(line => line.trim() != '');

    headers.value = lines[0].split(',').map(h => h.trim());

    // rows.value = lines.map(line => line.split(','));
    rows.value = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
    console.log(rows.value);

    let f = e.target;
    let tbl = csvFromString(text, file.name)

    sceneStore.datasets = tbl;
    sceneStore.readCSV = true;
    // console.log("Dataset loaded into sceneStore:", tbl.getUniqueFieldValues(field).length);
  }

  reader.readAsText(file);

}

</script>

<style scoped>  

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


</style>