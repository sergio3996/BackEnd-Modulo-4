var mongoose = require('mongoose');
var moment = require('moment');
var Schema = mongoose.Schema;

var reservaSchema = new Schema({
    desde: Date,
    hasta: Date,
    bicicleta: { type: mongoose.Schema.Types.ObjectId, ref: 'Bicicleta' },
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
});

reservaSchema.methods.diasDeReserva = function(){
    return moment(this.hasta).diff(moment(this.desde), 'days') + 1;
};

module.exports = mongoose.model('Reserva', reservaSchema);