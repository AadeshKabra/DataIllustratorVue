import mitt from 'mitt'

const bus = mitt()

var pipeService = {
    
    // define event names
    SELECT_READ_CSV: 'csv',
    ITEM_UPDATED: 'item_updated',
    
    emitReadCSV: function (msg) {
        bus.emit(this.SELECT_READ_CSV, msg)
    },
    onReadCSV: function (callback) {
        bus.on(this.SELECT_READ_CSV, function (msg) {
            callback(msg)
        })
    },

    emitItemUpdated: function (msg) {
        bus.emit(this.ITEM_UPDATED, msg)
    },
    onItemUpdated: function (callback) {
        bus.on(this.ITEM_UPDATED, function (msg) {
            callback(msg)
        })
    },
        
}

export default pipeService