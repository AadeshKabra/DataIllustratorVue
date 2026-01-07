<template>

  <div class="app-container">



    <div class="top-panel">
      <ul class="panel-functions">
        <li>Rectangle</li>
        <li>Repeat</li>
        <li>Divide</li>
        <li>Densify</li>
        <li>Classify</li>
      </ul>
    </div>


    <div class="main-layout">

      <div class="canvas">

      </div>

      <div class="data-section">

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

  </div>


</template>

<script setup>
import { ref } from 'vue'

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

function head(n = previousRows.value) {
  return rows.value.slice(0, n)
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
  position: relative;
}

.button-panel {
  background-color: #f5f5f5;
  padding: 10px;
  position: absolute;
  bottom: 180px;
  /* width: 100%; */
  left: 0;
  right: 0;
  display: flex;
  justify-content: flex-end;
}

.import-button {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.table-container {
  height: 180px;
  overflow-y: auto;
  overflow-x: auto;
  border: 1px solid black;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
}

table {
  border-collapse: collapse;
  width: 100%;
}

th {
  font-weight: bold;
  text-align: left;
}

td,
th {
  border: 1px solid black;
  padding: 5px;
}


.side-panels {
  width: 200px;
  flex: 0 0 200px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  border-left: 1px solid #ddd;
}

.layers-section {
  flex: 2 1 0;
  border: 2px solid black;
}

.canvas-section {
  flex: 3 1 0;
  border: 2px solid black;
}

.top-panel {
  display: flex;
  flex-direction: row;
}

.panel-functions {
  display: flex;
  list-style-type: none;
  flex-direction: row;
  gap: 10px;
  background-color: #ddd;
  padding: 5px;
  width: 100%;
}


</style>