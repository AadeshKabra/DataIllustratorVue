import { defineStore } from 'pinia';
import * as msc from 'mascot-vis';

// global store for authoring state (scene)
export const useSceneStore = defineStore('scene', {
  state: () => ({
    scene: msc.scene(),
    renderer: msc.renderer("svg", "canvas"),
    datasets: null,
    currentDataTable: null,
    stack: [],
    selected: null,
    directSelected: null,
    readCSV: false,
    undoStack: [],
    redoStack: [],
  }),

  getters: {
    // totalCount(state) {
    //   return state.items.reduce((sum, it) => sum + it.qty, 0)
    // },
  },

  actions: {

    printScene() {
      console.log(this.scene.toJSON())
    },

    addToStack (type) {
      let stackType = type ? type : "undo";
      let scn = this.scene.toJSON();
      // Only iterate over datasets if it exists and is iterable
      if (this.datasets && Array.isArray(this.datasets)) {
        for (let t of this.datasets) {
          if (!(t.id in scn.tables)) {
              scn.tables[t.id] = t.toJSON();
          }
        }
      }

      this.stack.push(JSON.stringify(scn));
      // if (stackType === "undo")
      //   store.dispatch(updateUndoStack({"length": stack.length}));
      // else if (stackType === "redo")
      //   store.dispatch(updateRedoStack({"length": stack.length}));

      // change the buttons on the ToolBar accordingly
      // useEffect(() => {
      //     d3.select("#undoBtn").property("disabled", props.undoStackChanged.length <= 0);
      // }, [props.undoStackChanged]);

    }
  },
})
