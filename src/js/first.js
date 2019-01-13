var logg = console.log;

var vClasses = require('./vueClasses');
var vCodes = require('./vueCodes');

exports.allcode = () => {

    vClasses.run();
    vCodes.run();

}