import mitt from 'mitt'

const bus = mitt()

var pipeService = {
    
    // define event names
    SELECT_READ_CSV: 'csv',
    SELECT_STATION: 'select_station',
    
    emitReadCSV: function (msg) {
        bus.emit(this.SELECT_READ_CSV, msg)
    },
    onReadCSV: function (callback) {
        bus.on(this.SELECT_READ_CSV, function (msg) {
            callback(msg)
        })
    },

    emitSelectStation: function (msg) {
        bus.emit(this.SELECT_STATION, msg)
    },
    onSelectStation: function (callback) {
        bus.on(this.SELECT_STATION, function (msg) {
            callback(msg)
        })
    },
        
}

export default pipeService