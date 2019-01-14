const logg = console.log;

const client = algoliasearch('KRM1S7DDHX', 'f109d17791c3399d3d83ed3848d230d4');
const index = client.initIndex('spring_classes');

const moment = require('moment');
const ical = require('ical-generator');

function localstorage(key, value) {
    if (value === undefined) {
        var value = window.localStorage.getItem(key);
        return value && JSON.parse(value);
    }
    window.localStorage.setItem(key, JSON.stringify(value));
}

function run() {
    var thevue = new Vue({
        el: '#vueClasses',
        data: {
            searchtext: '',
            searchresults: [],
            chosens: []
        },
        methods: {
            dosearch: function () {
                if (this.searchtext === '') {
                    return;
                }

                var self = this;
                index.search(this.searchtext, function (err, content) {
                    self.searchresults = [];
                    for (var i = 0; i < content.hits.length; i++) {
                        var row = content.hits[i];
                        self.searchresults.push(row)
                    }
                });
            },
            chooseresult: function (theresult) {
                this.chosens.push(theresult);
                this.chosens = _.uniqBy(this.chosens, 'objectID');
                localstorage('bbbb_classes', this.chosens);
            },
            choosefirstresult: function () {
                if (this.searchresults.length === 0) {
                    return;
                }
                var theresult = this.searchresults[0];
                this.chosens.push(theresult);
                this.chosens = _.uniqBy(this.chosens, 'objectID');
                localstorage('bbbb_classes', this.chosens);
            },
            removechosen: function (ch) {
                _.remove(this.chosens, function (anything) {
                    return anything.objectID === ch.objectID;
                });
                this.chosens.push('');
                this.chosens.pop(-1);
                localstorage('bbbb_classes', this.chosens);
            },
            exportics: function () {
                if (!this.chosens.length) {
                    alert("Don't forget to add at least 1 class!");
                    return;
                }

                var cal = ical({
                    domain: 'birdboxbluebook.com',
                    prodId: { company: 'BBBB', product: 'BBBB' },
                    name: 'BBBB',
                    floating: true
                });

                const DATEA = moment('2019-01-14');
                // const DATEB = moment('2019-04-26');
                const DIFF = 102;

                for (var i = 0; i <= DIFF; i++) {
                    var thedate = DATEA.clone().add(i, 'days');
                    var theday = thedate.format('dddd');

                    if (thedate.unix() === moment('2019-01-18').unix()) {
                        theday = 'Monday';
                    } else if (thedate.unix() === moment('2019-01-21').unix()) {
                        continue;
                    } else if (thedate.unix() >= moment('2019-03-09').unix() && thedate.unix() < moment('2019-03-25').unix()) {
                        continue;
                    }

                    // loop through chosen courses
                    for (var j = 0; j < this.chosens.length; j++) {
                        var thecourse = this.chosens[j];
                        var thetimesbyday = thecourse.timesbyday;

                        if (!(theday in thetimesbyday)) {
                            continue;
                        }

                        var thesessions = thetimesbyday[theday];
                        for (var k = 0; k < thesessions.length; k++) {
                            var thesess = thesessions[k];
                            cal.createEvent({
                                start: moment([2019, thedate.month(), thedate.date(), thesess.starthour, thesess.startmin]),
                                end: moment([2019, thedate.month(), thedate.date(), thesess.endhour, thesess.endmin]),
                                summary: [thecourse.subject, thecourse.number].join(' '),
                                description: [thecourse.long_title, thecourse.subject + ' ' + thecourse.number + ' (' + thecourse.section + ')', thecourse.professors.join(', '), thecourse.description].join(' / '),
                                location: thesess.location,
                                allDay: false
                            });
                        }
                    }
                }

                cal.createEvent({
                    start: moment('2019-01-18'),
                    summary: 'Monday Classes',
                    allDay: true
                });
                cal.createEvent({
                    start: moment('2019-03-09'),
                    summary: 'Spring Recess Begins',
                    allDay: true
                });
                cal.createEvent({
                    start: moment('2019-03-24'),
                    summary: 'Spring Recess Ends',
                    allDay: true
                });
                cal.createEvent({
                    start: moment('2019-04-26'),
                    summary: 'Last Day of Classes',
                    allDay: true
                });
                cal.createEvent({
                    start: moment('2019-05-08'),
                    summary: 'Last Day of Exams',
                    allDay: true
                });

                var calstring = cal.toString();
                calstring = calstring.replace(/(?:\r\n|\r|\n)/g, '%0A');
                $('#exportbutton').attr('href', 'data:text/calendar;charset=utf8,' + calstring);
            }
        },
        watch: {
            searchtext: function (newval, oldval) {
                if (this.searchtext === '') {
                    this.searchresults = [];
                    return;
                }

                this.debounceddosearch();
            }
        },
        mounted: function () {
            this.chosens = localstorage('bbbb_classes') || [];
            this.debounceddosearch = _.debounce(this.dosearch, 500);

        }
    });
    return thevue;
}

////////////////

exports.run = run;
