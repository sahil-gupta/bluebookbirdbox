var logg = console.log;
var d = document;
d.f = document.querySelector;
d.c = document.createElement;

var _help = require('./_help');
var _colors = require('./_colors');
var _focus = require('./_focus');
var _collegesample = require('./_collegesample');

var WIDTHCONTROL = .99;                 // flexible
var SECRETFACTOR = WIDTHCONTROL * .048; // fixed

var BILLBOARDY = .068 * WIDTHCONTROL;   // billboard is whatever is behind text
var BILLBOARDZ = 0;                     // infinitesimally thin

var FOLLOWRANGE = 7;

var ANGL35 = 35;
var ANGL18 = 18;

// Note:
// Frontend 'solids'  = 'events' + 'things'
// Backend  '/events' = 'events' + 'things'

function genrandomtimes(nevents) {
    var startsec = moment().startOf('day').unix();
    var out = [];
    for (var i = 0; i < nevents; i++) {
        out.push(startsec + _help.SECONDSINDAY * 8 / 24 + Math.random() * _help.SECONDSINDAY * 16 / 24);
    }
    out = _.sortBy(out, (s) => { return s; });
    out = _.map(out, (s) => { return moment.unix(s).format('ha'); });
    return out;
}

function drawtiles() {
    const containersquares = d.f('#aframetilessquares');
    const containertexts = d.f('#aframetilestexts');

    for (var i = _help.RANGEFUTURE; i <= _help.RANGEPAST; i++) {
        var theday = moment().add(-i, 'd');

        var elsquare = d.c('a-entity');
        $(elsquare).data('iiiii', i);
        elsquare.addEventListener('click', (evt) => {
            var detail = {
                point: evt.detail.intersection.point,
                i: $(evt.currentTarget).data('iiiii')
            };
            evt.currentTarget.emit('clickday', detail, true);
        });
        // elsquare.addEventListener('mouseenter'...
        var thepos = _help.getxyz(i);
        elsquare.setAttribute('position', thepos);
        elsquare.object3D.scale.set(_help.SQSIZE, _help.SQTHICKNESS, _help.SQSIZE);
        elsquare.setAttribute('geometry', 'primitive', 'box');
        elsquare.setAttribute('geometry', 'buffer', 'false');
        elsquare.setAttribute('shadow', 'cast', false);
        elsquare.setAttribute('shadow', 'receive', true);
        elsquare.setAttribute('material', 'color', '#ffffff');
        elsquare.setAttribute('material', 'opacity', 0);
        containersquares.appendChild(elsquare);
        elsquare.setAttribute('animation__opc', `property: components.material.material.opacity; dur: 997; delay: 0; easing: easeInOutQuad; to: 1`);

        var textsgroup = d.c('a-entity');
        $(textsgroup).data('iiiii', i);
        textsgroup.setAttribute('position', thepos);
        var textdaystring = d.c('a-text');
        var textdaynum = d.c('a-text');
        var colortx;
        if (i === 0) {
            textdaystring.id = 'todaytext1';
            textdaynum.id = 'todaytext2';
            colortx = '#333333';
        } else {
            colortx = '#010101';
        }
        textdaystring.object3D.position.set(-.390, .0360, .35);
        textdaystring.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        textdaystring.setAttribute('width', 1.5);
        textdaystring.setAttribute('shader', 'msdf');
        textdaystring.setAttribute('color', colortx);
        textdaystring.setAttribute('align', 'left');
        textdaystring.setAttribute('anchor', 'align');
        textdaystring.setAttribute('font', _help.getfont(4));
        textdaystring.setAttribute('negate', false);
        textdaystring.setAttribute('value', theday.format('ddd'));
        textsgroup.appendChild(textdaystring);

        textdaynum.object3D.position.set(.390, .0360, .35);
        textdaynum.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        textdaynum.setAttribute('width', 1.5);
        textdaynum.setAttribute('shader', 'msdf');
        textdaynum.setAttribute('color', colortx);
        textdaynum.setAttribute('align', 'right');
        textdaynum.setAttribute('anchor', 'align');
        textdaynum.setAttribute('font', _help.getfont(4));
        textdaynum.setAttribute('negate', false);
        textdaynum.setAttribute('value', (theday.month() === 0 && theday.date() === 1) ? theday.format('M/D/YYYY') : theday.format('M/D'));
        textsgroup.appendChild(textdaynum);

        textsgroup.setAttribute('material', 'opacity', 0);
        containertexts.appendChild(textsgroup);
        textsgroup.setAttribute('animation__opc', `property: components.material.material.opacity; dur: 997; delay: 0; easing: easeInOutQuad; to: 1`);
    }

    containersquares.setAttribute('geometry-merger', 'preserveOriginal', 'false');
    containertexts.setAttribute('geometry-merger', 'preserveOriginal', 'false');
}

function drawfollowtiles(xline) {
    const containersquares = d.f('#aframefollowtilessquares');
    const containertexts = d.f('#aframefollowtilestexts');

    for (var i = -FOLLOWRANGE; i <= 0; i++) {
        var theday = moment().add(-i, 'd');

        var elsquare = d.c('a-entity');
        $(elsquare).data('iiiii', i);
        $(elsquare).data('xxxxx', xline);
        // elsquare.addEventListener('click', (evt) => {
        //     var detail = {
        //         'iiiii': $(evt.currentTarget).data('iiiii'),
        //         'xxxxx': $(evt.currentTarget).data('xxxxx')
        //     };
        //     evt.currentTarget.emit('clickfollowday', detail, true);
        // });
        var thepos = _help.getfollowxyz(i, xline);
        elsquare.setAttribute('position', thepos);
        elsquare.object3D.scale.set(_help.SQSIZE, _help.SQTHICKNESS, _help.SQSIZE);
        elsquare.setAttribute('geometry', 'primitive', 'box');
        elsquare.setAttribute('geometry', 'buffer', 'false');
        elsquare.setAttribute('shadow', 'cast', false);
        elsquare.setAttribute('shadow', 'receive', true);
        elsquare.setAttribute('material', 'color', '#fafafa');
        elsquare.setAttribute('material', 'opacity', 0);
        containersquares.appendChild(elsquare);
        elsquare.setAttribute('animation__opc', `property: components.material.material.opacity; dur: 997; delay: 0; easing: easeInOutQuad; to: 1`);

        var textsgroup = d.c('a-entity');
        $(textsgroup).data('iiiii', i);
        textsgroup.setAttribute('position', thepos);
        var textdaystring = d.c('a-text');
        var textdaynum = d.c('a-text');
        var colortx = '#020202';
        textdaystring.object3D.position.set(-.390, .0360, .35);
        textdaystring.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        textdaystring.setAttribute('width', 1.5);
        textdaystring.setAttribute('shader', 'msdf');
        textdaystring.setAttribute('color', colortx);
        textdaystring.setAttribute('align', 'left');
        textdaystring.setAttribute('anchor', 'align');
        textdaystring.setAttribute('font', _help.getfont(4));
        textdaystring.setAttribute('negate', false);
        textdaystring.setAttribute('value', theday.format('ddd'));
        textsgroup.appendChild(textdaystring);

        textdaynum.object3D.position.set(.390, .0360, .35);
        textdaynum.object3D.rotation.set(THREE.Math.degToRad(-90), 0, 0);
        textdaynum.setAttribute('width', 1.5);
        textdaynum.setAttribute('shader', 'msdf');
        textdaynum.setAttribute('color', colortx);
        textdaynum.setAttribute('align', 'right');
        textdaynum.setAttribute('anchor', 'align');
        textdaynum.setAttribute('font', _help.getfont(4));
        textdaynum.setAttribute('negate', false);
        textdaynum.setAttribute('value', (theday.month() === 0 && theday.date() === 1) ? theday.format('M/D/YYYY') : theday.format('M/D'));
        textsgroup.appendChild(textdaynum);

        textsgroup.setAttribute('material', 'opacity', 0);
        containertexts.appendChild(textsgroup);
        textsgroup.setAttribute('animation__opc', `property: components.material.material.opacity; dur: 997; delay: 0; easing: easeInOutQuad; to: 1`);
    }

    containersquares.setAttribute('geometry-merger', 'preserveOriginal', 'false');
    containertexts.setAttribute('geometry-merger', 'preserveOriginal', 'false');
}

// type: thing or event
function makesamplesolid(solidgroup, xpos, ypos, zpos, type, specialtime, i) {
    var geocolor;
    geocolor = _colors.getcolor();
    if (i > 0) {
        geocolor = tinycolor(geocolor).desaturate(100).toHexString();
    }

    var thegeo;
    var georadius = .04;

    if (type === 'thing') {
        thegeo = d.c('a-sphere');
        thegeo.setAttribute('radius', georadius * 1.202);
        thegeo.object3D.position.set(xpos, ypos + georadius, zpos);
        thegeo.setAttribute('scale-on-mouseenter', '');
        // thegeo.setAttribute('material', 'emissive', '#080808'); // to avoid dark underbelly
    } else if (type === 'event') {
        thegeo = d.c('a-box');
        var boxwidth = georadius * 2;
        var boxheight = georadius * 2; // could be scaled up
        thegeo.setAttribute('scale', `${boxwidth} ${boxheight} ${boxwidth}`);
        thegeo.object3D.position.set(xpos, ypos + boxheight / 2, zpos);
        thegeo.object3D.rotation.y = THREE.Math.degToRad(22.5);
        thegeo.setAttribute('spin-on-mouseenter', '');
    }

    thegeo.setAttribute('color', geocolor);
    thegeo.setAttribute('shadow', 'cast', true);
    thegeo.setAttribute('shadow', 'receive', false);
    solidgroup.appendChild(thegeo);

    var rawtext = type === 'thing' ? _collegesample.getthing() : specialtime + ' ' + _collegesample.getevent(); // space delimit
    var rawtextlen = _help.measuretext(rawtext, SECRETFACTOR);

    var fontxshift = georadius * 1.2 + .05;
    var fontyshift = (BILLBOARDZ / 2 + .001) * Math.sin(THREE.Math.degToRad(ANGL35));
    var fontzshift = (BILLBOARDZ / 2 + .001) * Math.cos(THREE.Math.degToRad(ANGL35));

    var poseltextwrap = {};
    var poselrounded = {};
    poseltextwrap = { x: xpos + fontxshift, y: ypos + georadius + fontyshift, z: zpos + fontzshift };
    poselrounded = { x: xpos + fontxshift + rawtextlen / 2 - .0049, y: ypos + georadius, z: zpos };

    var eltextwrap = d.c('a-entity');
    eltextwrap.object3D.position.set(poseltextwrap.x, poseltextwrap.y, poseltextwrap.z);
    var eltext = d.c('a-text');
    eltext.object3D.position.set(0, .010, 0); // shift before rotation
    eltext.setAttribute('rotation', `-${ANGL35} 0 0`);
    eltext.setAttribute('width', WIDTHCONTROL);
    eltext.setAttribute('shader', 'msdf');
    eltext.setAttribute('align', 'left');
    eltext.setAttribute('anchor', 'align');
    eltext.setAttribute('color', '#fbfbfb');
    eltext.setAttribute('font', _help.getfont(25));
    eltext.setAttribute('negate', false);
    eltext.setAttribute('value', rawtext);
    eltextwrap.appendChild(eltext);
    solidgroup.appendChild(eltextwrap);

    var elrounded = d.c('a-rounded');
    elrounded.object3D.position.set(poselrounded.x, poselrounded.y, poselrounded.z);
    elrounded.setAttribute('color', geocolor);
    elrounded.setAttribute('rotation', `-${ANGL35} 0 0`);
    elrounded.setAttribute('width', rawtextlen + .03);
    elrounded.setAttribute('height', BILLBOARDY);
    elrounded.setAttribute('radius', .0101);
    elrounded.setAttribute('shadow', 'cast', true);
    elrounded.setAttribute('shadow', 'receive', false);
    solidgroup.appendChild(elrounded);
}

// type: thing or event
function makerealsolid(solidgroup, xpos, ypos, zpos, type, rawtext, color, i) {
    var geocolor = color;
    if (i > 0) {
        geocolor = tinycolor(geocolor).desaturate(100).toHexString();
    }

    var thegeo;
    var georadius = .04;

    if (type === 'thing') {
        thegeo = d.c('a-sphere');
        thegeo.setAttribute('radius', georadius * 1.202);
        thegeo.object3D.position.set(xpos, ypos + georadius, zpos);
        thegeo.setAttribute('scale-on-mouseenter', '');
        // thegeo.setAttribute('material', 'emissive', '#080808'); // to avoid dark underbelly
    } else if (type === 'event') {
        thegeo = d.c('a-box');
        var boxwidth = georadius * 2;
        var boxheight = georadius * 2; // could be scaled up
        thegeo.setAttribute('scale', `${boxwidth} ${boxheight} ${boxwidth}`);
        thegeo.object3D.position.set(xpos, ypos + boxheight / 2, zpos);
        thegeo.object3D.rotation.y = THREE.Math.degToRad(22.5);
        thegeo.setAttribute('spin-on-mouseenter', '');
    }

    thegeo.setAttribute('color', geocolor);
    thegeo.setAttribute('shadow', 'cast', true);
    thegeo.setAttribute('shadow', 'receive', false);
    solidgroup.appendChild(thegeo);

    var rawtextlen = _help.measuretext(rawtext, SECRETFACTOR);

    var fontxshift = xpos + .111;
    var fontyshift = (BILLBOARDZ / 2 + .001) * Math.sin(THREE.Math.degToRad(ANGL35));
    var fontzshift = (BILLBOARDZ / 2 + .001) * Math.cos(THREE.Math.degToRad(ANGL35));

    var eltextwrap = d.c('a-entity');
    eltextwrap.object3D.position.set(fontxshift, ypos + georadius + fontyshift, zpos + fontzshift);
    var eltext = d.c('a-text');
    eltext.object3D.position.set(0, .010, 0); // shift before rotation
    eltext.setAttribute('rotation', `-${ANGL35} 0 0`);
    eltext.setAttribute('width', WIDTHCONTROL);
    eltext.setAttribute('shader', 'msdf');
    eltext.setAttribute('align', 'left');
    eltext.setAttribute('anchor', 'align');
    eltext.setAttribute('color', '#fbfbfb');
    eltext.setAttribute('font', _help.getfont(25));
    eltext.setAttribute('negate', false);
    eltext.setAttribute('value', rawtext);
    eltextwrap.appendChild(eltext);
    solidgroup.appendChild(eltextwrap);

    var elrounded = d.c('a-rounded');
    elrounded.object3D.position.set(fontxshift + rawtextlen / 2 - .0049, ypos + georadius, zpos);
    elrounded.setAttribute('color', geocolor);
    elrounded.setAttribute('rotation', `-${ANGL35} 0 0`);
    elrounded.setAttribute('width', rawtextlen + .03);
    elrounded.setAttribute('height', BILLBOARDY);
    elrounded.setAttribute('radius', .0101);
    elrounded.setAttribute('shadow', 'cast', true);
    elrounded.setAttribute('shadow', 'receive', false);
    solidgroup.appendChild(elrounded);
}

function drawsamplesolids() {
    const containersolids = d.f('#aframesolids');

    for (var i = _help.RANGEFUTURE; i <= _help.RANGEPAST; i++) {
        var thepos = _help.getxyz(i);
        var solidsgroup = d.c('a-entity');
        $(solidsgroup).data('iiiii', i);
        solidsgroup.setAttribute('position', thepos);

        var nthings, nevents;
        if (i > 0) {
            nthings = Math.max(0, Math.floor(Math.random() * (-i * .1 + 2) + 1));
            nevents = Math.max(0, Math.floor(Math.random() * (-i * .333 + 4) + 1));
        } else {
            nthings = Math.max(0, Math.floor(Math.random() * (i * .1 + 2) + 1));
            nevents = Math.max(0, Math.floor(Math.random() * (i * .333 + 4) + 1));
        }
        var neventtimes = genrandomtimes(nevents);

        var xgap = 0; //(_help.SQSIZE / (1 + nthings + nevents)) / SQUEEZE;
        var xpos = -.3; //(-_help.SQSIZE / 2) / SQUEEZE + xgap;
        var ygap = 0;
        var ypos = .07;
        var zgap = _help.SQSIZE / (1 + nthings + nevents);
        var zpos = _help.SQSIZE / 2 - zgap;

        for (var j = 0; j < nthings; j++) {
            var solidgroup = d.c('a-entity');
            makesamplesolid(solidgroup, xpos, ypos, zpos, 'thing', undefined, i);
            solidsgroup.appendChild(solidgroup);

            xpos += xgap;
            ypos += ygap;
            zpos -= zgap;
        }

        for (var j = 0; j < nevents; j++) {
            var solidgroup = d.c('a-entity');
            makesamplesolid(solidgroup, xpos, ypos, zpos, 'event', neventtimes[j], i);
            solidsgroup.appendChild(solidgroup);

            xpos += xgap;
            ypos += ygap;
            zpos -= zgap;
        }

        containersolids.appendChild(solidsgroup);
    }
}

// fireevents are ascending
function drawsolids(fireevents, colorsolid) {
    if (fireevents == undefined) {
        fireevents = _help.localstorage('magic_fireevents');
    } else {
        _help.localstorage('magic_fireevents', fireevents);
    }
    if (colorsolid == undefined) {
        colorsolid = _help.localstorage('magic_colorsolid');
    } else {
        _help.localstorage('magic_colorsolid', colorsolid);
    }

    const containersolids = d.f('#aframesolids');

    var parent = containersolids;
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }

    // for all the firebase events, group by day
    var clusteredsolids = {};
    for (var i = 0; i < fireevents.length; i++) {
        var flatday = null;
        if (fireevents[i].data.when_onlydaymatters) {
            var daystring = moment.unix(fireevents[i].data.when_start_s).utc().format('YYYY-MM-DD');
            flatday = moment(daystring).startOf('day');
        } else {
            flatday = moment.unix(fireevents[i].data.when_start_s).startOf('day');
        }
        var clusterkey = (moment().startOf('day').diff(flatday, 'days')).toString();

        if (!clusteredsolids[clusterkey]) {
            clusteredsolids[clusterkey] = [];
        }
        clusteredsolids[clusterkey].push(fireevents[i]);
    }

    for (var i = _help.RANGEFUTURE; i <= _help.RANGEPAST; i++) {
        var solids = clusteredsolids[i.toString()];
        if (!solids) { // nothing on this day
            continue;
        }

        var thepos = _help.getxyz(i);
        var solidsgroup = d.c('a-entity');
        $(solidsgroup).data('iiiii', i);
        solidsgroup.setAttribute('position', thepos);

        var xgap = 0; // (_help.SQSIZE / (1 + solids.length)) / SQUEEZE;
        var xpos = -.3; // (-_help.SQSIZE / 2) / SQUEEZE + xgap;
        var ygap = 0;
        var ypos = .07;
        var zgap = _help.SQSIZE / (1 + solids.length);
        var zpos = _help.SQSIZE / 2 - zgap;

        // do things
        for (var j = 0; j < solids.length; j++) {
            if (!solids[j].data.when_onlydaymatters) {
                continue;
            }

            var solidgroup = d.c('a-entity');
            $(solidgroup).data('mydata', solids[j]);
            solidgroup.id = 'id' + solids[j].id;
            solidgroup.addEventListener('click', (evt) => {
                var detail = $(evt.currentTarget).data('mydata');
                evt.currentTarget.emit('clicksolid', detail, true);
            });

            var rawtext = solids[j].data.what_title;
            var colorthing = solids[j].data.what_color || colorsolid; // default to user's favorite color
            makerealsolid(solidgroup, xpos, ypos, zpos, 'thing', rawtext, colorthing, i);
            solidsgroup.appendChild(solidgroup);

            xpos += xgap;
            ypos += ygap;
            zpos -= zgap;
        }

        // do events
        for (var j = 0; j < solids.length; j++) {
            if (solids[j].data.when_onlydaymatters) {
                continue;
            }

            var solidgroup = d.c('a-entity');
            $(solidgroup).data('mydata', solids[j]);
            solidgroup.id = 'id' + solids[j].id;
            solidgroup.addEventListener('click', (evt) => {
                var detail = $(evt.currentTarget).data('mydata');
                evt.currentTarget.emit('clicksolid', detail, true);
            });

            var starttime = moment.unix(solids[j].data.when_start_s);
            var rawtime = (starttime.format('m') === '0') ? starttime.format('ha') : starttime.format('h:mma');
            var rawtext = rawtime + ' ' + solids[j].data.what_title; // space delimit
            var colorevent = solids[j].data.what_color || colorsolid; // default to user's favorite color
            if (i > 0) {
                colorevent = tinycolor(colorevent).desaturate(100).toHexString();
            }
            makerealsolid(solidgroup, xpos, ypos, zpos, 'event', rawtext, colorevent, i);
            solidsgroup.appendChild(solidgroup);

            xpos += xgap;
            ypos += ygap;
            zpos -= zgap;
        }

        containersolids.appendChild(solidsgroup);
    }
}

function drawfollowhandles(handle, color, xline) {
    var container = d.f('#aframefollowhandles');
    var athandle = '@' + handle;

    var rawtextlen = _help.measuretext(athandle, SECRETFACTOR);

    var xpoint = xline; // + _help.SQSIZE / 2 * .9;
    var ypoint = _help.HEIGHTX + .1;
    var zpoint = _help.SQSIZE / 2 * .9;

    var fontyshift = (BILLBOARDZ / 2 + .001) * Math.sin(THREE.Math.degToRad(ANGL18));
    var fontzshift = (BILLBOARDZ / 2 + .001) * Math.cos(THREE.Math.degToRad(ANGL18));

    var scalar = 1.1;

    var eltextwrap = d.c('a-entity');
    eltextwrap.object3D.position.set(xpoint, ypoint + fontyshift, zpoint + fontzshift);
    var eltext = d.c('a-text');
    eltext.object3D.position.set(0, scalar * .010, 0); // shift before rotation
    eltext.setAttribute('rotation', `-${ANGL18} 0 0`);
    eltext.setAttribute('width', WIDTHCONTROL * scalar);
    eltext.setAttribute('shader', 'msdf');
    eltext.setAttribute('align', 'center');
    eltext.setAttribute('anchor', 'align');
    eltext.setAttribute('color', '#fbfbfb');
    eltext.setAttribute('font', _help.getfont(4));
    eltext.setAttribute('negate', false);
    eltext.setAttribute('value', athandle);
    eltextwrap.appendChild(eltext);
    container.appendChild(eltextwrap);

    var elrounded = d.c('a-rounded');
    elrounded.object3D.position.set(xpoint, ypoint, zpoint);
    // elrounded.object3D.position.set(xpoint - scalar * (rawtextlen / 2 - .0049), ypoint, zpoint);
    elrounded.setAttribute('color', color);
    elrounded.setAttribute('rotation', `-${ANGL18} 0 0`);
    elrounded.setAttribute('width', scalar * rawtextlen + .03);
    elrounded.setAttribute('height', scalar * BILLBOARDY);
    elrounded.setAttribute('radius', .0401);
    elrounded.setAttribute('shadow', 'cast', true);
    elrounded.setAttribute('shadow', 'receive', false);
    container.appendChild(elrounded);
}

// fireevents are ascending
function drawfollowsolids(fireevents, colorsolid, xline) {
    if (colorsolid == undefined) {
        colorsolid = '#666666';
    }

    const containersolids = d.f('#aframefollowsolids');

    // for all the firebase events, group by day
    var clusteredsolids = {};
    for (var i = 0; i < fireevents.length; i++) {
        var flatday = null;
        if (fireevents[i].data.when_onlydaymatters) {
            var daystring = moment.unix(fireevents[i].data.when_start_s).utc().format('YYYY-MM-DD');
            flatday = moment(daystring).startOf('day');
        } else {
            flatday = moment.unix(fireevents[i].data.when_start_s).startOf('day');
        }
        var clusterkey = (moment().startOf('day').diff(flatday, 'days')).toString();

        if (!clusteredsolids[clusterkey]) {
            clusteredsolids[clusterkey] = [];
        }
        clusteredsolids[clusterkey].push(fireevents[i]);
    }

    for (var i = -FOLLOWRANGE; i <= 0; i++) {
        var solids = clusteredsolids[i.toString()];
        if (!solids) { // nothing on this day
            continue;
        }

        var thepos = _help.getfollowxyz(i, xline);
        var solidsgroup = d.c('a-entity');
        $(solidsgroup).data('iiiii', i);
        solidsgroup.setAttribute('position', thepos);

        var xgap = 0; // (_help.SQSIZE / (1 + solids.length)) / SQUEEZE;
        var xpos = -.3; // (-_help.SQSIZE / 2) / SQUEEZE + xgap;
        var ygap = 0;
        var ypos = .07;
        var zgap = _help.SQSIZE / (1 + solids.length);
        var zpos = _help.SQSIZE / 2 - zgap;

        // do things
        for (var j = 0; j < solids.length; j++) {
            if (!solids[j].data.when_onlydaymatters) {
                continue;
            }

            var solidgroup = d.c('a-entity');
            $(solidgroup).data('mydata', solids[j]);
            solidgroup.id = 'id' + solids[j].id;

            var rawtext = solids[j].data.what_title;
            var colorthing = solids[j].data.what_color || colorsolid; // default to user's favorite color
            makerealsolid(solidgroup, xpos, ypos, zpos, 'thing', rawtext, colorthing, i);
            solidsgroup.appendChild(solidgroup);

            xpos += xgap;
            ypos += ygap;
            zpos -= zgap;
        }

        // do events
        for (var j = 0; j < solids.length; j++) {
            if (solids[j].data.when_onlydaymatters) {
                continue;
            }

            var solidgroup = d.c('a-entity');
            $(solidgroup).data('mydata', solids[j]);
            solidgroup.id = 'id' + solids[j].id;

            var starttime = moment.unix(solids[j].data.when_start_s);
            var rawtime = (starttime.format('m') === '0') ? starttime.format('ha') : starttime.format('h:mma');
            var rawtext = rawtime + ' ' + solids[j].data.what_title; // space delimit
            var colorevent = solids[j].data.what_color || colorsolid; // default to user's favorite color
            if (i > 0) {
                colorevent = tinycolor(colorevent).desaturate(100).toHexString();
            }
            makerealsolid(solidgroup, xpos, ypos, zpos, 'event', rawtext, colorevent, i);
            solidsgroup.appendChild(solidgroup);

            xpos += xgap;
            ypos += ygap;
            zpos -= zgap;
        }

        containersolids.appendChild(solidsgroup);
    }


}

function movetiles() {
    var kidsquares = d.f('#aframetilessquares').children;
    for (var a = 0; a < kidsquares.length; a++) {
        var i = $(kidsquares[a]).data('iiiii');
        var thepos = _help.getxyz(i);
        var stringpos = AFRAME.utils.coordinates.stringify(thepos);

        kidsquares[a].setAttribute('animation__pos', `property: position; dur: 2000; easing: easeInOutQuad; to: ${stringpos}`);
    }

    var kidtexts = d.f('#aframetilestexts').children;
    for (var a = 0; a < kidtexts.length; a++) {
        var i = $(kidtexts[a]).data('iiiii');
        var thepos = _help.getxyz(i);
        var stringpos = AFRAME.utils.coordinates.stringify(thepos);

        kidtexts[a].setAttribute('animation__pos', `property: position; dur: 2000; easing: easeInOutQuad; to: ${stringpos}`);
    }
}

function movesolids() {
    var kidsolidsgroups = d.f('#aframesolids').children;
    for (var a = 0; a < kidsolidsgroups.length; a++) {
        var i = $(kidsolidsgroups[a]).data('iiiii');
        var thepos = _help.getxyz(i);

        kidsolidsgroups[a].setAttribute('animation__pos', `property: position; dur: 2000; easing: easeInOutQuad; to: ${AFRAME.utils.coordinates.stringify(thepos)}`);
    }
}

function newtodaycolor(color) {
    _focus.newfocuscolor(color);

    // change today text color
    d.f('#todaytext1').setAttribute('animation__col', `property: color; dur: ${500}; easing: easeInOutQuad; to: ${color}`);
    d.f('#todaytext2').setAttribute('animation__col', `property: color; dur: ${500}; easing: easeInOutQuad; to: ${color}`);
}

//////////////

exports.drawtiles = drawtiles;
exports.drawsolids = drawsolids;
exports.drawsamplesolids = drawsamplesolids;

exports.drawfollowtiles = drawfollowtiles;
exports.drawfollowsolids = drawfollowsolids;
exports.drawfollowhandles = drawfollowhandles;

exports.movetiles = movetiles;
exports.movesolids = movesolids;

exports.newtodaycolor = newtodaycolor;
