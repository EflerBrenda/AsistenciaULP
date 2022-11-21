const moment = require("moment");

function isOnlyText(valor) {
    return valor && (/^[a-zA-Z ]+$/).test(valor);
}

function isNumber(valor) {
    return valor && (/^[0-9]*$/).test(valor);
}
function isEmail(valor) {
    return valor && (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(valor);
}
function isDate(valor) {
    if (valor) {
        return moment(valor).format('MM-DD-YYYY');
    }
    else {
        return true;
    }
    //return moment(valor).format('MM-DD-YYYY');

}
function isHour(valor) {

    return valor && (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).test(valor);
}



function isValidHour(valorDesde, valorHasta) {
    let horaDesde = moment(valorDesde, 'h:mm');
    let horaHasta = moment(valorHasta, 'h:mm');
    let horaValidaDesde = moment('09:00', 'h:mm');
    let horaValidaHasta = moment('22:00', 'h:mm');

    if (horaDesde <= horaHasta && horaDesde >= horaValidaDesde && horaDesde <= horaValidaHasta && horaHasta <= horaValidaHasta && horaHasta >= horaValidaDesde) {
        return true;

    }
    return false;

}

module.exports = { isOnlyText, isNumber, isEmail, isDate, isHour, isValidHour }


