const logg = console.log;

const client = algoliasearch('KRM1S7DDHX', 'f109d17791c3399d3d83ed3848d230d4');
const index = client.initIndex('spring_classes');

const ical = require('ical-generator');
const moment = require('moment');

const SECONDSINDAY = 86400;
const TODAY = moment().startOf('day');
const RANGEFUTURE = TODAY.diff(moment('2020-05-20'), 'days');   // negative number
const RANGEPAST = TODAY.diff(moment('2019-01-01'), 'days');     // positive number

function localstorage(key, value) {
    if (value === undefined) {
        var value = window.localStorage.getItem(key);
        return value && JSON.parse(value);
    }
    window.localStorage.setItem(key, JSON.stringify(value));
}

// const cal = ical({
//     domain: 'sebbo.net',
//     prodId: { company: 'superman-industries.com', product: 'ical-generator' },
//     name: 'My Testfeed',
//     timezone: 'Europe/Berlin'
// });
// // You can also set values like this…
// cal.domain('sebbo.net');
// // … or get values
// logg(cal.domain()); // --> "sebbo.net"
// // create a new event
// logg(moment())
// logg('this')
// const event = cal.createEvent({
//     start: moment(),
//     end: moment().add(1, 'hour'),
//     timestamp: moment(),
//     summary: 'My Event',
//     organizer: 'Sebastian Pekarek <mail@example.com>'
// });
// // like above, you can also set/change values like this…
// event.summary('My Super Mega Awesome Event');
// // get the iCal string
// logg(cal.toString());
// logg('hereee')




function run() {
    var thevue = new Vue({
        el: '#vueClasses',
        data: {
            searchtext: '',
            searchresults: [],
            chosens: ['abc','def','ghi']
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
                        self.searchresults.push(row.Code + ' / ' + row.Building)
                    }
                });
            },
            chooseresult: function (thehandle) {
                window.location.href = '/' + thehandle.substring(1);
            },
            choosefirstresult: function () {
                if (this.searchresults.length === 0) {
                    return;
                }
                window.location.href = '/' + this.searchresults[0].substring(1);
            },
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
            this.debounceddosearch = _.debounce(this.dosearch, 500);

        }
    });
    return thevue;
}

////////////////

exports.run = run;
