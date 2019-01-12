var logg = console.log;
var d = document;
d.f = document.querySelector;
d.ff = document.querySelectorAll;
d.c = document.createElement;

var _help = require('./_help');
var _colors = require('./_colors');
var _timelines = require('./_timelines');

const fireauth = firebase.auth();
const firestore = firebase.firestore();
const firefunctions = firebase.functions();


const IDVUE = '#vueCrud';

function run() {
    var thevue = new Vue({
        el: IDVUE,
        data: {
            crudinput: '',
            lasttouchinput: -1,
            lasttouchbox: -1,
            theid: null,
            someintervalID: null,
            colorevent: null,
        },
        methods: {
            docreate: function () {
                var self = this;

                self.cleardivsandtimeouts();
                setTimeout(() => {
                    $('#crudinput').fadeIn();
                    $('#crudinput input').focus();
                    self.lasttouchinput = Date.now();
                    self.fadeoutinput10();
                }, 10);
            },
            dodelete: function () {
                var self = this;

                $('#cruddelete').fadeOut(250);
                setTimeout(() => { $('#crudcreate').fadeIn(); }, 250);

                var el1 = d.f('#id' + self.theid + ' a-box') || d.f('#id' + self.theid + ' a-sphere');
                var el2 = d.f('#id' + self.theid + ' a-rounded');
                var el3 = d.f('#id' + self.theid + ' a-text');
                el1.setAttribute('animation__opc', `property: material.opacity; dur: 500; delay: 0; easing: easeInOutQuad; to: 0`);
                el2.setAttribute('animation__opc', `property: rounded.opacity; dur: 500; delay: 0; easing: easeInOutQuad; to: 0`);
                el3.setAttribute('animation__opc', `property: text.opacity; dur: 500; delay: 0; easing: easeInOutQuad; to: 0`);

                setTimeout(() => {
                    firestore.collection('events').doc(self.theid).update({
                        when_destroyed: moment().unix(),
                        when_modified: moment().unix(),
                    }).then(() => {
                        // hereee need more efficient way of redrawing events
                        var fireevents = _help.localstorage('magic_fireevents');
                        _.remove(fireevents, { 'id': self.theid });
                        _timelines.drawsolids(fireevents, undefined);
                    });
                }, 500);
            },
            dosave: function () {
                // hereee validate text

                this.updatedefaultcolor();

                var split = this.crudinput.split(' - ');
                if (split.length === 2) {
                    split.push(this.colorevent);
                }
                if (split.length !== 3) {
                    var temp = this.crudinput;
                    $('#crudinput input').addClass('moon-gray');
                    this.crudinput = 'Title - Time - Color';
                    setTimeout(() => {
                        $('#crudinput input').removeClass('moon-gray');
                        this.crudinput = temp;
                    }, 2000);
                    return;
                }

                var part0 = split[0];
                var part1 = Sherlock.parse(split[1]);
                var part2 = split[2];

                var thetitle = part0.trim();
                if (thetitle.length === 0) {
                    thetitle = '_';
                } else if (thetitle.length > 21) {
                    thetitle = thetitle.substring(0, 20) + '.';
                }
                thetitle = thetitle.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');


                var thepureday = part1.isAllDay;
                var thestart = null;
                var theend = null;
                if (thepureday) {
                    var daystring = moment(part1.startDate).format('YYYY-MM-DD');
                    thestart = moment.utc(daystring).startOf('day').unix() + _help.DAYFLAG;
                    theend = thestart + _help.SECONDSINDAY;
                } else {
                    thestart = moment(part1.startDate).unix();
                    theend = thestart + _help.SECONDSINDAY / 24;
                }


                var thecolor = _colors.stringtocolor(part2);

                $('#crudinput').fadeOut(250);
                setTimeout(() => {
                    this.crudinput = '';
                    $('#crudsaved').fadeIn(250);

                    setTimeout(() => {
                        $('#crudsaved').fadeOut(250);

                        setTimeout(() => {
                            $('#crudcreate').fadeIn(250);

                        }, 250);
                    }, 2000);
                }, 250);

                firestore.collection('events').add({
                    what_title: thetitle,
                    when_created: moment().unix(),
                    when_modified: moment().unix(),
                    when_destroyed: null,
                    when_start_s: thestart,
                    when_end_s: theend,
                    when_reminder_s: null,
                    when_onlydaymatters: thepureday,
                    who_creator: fireauth.currentUser.uid,
                    who_invited: null,
                    who_going: null,
                    who_notgoing: null,
                    what_comments: null,
                    what_color: thecolor,
                    what_hashtags: [],
                    why_importance: 3,
                    where_placestarttext: null,
                    where_placestartobject: null,
                    where_placeendtext: null,
                    where_placeendobject: null,
                    what_sharelevel: 'public',
                    what_locationsharelevel: 'private',
                    what_eventgrouphash: null
                }).then((docref) => {
                    // hereee should be more efficient
                    firefunctions.httpsCallable('myevents')({
                        theuid: fireauth.currentUser.uid,
                        theminstart: _help.TODAY.unix() - (_help.RANGEPAST) * _help.SECONDSINDAY,
                        themaxstart: _help.TODAY.unix() + (-_help.RANGEFUTURE + 1) * _help.SECONDSINDAY,
                    }).then((result) => {
                        _timelines.drawsolids(result.data.thefireevents, undefined);
                    }).catch((err) => { logg(err); });

                    // var fireevents = _help.localstorage('magic_fireevents');
                    // _.remove(fireevents, { 'id': self.theid });
                    // _timelines.drawsolids(fireevents, undefined);
                });
            },
            fadeoutinput10: function () {
                var self = this;

                self.someintervalID = setInterval(() => {
                    if (!$('#crudinput').is(':visible')) {
                        clearInterval(self.someintervalID);
                        return;
                    }

                    if (self.lasttouchinput + 10 * 1000 < Date.now()) {
                        clearInterval(self.someintervalID);

                        $('#crudinput').fadeOut(250);
                        setTimeout(() => { $('#crudcreate').fadeIn(); }, 250);
                    }
                }, 1000); // check every sec
            },
            fadeoutdelete5: function () {
                var self = this;

                self.someintervalID = setInterval(() => {
                    if (!$('#cruddelete').is(':visible')) {
                        clearInterval(self.someintervalID);
                        return;
                    }

                    if (self.lasttouchbox + 5000 < Date.now()) {
                        clearInterval(self.someintervalID);

                        $('#cruddelete').fadeOut(250);
                        setTimeout(() => { $('#crudcreate').fadeIn(); }, 250);
                    }
                }, 1000); // check every sec
            },
            cleardivsandtimeouts: function () {
                $('#crudcreate').fadeOut(10);
                $('#cruddelete').fadeOut(10);
                $('#crudinput').fadeOut(10);
                clearInterval(this.someintervalID);
            },
            updatedefaultcolor: function () {
                var self = this;
                firefunctions.httpsCallable('handletopublichuman')({
                    thehandle: _help.THEPATH,
                }).then((result) => {
                    var thehuman = result.data.thehuman;
                    // var thehumanuid = thehuman.uid;
                    self.colorevent = thehuman.data.what_colorevent;
                }).catch((err) => { logg(err); });
            }
        },
        watch: {
            crudinput: function (newval, oldval) {
                // hereee
                // this.crudinput = this.crudinput.replace(/[^a-z0-9]/gi, '').toLowerCase().substring(0, 15);

                this.lasttouchinput = Date.now();
            }
        },
        created: function () {
            this.updatedefaultcolor();
        },
        mounted: function () {
            var self = this;
            $('#crudcreate').fadeIn();

            d.addEventListener('clicksolid', (e) => {
                self.theid = e.detail.id; // e.detail.data.what_sharelevel;

                self.cleardivsandtimeouts();
                setTimeout(() => {
                    $('#cruddelete').fadeIn();
                    self.lasttouchbox = Date.now();
                    self.fadeoutdelete5();
                }, 10);
            }, false);

            var primary = 'Title - Time - Color';
            var secondaries = [
                'Hit the gym - Today at 6pm - Red',
                'Hand in psych paper - 1/7 2pm - Blue',
                'Flight to new york - Next friday 8am - Orange',
                'Mom\'s birthday - 2/4 - Green',
                'Watch new netflix special - Tomorrow - Black'];
            var merged = []
            for (var i = 0; i < secondaries.length; i++) {
                merged.push(primary);
                merged.push(secondaries[i]);
            }
            var typed = new Typed('#crudinput input', {
                strings: merged,
                typeSpeed: 5,
                backSpeed: 5,
                backDelay: 3000,
                startDelay: 500,
                showCursor: false,
                smartBackspace: false,
                shuffle: false,
                attr: 'placeholder',
                loop: true
            });
        }
    });
    return thevue;
}

////////////////

exports.run = run;
