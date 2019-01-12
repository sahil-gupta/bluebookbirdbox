var logg = console.log;
var d = document;
d.f = document.querySelector;
d.c = document.createElement;

const DAYFLAG = 7;
const SECONDSINDAY = 86400;
const TODAY = moment().startOf('day');
const RANGEFUTURE = TODAY.diff(moment('2020-05-20'), 'days');   // negative number
const RANGEPAST = TODAY.diff(moment('2019-01-01'), 'days');     // positive number

const HEIGHTFLOOR = 60.01;
const HEIGHTX = HEIGHTFLOOR + 1.5;
const SQSIZE = .88;
const SQTHICKNESS = 1 / 20;

const GRIDUPSHIFT = 2;

const THEPATH = window.location.pathname.substring(1);

function mod(n, m) {
    return ((n % m) + m) % m;
}

// get and set
function localstorage(key, value) {
    if (value === undefined) {
        var value = window.localStorage.getItem(key);
        return value && JSON.parse(value);
    }

    window.localStorage.setItem(key, JSON.stringify(value));
}

// pass in i to calculate, else grab from local storage
function getxyz(i) {
    if (i == undefined) {
        i = localstorage('magic_iiiii');
    }

    if (localstorage('magic_gridview')) {
        return {
            x: mod((moment().day() + (-i)), 7) - 3,
            y: HEIGHTX + GRIDUPSHIFT,
            z: - Math.floor((moment().day() + (-i)) / 7)
        };
    } else {
        return {
            x: 0,
            y: HEIGHTX,
            z: i
        }
    }
}
function getfollowxyz(i, xline) {
    return {
        x: xline,
        y: HEIGHTX,
        z: i
    }
}

function pauseshadow(timems) {
    var thescene = d.f('a-scene');
    var light = d.f('#idlitdircam');

    light.setAttribute('light', 'castShadow', false);
    thescene.renderer.shadowMap.needsUpdate = true;

    setTimeout(() => {
        light.setAttribute('light', 'castShadow', true);
        thescene.renderer.shadowMap.needsUpdate = true;
    }, timems);
}

// 0 light, 1 italic, 2 regular, 25 medium, 3 bolditalic, 4 bold
function getfont(flavor) {
    var suffix = '';

    if (flavor === 0) {
        suffix = 'light';
    } else if (flavor === 1) {
        suffix = 'italic';
    } else if (flavor === 2) {
        suffix = '';
    } else if (flavor === 25) {
        suffix = 'med';
    } else if (flavor === 3) {
        suffix = 'bolditalic';
    } else if (flavor === 4) {
        suffix = 'bold';
    }

    var base = 'helv';
    var out = '/phont/' + base + suffix + '-msdf.json';
    return out;
}

function setintervalx(callback, interval, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(() => {
        callback();
        if (++x === repetitions) {
            window.clearInterval(intervalID);
        }
    }, interval);
}

function measuretext(thestring, factor) {
    const widths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.2796875, 0.2765625, 0.3546875, 0.5546875, 0.5546875, 0.8890625, 0.665625, 0.190625, 0.3328125, 0.3328125, 0.3890625, 0.5828125, 0.2765625, 0.3328125, 0.2765625, 0.3015625, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.2765625, 0.2765625, 0.584375, 0.5828125, 0.584375, 0.5546875, 1.0140625, 0.665625, 0.665625, 0.721875, 0.721875, 0.665625, 0.609375, 0.7765625, 0.721875, 0.2765625, 0.5, 0.665625, 0.5546875, 0.8328125, 0.721875, 0.7765625, 0.665625, 0.7765625, 0.721875, 0.665625, 0.609375, 0.721875, 0.665625, 0.94375, 0.665625, 0.665625, 0.609375, 0.2765625, 0.3546875, 0.2765625, 0.4765625, 0.5546875, 0.3328125, 0.5546875, 0.5546875, 0.5, 0.5546875, 0.5546875, 0.2765625, 0.5546875, 0.5546875, 0.221875, 0.240625, 0.5, 0.221875, 0.8328125, 0.5546875, 0.5546875, 0.5546875, 0.5546875, 0.3328125, 0.5, 0.2765625, 0.5546875, 0.5, 0.721875, 0.5, 0.5, 0.5, 0.3546875, 0.259375, 0.353125, 0.5890625]
    const avg = 0.5279276315789471;


    var thelen = thestring
        .split('')
        .map(c => c.charCodeAt(0) < widths.length ? widths[c.charCodeAt(0)] : avg)
        .reduce((cur, acc) => acc + cur) * factor;

    if (thestring.length < 8) {
        thelen *= 1.05;
    }

    return thelen;
}

function removeblinders(timems, dontrepeat) {
    if (dontrepeat === true) {
        if (localstorage('magic_dontrepeat') === true) {
            timems = 10;
        } else {
            localstorage('magic_dontrepeat', true);
        }
    }

    var blinder1 = d.f('#theblinder1');
    var blinder2 = d.f('#theblinder2');
    blinder1.setAttribute('animation__pos', `property: position; dur: ${timems}; easing: easeInOutQuad; to: 0 .825 -1`);
    blinder2.setAttribute('animation__pos', `property: position; dur: ${timems}; easing: easeInOutQuad; to: 0 -.825 -1`);
    setTimeout(() => {
        blinder1.setAttribute('visible', false);
        blinder2.setAttribute('visible', false);

        blinder1.object3D.position.z = 1; // behind cam
        blinder2.object3D.position.z = 1;
    }, timems * 1.1);
}


////////////////
exports.DAYFLAG = DAYFLAG;
exports.SECONDSINDAY = SECONDSINDAY;
exports.TODAY = TODAY;
exports.RANGEFUTURE = RANGEFUTURE;
exports.RANGEPAST = RANGEPAST;

exports.HEIGHTFLOOR = HEIGHTFLOOR;
exports.HEIGHTX = HEIGHTX;
exports.SQSIZE = SQSIZE;
exports.SQTHICKNESS = SQTHICKNESS;

exports.GRIDUPSHIFT = GRIDUPSHIFT;

exports.THEPATH = THEPATH;

exports.mod = mod;
exports.localstorage = localstorage;
exports.getxyz = getxyz;
exports.getfollowxyz = getfollowxyz;
exports.getfont = getfont;
exports.setintervalx = setintervalx;
exports.measuretext = measuretext;
exports.pauseshadow = pauseshadow;
exports.removeblinders = removeblinders;
