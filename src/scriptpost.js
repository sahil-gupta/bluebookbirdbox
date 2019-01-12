var logg = console.log;

// js files
const thejsfiles = [
    require('./js/first')
];
// on document ready
$(() => {
    for (var i = 0; i < thejsfiles.length; i++) {
        thejsfiles[i].allcode();
    }
});
