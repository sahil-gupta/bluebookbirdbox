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
                var cal = ical({
                    domain: 'birdboxbluebook.com',
                    prodId: { company: 'BBBB', product: 'BBBB' },
                    name: 'BBBB',
                    floating: true
                });

                const DATEA = moment('2019-01-14');
                const DATEB = moment('2019-04-26');
                const DIFF = 102;

                for (var i = 0; i <= DIFF; i++) {
                    var thisdate = DATEA.clone().add(i, 'days');
                    var dayofweek = thisdate.format('dddd');

                    for (var j = 0; j < this.chosens.length; j++) {

                        var RR = this.chosens[j];

                        var timesbyday = RR.timesbyday;

                        if (dayofweek in timesbyday) {
                            
                        }

                        var thislocation = 'asdf';
                        var thisstart;
                        var thisend;

                        cal.createEvent({
                            start: thistart,
                            end: thisend,
                            timestamp: moment(),
                            summary: [RR.subject, RR.number].join(' '),
                            description: [RR.long_title, RR.subject + ' ' + RR.number + ' (' + RR.section + ')', RR.professors.join(', '), RR.description].join(' / '),
                            location: thislocation,
                            allDay: false
                        });
                    }
                }

                // for every day in teh semester
                //   loop through all the classes
                //   check if it's supposed to be on that day
                //   if it is and there are no edge cases
                // add it including all details
                // add all the special holidays


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
