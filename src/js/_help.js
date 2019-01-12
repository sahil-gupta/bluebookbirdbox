var logg = console.log;
var d = document;

const THEPATH = window.location.pathname.substring(1);

// get and set
function localstorage(key, value) {
    if (value === undefined) {
        var value = window.localStorage.getItem(key);
        return value && JSON.parse(value);
    }

    window.localStorage.setItem(key, JSON.stringify(value));
}


////////////////

exports.localstorage = localstorage;

