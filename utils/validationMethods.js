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


module.exports = { isOnlyText, isNumber, isEmail, isDate }


