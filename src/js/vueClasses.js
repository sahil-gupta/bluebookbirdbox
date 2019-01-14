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
            removechosen: function (chosen) {
                _.remove(this.chosens, function (anything) {
                    return anything.objectID === chosen.objectID;
                });
                this.chosens.push('');
                this.chosens.pop(-1);
                localstorage('bbbb_classes', this.chosens);
            },
            exportics: function () {

                // for every day in teh semester
                //   loop through all the classes
                //   check if it's supposed to be on that day
                //   if it is and there are no edge cases
                        // add it including all details
                // add all the special holidays
                // download the ICS

                const TODAY = moment().startOf('day');
                const RANGEFUTURE = TODAY.diff(moment('2020-05-20'), 'days');   // negative number
                
                // Create new Calendar and set optional fields
                var cal = ical({
                    domain: 'sebbo.net',
                    name: 'My Testfeed',
                    timezone: 'America/New_York'
                });

                // create a new event
                var event = cal.createEvent({
                    start: moment(),
                    end: moment().add(1, 'hour'),
                    timestamp: moment(),
                    summary: 'My Event',
                    organizer: 'Sebastian Pekarek <mail@example.com>'
                });

                // like above, you can also set/change values like this…
                event.summary('My Super Mega Awesome Event');

                // get the iCal string
                var temp = cal.toString();
                temp = temp.replace(/(?:\r\n|\r|\n)/g, '%0A');
                logg(temp)


                // const cal = ical({
                //     domain: 'spase.io',
                //     name: 'Spase Time',
                //     timezone: 'America/New_York'
                // });
                // const event = cal.createEvent({
                //     start: moment(),
                //     end: moment().add(1, 'hour'),
                //     timestamp: moment(),
                //     summary: 'Example Event',
                //     description: 'It works ;)',
                //     location: 'my room',
                //     url: 'https://spase.io',
                //     organizer: 'Sebastian Pekarek <mail@example.com>'
                // });
                // // like above, you can also set/change values like this…
                // event.summary('My Super Mega Awesome Event');
                // // get the iCal string
                // logg(cal.toString());

                // // %0A
                
                $('#exportbutton').attr('href', 'data:text/calendar;charset=utf8,' + temp);
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
